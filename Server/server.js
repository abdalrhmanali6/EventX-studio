require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./Users");
const cors = require("cors");
const Events = require("./Events");
const Ticket = require("./Ticket");
const app = express();
const QRCode = require("qrcode");
const { Parser } = require("json2csv");

mongoose
  .connect(process.env.MONGO_URL)
  .then(()=>console.log("connected"))
  .catch((e) => console.error(e));

app.use(express.json());
app.use(cors({
  origin: "https://event-x-studio-7.vercel.app", 
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));


//*?...........................................................................Auth..........................................................................

app.get("/ping", (req, res) => {
  res.json({ msg: "pong ✅" });
});


app.post("/register", async (req, res) => {
  try {
    const hashedPass = await bcrypt.hash(req.body.pass, 10);

    const user = {
      fname: req.body.fname,
      lname: req.body.lname,
      username: req.body.username,
      email: req.body.email,
      pass: hashedPass,
      phone: req.body.phone,
      gender: req.body.gender,
      age: req.body.age,
    };

    const { existingEmail, existingPhone, existingUsername } =
      await isUserExist(user.email, user.username, user.phone);

    if (existingEmail || existingPhone || existingUsername) {
      return res.status(409).json({
        message: "Duplicate Found!",
        existingEmail,
        existingPhone,
        existingUsername,
      });
    }

    const newUser = await User.create(user);
    res.status(201).json({ message: "Account register", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "registed Failed", error: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const loginUser = await User.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }],
    });
    if (loginUser == null) {
      return res.status(404).json({ message: "User not found" });
    }
    await User.updateOne(
      { username: loginUser.username },
      { $set: { role: req.body.role } }
    );
    if (await bcrypt.compare(req.body.pass, loginUser.pass)) {
      const token = generateToken({
        username: loginUser.username,
        _id: loginUser._id,
        role: req.body.role,
      });
      res.status(200).json({ message: " success", token: token });
    } else {
      res.status(400).json({ message: "wrong password" });
    }
  } catch (e) {
    res.status(500).json({ message: "login Failed", error: e.message });
  }
});

//*?......................................................................................Events...............................................................

app.post("/addEvent", authenticateToken, Role("admin"), async (req, res) => {
  try {
    const event = {
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      venue: req.body.venue,
      totalSeats: req.body.totalSeats,
      price: req.body.price,
      status: req.body.status,
      popularity: req.body.popularity,
      categories: req.body.categories,
      createdBy: req.user.id,
      ...req.body,
    };

    const newEvent = await Events.create(event);

    res.status(201).json({ message: "Created", data: newEvent });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Creating event fialed", error: e.message });
  }
});

app.get(
  "/showCreatedEvents",
  authenticateToken,
  Role("Admin"),
  async (req, res) => {
    try {
      const data = await Events.find({ createdBy: req.user.id });
      if (data.length === 0) {
        return res
          .status(200)
          .json({ message: "No events created by you to show" });
      }

      res.status(200).json({ message: "Accepted", data: data });
    } catch (e) {
      res.status(500).json({ message: "showEvents Failed", error: e.message });
    }
  }
);

app.get(
  "/admin/Event/:id",
  authenticateToken,
  Role("Admin"),
  async (req, res) => {
    try {
      const data = await Events.findOne({
        createdBy: req.user.id,
        _id: req.params.id,
      });
      if (!data) {
        return res
          .status(404)
          .json({ message: "this Event not found or not created by you" });
      }

      res.status(200).json({ message: "Accepted", data: data });
    } catch (e) {
      res.status(500).json({ message: "showEvents Failed", error: e.message });
    }
  }
);

app.patch(
  "/admin/updateEvent/:id",
  authenticateToken,
  Role("Admin"),
  async (req, res) => {
    try {
      const update = await Events.findOneAndUpdate(
        { _id: req.params.id, createdBy: req.user.id },
        { $set: req.body },
        { new: true }
      );

      if (!update) {
        return res
          .status(404)
          .json({ message: "Event not found or not created by you" });
      }

      res
        .status(200)
        .json({ message: "Event updated successfully", data: update });
    } catch (e) {
      res
        .status(500)
        .json({ message: "Updating event failed", error: e.message });
    }
  }
);

app.delete(
  "/admin/deleteEvent/:id",
  authenticateToken,
  Role("Admin"),
  async (req, res) => {
    try {
      const deletedEvent = await Events.findOneAndDelete({
        _id: req.params.id,
        createdBy: req.user.id,
      });
      console.log(deletedEvent);
      res
        .status(200)
        .json({ message: "Event Deleted successfully", data: deletedEvent });
    } catch (e) {
      res
        .status(500)
        .json({ message: "Deleting event failed", error: e.message });
    }
  }
);

