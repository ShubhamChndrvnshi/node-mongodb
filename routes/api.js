/* eslint-disable linebreak-style */
const express = require("express");
const authRouter = require("./auth");
const TokenRouter = require("./property");

const app = express();

app.use("/auth/", authRouter);
app.use("/token/", TokenRouter);

module.exports = app;