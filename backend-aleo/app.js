require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var beneficiariesRouter = require("./routes/beneficiaries");
var credentialsRouter = require("./routes/credentials");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const cors = require("cors");
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || "*",
    credentials: true,
  })
);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/beneficiaries", beneficiariesRouter);
app.use("/credentials", credentialsRouter);

module.exports = app;
