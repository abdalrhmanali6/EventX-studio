const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },

  seatNumber: Number,

  ticketQR: String,

  bookedAt: { type: Date, default: Date.now },

  status: {
    type: String,
    enum: ["Active", "Cancelled", "Used"],
    default: "Active",
  },

  price: Number,

  paymentMethod: {
    type: String,
    enum: ["Cash", "Wallet", "Card", "Free"],
    default: "Free",
  },

  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending",
  },

  checkedIn: { type: Boolean, default: false },

  checkedInTime: Date,

  ticketType: { type: String, required: true },
});

module.exports = mongoose.model("Ticket", ticketSchema);
