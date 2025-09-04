const mongoose = require("mongoose");

const category = [
  "music",
  "arts",
  "film",
  "conferences",
  "business",
  "education",
  "sports",
  "food",
  "community",
  "parties",
  "fashion",
  "gaming",
  "travel",
  "health",
  "family",
  "festivals",
  "technology",
  "government",
  "religion",
];

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
    lowercase: true,
  },

  description: {
    type: String,
    required: true,
    minlength: 15,
  },

  date: {
    type: Date,
    required: true,
  },

  venue: {
    type: String,
    minlength: 15,
    required: true,
  },

  totalSeats: {
    type: Number,
    default:0
  },

  availableSeats: {
    type: Number,
    default: function () {
      return this.totalSeats;
    },
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  ticketTypes: [
    {
      type: {
        type: String,
        enum: ["VIP", "Regular", "Student"],
        required: true,
      },
      price: { type: Number, required: true },
      seats: { type: Number, required: true },
      availableSeats: {
        type: Number,
        default: function () {
          return this.seats;
        },
      },
    },
  ],

  price: {
    type: Number,
    default: 0,
  },

  status: {
    type: String,
    enum: ["UpComing", "Closed", "Active"],
    default: "UpComing",
  },

  popularity: {
    type: String,
    enum: ["low", "medium", "high"],
  },

  createdAt: {
    type: Date,
    default: Date.now(),
    immutable: true,
  },

  updatedAt: Date,

  categories: {
  type: [String],
  enum: category,
  default: []
}
});


eventSchema.pre("save", function (next) {
  if (this.ticketTypes && this.ticketTypes.length > 0) {
    this.totalSeats = this.ticketTypes.reduce((sum, t) => sum + t.seats, 0);
    this.availableSeats = this.ticketTypes.reduce(
      (sum, t) => sum + t.availableSeats,
      0
    );
    const regularTicket = this.ticketTypes.find((t) => t.type === "Regular");
    if (regularTicket) {
      this.price = regularTicket.price;
    }
  }

  this.updatedAt = Date.now();
  next();
});



eventSchema.pre("findOneAndUpdate", function(next) {
  let update = this.getUpdate().$set || this.getUpdate();
  

  

  if (update.ticketTypes && update.ticketTypes.length > 0) {
    update.totalSeats = update.ticketTypes.reduce((sum, t) => sum + Number(t.seats), 0);
    update.availableSeats = update.ticketTypes.reduce((sum, t) => sum + Number( t.seats), 0);

    const regularTicket = update.ticketTypes.find((t) => t.type === "Regular");
    if (regularTicket) {
      update.price = regularTicket.price;
    }
  }

  update.updatedAt = Date.now();
  this.setUpdate({ $set: update });
  next();
});


module.exports = mongoose.model("Event", eventSchema);

