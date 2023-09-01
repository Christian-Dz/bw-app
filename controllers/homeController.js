
const Url = require("../models/Url.js"); // Los controladores son los que van en llaves

const leerUrls = async (req, res) => {
  try {
    const urls = await Url.find().lean();
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








  module.exports = {
    leerUrls,
    agregarUrl,
    eliminarUrl,
  };
