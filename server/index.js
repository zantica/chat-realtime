import express from "express";
import logger from "morgan";
import { Server } from "socket.io";
import { createServer } from "node:http";
import passport from "passport";
import session from "express-session";
import bcrypt from "bcrypt";
import { Strategy } from "passport-local";
import dotenv from "dotenv";

dotenv.config();
const port = process.env.PORT ?? 3000;

const app = express();

const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {
    maxDisconnectionDuration: 10000,
  },
});

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});

io.on("disconnect", () => {
  console.log("usuario desconectado");
});

app.use(logger("dev"));
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  //todo conectar base de datos y crear modelo para busqueda de usuarios
  const user = getUserbyID(id);
  done(null, user);
});

const localStrategy = Strategy;

passport.use(
  new localStrategy((username, password, done) => {
    const user = getUserByUsername(username);
    if (!user) {
      return done(null, false, { message: "user not found" });
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Invalid password" });
      }
    });
  })
);

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/client/index.html");
});

app.get("/login", (req, res) => {
  res.sendFile(process.cwd() + "/client/login.html");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
console.log(req.body);
  if (username === "santi" && password === "1234") {
    res.send(200, "usuario logeado");
  } else {
    res.send(401, "unauthorized");
  }
});

// app.post("/", (req, res) => {
//   const { user, password } = req.body;
//   //TODO CREAR USUARIO
// });

server.listen(port, () => {
  console.log("server listening on port " + port);
});
