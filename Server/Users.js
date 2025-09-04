const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  fname: {
    type: String,
    minLength: 2,
    trim: true,
  },

  lname: {
    type: String,
    minLength: 2,
    trim: true,
  },

  age: {
    type: Number,
    min: 16,
    max: 90,
  },

  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    minLength: 6,
    trim: true,
  },

  email: {
    unique: true,
    type: String,
    required: true,
    minLength: 15,
  },

  phone: {
    type: String,
    required: true,
  },

  gender: {
    type: String,
    enum: ["Male", "Female"],
  },

  ticket: [
    {
      event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
      seatNumber: Number,
      ticketQR: String, 
      bookedAt: { type: Date, default: Date.now },
      status: {
        type: String,
        enum: ["Active", "Cancelled", "Used"],
        default: "Active",
      },
    },
  ],

  pass: {
    type: String,
    required: true,
    minLength: 9,
  },

  role: {
    type: String,
    enum: ["Admin", "User"],
    default: "User",
  },

  createdAt: {
    type: Date,
    default: Date.now(),
    immutable: true,
  },

  updatedAt:Date
  

});

UserSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("User", UserSchema);
