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
const verifyUser = require("../middlewares/verifyUser");
const { formPerfil, editarFotoPerfil } = require("../controllers/perfilController");

const router = express.Router();

router.get("/", verifyUser, leerUrls);
router.post("/", verifyUser, urlValidar, agregarUrl);
router.get("/eliminar/:id", verifyUser, eliminarUrl);
router.get("/editar/:id", verifyUser, editarUrlForm);
router.post("/editar/:id", verifyUser, urlValidar, editarUrl);
router.get("/perfil", verifyUser, formPerfil);
router.post("/perfil", verifyUser, editarFotoPerfil);
router.get("/:shortUrl", redirect);

module.exports = router;
