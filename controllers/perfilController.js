const formidable = require("formidable");
const fs = require("fs");
const Jimp = require("jimp");
const path = require("path");
const User = require("../models/User");

module.exports.formPerfil = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    return res.render("perfil", { user: req.user, imagen: user.imagen });
  } catch (error) {
    req.flash("mensajes", [{ msg: "no se puede leer perfil" }]);
    return res.redirect("/perfil");
  }
};

module.exports.editarFotoPerfil = async (req, res) => {
  const form = new formidable.IncomingForm();
  //form.maxFileSize = 5 * 1024 * 1024;
  form.parse(req, async (err, fields, files) => {
    try {
      /* if (err) {
        throw new Error("Error al subir la imagen");
      } */
      /* console.log("fields:");
      console.log(fields);
      console.log("files:");
      console.log(files);*/

      const file = files.myFile;
      if (!files || !files.myFile || files.myFile.originalFilename === "") {
        throw new Error("Por favor agrega una imagen");
      }

      const allowedMIMETypes = ["image/jpeg", "image/png"];

      if (!allowedMIMETypes.includes(file.mimetype)) {
        throw new Error("La imagen debe ser .jpeg o .png");
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error("La imagen debe ser menor a 5MB");
      }

      const extension = file.mimetype.split("/")[1];
      const dirFile = path.join(
        __dirname,
        `../public/img/perfiles/${req.user.id}.${extension}`
      );

      fs.renameSync(file.filepath, dirFile);

      const image = await Jimp.read(dirFile);
      image.resize(200, 200).quality(90).writeAsync(dirFile);

      const user = await User.findById(req.user.id);
      user.imagen = `${req.user.id}.${extension}`;
      await user.save();

      req.flash("mensajes", [{ msg: "ya se subió la imagen" }]);
    } catch (error) {
      req.flash("mensajes", [{ msg: error.message }]);
      console.log("error en el catch");
      console.log(error);
    } finally {
      return res.redirect("/perfil");
    }
  });
};
