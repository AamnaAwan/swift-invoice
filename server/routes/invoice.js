const express = require("express");
const router = express.Router();
const { db } = require("../firebaseAdmin");
const auth = require("../middleware/auth");

const requireDb = (res) => {
  if (!db) {
    res.status(503).json({ msg: "Firebase backend is not configured" });
    return false;
  }
  return true;
};

const serializeInvoice = (id, data) => ({
  id,
  clientName: data.clientName || "",
  description: data.description || "",
  amount: Number(data.amount || 0),
  status: data.status || "unpaid",
  userId: data.userId,
  createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
  updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
  date: data.date?.toDate ? data.date.toDate().toISOString() : data.date,
});

// CREATE
router.post("/", auth, async (req, res) => {
  if (!requireDb(res)) return;

  try {
    const invoiceData = {
      ...req.body,
      userId: req.user,
      createdAt: new Date(),
      updatedAt: new Date(),
      date: new Date(),
    };
    const invoiceRef = await db.collection("invoices").add(invoiceData);
    res.json(serializeInvoice(invoiceRef.id, invoiceData));
  } catch (err) {
    console.error("Create invoice error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// READ
router.get("/", auth, async (req, res) => {
  if (!requireDb(res)) return;

  try {
    const snapshot = await db.collection("invoices").where("userId", "==", req.user).get();
    const invoices = snapshot.docs.map(doc => serializeInvoice(doc.id, doc.data()));
    res.json(invoices);
  } catch (err) {
    console.error("Get invoices error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// UPDATE
router.put("/:id", auth, async (req, res) => {
  if (!requireDb(res)) return;

  try {
    const invoiceRef = db.collection("invoices").doc(req.params.id);
    const invoiceDoc = await invoiceRef.get();
    if (!invoiceDoc.exists || invoiceDoc.data().userId !== req.user) {
      return res.status(404).json({ msg: "Invoice not found" });
    }

    const updatedData = {
      ...req.body,
      updatedAt: new Date()
    };
    await invoiceRef.update(updatedData);
    const updatedDoc = await invoiceRef.get();
    res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (err) {
    console.error("Update invoice error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  if (!requireDb(res)) return;

  try {
    const invoiceRef = db.collection("invoices").doc(req.params.id);
    const invoiceDoc = await invoiceRef.get();
    if (!invoiceDoc.exists || invoiceDoc.data().userId !== req.user) {
      return res.status(404).json({ msg: "Invoice not found" });
    }

    await invoiceRef.delete();
    res.json({ msg: "Deleted" });
  } catch (err) {
    console.error("Delete invoice error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;