import express from "express";
import { user } from "../services/user/user.js";

const router = express.Router();

router.post("/create", (req, res) => {
  const { username, password, name, email } = req.body;
  console.log(req.body);
  const response = user.createUser({ username, password, name, email });
  res.send(response);
});

module.exports = router;