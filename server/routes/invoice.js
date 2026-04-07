const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Invoice = require("../models/Invoice");
const auth = require("../middleware/auth");

// In-memory storage for testing when MongoDB is not available
let inMemoryInvoices = [];
let invoiceIdCounter = 1;

// Helper function to check if MongoDB is connected
const isMongoConnected = () => mongoose.connection.readyState === 1;

// CREATE
router.post("/", auth, async (req, res) => {
  try {
    let invoice;

    if (isMongoConnected()) {
      invoice = await Invoice.create({
        ...req.body,
        userId: req.user,
      });
    } else {
      // Fallback to in-memory storage
      invoice = {
        _id: invoiceIdCounter++,
        ...req.body,
        userId: req.user,
        date: new Date()
      };
      inMemoryInvoices.push(invoice);
    }

    res.json(invoice);
  } catch (err) {
    console.error("Create invoice error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// READ
router.get("/", auth, async (req, res) => {
  try {
    let invoices;

    if (isMongoConnected()) {
      invoices = await Invoice.find({ userId: req.user });
    } else {
      // Fallback to in-memory storage
      invoices = inMemoryInvoices.filter(inv => inv.userId === req.user);
    }

    res.json(invoices);
  } catch (err) {
    console.error("Get invoices error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// UPDATE
router.put("/:id", auth, async (req, res) => {
  try {
    let updated;

    if (isMongoConnected()) {
      updated = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    } else {
      // Fallback to in-memory storage
      const index = inMemoryInvoices.findIndex(inv => inv._id.toString() === req.params.id);
      if (index !== -1) {
        inMemoryInvoices[index] = { ...inMemoryInvoices[index], ...req.body };
        updated = inMemoryInvoices[index];
      }
    }

    if (!updated) return res.status(404).json({ msg: "Invoice not found" });
    res.json(updated);
  } catch (err) {
    console.error("Update invoice error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  try {
    let deleted = false;

    if (isMongoConnected()) {
      const result = await Invoice.findByIdAndDelete(req.params.id);
      deleted = !!result;
    } else {
      // Fallback to in-memory storage
      const index = inMemoryInvoices.findIndex(inv => inv._id.toString() === req.params.id);
      if (index !== -1) {
        inMemoryInvoices.splice(index, 1);
        deleted = true;
      }
    }

    if (!deleted) return res.status(404).json({ msg: "Invoice not found" });
    res.json({ msg: "Deleted" });
  } catch (err) {
    console.error("Delete invoice error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;