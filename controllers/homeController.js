const Url = require("../models/Url.js"); // Los controladores son los que van en llaves
const { nanoid } = require("nanoid");

const leerUrls = async (req, res) => {
  try {
    const urls = await Url.find({ user: req.user.id }).lean(); // el ".lean() es porque mongoose trae un objeto con diferentes caracteristicas y no los puede leer hbs, con json eso se soluciona o con Rect, y lean lo que hace es convertirlo a javascript normal"
    return res.render("home", { urls: urls });
  } catch (error) {
    console.log("error en leerUrls");
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/");
  }
};

const agregarUrl = async (req, res) => {
  const { origin } = req.body;
  try {
    const url = new Url({ origin: origin, shortUrl: nanoid(6), user: req.user.id });
    await url.save();
    req.flash("mensajes", [{ msg: "url agregada" }]);
    return res.redirect("/");
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/");
  }
};
// HASTA AQUI ESTA REVISADO
const eliminarUrl = async (req, res) => {
  const { id } = req.params;
  try {
    //await Url.findByIdAndDelete(id);  //buscar diferencia entre delete y remove
    const url = await Url.findById(id);
    if (!url.user.equals(req.user.id)) {
      throw new Error("No puedes eliminar esta url");
    }
    await Url.deleteOne({ _id: id });
    req.flash("mensajes", [{ msg: "url eliminada" }]);
    return res.redirect("/");
  } catch (error) {
    console.log("error en eliminarUrl")
    console.log(error);
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/");
  }
};

const editarUrlForm = async (req, res) => {
  const { id } = req.params;
  try {
    const url = await Url.findById(id).lean();
    if (!url.user.equals(req.user.id)) {
      throw new Error("No puedes eliminar esta url");
    }
    return res.render("home", {url});
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/");
  }
};

const editarUrl = async (req, res) => {
  const { id } = req.params;
  const { origin } = req.body;
  try {
    //await Url.findByIdAndUpdate(id, { origin });
    const url = await Url.findById(id);
    if (!url.user.equals(req.user.id)) {
      throw new Error("No puedes eliminar esta url");
    }
    await url.updateOne({ origin });
    req.flash("mensajes", [{ msg: "url editada" }]);
    
    return res.redirect("/");
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/");
  }
};

const redirect = async (req, res) => {
  const { shortUrl } = req.params;
  try {
    const urlDb = await Url.findOne({ shortUrl: shortUrl  });
    return res.redirect(urlDb.origin);
  } catch (error) {
     req.flash("mensajes", [{ msg: "no existe esta url" }]);
     return res.redirect("/auth/login");
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
