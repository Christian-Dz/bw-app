require("dotenv").config();
require("./database/db.js");
const { create } = require("express-handlebars");
const express = require("express");
const app = express();
const port = process.env.PORT;


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

app.use("/", require("./routers/home"));
app.use("/auth", require("./routers/auth"));

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
