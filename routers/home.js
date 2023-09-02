const express = require("express");
const {
  leerUrls,
  agregarUrl,
  eliminarUrl,
  editarUrlForm,
  editarUrl,
} = require("../controllers/homeController");
const urlValidar = require("../middlewares/urlValida");
const router = express.Router();


router.get("/login", (req, res) => {res.render("login")});
router.get("/", leerUrls);
router.post("/", urlValidar, agregarUrl);
router.get("/eliminar/:id", eliminarUrl);
router.get("/editar/:id", editarUrlForm);
router.post("/editar/:id", urlValidar, editarUrl);




module.exports = router;
