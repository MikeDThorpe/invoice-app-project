const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsmate = require("ejs-mate");
const invoiceRoutes = require("./router/invoices");
const apiRoutes = require("./router/api");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const ExpressError = require("./utilities/expressError");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require('passport');
const localStrategy = require('passport-local')
const User = require('./models/user')

const port = process.env.PORT || 3001;
app.listen(port);

//create database connection with mongoose
mongoose.connect("mongodb://localhost:27017/invoiceApp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

//set tools for application
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsmate);

// global middleware
app.use(methodOverride("_method"));
app.use(express.static("assets"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: "testSecret",
    saveUninitialized: true,
    resave: true,
  })
);
app.use(flash());
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// homepage
app.get("/", (req, res, next) => {
  res.render("index", {
    title: "Create, Receive & Send Invoices",
  });
});
// register form
app.get("/register", (req, res, next) => {
  res.render("register", {
    title: "Register"
  });
});
// routing
app.use("/invoices", invoiceRoutes);
app.use("/api", apiRoutes);

// 404 page
app.use("*", (req, res, next) => {
  next(new ExpressError("404", "Page not found"));
});

// error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send(message);
});
