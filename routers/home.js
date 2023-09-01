const express = require("express");
const { leerUrls, agregarUrl, eliminarUrl } = require("../controllers/homeController");
const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/", leerUrls);

router.post("/", agregarUrl);

router.get("/eliminar/:id", eliminarUrl);

module.exports = router;
