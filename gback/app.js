require("dotenv").config();
const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const path = require('path'); 

const cookiePaser = require("cookie-parser");

const userRoute = require("./routes/user");
const taskRoute = require("./routes/task")
const calendarRoute = require('./routes/calendar')
const incomeRoute = require('./routes/income')
const expenseRoute = require('./routes/expense')
const chatRoutes = require('./routes/bot');

const app = express();
const port = process.env.PORT || 2000;


app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true, 
  methods: ['GET', 'POST', 'DELETE', 'PATCH','OPTIONS'],   // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allowed headers
  maxAge: 86400,    // Cache the preflight response for 24 hours
})); 
app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(cookiePaser());
app.use(express.urlencoded({extended: false}));


mongoose
  .connect(process.env.MONGO_URL|| "mongodb://127.0.0.1:27017/grego")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


app.use("/user", userRoute);
app.use('/task', taskRoute)
app.use('/calendar',calendarRoute)
app.use('/income', incomeRoute);
app.use('/expense', expenseRoute)
app.use('/bot', chatRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
