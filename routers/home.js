const express = require("express");
const {
  leerUrls,
  agregarUrl,
  eliminarUrl,
  editarUrlForm,
  editarUrl,
  redirect
} = require("../controllers/homeController");
const urlValidar = require("../middlewares/urlValida");
const router = express.Router();


router.get("/login", (req, res) => {res.render("login")});
router.get("/", leerUrls);
router.post("/", urlValidar, agregarUrl);
router.get("/eliminar/:id", eliminarUrl);
router.get("/editar/:id", editarUrlForm);
router.post("/editar/:id", urlValidar, editarUrl);
router.get("/:shortUrl", redirect);



module.exports = router;
