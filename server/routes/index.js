import express from "express";
const router = express.Router();

//toDo importar rutas desde /api/
// import user from "../api/user.js";
// import login from "../api/login.js";
const login = require("../api/login.js");
const user = require("../api/user.js");

//! router.use(nombre de ruta, modelo)
router.use("/create", user);
router.use("/login", login);

module.exports = router;
