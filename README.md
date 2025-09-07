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

----
----

- 🖼️ Frontend
  -


