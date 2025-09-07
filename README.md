# 📝 Project Info
- **Project Name:** EventX Studio  
- **Date:** 2025-09-05  
- **Author:** Abdalrahman ALI
# EventX-studio

Event organizers often face challenges in managing events, selling tickets, tracking attendees, and analyzing engagement. Existing solutions are either too complex or expensive for small to medium-sized organizations. The EventX Studio system solves this by providing an easy-to-use Event Management System with separate roles for Admins and Users





## 🚀 Tech Stack
- Frontend: React (Vite)
- Backend: Node.js + Express
- Database: MongoDB Atlas
- Authentication: JWT + Bcrypt

## 🛠️ Installation
1. Clone repo:
   ```bash
   git clone https://github.com/username/EventX-studio.git
   ```

## Install dependencies
```bash
cd server
npm install
cd ../client
npm install
```



## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGO_URL`

`ANOTHER_API_KEY`


## 🌍 Live Demo

Frontend: https://event-x-studio-7.vercel.app

 Backend: https://event-x-backend-one.vercel.app

## 📑 Final Report

   
<details>
<summary> 💻   BackEnd </summary>

## 📊 Backend  Report
   
 #### **First:User Schema (MongoDB + Mongoose)**
  ```js
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
  ```
  - fname / lname → User’s first and last name (String, min lengt=2)
  - age → User’s age (Number, between 16 and 90).
  - username → Required, unique, lowercase, min length = 6
  - email → Required, unique, min length = 15
  - phone → User’s phone number (Required)
  - gender → Can be either ``"Male"`` or ``"Female"``
  - pass → User’s password (Required, min length = 9)
  - role → ``"Admin"`` or ``"User"`` (default: ``"User"``)
  - createdAt → Auto-set creation date (immutable).
  - updatedAt → Auto-updated before saving

---
---
#### **Second: Event Schema (MongoDB + Mongoose)**

```js
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
```
  - First import mongoose 
  - Declare used categories
  - Create event Schema

    - title: Event title `(Type:String ,required,lowercase)`
    - description:Event description `(type:String , required , minLength=15)`
    - date :Event Date `(type:date,required )`
    - venue: Event venue `(type:String , required , minLength=15)`
    - totalSeats: Event total Seats `     (type: Number)`
    - availableSeats: Event availableSeats `( type: Number, default:Number of totalSeats )`
    - createdBy: Event admin   
    - ticketTypes: Array of 
        
        - type:type of Ticket `(VIP,Regular,Student)`
        - price: Ticket price
        - seats: number of total seats  for this ticket
        - availableSeats: number pf available Seats of this ticket
    - price:Event default ticket price `Regular`
    - status :Event Status `( UpComing, closed, Active)`
    - popularity:Event popularity
    - createdAt: Event create date
    - categories: event categories i declare it above
- Some Middleware to check: 
  - if someone book ticket reduce availableSeats
  - to make default price is Regular ticket price
  
 ---
 ---

 #### **Third: Ticket Schema (MongoDB + Mongoose)**

```js
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
```
- First import mongoose
- Declare ticket schema
  
  - user: Reference to the user who booked the ticket
  - event: Reference to the event associated with this ticket
  - seatNumber : The attendee’s seat number
  - ticketQR: The unique QR code generated for check-in
  - bookedAt: The timestamp when the ticket was booked
  - status :Ticket status `(Active,Cancelled,Used)`
  - price: Ticket price at the time of booking
  - paymentMethod: `( Cash , Wallet , Card)`
  - paymentStatus: `(Pending , Paid , Failed)`
  - checkedIn: Boolean indicating whether the attendee has checked in
  -  checkedInTime:  The timestamp when the attendee checked in
  - ticketType: `(VIP,Regular,Student)`
  
---
---
#### **Fourth: server.js** 
  - **Added the modules that are used in the backend.**
   ```js
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
```
  
 -  dotenv → Loads environment variables from a .env file into process.env. Helps keep sensitive data (like database URIs or secret keys) secure.
   
   -  express → A lightweight web framework for Node.js. It’s used to create the server, handle HTTP requests (GET, POST, etc.), and define APIs.
   
   - mongoose → A MongoDB object modeling tool. It allows you to define schemas and interact with MongoDB in a structured way.
   
   - bcrypt → A library used to securely hash and compare passwords. It’s essential for protecting user credentials.
   
   - jsonwebtoken (JWT) → Used for authentication and authorization. It generates tokens for logged-in users so they can securely access protected routes.
   
   - cors → Middleware that allows cross-origin requests (e.g., letting your React frontend communicate with your Node.js backend).
   
- User / Events / Ticket (Custom Models) → These are your Mongoose models that represent collections in MongoDB:
   
    - User → Stores user information (username, email, password, etc.).
   
    - Events → Stores event details (title, date, location, etc.).
   
    - Ticket → Stores ticket information linked to events and users.
   
   - qrcode → Generates QR codes (for example, to validate event tickets or provide quick access to information).
   
   - json2csv (Parser) → Converts JSON data into CSV format, which is useful for exporting reports or data
---
- **Mongoose Setup**
  ```js
  mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("connected"))
  .catch((e) => console.error(e));
  ```
   - 1 `mongoose.connect(process.env.MONGO_URL):` This is the core function that initiates the connection. It takes the database connection string from the `MONGO_URL`       environment variable. Using an environment variable is a secure best practice to keep sensitive credentials out of the source code.

    - 2`.then(() => console.log("connected")):` This part executes if the connection is successful. The `.then()` method handles the "promise" returned by `connect().` When it resolves       successfully, it prints "connected" to the console.

    - 3`.catch((e) => console.error(e)):` This part acts as an error handler. If the connection fails for any reason (e.g., invalid URL, network issue), the `.catch()` method catches       the `error (e)` and logs it to the console for debugging.
---
- **Express and cors setup**
   ```js
      app.use(express.json());
      app.use(
     cors({
       origin: "*",
    credentials: true,
  })
  );
   ```
    - 1 ` express.json()`: Parses JSON data from incoming requests into `req.body`.

    - 2  `cors()`: Allows frontend apps from any `origin ("*")` to access this server, including requests with `credentials (cookies, auth)`.
---
- **Functions**

  - Check if user exist 
     ```js
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
       ```
  - Generate Token and Sign it to JWT

    ```js 
      function generateToken(user) {
      return jwt.sign(
      { username: user.username, id: user._id, role: user.role },
      process.env.ACCESS_TOKEN,
     { expiresIn: "30m" }
     );
     }
     ```
  - Check if token exist or valid
     ```js
       function authenticateToken(req, res, next) {
      const authHeader = req.headers["authorization"];
     const token = authHeader && authHeader.split(" ")[1];
     if (token == null) {
      return res.status(401).json({ message: "Not authenticated" });
     }

     jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) {
      return res.status(403).json({
        message: "Access denied please Relogin",
        error: err.message,
      });
    }
    req.user = user;
    next();
    })}
    ```
  - Check if role has permission for this service

  ```js
   function Role(role) {
    return (req, res, next) => {
    if (req.user.role.toLowerCase() !== role.toLowerCase()) {
      return res.status(403).json({ message: "You have no Access" });
    }
     next();
    };
    }
  ```
  

---
 - **Auth APIs**
   - Register
     ```js
     
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
   
       ```
     - 1 Hashes the password.

     - 2 Checks for existing email, phone, or username.

     - 3 Returns 409 if duplicate exists.

     - 4 Creates new user and returns 201 on success.

   - login
     ```js
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
     ```
     - 1- Finds user by email or username.

     - 2- Returns 404 if not found.

     - 3- Updates user's role.

     - 4- Compares password hash.

     - 5- Returns JWT token on success, 400 on wrong password