app.get("/user/Events", authenticateToken, Role("User"), async (req, res) => {
  try {
    const allEvents = await Events.find();
    res.status(200).json({ data: allEvents });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Showing events failed", error: e.message });
  }
});

app.get(
  "/user/SearchEvent",
  authenticateToken,
  Role("User"),
  async (req, res) => {
    try {
      const { title, categories } = req.query;

      const Search = {};
      if (title) {
        Search.title = { $regex: title, $options: "i" };
      }
      if (categories) {
        Search.categories = { $in: [categories] };
      }

      const SearchedEvent = await Events.find(Search);

      if (!SearchedEvent || SearchedEvent.length == 0) {
        return res
          .status(404)
          .json({ message: "can't find what you search for" });
      }

      res.status(200).json({ data: SearchedEvent });
    } catch (e) {
      res
        .status(500)
        .json({ message: "Showing events failed", error: e.message });
    }
  }
);

app.get(
  "/user/Event/:id",
  authenticateToken,
  Role("User"),
  async (req, res) => {
    try {
      const data = await Events.findOne({ _id: req.params.id }).populate(
        "createdBy",
        "username fname lname"
      );
      if (!data) {
        return res.status(404).json({ message: "this Event not found " });
      }

      res.status(200).json({ message: "Accepted", data: data });
    } catch (e) {
      res.status(500).json({ message: "showEvents Failed", error: e.message });
    }
  }
);

//*?.......................................................user..........................................................................................

app.get("/user", authenticateToken, async (req, res) => {
  try {
    const userData = await User.findById({ _id: req.user.id }, { pass: 0 });
    res.status(200).json({ data: userData });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//*?.......................................................Tickets..........................................................................................

//*Book ticket
app.post(
  "/user/bookTicket/:eventid",
  authenticateToken,
  Role("User"),
  async (req, res) => {
    try {
      const eventid = req.params.eventid;
      const event = await Events.findById(eventid);
      if (!event) {
        return res.status(404).json({ message: "This event not found" });
      }

      if (event.availableSeats <= 0) {
        return res.status(400).json({ message: "No tickets available" });
      }

      if (req.user.id == event.createdBy.toString()) {
        return res
          .status(400)
          .json({ message: "You cannot book a ticket for your own event!" });
      }

      const ticketType = req.body.type;
      const TicketType = event.ticketTypes?.find((c) => c.type === ticketType);

      if (!TicketType) {
        return res
          .status(404)
          .json({ message: "There is no such ticket type" });
      }

      if (TicketType.availableSeats <= 0) {
        return res
          .status(400)
          .json({ message: `No seats available for ${ticketType}` });
      }

      const vipticket = event.ticketTypes.find((t) => t.type == "VIP");
      const vipSeats = vipticket ? vipticket.seats : 0;

      let seatNumber;

      if (ticketType == "VIP") {
        const bookedVIPSeats = await Ticket.countDocuments({
          event: eventid,
          ticketType: "VIP",
        });

        if (!vipticket || bookedVIPSeats >= vipSeats) {
          return res
            .status(400)
            .json({ message: `No seats available for ${ticketType}` });
        }

        seatNumber = bookedVIPSeats + 1;
      } else {
        regStuTickets = event.ticketTypes.filter(
          (t) => t.type == "Regular" || t.type == "Student"
        );

        regStuSeats = regStuTickets?.reduce((sum, t) => sum + t.seats, 0);

        const bookedRS = await Ticket.countDocuments({
          event: eventid,
          ticketType: { $in: ["Regular", "Student"] },
        });

        if (!regStuTickets || bookedRS >= regStuSeats) {
          return res
            .status(400)
            .json({ message: `No seats available for ${ticketType}` });
        }

        seatNumber = vipSeats + bookedRS + 1;
      }

      const decreaseSeatsNumber = await Events.updateOne(
        {
          _id: eventid,
          "ticketTypes.type": ticketType,
          "ticketTypes.availableSeats": { $gt: 0 },
          availableSeats: { $gt: 0 },
        },
        {
          $inc: {
            "ticketTypes.$.availableSeats": -1,
            availableSeats: -1,
          },
        }
      );

      if (decreaseSeatsNumber.modifiedCount === 0) {
        return res.status(400).json({
          message: "Seat just sold out. Please try another ticket type.",
        });
      }


      const newTicket = await Ticket.create({
        user: req.user.id,
        event: eventid,
        ticketQR: "",
        seatNumber: seatNumber,
        paymentMethod: req.body.paymentMethod || "Free",
        paymentStatus:
          req.body.paymentMethod == "Free" ||
          req.body.paymentMethod == "Card" ||
          req.body.paymentMethod == "Wallet"
            ? "Paid"
            : "Pending",
        ticketType: ticketType,
        price: TicketType.price,
      });

      const qrString = newTicket._id.toString();
      const ticketQR = await QRCode.toDataURL(qrString);

      newTicket.ticketQR = ticketQR;
      await newTicket.save();

      res.status(201).json({ message: " Ticket created", data: newTicket });
    } catch (e) {
      res
        .status(500)
        .json({ message: "Booking ticket failed", error: e.message });
    }
  }
);

//*show ticket

app.get(
  "/user/ticket/:ticketID",
  authenticateToken,
  Role("User"),
  async (req, res) => {
    try {
      const ticketId = req.params.ticketID;
      const ticket = await Ticket.findOne({
        _id: ticketId,
        user: req.user.id,
      }).populate({
        path: "event",
        select: "title date venue description createdBy",
        populate: {
          path: "createdBy",
          select: "fname lname ",
        },
      }).populate({
      path: "user",
      select: "fname lname ", 
  });
      if (!ticket) {
        return res.status(404).json({ message: "can't find this ticket" });
      }

      res.status(200).json({ data: ticket });
    } catch (e) {
      res
        .status(500)
        .json({ message: "Showing ticket failed", error: e.message });
    }
  }
);

//*show user Tickets

app.get("/user/Tickets", authenticateToken, Role("User"), async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id }).populate({
      path: "event",
      select: "title date venue description createdBy",
      populate: {
        path: "createdBy",
        select: "fname lname ",
      },
    });

    if (!tickets) {
      return res
        .status(404)
        .json({ message: "can't find any tickets for this user" });
    }

    res.status(200).json({ data: tickets });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Showing ticket failed", error: e.message });
  }
});



