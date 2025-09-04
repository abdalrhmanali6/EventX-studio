# EventX-studio
Event organizers often face challenges in managing events, selling tickets, tracking attendees, and analyzing engagement. Existing solutions are either too complex or expensive for small to medium-sized organizations.  The EventX Studio system solves this by providing an easy-to-use Event Management System with separate roles for Admins and Users


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

## env
```bash
MONGO_URI=your_mongo_connection_string
Access-token=your_secret_key
```

## 🌍 Live Demo

Frontend: https://event-x-studio-7.vercel.app

Backend: https://event-x-backend-one.vercel.app

# H1📑 Final Report

 # H2 BackEnd ![Node.js](https://img.shields.io/badge/node-%3E%3D14-green)

  - **Added the modules that are used in the backend.</summary>**
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
    - 1 dotenv → Loads environment variables from a .env file into process.env. Helps keep sensitive data (like database URIs or secret keys) secure.
   
    - 2  express → A lightweight web framework for Node.js. It’s used to create the server, handle HTTP requests (GET, POST, etc.), and define APIs.
   
    - 3 mongoose → A MongoDB object modeling tool. It allows you to define schemas and interact with MongoDB in a structured way.
   
    - 4 bcrypt → A library used to securely hash and compare passwords. It’s essential for protecting user credentials.
   
    - 5 jsonwebtoken (JWT) → Used for authentication and authorization. It generates tokens for logged-in users so they can securely access protected routes.
   
    - 6 cors → Middleware that allows cross-origin requests (e.g., letting your React frontend communicate with your Node.js backend).
   
    - 7 User / Events / Ticket (Custom Models) → These are your Mongoose models that represent collections in MongoDB:
   
     - 8 User → Stores user information (username, email, password, etc.).
   
      - 9 Events → Stores event details (title, date, location, etc.).
   
    - 10 Ticket → Stores ticket information linked to events and users.
   
    - 11 qrcode → Generates QR codes (for example, to validate event tickets or provide quick access to information).
   
    - 12 json2csv (Parser) → Converts JSON data into CSV format, which is useful for exporting reports or data

** Mongoose Setup**
  ```js
  mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("connected"))
  .catch((e) => console.error(e));
  ```
    -1 `mongoose.connect(process.env.MONGO_URL):` This is the core function that initiates the connection. It takes the database connection string from the `MONGO_URL`       environment variable. Using an environment variable is a secure best practice to keep sensitive credentials out of the source code.

    - 2`.then(() => console.log("connected")):` This part executes if the connection is successful. The `.then()` method handles the "promise" returned by `connect().` When it resolves       successfully, it prints "connected" to the console.

    - 3`.catch((e) => console.error(e)):` This part acts as an error handler. If the connection fails for any reason (e.g., invalid URL, network issue), the `.catch()` method catches       the `error (e)` and logs it to the console for debugging.

**Express and cors setup**
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

**Auth APIs**
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
 1- Finds user by email or username.

 2- Returns 404 if not found.

 3- Updates user's role.

 4- Compares password hash.

 5- Returns JWT token on success, 400 on wrong password



   

   



