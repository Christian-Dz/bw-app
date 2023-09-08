const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const { create } = require("express-handlebars");
require("dotenv").config();
require("./database/db.js");
const User = require("./models/User.js");
const app = express();

const port = process.env.PORT;

app.use(session({
  secret: "qwerty",
  resave: false,
  saveUninitialized: false,
  name: "secret-name-here",
}));


app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, {id: user._id, userName: user.userName});
});
passport.deserializeUser(async (user, done) => {
  const userDb = await User.findById(user.id);
  return done(null, { id: userDb._id, userName: userDb.userName });
});


const hbs = create({
  extname: ".hbs",
  partialsDir: "views/components/",
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");

//app.use(express.static("public", { extensions: ["html", "css", "js"] }));
app.use(express.static(__dirname + "/public")); //buscar diferencia
app.use(express.urlencoded({ extended: true}));  // middleware para parsear formularios

app.use((req, res, next) => {
  res.locals.mensajes = req.flash("mensajes");
  next();
});



app.use("/", require("./routers/home"));
app.use("/auth", require("./routers/auth"));

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
