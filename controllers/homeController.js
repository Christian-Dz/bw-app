
const Url = require("../models/Url.js"); // Los controladores son los que van en llaves

const leerUrls = async (req, res) => {
  try {
    const urls = await Url.find().lean(); // el ".lean() es porque mongoose trae un objeto con diferentes caracteristicas y no los puede leer hbs, con json eso se soluciona o con Rect, y lean lo que hace es convertirlo a javascript normal"
    res.render("home", { urls: urls });
  } catch (error) {
    console.log(error);
    res.send("Algo falló al leer las urls");
  }
};

const agregarUrl = async (req, res) => {
  const { origin } = req.body;
  try {
    const url = new Url({ origin: origin });
    await url.save();
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.send("Algo falló al crear la url");
  }
};

const eliminarUrl = async (req, res) => {
  const { id } = req.params;
  try {
    await Url.findByIdAndDelete(id);  //buscar diferencia entre delete y remove
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.send("Algo falló al eliminar la url");
  }
};

const editarUrlForm = async (req, res) => {
  const { id } = req.params;
  try {
    const url = await Url.findById(id).lean();
    res.render("home", {url});
  } catch (error) {
    console.log(error);
    res.send("Algo falló al editar la url");
  }
};

const editarUrl = async (req, res) => {
  const { id } = req.params;
  const { origin } = req.body;
  try {
    await Url.findByIdAndUpdate(id, { origin });
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.send("Algo falló al editar la url");
  }
};

const redirect = async (req, res) => {
  const { shortUrl } = req.params;
  try {
    const urlDb = await Url.findOne({ shortUrl });
    res.redirect(urlDb.origin);
  } catch (error) {
    console.log(error);
    res.send("Algo falló al editar la url");
  }
};







  module.exports = {
    leerUrls,
    agregarUrl,
    eliminarUrl,
    editarUrlForm,
    editarUrl,
    redirect,
  };