app.get("/admin/my-events-tickets", authenticateToken, Role("Admin"), async (req, res) => {
  try {
    
    const events = await Events.find({ createdBy: req.user.id });
 
    const eventsWithTickets = await Promise.all(
      events.map(async (event) => {
        const tickets = await Ticket.find({ event: event._id }).populate("user", "fname lname");
        return { event, tickets };
      })
    );

    res.status(200).json({ data: eventsWithTickets });
  } catch (e) {
    res.status(500).json({ message: "Fetching tickets failed", error: e.message });
  }
});


app.patch(
  "/admin/ticket/checkin/:ticketId",
  authenticateToken,
  Role("Admin"),
  async (req, res) => {
    try {
      const { ticketId } = req.params;

        
      const ticket = await Ticket.findById(ticketId).populate("event");

      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      if (ticket.checkedIn) {
        return res.status(400).json({ message: "Ticket already checked in" });
      }

     
      ticket.checkedIn = true;
      ticket.checkedInTime = new Date();
      ticket.status = "Used"; 
      ticket.paymentStatus="Paid"

      await ticket.save();

      return res.status(200).json({ message: "Ticket checked in successfully", data: ticket });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Check-in failed", error: err.message });
    }
  }
);
//?......................................................insights.........................................................................................

app.get(
  "/Admin/insights",
  authenticateToken,
  Role("Admin"),
  async (req, res) => {
    try {
      const userId = req.user.id;

      // 1️⃣ الأحداث الخاصة بالـAdmin
      const myEventIds = await Events.find({ createdBy: userId }).distinct("_id");

      // 2️⃣ إجمالي الأحداث
      const totalEvents = myEventIds.length;

      // 3️⃣ التيكتات الخاصة بالأحداث دي
      const tickets = await Ticket.find({ event: { $in: myEventIds } })
        .populate("event");

      const totalTicketsSold = tickets.length;
      const totalRevenue = tickets.reduce((sum, t) => sum + (t.price || 0), 0);

      // 4️⃣ الحضور
      const attended = tickets.filter((t) => t.checkedIn).length;
      const attendanceRate =
        tickets.length > 0 ? Math.round((attended / tickets.length) * 100) : 0;

      // 5️⃣ الأحداث القادمة
      const now = new Date();
      const upcomingEvents = await Events.find({
        _id: { $in: myEventIds },
        date: { $gt: now },
      })
        .select("title date")
        .sort("date")
        .limit(5);

      // 6️⃣ آخر الحجوزات للأحداث الخاصة بالـAdmin
      const recentBookings = await Ticket.find({ event: { $in: myEventIds } })
        .populate("user", "fname lname username")
        .populate("event", "title")
        .sort({ bookedAt: -1 })
        .limit(5)
        .lean();

      const recentBookingsEvents = recentBookings.map((b) => ({
        _id: b._id,
        userName: b.user?.username || `${b.user?.fname} ${b.user?.lname}`,
        eventTitle: b.event?.title,
        ticketType: b.ticketType,
        bookedAt: b.bookedAt,
      }));

      // 7️⃣ إجمالي الحضور للأحداث الخاصة
      const totalAttendees = await Ticket.countDocuments({
        checkedIn: true,
        event: { $in: myEventIds },
      });

      
      const revenueTrend = await Ticket.aggregate([
        { $match: { paymentStatus: "Paid", event: { $in: myEventIds } } },
        {
          $group: {
            _id: { $month: "$bookedAt" },
            total: { $sum: "$price" },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      
      const eventCategories = await Events.aggregate([
        { $match: { _id: { $in: myEventIds } } },
        { $unwind: "$categories" },
        { $group: { _id: "$categories", count: { $sum: 1 } } },
      ]);

      res.json({
        totalEvents,
        totalTicketsSold,
        totalRevenue,
        attendanceRate,
        upcomingEvents,
        recentBookingsEvents,
        eventCategories,
        totalAttendees,
        revenueTrend,
      });
    } catch (e) {
      res
        .status(500)
        .json({ message: "Insights fetch failed", error: e.message });
    }
  }
);


app.get(
  "/admin/analytics/charts",
  authenticateToken,
  Role("Admin"),
  async (req, res) => {
    try {
      const ticketsEvent = await Ticket.find().populate("event").lean();

      const ticketTypes = ["VIP", "Regular", "Student"];
      const ticketTypeDistribution = ticketTypes.map((type) => {
        const count = ticketsEvent.filter(
          (t) =>
            t.ticketType === type &&
            t.event.createdBy.toString() === req.user.id
        ).length;
        return { _id: type, count };
      });

      const ticketsuser = await Ticket.find({}).populate("user").lean();

      const ageGroups = {
        "<18": 0,
        "18-25": 0,
        "26-35": 0,
        "36-50": 0,
        "50+": 0,
      };
      const gender = { Male: 0, Female: 0 };

      ticketsuser.forEach((t) => {
        const age = t.user.age;
        if (age < 18) ageGroups["<18"]++;
        else if (age <= 25) ageGroups["18-25"]++;
        else if (age <= 35) ageGroups["26-35"]++;
        else if (age <= 50) ageGroups["36-50"]++;
        else ageGroups["50+"]++;

        gender[t.user.gender] = (gender[t.user.gender] || 0) + 1;
      });

      res.json({ ageGroups, gender, ticketTypeDistribution });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

app.get(
  "/admin/analytics/export",
  authenticateToken,
  Role("Admin"),
  async (req, res) => {
    try {
      // حصر التيكتات على أحداث الـAdmin فقط
      const myEventIds = await Events.find({ createdBy: req.user.id }).distinct("_id");

      const tickets = await Ticket.find({ event: { $in: myEventIds } })
        .populate("user event")
        .lean();

      const fields = [
        "_id",
        "user.fname",
        "user.lname",
        "user.email",
        "event.title",
        "ticketType",
        "price",
        "status",
        "checkedInTime",
      ];

      const parser = new Parser({ fields });
      const csv = parser.parse(tickets);

      res.header("Content-Type", "text/csv");
      res.attachment("tickets_report.csv");
      return res.send(csv);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//?.......................................................Functions.........................................................................................

async function isUserExist(email, username, phone) {
  const existingEmail = await User.findOne({ email });
  const existingPhone = await User.findOne({ phone });
  const existingUsername = await User.findOne({ username });

  return {
    existingEmail: !!existingEmail,
    existingPhone: !!existingPhone,
    existingUsername: !!existingUsername,
  };
}

function generateToken(user) {
  return jwt.sign(
    { username: user.username, id: user._id, role: user.role },
    process.env.ACCESS_TOKEN,
    {
      expiresIn: "30m",
    }
  );
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    res.status(401).json({ message: "Not authenticated" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) {
      res
        .status(403)
        .json({ message: "Access denied please Relogin", error: err.message });
    }
    req.user = user;
    next();
  });
}

function Role(role) {
  return (req, res, next) => {
    if (req.user.role.toLowerCase() !== role.toLowerCase()) {
      return res.status(403).json({ message: "Yo have no Access" });
    }
    next();
  };
}
