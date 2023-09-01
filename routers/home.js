
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const urls = [{ origin: "wwww.google.com", shortUrl: "sjhvbsbsjk" }];
  res.render("home", { urls: urls });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/", (req, res) => {
  res.send("consulta con el metodo post");
});



module.exports = router;