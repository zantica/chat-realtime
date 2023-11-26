import express from "express";
import { user } from "../services/user/user.js";
const loginrouter = express.Router();

loginrouter.get("/login", (req, res) => {
  res.sendFile(process.cwd() + "/client/login.html");
});

loginrouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userlogged = await user.userLogin({ username, password });

  console.log("userlogged", userlogged);
  if (userlogged) {
    res.redirect("/");
  }
});

module.exports = { loginrouter };
