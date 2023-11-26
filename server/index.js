import express from "express";
import logger from "morgan";
import { Server } from "socket.io";
import { createServer } from "node:http";
import passport from "passport";
import session from "express-session";
import bcrypt from "bcrypt";
import { Strategy } from "passport-local";
import dotenv from "dotenv";
import { user } from "./services/user/user.js";

// import routes from "./routes/index.js";

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
// app.use(routes);

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

// app.post("/create", (req, res) => {
//   const { username, password, name, email } = req.body;
//   console.log(req.body);
//   const response = user.createUser({ username, password, name, email });
//   res.send(response);
// });

// app.get("/login", (req, res) => {
//   res.sendFile(process.cwd() + "/client/login.html");
// });

// app.post("/login", async (req, res) => {
//   const { username, password } = req.body;
//   const userlogged = await user.userLogin({ username, password });

//   console.log("userlogged", userlogged);
//   if (userlogged) {
//     res.redirect("/");
//   }
// });

server.listen(port, () => {
  console.log("server listening on port " + port);
});
