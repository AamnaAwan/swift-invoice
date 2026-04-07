const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  description: { type: String },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Invoice", invoiceSchema);