---
- **EVENTS**
  
  -  Create event

     - API endpoint
      | Method | Endpoint    | Description              | Auth   |
      |--------|-------------|--------------------------|--------|
      | `GET`    | /addEvent | Create new event | `Admin` |

      **Path Parameters**

      | Name | Type   | Required | Description             |
      |------|--------|----------|-------------------------|
      | `title`   | `String` | yes      | Title  of event|
      | `description`| `String`| yes |  description of event |
      | `date`| `Date` | yes | Date of event |
      | `venue`| `String` | yes | Venue of event |
      | `totalSeats` | `Number` | yes | totalSeats of event |
      | `price` | `Number` | yes | price of event |
      | `status` | `String` | yes | status of event |
      | `popularity`| `String` | yes | popularity of event |
      | `categories`| `String` | yes | categories of event |
      | `createdBy`| `ObjectId` | yes | who created the event |

      **Responses**

      | Status Code | Type   | Required | Response Body                         |
      |-------------|--------|----------|------------------------------------|
      | 201        | object | yes      | { message: "Created", data: newEvent }         |
      | 500        | object | no       | { message: "Creating event fialed", error: e.message }                   |
     
      **CODE**
      ```js
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
      ```
     
  - Show Created Events
    
    - API endpoint
    | Method | Endpoint            | Description                        | Auth   |
    |--------|---------------------|------------------------------------|--------|
    | `GET`  | `/showCreatedEvents`| Show all events created by the user| `Admin` |

    - Path Parameters
      > This endpoint does not require body or query parameters.  
      > It automatically filters by the authenticated user’s ID.
    
    - CODE
    ```js
      app.get(
      "/showCreatedEvents",
      authenticateToken,
      Role("Admin"),
      async (req, res) => {
        try {
          const data = await Events.find({ createdBy: req.user.id });
          if (data.length === 0) {
            return res
              .status(404)
              .json({ message: "No events created by you to show" });
          }

          res.status(200).json({ message: "Accepted", data: data });
        } catch (e) {
          res.status(500).json({ message: "showEvents Failed", error: e.message });
        }
      }
    );

    ```
  -  Get Event by ID (Admin)

     - API endpoint  
      | Method | Endpoint            | Description                     | Auth   |
      |--------|---------------------|---------------------------------|--------|
      | `GET`  | /admin/Event/:id    | Get a specific event by its ID  | `Admin` |

      **Path Parameters**

      | Name | Type   | Required | Description                         |
      |------|--------|----------|-------------------------------------|
      | `id` | String | yes      | ID of the event created by the user |

      **Responses**

      | Status Code | Type   | Required | Response Body                                                                 |
      |-------------|--------|----------|-------------------------------------------------------------------------------|
      | 200         | object | yes      | { message: "Accepted", data: { ...eventData } }                               |
      | 404         | object | no       | { message: "this Event not found or not created by you" }                     |
      | 500         | object | no       | { message: "showEvents Failed", error: e.message }                            |

      > **Note:** This endpoint only returns events created by the authenticated admin.

      **CODE**
      ```js
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
      ```
  -  Update Event (Admin)

     - API endpoint  
      | Method   | Endpoint                | Description                       | Auth   |
      |----------|-------------------------|-----------------------------------|--------|
      | `PATCH`  | /admin/updateEvent/:id  | Update an existing event by its ID | `Admin` |

      **Path Parameters**

      | Name | Type   | Required | Description                         |
      |------|--------|----------|-------------------------------------|
      | `id` | String | yes      | ID of the event created by the user |

      **Request Body (any of these fields can be updated)**

      | Field        | Type      | Required | Description             |
      |--------------|-----------|----------|-------------------------|
      | `title`      | String    | no       | Title of the event      |
      | `description`| String    | no       | Description of the event |
      | `date`       | Date      | no       | Date of the event       |
      | `venue`      | String    | no       | Venue of the event      |
      | `totalSeats` | Number    | no       | Total available seats   |
      | `price`      | Number    | no       | Price of the event      |
      | `status`     | String    | no       | Event status            |
      | `popularity` | String    | no       | Popularity level        |
      | `categories` | String    | no       | Event categories        |

      **Responses**

      | Status Code | Type   | Required | Response Body                                                               |
      |-------------|--------|----------|-----------------------------------------------------------------------------|
      | 200         | object | yes      | { message: "Event updated successfully", data: { ...updatedEvent } }        |
      | 404         | object | no       | { message: "Event not found or not created by you" }                        |
      | 500         | object | no       | { message: "Updating event failed", error: e.message }                      |

      > **Note:** Only the admin who created the event can update it.

      **CODE**
      ```js
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

            if (!
  -  Delete Event (Admin)

     - API endpoint  
      | Method   | Endpoint                | Description                       | Auth   |
      |----------|-------------------------|-----------------------------------|--------|
      | `DELETE` | /admin/deleteEvent/:id  | Delete an existing event by its ID | `Admin` |

      **Path Parameters**

      | Name | Type   | Required | Description                         |
      |------|--------|----------|-------------------------------------|
      | `id` | String | yes      | ID of the event created by the user |

      **Responses**

      | Status Code | Type   | Required | Response Body                                                               |
      |-------------|--------|----------|-----------------------------------------------------------------------------|
      | 200         | object | yes      | { message: "Event Deleted successfully", data: { ...deletedEvent } }        |
      | 404         | object | no       | { message: "Event not found or not created by you" }                        |
      | 500         | object | no       | { message: "Deleting event failed", error: e.message }                      |

      > **Note:** Only the admin who created the event can delete it.

      **CODE**
      ```js
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
      ```
  -  Get All Events (User)

     - API endpoint  
      | Method | Endpoint      | Description              | Auth   |
      |--------|---------------|--------------------------|--------|
      | `GET`  | /user/Events  | Retrieve all events      | `User` |

      **Path Parameters**  
      *None*

      **Responses**

      | Status Code | Type   | Required | Response Body                                           |
      |-------------|--------|----------|---------------------------------------------------------|
      | 200         | object | yes      | { data: [ { ...event1 }, { ...event2 }, ... ] }        |
      | 500         | object | no       | { message: "Showing events failed", error: e.message } |

      > **Note:** Any authenticated user with the `User` role can view all events.

      **CODE**
      ```js
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
      ```
  -  Search Events (User)

     - API endpoint  
      | Method | Endpoint          | Description                     | Auth   |
      |--------|-------------------|---------------------------------|--------|
      | `GET`  | /user/SearchEvent | Search events by title/category | `User` |

      **Query Parameters**

      | Name        | Type   | Required | Description                              |
      |-------------|--------|----------|------------------------------------------|
      | `title`     | String | no       | Title (partial match, case-insensitive) |
      | `categories`| String | no       | Category to filter events by            |

      **Responses**

      | Status Code | Type   | Required | Response Body                                           |
      |-------------|--------|----------|---------------------------------------------------------|
      | 200         | object | yes      | { data: [ { ...event1 }, { ...event2 }, ... ] }        |
      | 404         | object | no       | { message: "can't find what you search for" }          |
      | 500         | object | no       | { message: "Showing events failed", error: e.message } |

      > **Note:** This endpoint allows users to search events by title (with partial match) or by category.

      **CODE**
      ```js
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
      ```
  -  Get Event by ID (User)

     - API endpoint  
      | Method | Endpoint       | Description                     | Auth   |
      |--------|----------------|---------------------------------|--------|
      | `GET`  | /user/Event/:id | Get event details by its ID     | `User` |

      **Path Parameters**

      | Name | Type   | Required | Description         |
      |------|--------|----------|---------------------|
      | `id` | String | yes      | ID of the event     |

      **Responses**

      | Status Code | Type   | Required | Response Body                                                                  |
      |-------------|--------|----------|--------------------------------------------------------------------------------|
      | 200         | object | yes      | { message: "Accepted", data: { ...event, createdBy: { username, fname, lname } } } |
      | 404         | object | no       | { message: "this Event not found" }                                            |
      | 500         | object | no       | { message: "showEvents Failed", error: e.message }                             |

      > **Note:** This endpoint returns detailed event info, including the creator’s username, fname, and lname.

      **CODE**
      ```js
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
      ```
---
- **User**
  -  Get User Profile

     - API endpoint  
      | Method | Endpoint | Description            | Auth   |
      |--------|----------|------------------------|--------|
      | `GET`  | /user    | Get logged-in user info | `User` |

      **Path Parameters**  
      *None*

      **Responses**

      | Status Code | Type   | Required | Response Body                          |
      |-------------|--------|----------|----------------------------------------|
      | 200         | object | yes      | { data: { ...userData } } (without `pass`) |
      | 500         | object | no       | { error: e.message }                   |

      > **Note:** This endpoint retrieves the logged-in user’s profile information. The `pass` field is excluded for security reasons.

      **CODE**
      ```js
      app.get("/user", authenticateToken, async (req, res) => {
        try {
          const userData = await User.findById({ _id: req.user.id }, { pass: 0 });
          res.status(200).json({ data: userData });
        } catch (e) {
          res.status(500).json({ error: e.message });
        }
      });
      ```
---
- **Tickets**
  -  Book Ticket (User)

     - API endpoint  
      | Method  | Endpoint                  | Description                | Auth   |
      |---------|---------------------------|----------------------------|--------|
      | `POST`  | /user/bookTicket/:eventid | Book a ticket for an event | `User` |

      **Path Parameters**

      | Name      | Type   | Required | Description             |
      |-----------|--------|----------|-------------------------|
      | `eventid` | String | yes      | ID of the event to book |

      **Request Body**

      | Field           | Type   | Required | Description                                                                 |
      |-----------------|--------|----------|-----------------------------------------------------------------------------|
      | `type`          | String | yes      | Ticket type (e.g., `VIP`, `Regular`, `Student`)                            |
      | `paymentMethod` | String | no       | Payment method (`Cash`, `Card`, `Wallet`, `Free`) – default is `"Free"`    |

      **Responses**

      | Status Code | Type   | Required | Response Body                                                                 |
      |-------------|--------|----------|-------------------------------------------------------------------------------|
      | 201         | object | yes      | { message: "Ticket created", data: { ...newTicket } }                         |
      | 400         | object | no       | { message: "No tickets available" } or { message: "You cannot book a ticket for your own event!" } or { message: "Seat just sold out. Please try another ticket type." } |
      | 404         | object | no       | { message: "This event not found" } or { message: "There is no such ticket type" } |
      | 500         | object | no       | { message: "Booking ticket failed", error: e.message }                        |

      > **Notes:**
      > - Users cannot book tickets for their own events.  
      > - Available seats are reduced automatically when a ticket is booked.  
      > - VIP seat numbering starts from `1` up to VIP seats count.  
      > - Regular & Student seat numbering starts after VIP seats.  
      > - A QR code is generated and attached to each ticket.  

      **CODE**
      ```js
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
      ```
  - **Get Ticket Details (User)**  

    - **API endpoint**  
    | Method | Endpoint              | Description             | Auth   |
    |--------|-----------------------|-------------------------|--------|
    | `GET`  | /user/ticket/:ticketID | Get details of a ticket | `User` |

     **Path Parameters**  

    | Name       | Type   | Required | Description        |
    |------------|--------|----------|--------------------|
    | `ticketID` | String | yes      | ID of the ticket   |

    **Responses**  

    | Status Code | Type   | Required | Response Body                                                                 |
    |-------------|--------|----------|-------------------------------------------------------------------------------|
    | 200         | object | yes      | `{ "data": { "_id": "...", "event": { "title": "...", "date": "...", "venue": "...", "description": "...", "createdBy": { "fname": "...", "lname": "..." } }, "user": { "fname": "...", "lname": "..." }, "seatNumber": 1, "ticketType": "VIP", ... } }` |
    | 404         | object | no       | `{ "message": "can't find this ticket" }`                                     |
    | 500         | object | no       | `{ "message": "Showing ticket failed", "error": e.message }`                  |

    > **Notes:**  
    > - Ticket details include event information and user info.  
    > - Event creator’s first and last name are also populated.  

    **CODE**
    ```js
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
  - **Get All Tickets (User)**  

  - **API endpoint**  
    | Method | Endpoint        | Description                      | Auth   |
    |--------|-----------------|----------------------------------|--------|
    | `GET`  | /user/Tickets   | Get all tickets booked by a user | `User` |

      **Responses**  

      | Status Code | Type   | Required | Response Body                                                                 |
      |-------------|--------|----------|-------------------------------------------------------------------------------|
      | 200         | object | yes      | `{ "data": [ { "_id": "...", "event": { "title": "...", "date": "...", "venue": "...", "description": "...", "createdBy": { "fname": "...", "lname": "..." } }, "seatNumber": 1, "ticketType": "Regular", ... } ] }` |
      | 404         | object | no       | `{ "message": "can't find any tickets for this user" }`                       |
      | 500         | object | no       | `{ "message": "Showing ticket failed", "error": e.message }`                  |

      > **Notes:**  
      > - Returns a list of all tickets booked by the authenticated user.  
      > - Each ticket includes populated event information and event creator’s basic details.  

      **CODE**
      ```js
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
  - **Get All Tickets for My Events (Admin)**  

        - **API endpoint**  
          | Method | Endpoint                | Description                                | Auth   |
          |--------|-------------------------|--------------------------------------------|--------|
          | `GET`  | /admin/my-events-tickets| Get all tickets for events created by admin| `Admin`|

        **Responses**  

        | Status Code | Type   | Required | Response Body                                                                 |
        |-------------|--------|----------|-------------------------------------------------------------------------------|
        | 200         | object | yes      | `{ "data": [ { "event": { "_id": "...", "title": "...", "date": "...", "venue": "...", "description": "..." }, "tickets": [ { "_id": "...", "user": { "fname": "...", "lname": "..." }, "seatNumber": 1, "ticketType": "VIP", ... } ] } ] }` |
        | 500         | object | no       | `{ "message": "Fetching tickets failed", "error": e.message }`                 |

        > **Notes:**  
        > - Returns all events created by the logged-in admin.  
        > - For each event, includes a list of tickets with user details (fname, lname).  

        **CODE**
        ```js
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

  - **Check-in Ticket (Admin)**  

  - **API endpoint**  
    | Method  | Endpoint                         | Description                  | Auth   |
    |---------|----------------------------------|------------------------------|--------|
    | `PATCH` | /admin/ticket/checkin/:ticketId  | Mark a ticket as checked-in  | `Admin`|

    **Request Parameters**  

    | Name      | Type   | Required | Description             |
    |-----------|--------|----------|-------------------------|
    | ticketId  | string | yes      | The ID of the ticket    |

      **Responses**  

      | Status Code | Type   | Required | Response Body                                                                 |
      |-------------|--------|----------|-------------------------------------------------------------------------------|
      | 200         | object | yes      | `{ "message": "Ticket checked in successfully", "data": { ...ticketObject } }`|
      | 400         | object | no       | `{ "message": "Ticket already checked in" }`                                  |
      | 404         | object | no       | `{ "message": "Ticket not found" }`                                           |
      | 500         | object | no       | `{ "message": "Check-in failed", "error": err.message }`                      |

      > **Notes:**  
      > - Marks the ticket as `checkedIn: true`.  
      > - Updates `checkedInTime` with the current date.  
      > - Sets `status` to `"Used"` and `paymentStatus` to `"Paid"`.  

      **CODE**
      ```js
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
            ticket.paymentStatus = "Paid";

            await ticket.save();

            return res.status(200).json({ message: "Ticket checked in successfully", data: ticket });
          } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Check-in failed", error: err.message });
          }
        }
      );

  ---
- **insights**
  
  - **Admin Insights**  

  - **API endpoint**  
    | Method | Endpoint        | Description                       | Auth   |
    |--------|-----------------|-----------------------------------|--------|
    | `GET`  | /Admin/insights | Fetch insights for admin’s events | `Admin`|

    **Responses**  

    | Status Code | Type   | Required | Response Body                                                                 |
    |-------------|--------|----------|-------------------------------------------------------------------------------|
    | 200         | object | yes      | `{ totalEvents, totalTicketsSold, totalRevenue, attendanceRate, upcomingEvents, recentBookingsEvents, eventCategories, totalAttendees, revenueTrend }` |
    | 500         | object | no       | `{ "message": "Insights fetch failed", "error": e.message }`                  |

    **Response Fields Explained**  

    | Field                | Type     | Description                                                                 |
    |-----------------------|----------|-----------------------------------------------------------------------------|
    | `totalEvents`         | Number   | Total number of events created by the admin                                |
    | `totalTicketsSold`    | Number   | Total tickets sold across all events                                       |
    | `totalRevenue`        | Number   | Total revenue from ticket sales (sum of all paid tickets)                  |
    | `attendanceRate`      | Number   | Percentage of checked-in tickets vs total tickets                          |
    | `upcomingEvents`      | Array    | Next 5 upcoming events `{ title, date }`                                   |
    | `recentBookingsEvents`| Array    | Last 5 bookings `{ _id, userName, eventTitle, ticketType, bookedAt }`      |
    | `eventCategories`     | Array    | Aggregated categories of events `{ _id: categoryName, count: totalEvents }` |
    | `totalAttendees`      | Number   | Total number of attendees checked-in                                       |
    | `revenueTrend`        | Array    | Revenue grouped by month `{ _id: monthNumber, total: revenue }`             |

    > **Notes:**  
    > - Revenue is calculated only for tickets with `paymentStatus = "Paid"`.  
    > - Attendance rate = (checked-in tickets ÷ total tickets) × 100.  
    > - Upcoming events are limited to the next 5, sorted by date.  
    > - Recent bookings are limited to the last 5, sorted by `bookedAt`.  

    **CODE**
    ```js
    app.get(
      "/Admin/insights",
      authenticateToken,
      Role("Admin"),
      async (req, res) => {
        try {
          const userId = req.user.id;

          const myEventIds = await Events.find({ createdBy: userId }).distinct("_id");
          const totalEvents = myEventIds.length;

          const tickets = await Ticket.find({ event: { $in: myEventIds } }).populate("event");
          const totalTicketsSold = tickets.length;
          const totalRevenue = tickets.reduce((sum, t) => sum + (t.price || 0), 0);

          const attended = tickets.filter((t) => t.checkedIn).length;
          const attendanceRate = tickets.length > 0 ? Math.round((attended / tickets.length) * 100) : 0;

          const now = new Date();
          const upcomingEvents = await Events.find({
            _id: { $in: myEventIds },
            date: { $gt: now },
          }).select("title date").sort("date").limit(5);

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

          const totalAttendees = await Ticket.countDocuments({
            checkedIn: true,
            event: { $in: myEventIds },
          });

          const revenueTrend = await Ticket.aggregate([
            { $match: { paymentStatus: "Paid", event: { $in: myEventIds } } },
            { $group: { _id: { $month: "$bookedAt" }, total: { $sum: "$price" } } },
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
          res.status(500).json({ message: "Insights fetch failed", error: e.message });
        }
      }
    );
  
  - **Admin Analytics Charts**

  - **API endpoint**  
    | Method | Endpoint                | Description                             | Auth   |
    |--------|-------------------------|-----------------------------------------|--------|
    | `GET`  | /admin/analytics/charts | Fetch analytics data for admin’s charts | `Admin`|

    **Responses**  

    | Status Code | Type   | Required | Response Body                                                                 |
    |-------------|--------|----------|-------------------------------------------------------------------------------|
    | 200         | object | yes      | `{ ageGroups, gender, ticketTypeDistribution }`                               |
    | 500         | object | no       | `{ "message": e.message }`                                                    |

    **Response Fields Explained**  

    | Field                    | Type   | Description                                                                 |
    |---------------------------|--------|-----------------------------------------------------------------------------|
    | `ageGroups`              | Object | Distribution of users by age groups `{ "<18", "18-25", "26-35", "36-50", "50+" }` |
    | `gender`                 | Object | Distribution of users by gender `{ Male, Female }`                          |
    | `ticketTypeDistribution` | Array  | Ticket count per type for admin’s events `[ { _id: "VIP", count }, ... ]`   |

    > **Notes:**  
    > - Only tickets from events created by the authenticated admin are considered in `ticketTypeDistribution`.  
    > - User demographics (`ageGroups`, `gender`) are calculated based on ticket owners.  
    > - Ticket types supported: `"VIP"`, `"Regular"`, `"Student"`.  

    **CODE**
    ```js
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

  - **Admin Analytics Export**

  - **API endpoint**  
    | Method | Endpoint                 | Description                                     | Auth   |
    |--------|--------------------------|-------------------------------------------------|--------|
    | `GET`  | /admin/analytics/export  | Export all tickets data for admin’s events (CSV)| `Admin`|

    **Responses**  

    | Status Code | Type        | Required | Response Body                                   |
    |-------------|-------------|----------|-------------------------------------------------|
    | 200         | file (CSV)  | yes      | `tickets_report.csv` containing ticket details  |
    | 500         | object      | no       | `{ "message": e.message }`                      |

    **CSV Export Fields**  

    | Field          | Description                                     |
    |----------------|-------------------------------------------------|
    | `_id`          | Ticket unique ID                               |
    | `user.fname`   | First name of the ticket owner                 |
    | `user.lname`   | Last name of the ticket owner                  |
    | `user.email`   | Email of the ticket owner                      |
    | `event.title`  | Event title                                    |
    | `ticketType`   | Ticket type (`VIP`, `Regular`, `Student`)      |
    | `price`        | Ticket price                                   |
    | `status`       | Ticket status (`Active`, `Used`, etc.)         |
    | `checkedInTime`| Timestamp when the ticket was checked in (if any)|

    > **Notes:**  
    > - Export only includes tickets from events created by the authenticated admin.  
    > - File is returned in **CSV format** with filename `tickets_report.csv`.  
    > - The endpoint is intended for admin reporting & analysis.  

    **CODE**
    ```js
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

</details>


<details>
<summary>🖼️ Frontend</summary>
  # 📊 Frontend  Report
## 🔎 Summary
Brief overview of the current frontend progress, goals, and challenges.  
Example:  
The frontend development is **70% complete**, with core pages implemented and responsive design applied. Some features are pending API integration.  

---

## ✅ Implemented Features
- [x] Login & Registration UI (responsive + validation)  
- [x] Event Cards with search & filter  
- [x] QR Code generation for tickets  
- [x] Dashboard layout with TailwindCSS  

---

## 📑 Table of Contents

### 📄 Pages
- [Home](#home)
- [AdminHome](#adminhome)
- [BookTicket](#bookticket)
- [Login](#login)
- [Register](#register)
- [TicketDetails](#ticketdetails)
- [UserHome](#userhome)

### 🧭 Components
- [Api](#api)
- [Dashboard](#dashboard)
- [AdminAnalytics](#adminanalytics)
- [AdminEventDetails](#admineventdetails)
- [AttendanceInsight](#attendanceinsight)
- [CreateEvent](#createevent)
- [EventCard](#eventcard)
- [EventMangement](#eventmangement)
- [Header](#header)
- [Input](#input)
- [MyTickets](#mytickets)
- [PaymentCard](#paymentcard)
- [PaymentWallet](#paymentwallet)
- [ShowEvents](#showevents)
- [SidebarItem](#sidebaritem)
- [TicketCard](#ticketcard)
- [UnderDevelopment](#underdevelopment)
- [UserEventDetails](#usereventdetails)
- [navigate](#navigate)

---

---

 ## 🔌 API Service (Axios Instance)

### 📄 Description
This module provides a pre-configured `axios` instance for handling API requests to the backend.  
It includes:
- Global base URL setup.
- Credential support.
- Error handling with `react-toastify`.
- Automatic redirect on **401 Unauthorized** responses.

---

### ✅ Implemented Features
- [x] `axios.create()` with `baseURL = https://event-x-backend-one.vercel.app`.  
- [x] Enabled `withCredentials` for secure cookie/session handling.  
- [x] Response interceptor to catch errors globally.  
- [x] Automatic `token` removal from `localStorage` when session expires.  
- [x] User feedback with `react-toastify`.  
- [x] Redirect to `/login` page on **401 Unauthorized**.  


---

### 📂 Code Snippet
```js
import axios from "axios";
import { toast } from "react-toastify"; 
import 'react-toastify/dist/ReactToastify.css';

const api = axios.create({
  baseURL: "https://event-x-backend-one.vercel.app",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token"); 
      toast.error("Session expired, please login again", {
        position: "top-center",
        autoClose: 3000,
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 3500); 
    }
    return Promise.reject(error);
  }
);

export default api;
```

## 🏠 Home Page Component

### 📄 Description
The **Home Page** is the landing page of the application.  
It introduces the platform, highlights its main features, and provides quick navigation options for new and returning users.

---

### ✅ Implemented Features
- [x] Responsive **Hero Section** with gradient background.  
- [x] **Call-to-action buttons** → "Get Started" (Register) & "Log In".  
- [x] **Features Section** highlighting:
  - 🎟 Ticket Management  
  - 📊 Analytics  
  - 🤝 Easy Collaboration  
- [x] **Header** component integration.  
- [x] **Footer** with copyright.  

---


### 📂 Code Snippet
```jsx
import React from "react";
import { Link } from "react-router";
import Header from "../components/Header";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header>
        <Header />
      </header>
      <main>
        <section>
          <div className="flex flex-col items-center justify-center text-center py-20 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Simplify Event Management 🚀
            </h1>
            <p className="max-w-2xl text-lg sm:text-xl mb-6">
              Event organizers often face challenges in managing events, selling
              tickets, tracking attendees, and analyzing engagement. Our platform
              makes it <span className="font-semibold">simple, affordable, and efficient</span>.
            </p>
            <div className="flex gap-4">
              <Link to="/register">
                <button className="px-6 py-3 rounded-2xl bg-white text-blue-600 font-medium shadow hover:bg-gray-100 transition cursor-pointer">
                  Get Started
                </button>
              </Link>
              <Link to="/login">
                <button className="px-6 py-3 rounded-2xl border border-white text-white font-medium hover:bg-white hover:text-blue-600 transition cursor-pointer">
                  Log In
                </button>
              </Link>
            </div>
          </div>
        </section>

        <section className="flex flex-col items-center py-16 px-6">
          <h2 className="text-2xl font-bold mb-10">Why choose our platform?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl">
            <div className="featuresCard">
              <h3 className="font-semibold text-lg mb-2">🎟 Ticket Management</h3>
              <p className="text-gray-600 text-sm">
                Sell tickets online and track registrations in real-time.
              </p>
            </div>
            <div className="featuresCard">
              <h3 className="font-semibold text-lg mb-2">📊 Analytics</h3>
              <p className="text-gray-600 text-sm">
                Gain insights into attendees and engagement with easy-to-read dashboards.
              </p>
            </div>
            <div className="featuresCard">
              <h3 className="font-semibold text-lg mb-2">🤝 Easy Collaboration</h3>
              <p className="text-gray-600 text-sm">
                Organize with your team seamlessly and assign roles effortlessly.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="text-center py-6 text-sm text-gray-500">
        © 2025 EventX Studio. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
```
## 📝 Register Page Component

### 📄 Description
The **Register Page** allows new users to create an account.  
It includes client-side validation (password match, phone validation), error handling for duplicates, and feedback messages. Successful registration redirects the user to the **Login Page**.

---

### ✅ Implemented Features
- [x] Form with multiple input fields:
  - First Name / Last Name
  - Username
  - Email
  - Password & Re-enter Password
  - Phone Number
  - Gender (dropdown)
  - Age (number input)  
- [x] Client-side validation:
  - Password confirmation check  
  - Phone number validation (only digits)  
  - Username, Email, and Phone error messages for duplicates  
- [x] Password toggle visibility (`show / hide`).  
- [x] API integration (`/register` endpoint).  
- [x] Success message with spinner animation before redirect.  
- [x] Redirect to login page after successful registration.  

---



### 📂 Code Snippet
```jsx
import React, { useState } from "react";
import api from "../components/Api";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Input from "../components/Input";

const Register = () => {
  const navigate = useNavigate();

  const [passError, setPassError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [usernamError, setUsernameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [registed, setRegisted] = useState("");

  const getFormData = (event) => {
    event.preventDefault();
    // Password validation
    if (
      event.target.elements["pass"].value !==
      event.target.elements["re-pass"].value
    ) {
      return setPassError("Password not Match");
    } else {
      setPassError("");
    }

    // Phone validation
    const regex = /^[0-9]+$/;
    if (!regex.test(event.target.elements["phone"].value)) {
      return setPhoneError("Phone is invalid (must contain only numbers)");
    } else {
      setPhoneError("");
    }

    const user = {
      fname: event.target.elements["firstName"].value,
      lname: event.target.elements["lastName"].value,
      username: event.target.elements["username"].value,
      email: event.target.elements["email"].value,
      pass: event.target.elements["pass"].value,
      phone: event.target.elements["phone"].value,
      gender: event.target.elements["Gender"].value,
      age: event.target.elements["Age"].value,
    };

    api
      .post("/register", user)
      .then((res) => {
        setEmailError("");
        setUsernameError("");
        setPhoneError("");
        res.status == 201 &&
          setRegisted("Account created successfully! You can sign in now");
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 3000);
      })
      .catch((e) => {
        setRegisted("");
        if (e.response.data.message == "Duplicate Found!") {
          e.response.data.existingEmail
            ? setEmailError("This Email already exist")
            : setEmailError("");
          e.response.data.existingUsername
            ? setUsernameError("This username already exist")
            : setUsernameError("");
          e.response.data.existingPhone
            ? setPhoneError("This phone already used")
            : setPhoneError("");
        }
      });
  };

  return (
    <>
      <header>
        <Header />
      </header>
      <main className="my-5 flex flex-col items-center">
        <h1>Create your account</h1>
        <form
          className="my-7 grid grid-cols-1 gap-7 sm:w-120 w-60"
          onSubmit={getFormData}
        >
          {/* Form inputs */}
        </form>
      </main>
    </>
  );
};

export default Register;

## 🔑 Login Page Component

### 📄 Description
The **Login Page** allows users to access their accounts using either **username** or **email**.  
It handles authentication via API, stores JWT tokens, and redirects users based on their role (User/Admin).  

---
```
### ✅ Implemented Features
- [x] Login with **username** or **email** (toggle option).  
- [x] Password field with **show/hide** toggle.  
- [x] Role selection dropdown (`User` / `Admin`).  
- [x] Error handling:
  - User not found (username/email).  
  - Wrong password.  
- [x] JWT Token stored in `localStorage`.  
- [x] Redirect:
  - `Admin` → `/Admin`.  
  - `User` → `/User`.  
- [x] UI links:
  - Forgot password (placeholder).  
  - Sign up (navigate to Register).  
  - Toggle between "Sign in with email / username".  

---

### 📂 Code Snippet
```jsx
import React, { useState } from "react";
import Header from "../components/Header";
import Input from "../components/Input";
import { Link, useNavigate } from "react-router-dom";
import api from "../components/Api";

const Login = () => {
  const navigate = useNavigate();

  const [showPass, setShowPass] = useState(false);
  const [method, setmethod] = useState("username");
  const [userExist, setUserExist] = useState("");
  const [passmatch, setPassMatch] = useState("");

  const verfiyAccount = (event) => {
    event.preventDefault();

    const data = {
      pass: event.target.elements["pass"].value,
      role: event.target.elements["role"].value,
    };

    if (method == "username") {
      data.username = event.target.elements["username"].value;
    } else {
      data.email = event.target.elements["email"].value;
    }

    api
      .post("/login", data)
      .then((res) => {
        const token = res.data.token;
        localStorage.setItem("token", token);

        if (data.role == "Admin") {
          navigate("/Admin");
        } else {
          navigate("/User", { replace: true });
        }

        setTimeout(() => {
          window.location.reload();
        }, 200);
      })
      .catch((e) => {
        e.status == 404 && method == "username"
          ? setUserExist("User not found")
          : e.status == 404 && method == "email"
          ? setUserExist("Email not found")
          : setUserExist("");

        e.status == 400 ? setPassMatch("Wrong password") : setPassMatch("");
      });
  };

  return (
    <div>
      <header>
        <Header />
      </header>
      <main className="my-12 flex flex-col items-center">
        {/* Login Form */}
      </main>
      <footer className="text-center py-6 text-sm text-gray-500">
        © 2025 EventX Studio. All rights reserved.
      </footer>
    </div>
  );
};

export default Login;
```

## 🛠️ AdminHome Page Component

### 📄 Description
The **Admin Home Dashboard** is the main control panel for administrators.  
It includes a **Sidebar Navigation** for switching between sections such as Dashboard, Event Management, Attendance Insights, and Analytics.  
The sidebar is **responsive**, opening and collapsing on smaller screens.

---

### ✅ Implemented Features
- [x] **Sidebar Navigation** with sections:
  - Dashboard  
  - Manage Events  
  - Attendee Insights  
  - Analytics & Reports  
  - Contact Support / Notifications / Settings  
  - Manage Users / Logout  
- [x] **Responsive Sidebar** (toggle button on mobile).  
- [x] Dynamic component rendering using `activeComponent`.  
- [x] Fetches logged-in user data (`/user` API + token header).  
- [x] Logout functionality (clears `token` and redirects to `/login`).  

---



### 📂 Code Snippet
```jsx
useEffect(() => {
  api
    .get("/user", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => setuser(res.data.data))
    .catch((e) => console.log(e.message));
}, []);
```

## 📊 Dashboard Component

### 📄 Description
The **Dashboard** provides administrators with an overview of key metrics and insights.  
It displays statistics, upcoming events, attendance rates, recent bookings, and revenue trends in a structured and visual format.

---

### ✅ Implemented Features
- [x] **User Greeting** with first and last name.  
- [x] **Key Stats Cards**:
  - 🎉 Total Events  
  - 🎟️ Total Tickets Sold  
  - 💰 Total Revenue  
- [x] **Upcoming Events Section** (limited to 5 events).  
- [x] **Attendance Insights** with progress bar visualization.  
- [x] **Recent Bookings List** showing user, ticket type, and event details.  
- [x] **Revenue Trend Chart** using **Recharts** (Line Chart).  
- [x] **Create Event Button** → navigates to event creation form.  

---



### 📂 Code Snippet
```jsx
useEffect(() => {
  api
    .get("/Admin/insights", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => setInsights(res.data))
    .catch((e) => console.log(e));
}, []); 
```

## 🗂️ EventMangement Component

### 📄 Description
The **EventMangement** component provides administrators with tools to view and organize events.  
It fetches events created by the logged-in admin and categorizes them into **Up-Coming**, **Active**, and **Closed**.  
It also provides quick navigation to **Create New Events** and **Attendee Insights**.

---

### ✅ Implemented Features
- [x] **Fetch Created Events** from backend (`/showCreatedEvents`) with JWT token authentication.  
- [x] **Categorized Event Lists**:
  - 🔵 **Up-Coming Events**  
  - 🟢 **Active Events**  
  - 🔴 **Closed Events**  
- [x] **EventCard Component Integration** → displays event details (title, price, seats, venue, date/time, categories).  
- [x] **Quick Actions**:
  - ➕ Create New Event (navigates to `CreateEvent`).  
  - 📊 Attendee Insights (navigates to `AttendanceInsight`).  

---


### 📂 Code Snippet
```jsx
useEffect(() => {
  api
    .get("/showCreatedEvents", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((data) => setEvents(data.data.data))
    .catch((e) => console.log(e));
}, []);
```

## 🎴 EventCard Component

### 📄 Description
The **EventCard** component is a reusable card that displays the details of an event.  
It integrates with the **EventContext** to set the active event ID when the user clicks on the navigation arrow, allowing navigation to event-specific views (e.g., event details).

---

### ✅ Implemented Features
- [x] Displays **event title** with styled text.  
- [x] Shows **key event metrics**:
  - 💰 Price  
  - 💺 Total Seats  
  - 🎟️ Available Seats  
- [x] Shows **event details**:
  - 📍 Venue  
  - 📅 Date  
  - ⏰ Time  
- [x] **Context Integration**: Uses `EventContext` to update the selected `eventID`.  
- [x] **Navigation Support**: On clicking the **arrow button**, triggers:
  - `data.setActiveComponent(data.path)` → updates parent active view.  
  - `setEventID(data.id)` → saves current event ID in global context.  

---



### 📂 Code Snippet
```jsx
import React, { useContext,useEffect, useState } from 'react'
import { EventContext } from '../App'
const EventCard = ({data}) => {

    
    const {setEventID}=useContext(EventContext)
   

  return (
    <>


    <div key={data.id}  className=" eventsCard ">
              
              <p className="text-center text-black [text-shadow:_0px_1px_2px_rgba(102,102,102,1)] font-bold  ">{data.title}</p>
              <div className="grid grid-cols-3 gap-3 border-b-1 p-4 ">
                <div className="grid grid-cols-2 gap-3">
                  <img src="Cash.svg " className="w-6 h-6" />
                  <p className="text-center text-[#0F5D13] [text-shadow:_0px_1px_2px_rgba(102,102,102,1)] font-bold  ">{data.price}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 ">
                  <img src="Seat1.svg " className="w-6 h-6" />
                  <p className="text-center text-[#EB3223] [text-shadow:_0px_1px_2px_rgba(102,102,102,1)] font-bold  ">{data.totalSeats}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <img src="Ticket.svg " className="w-6 h-6" />
                  <p className="text-center text-[#8B2CF5] [text-shadow:_0px_1px_2px_rgba(102,102,102,1)] font-bold ">{data.availableSeats}</p>
                </div>
              </div>
              <div className="flex flex-col space-y-2 pt-2">
                  <p className="text-[#666666] font-bold [text-shadow:_0px_0px_2px_rgba(102,102,102,0.7)]">
                   Venue :<span className="text-black [text-shadow:_0px_0px_2px_rgba(102,102,102,0.4)]">{data.venue}</span> 
                  </p>
                  <p className="text-[#666666] font-bold [text-shadow:_0px_0px_2px_rgba(102,102,102,0.7)]">
                    Date    : <span className="text-black [text-shadow:_0px_0px_2px_rgba(102,102,102,0.4)]">{data.date}</span> 
                  </p>

                  <p className="text-[#666666] font-bold [text-shadow:_0px_0px_2px_rgba(102,102,102,0.7)]">
                    Time    : <span className="text-black [text-shadow:_0px_0px_2px_rgba(102,102,102,0.4)]">{data.time}</span>
                  </p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
              className="size-9 absolute bottom-4 right-4 cursor-pointer "
              onClick={()=>{

                data.setActiveComponent(data.path);
                setEventID(data.id) ;
              }
              }
              >
              <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            </div>




    </>
  )
}

export default EventCard
```
## 📊 AdminAnalytics Component

### 📄 Description
The **AdminAnalytics** component provides administrators with a visual overview of platform statistics and user insights.  
It fetches and displays **summary metrics** (events, bookings, revenue, attendees) and multiple **charts** for better decision-making.  
Additionally, it includes an **export feature** to download analytics data as a CSV file.

---

### ✅ Implemented Features
- [x] **Summary Cards** for quick insights:
  - 📅 Total Events
  - 🎟️ Total Bookings
  - 💰 Total Revenue
  - 👥 Total Attendees
- [x] **Analytics Visualizations**:
  - 📊 Age Group Distribution (BarChart)
  - ⚧ Gender Distribution (PieChart)
  - 🎟️ Ticket Type Distribution (PieChart)
  - 🏷️ Event Categories (PieChart)
- [x] **CSV Export**:
  - Exports ticket data in `.csv` format.
  - Handles server response as a Blob and automatically triggers download.
- [x] Responsive charts using **Recharts** and `ResponsiveContainer`.
- [x] Dynamic colors from a shared palette (`COLORS` array).

---

### 🐞 Known Issues
| Issue | Status | Notes |
|-------|--------|-------|
| **Hardcoded colors** | ⚠️ Limited flexibility | Charts rely on static `COLORS`; may repeat if data points exceed array length. |
| **Missing loading/error states** | ❌ Needs improvement | Component directly renders charts; no UI feedback for loading or request failures. |
| **CSV export UX** | ⚠️ Minimal | Uses `alert()` on failure; could be replaced with `toast` notifications for consistency. |
| **Accessibility concerns** | ⚠️ Needs improvement | Charts lack ARIA labels and alt-text for better screen reader support. |
| **Inconsistent naming** | ⚠️ Minor | `/Admin/insights` endpoint vs `/admin/analytics/charts` → inconsistent casing in API routes. |

---

### 📂 Code Snippet
```jsx
const exportCSV = () => {
  api
    .get("/admin/analytics/export", {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "tickets_report.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    })
    .catch((err) => {
      console.error("CSV export failed:", err);
      alert("Export failed. Please try again.");
    });
};
```
## 📝 AdminEventDetails Component

### 📄 Description
The **AdminEventDetails** component allows administrators to **view, edit, and delete events**.  
It fetches detailed event data from the backend and displays information such as **title, date, venue, description, tickets, categories, and popularity**.  
Admins can **toggle between view and edit modes**, update event details, or delete an event with a confirmation dialog.

---

### ✅ Implemented Features
- [x] **View Event Details**:
  - Event title, date & time, venue, description
  - Ticket price, total seats, available seats
  - Categories and popularity level
  - Ticket types (price, seats, available seats)
- [x] **Edit Mode**:
  - Inline editing for all event fields using `Input` and `react-select`
  - Ability to update ticket types (price, seats, availability)
  - Input validation: prevents submission if fields are empty
- [x] **Delete Event**:
  - Delete confirmation modal before removing an event
  - Deletes via API and navigates back to event management view
- [x] **Responsive Layout**:
  - Adjusts for desktop and mobile screens
  - Uses flexbox and responsive utility classes
- [x] **UX Feedback**:
  - Displays alert if fields are incomplete
  - Edit toggle button switches between **Edit / Confirm**
  - Delete warning modal for safe actions

---

### 📂 Code Snippet (Delete Confirmation Modal)
```jsx
{warning && (
  <div className="inset-0 bg-black/50 fixed flex items-center justify-center">
    <div className="bg-[#282828] p-7 rounded-xl">
      <p className="text-center text-white pb-5">
        Are you sure you want to delete this event?
      </p>
      <div className="flex justify-evenly">
        <button
          className="bg-red-500 hover:bg-red-700 text-white p-3 rounded-2xl"
          onClick={() => {
            Delete(eventID);
          }}
        >
          Delete
        </button>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-black p-3 rounded-2xl"
          onClick={() => SetWarning(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
```
# AttendanceInsight Component

## Description
The `AttendanceInsight` component is designed for **event administrators** to monitor and manage attendee check-ins. It provides a **QR code scanning system** and a **manual check-in option**, displaying ticket information in an organized table format. This ensures smooth attendee verification at event entrances.

---

## Implemented Features ✅
- **Fetch Events & Tickets**: Loads all events managed by the admin along with ticket data using the backend API (`/admin/my-events-tickets`).
- **Expandable Event Sections**: Events can be expanded/collapsed to view ticket details.
- **Check-In Management**:
  - Manual **check-in button** for each ticket.
  - QR code scanning using `@zxing/browser` to automatically check in tickets.
- **Real-time UI Updates**: When a ticket is checked in, its status updates instantly without page reload.
- **QR Scanner Control**:
  - Start/Stop scanning with camera access.
  - Automatically stops scanning after processing a QR code.
- **User Greeting**: Displays a welcome message with admin’s name and username.
- **Notifications**:
  - Success and error messages via `toast` (local state-based).

---



## Code Snippet 📂
```jsx
const handleCheckIn = async (ticketId) => {
  const ticket = eventsData
    .flatMap((ev) => ev.tickets)
    .find((t) => t._id === ticketId);

  if (ticket?.checkedIn) {
    setToast("Ticket already checked in");
    setTimeout(() => setToast(""), 3000);
    return;
  }

  try {
    await api.patch(
      `/admin/ticket/checkin/${ticketId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setEventsData((prev) =>
      prev.map((ev) => ({
        ...ev,
        tickets: ev.tickets.map((t) =>
          t._id === ticketId
            ? { ...t, checkedIn: true, checkedInTime: new Date() }
            : t
        ),
      }))
    );

    setToast("Checked in successfully!");
  } catch (e) {
    setToast(e.response?.data?.message || "Check-in failed");
  }
};
```
# CreateEvent Component

## Description
The `CreateEvent` component provides an interface for **admins/organizers** to create new events.  
It integrates **form inputs, category selectors, and ticket management** (add, edit, remove ticket types) while connecting to the backend API to store event data.  

---

## Implemented Features ✅
- **Event Form**:
  - Collects essential event details: name, date, description, venue.
  - Enforces validation (`required`, `minLength`, `min date`).
- **Category & Status Selection**:
  - Uses `react-select` for dynamic dropdowns with multi-select support.
  - Options fetched via `EventContext` (`categories`, `status`, `popularity`).
- **Ticket Management**:
  - Add/remove multiple ticket types (VIP, Regular, Student).
  - Define **price** and **seat count** for each ticket.
  - Prevents event submission if no ticket type is added.
- **Form Submission**:
  - Sends event data to `/addEvent` endpoint with **JWT authorization**.
  - Redirects to `manageEvents` after successful creation (with delay for UX).
- **UI Enhancements**:
  - Inline icons for better form UX (pen, seat, USD, location).
  - Animated feedback when creating (spinner + message).
  - Error handling with feedback messages.

---


## Code Snippet 📂
```jsx
const createTickets = () => {
  setTicket([
    ...ticket,
    {
      type: "",
      price: 0,
      seats: 0,
    },
  ]);
};

const updateTickets = (i, prop, value) => {
  const newTicket = [...ticket];
  newTicket[i][prop] = value;
  setTicket(newTicket);
};

const removeTicket = (index) => {
  setTicket(ticket.filter((_, i) => i !== index));
};
```
# Header Component

## Description
The `Header` component serves as the **main navigation bar** for the EventX Studio application.  
It provides quick access to **Home**, **Sign Up**, and **Sign In** routes while also including placeholders for **About** and **Contact**.  
It dynamically highlights the **active route** using `useLocation`.

---

## Implemented Features ✅
- **Branding**:
  - Displays `EventX Studio` with custom font styling (`ReenieBeanie` for "Studio").
- **Navigation Links**:
  - `Home` (`/`), `Sign Up` (`/register`), `Sign In` (`/login`).
  - `About` and `Contact` as placeholder links (`#`).
- **Active Route Detection**:
  - Uses `useLocation()` to detect the current path.
  - Applies **different styles** (disabled/active) depending on whether the link matches the current route.
- **Responsive Design**:
  - `About` and `Contact` links are **hidden on small screens** (`sm:inline-flex hidden`).
  - Navigation spacing adjusts with Tailwind’s responsive classes.
- **Styling & UX**:
  - Active links are **disabled** (`cursor-not-allowed`).
  - Inactive links are styled with **hover and active states** for better UX.

---
## Code Snippet 📂
```jsx
<Link to={"/login"}>
  <p
    className={`${
      location == "/login"
        ? "bg-gray-200 px-4 py-2 rounded-xl font-medium cursor-not-allowed"
        : "bg-blue-400 px-4 py-2 rounded-xl font-medium cursor-pointer active:opacity-55 hover:bg-blue-500"
    }`}
  >
    Sign In
  </p>
</Link>

```
---
# Input Component

## Description
The `Input` component is a **reusable form field wrapper** used across the application.  
It combines a `<label>` with an `<input>` element and supports additional customization such as extra props, conditional rendering, and injected elements (e.g., icons).

---

## Implemented Features ✅
- **Reusable Input Field**:
  - Encapsulates `label` + `input` inside a styled wrapper (`info` class).
- **Customizable Props**:
  - `htmlFor`, `label`, `id`, `name`, `type`, `placeholder`, `required`.
- **Styling Support**:
  - Accepts `className` for styling extensions.
  - Uses `info` and `input` utility classes (Tailwind or custom CSS).
- **Flexibility**:
  - `formprop`: allows passing additional wrapper classes.
  - `...rest`: spreads extra props (e.g., `min`, `max`, `onChange`).
  - `element`: renders extra JSX (like icons) next to the input.

---


## Code Snippet 📂
```jsx
<div className={`info ${formprop || ""}`}>
  <label htmlFor={htmlFor}>{label}</label>
  <input
    id={id}
    name={name}
    type={type}
    placeholder={placeholder}
    className={`input ${className}`}
    required={required}
    {...rest}
  />
  {element && element}
</div>
```
# MyTickets Component

## Description
The `MyTickets` component displays all tickets purchased by the currently logged-in user.  
It fetches tickets from the backend and renders them using the reusable `TicketCard` component.

---

## Implemented Features ✅
- **Ticket Fetching**:
  - Uses `useEffect` to call `/user/Tickets` endpoint.
  - Attaches **JWT Authorization header** from `EventContext`.
- **State Management**:
  - Stores tickets in local state (`tickets`).
- **Dynamic Rendering**:
  - If tickets exist → render them via `TicketCard`.
  - If no tickets → display placeholder text (`No tickets found`).
- **Personalized Header**:
  - Greets user with `fname`, `lname`, and `username`.
  - Displays section title **"My Tickets"**.
- **Responsive Grid**:
  - 1 column on mobile.
  - 2 columns on small screens.
  - 3 columns on large screens.

---

## Code Snippet 📂
```jsx
useEffect(() => {
  api
    .get(`/user/Tickets`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => setTickets(res.data.data))
    .catch((e) => console.log(e));
}, [token]);
```
---

# PaymentForm Component

## Description
The `PaymentForm` component provides a **credit card input form** integrated with  
[`react-credit-cards-2`](https://www.npmjs.com/package/react-credit-cards-2) for **real-time visualization** of card details.  
It validates user input (card number, name, expiry, CVC) and syncs state with a parent via `setCardData`.

---

## Implemented Features ✅
- **Real-time Card Preview**:
  - Uses `<Cards />` from `react-credit-cards-2`.
  - Dynamically updates on input/focus changes.
- **Input Validation**:
  - **Card Number**: Digits only, max length 16.
  - **CVC**: Digits only, max length 3.
  - **Expiry**: Validates `MM/YY` format.
  - **Card Holder Name**: Alphabet + spaces only.
- **State Sync**:
  - Internal state (`number`, `expiry`, `cvc`, `name`, `focus`).
  - Updates parent via `setCardData`.
- **Responsive Layout**:
  - Adjusts card preview scaling for mobile/tablet/desktop.

---


## Code Snippet 📂
```jsx
const handleInputChange = (e) => {
  const { name, value } = e.target;
  let newValue = value;

  if (name === "number") {
    if (/^\d*$/.test(value) && value.length <= 16) {
      newValue = value;
    } else return;
  } else if (name === "cvc") {
    if (/^\d*$/.test(value) && value.length <= 3) {
      newValue = value;
    } else return;
  } else if (name === "expiry") {
    if (/^\d{0,2}\/?\d{0,2}$/.test(value)) {
      newValue = value;
    } else return;
  } else if (name === "name") {
    if (/^[a-zA-Z\s]*$/.test(value)) {
      newValue = value;
    } else return;
  }

  const newState = { ...state, [name]: newValue };
  setState(newState);
  setCardData(newState);
};
```
---
# PaymentWallet Component

## Description
The `PaymentWallet` component provides an interface for users to **select a mobile wallet provider** (Vodafone, Orange, Etisalat) and input their **phone number** for payment processing.  
It validates the number format and passes valid data back to the parent via `setWalletData`.

---

## Implemented Features ✅
- **Wallet Selection**:
  - Users can choose between **Vodafone, Orange, Etisalat** by clicking on provider logos.
  - Selected wallet is highlighted with `shadow-2xl` for better UX.
- **Phone Number Input**:
  - Input accepts only numeric values (`type="tel"`).
  - Requires exactly **11 digits** for validation.
  - On valid entry, `setWalletData` updates the parent with the phone number.
- **Validation Feedback**:
  - Shows error message (`this number not valid`) when format is incorrect.
- **Responsive Layout**:
  - Uses Tailwind classes to adjust font size and spacing across devices.

---


## Code Snippet 📂
```jsx
const handleInputChange = (e) => {
  const { name, value } = e.target;
  if (name === "number") {
    if (!(/^\d*$/.test(value) && value.length == 11)) {
      setWarning(true);
    } else {
      setWarning(false);
      setWalletData(value);
    }
  }
};
```

---

# ShowEvents Component

## Description
The `ShowEvents` component displays a categorized list of events (**Up-Coming, Active, Closed**) for the logged-in user.  
It includes **search and category filtering** functionality and retrieves events from the backend via secured API calls.

---

## Implemented Features ✅
- **Event Retrieval**:
  - Fetches all events from `/user/Events` using JWT authentication.
  - Automatically refreshes when `token` changes.
- **Search & Filter**:
  - Search by **event title** (real-time search bar).
  - Filter by **category** using `react-select` dropdown.
  - Supports **clearable selection** to reset filters.
- **Event Categorization**:
  - Events are grouped into:
    - 🔵 **Up-Coming Events** (`status === "UpComing"`)
    - 🟢 **Active Events** (`status === "Active"`)
    - 🔴 **Closed Events** (`status === "Closed"`)
- **Dynamic UI**:
  - Displays a welcome message with **user full name + username**.
  - Gracefully handles "No events found" state.
  - Responsive grid layout (`1–3 columns` depending on screen size).
- **EventCard Integration**:
  - Each event is passed into an `EventCard` component with props:
    - `title, price, totalSeats, availableSeats, venue, date, time, id, categories`.

---



## Code Snippet 📂
```jsx
useEffect(() => {
  api
    .get(
      `/user/SearchEvent?title=${search || ""}&categories=${Category?.value || ""}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then((res) => {
      setEvents(res.data.data);
      setNotFound(false);
    })
    .catch((e) => {
      if (e.response && e.response.status === 404) {
        setNotFound(true);
        setEvents([]);
      } else {
        console.log(e);
      }
    });
}, [search, Category, token]);
```
---
# SidebarItem Component

## Description
The `SidebarItem` component is a **reusable UI element** for sidebar navigation.  
It displays an **icon (image)** alongside a **text label** and supports passing custom event handlers or props.

---

## Implemented Features ✅
- **Icon + Label Layout**:
  - Renders an image (`props.image`) aligned with a text label (`props.text`).
- **Reusable Wrapper**:
  - Accepts `...rest` props to allow custom behavior (e.g., `onClick`, `onMouseEnter`).
- **Styling**:
  - Default styles:
    - `cursor-pointer` for interactivity.
    - Responsive text size (`text-xs → sm:text-base`).
    - Icon width fixed at `1.7rem`.
    - Consistent spacing between icon and text (`mr-5`).

---



## Code Snippet 📂
```jsx
function SidebarItem({ image, text, ...rest }) {
  return (
    <div className="SbarItem cursor-pointer" {...rest}>
      <img src={image} className="mr-5 w-[1.7rem]" />
      <p className="text-[#D9D9D9] text-xs sm:text-base">{text}</p>
    </div>
  );
}
```
---

# TicketCard Component

## Description
The `TicketCard` component displays a **detailed summary of a user's ticket**.  
It shows ticket info (QR code, seat, type, price, event, payment, and status) and allows navigation to a detailed ticket view.

---

## Implemented Features ✅
- **Interactive Card**:
  - Clickable card → sets the current `ticketID` in context and navigates to `/User/TicketDetails`.
  - Hover effect (`hover:shadow-lg`) for better UX.
- **Ticket QR Code**:
  - Displays a ticket-specific QR image (`ticket.ticketQR`) with fallback styles.
- **Ticket Details**:
  - Seat number and ticket type.
  - Event title.
  - Price in **EGP**.
  - Payment method and payment status:
    - Status color-coded (`green` = Paid, `red` = Unpaid).
  - General ticket status (e.g., Active, Cancelled).
  - Check-in indicator ✅/❌.
- **Timestamp**:
  - Shows the `bookedAt` date, formatted via `toLocaleString()`.

---



## Code Snippet 📂
```jsx
<div
  className="bg-white shadow-md rounded-2xl p-4 flex flex-col md:flex-row gap-4 hover:shadow-lg transition w-full"
  onClick={() => {
    setTicketID(ticket._id);
    navigate("/User/TicketDetails");
  }}
>
  <div className="flex justify-center md:w-1/3">
    <img src={ticket.ticketQR} alt="QR Code" className="w-32 h-32 object-contain" />
  </div>

  <div className="flex-1 text-gray-700">
    <h2 className="text-lg font-semibold mb-2">
      Seat #{ticket.seatNumber} - {ticket.ticketType}
    </h2>
    <h2 className="text-lg font-semibold mb-2">{ticket.event.title}</h2>
    <p><span className="font-medium">Price:</span> {ticket.price} EGP</p>
    <p><span className="font-medium">Payment Method:</span> {ticket.paymentMethod}</p>
    <p>
      <span className="font-medium">Payment Status:</span>{" "}
      <span
        className={`${
          ticket.paymentStatus === "Paid" ? "text-green-600" : "text-red-500"
        } font-semibold`}
      >
        {ticket.paymentStatus}
      </span>
    </p>
    <p><span className="font-medium">Status:</span> {ticket.status}</p>
    <p><span className="font-medium">Checked-in:</span> {ticket.checkedIn ? "Yes ✅" : "No ❌"}</p>
    <p className="text-sm text-gray-500 mt-2">
      Booked At: {new Date(ticket.bookedAt).toLocaleString()}
    </p>
  </div>
</div>
```

# UnderDevelopment Component

## Description
The `UnderDevelopment` component serves as a **placeholder page** for features that are not yet ready.  
It informs users that the page is still in progress and provides a way to navigate back depending on their role.

---

## Implemented Features ✅
- **User Feedback**:
  - Displays a clear message: *"This Page is Under Development 🚧"*.
  - Provides additional context encouraging users to check back later.
- **Role-Based Navigation**:
  - If user role = `User` → navigates back to **MyTickets**.
  - If user role = `Admin` → navigates back to **Dashboard**.
- **UI/UX**:
  - Responsive layout using flexbox and `min-h-screen`.
  - Gradient background (`from-gray-100 to-gray-200`) for modern look.
  - Prominent call-to-action button styled with hover/transition effects.

---



## Code Snippet 📂
```jsx
<button
  onClick={() => {
    if (user?.role === "User") setActiveComponent("MyTickets");
    else if (user?.role === "Admin") setActiveComponent("Dashboard");
  }}
  className="mt-8 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition"
>
  Go Back
</button>
```
---

# UserEventDetails Component

## Description
The `UserEventDetails` component displays **detailed information** about a specific event.  
It allows the user to view event metadata, ticket types, and provides an option to book tickets.

---

## Implemented Features ✅
- **Data Fetching**:
  - Fetches event details from `/user/Event/:eventID` using `axios` (via `api`).
  - Stores the result in `EventContext` (`setEvent`).
- **Event Details UI**:
  - Displays event name, date, time, venue, description.
  - Shows total seats, available seats, ticket price, and popularity.
  - Displays tags, expected attendance, and the event creator.
- **Ticket Types Section**:
  - Lists all available ticket types with:
    - Price
    - Total seats
    - Available seats
- **Navigation**:
  - Back button → sets active component back to `showEvents`.
  - “Book Ticket” button → navigates to `/User/BookTicket`.
- **Responsive Layout**:
  - Flex and grid-based layout for mobile, tablet, and desktop.
  - Inputs are **read-only** for ticket type details.

---


## Code Snippet 📂
```jsx
<div className="flex justify-center my-5">
  <button
    className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold w-full sm:w-auto"
    onClick={() => navigate("/User/BookTicket")}
  >
    Book Ticket
  </button>
</div>
```
---

# Authentication Helpers (JWT)

## Description
This file provides **utility functions** for handling authentication and authorization in the application.  
It uses **JWT decoding** to:
- Validate tokens
- Protect routes
- Check user roles

---

## Implemented Features ✅

### 1. `isTokenValid()`
- Retrieves JWT token from `localStorage`.
- Decodes the token using `jwt-decode`.
- Checks if the token has expired:
  - `decodeToken.exp > Date.now() / 1000`
- Returns:
  - `true` if token is valid
  - `false` if missing/expired

---

### 2. `ProtectRoute`
- A higher-order component (HOC) used with **React Router**.
- Wraps around protected routes.
- Behavior:
  - If `isTokenValid()` → renders `children`.
  - If invalid → redirects user to `/` (login page).

**Usage Example:**
```jsx
<Route 
  path="/dashboard" 
  element={
    <ProtectRoute>
      <Dashboard />
    </ProtectRoute>
  } 
/>
```
### 3. `checkRole()`
- Retrieves token from `localStorage`..
- Wraps around protected routes.
- Behavior:
  - If `isTokenValid()` → renders `children`.
  - If invalid → redirects user to `/` (login page).

**Usage Example:**
```jsx
<Route 
  path="/dashboard" 
  element={
    <ProtectRoute>
      <Dashboard />
    </ProtectRoute>
  } 
/>
```
---
# UserHome Component

## Description
The `UserHome` component is the **main container** for the **User Dashboard** after login.  
It provides:
- Sidebar navigation
- Main content area (dynamic rendering of components)
- User data fetching (with JWT authentication)

---

## Features ✅

### 1. **Sidebar Navigation**
- **Responsive** (collapsible on small screens with toggle button).
- Navigation sections:
  - **Main Navigation**:  
    - `Events` → Shows all events (`ShowEvents`)  
    - `My Tickets` → Shows user’s booked tickets (`MyTickets`)  
  - **Support & Management**:  
    - `Contact Support`, `Notifications`, `Settings` → Placeholder (`UnderDevelopment`)  
  - **Users & Logout**:  
    - `Manage Users` → Placeholder  
    - `Logout` → Clears JWT token and redirects to `/login`

---

### 2. **Main Content**
- Content is **dynamically rendered** based on `activeComponent` state:
  - `"showEvents"` → `ShowEvents`
  - `"userEventDetails"` → `UserEventDetails`
  - `"MyTickets"` → `MyTickets`
  - `"UnderDevelopment"` → `UnderDevelopment`

---

### 3. **User Authentication**
- Uses `EventContext` to access:
  - `setuser` → updates current user
  - `token` → JWT for authenticated API calls
- Fetches user data from `/user` API endpoint with token in headers.
- If `setuser` is undefined, it reloads the page after 300ms (⚠️ hacky fix).

---

### 4. **State Management**
- `activeComponent` → controls which page is displayed.
- `sidebarOpen` → controls mobile sidebar visibility.

---

# BookTicket Component

## Description
The `BookTicket` component handles the **ticket booking process** for a specific event.  
It allows users to:
- Select a ticket type
- Choose a payment method (Cash, Wallet, or Card)
- Enter payment details
- Review their order before confirmation
- Confirm or cancel the booking

---

## Features ✅

### 1. **Event Information**
- Displays:
  - Event **title**
  - Event **date**
  - Event **venue**
  - Event **description**
- Data is retrieved from `EventContext`.

---

### 2. **Ticket Selection**
- Users choose from available ticket types (`Event.ticketTypes`).
- Each option shows the ticket type and price (e.g., `VIP - 500 EG`).
- If no ticket is selected, a warning is displayed.

---

### 3. **Payment Method**
- Options:  
  - **Cash** (default)  
  - **Wallet** → Renders `PaymentWallet` form  
  - **Card** → Renders `PaymentForm` form  
- Validates input before confirming the order.

---

### 4. **Order Review**
- Shows:
  - Selected ticket type & price
  - Total price
  - Payment method
  - Terms & conditions (non-refundable, transferable only through EventX)

---

### 5. **Ticket Creation**
- On confirm:
  - Validates payment inputs.
  - Sends a POST request to:
    ```
    POST /user/bookTicket/:eventID
    ```
    With body:
    ```json
    {
      "type": "<ticket-type>",
      "paymentMethod": "<method>"
    }
    ```
  - Adds JWT token in headers for authentication.

- On success:
  - Saves ticket ID in context (`setTicketID`).
  - Shows success message.
  - Redirects to `/User/TicketDetails` after 2 seconds.

- On failure:
  - Displays error message from server.

---

### 6. **Cancel**
- User can cancel booking → navigates back to `/User`.

---

## State Management
- `EventTicket`: Selected ticket type
- `method`: Payment method (`Cash`, `Wallet`, `Card`)
- `cardData`: Stores card input (from `PaymentForm`)
- `walletData`: Stores wallet input (from `PaymentWallet`)
- `warning`: Validation messages for missing fields
- `error`: API error messages
- `success`: Boolean for booking success (triggers redirect)
---
# TicketDetails Component

## Description
The `TicketDetails` component displays the **details of a booked ticket** and the **associated event**.  
It fetches ticket information from the backend API using the `ticketID` stored in context and renders a structured page with event details, ticket holder info, and an order summary.

---

## Features ✅

### 1. **API Integration**
- On mount (`useEffect`):
  - Calls:
    ```
    GET /user/ticket/:ticketID
    ```
    With headers:
    ```http
    Authorization: Bearer <token>
    ```
  - Saves response data into local state `ticket`.

---

### 2. **Event Details**
- Shows:
  - Event **title**
  - Event **date** (formatted)
  - Event **venue**
  - Event **description**

---

### 3. **Ticket & User Information**
- Displays:
  - User name (from `ticket.user.fname` + `ticket.user.lname`)
  - Seat number
  - Ticket type
  - Price
  - Payment method
  - Payment status (`Paid`/`Unpaid`)
  - Check-in status (`Checked-in`/`Not Checked-in`)

---

### 4. **Your Ticket Section**
- Shows:
  - Ticket QR code image (`ticket.ticketQR`)
  - Ticket status (styled in an orange badge)

---

### 5. **Order Summary**
- Displays:
  - Selected ticket (type & price)
  - Total price
  - Payment method
  - Terms & conditions (non-refundable, transferable only through EventX)
- Provides a **Return** button → navigates back to `/User`.

---

## State Management
- **ticket** (`useState`) → Holds ticket data fetched from API.
- Data comes from:
  - `ticketID` (from `EventContext`)
  - `token` (for authentication)

---
</details>

