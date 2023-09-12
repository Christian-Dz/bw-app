const User = require("../models/User.js");
const { validationResult } = require("express-validator");
const { nanoid } = require("nanoid");
const nodemailer = require("nodemailer");
require("dotenv").config();

const signForm = (req, res) => {
  res.render("sign");
};

const loginForm = (req, res) => {
  res.render("login");
};

const signUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("mensajes", errors.array());
    return res.redirect("/auth/signin");
  }
  const { userName, email, password } = req.body;

  try {
    let user = await User.findOne({ email: email });
    if (user) throw new Error("User already exists");
    user = new User({ userName, email, password, tokenConfirm: nanoid() });
    await user.save();

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
      }
    });

    await transport.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: user.email, // list of receivers
      subject: "Verify Account", // Subject line
      html:
        `<a href="http://localhost:3000/auth/confirmAcc/${user.tokenConfirm}"> Click aqui para verificar cuenta </a>`,
    });

    req.flash("mensajes", { msg: "revisa tu correo para confirmar tu cuenta" });
    res.redirect("/auth/login");
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/auth/signin");
  }
};

const confirmAcc = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ tokenConfirm: token });
    if (!user) throw new Error("User not found");
    user.confirmedAccount = true;
    user.tokenConfirm = null;
    await user.save();

    req.flash("mensajes", { msg: "Cuenta verificada" });
    res.redirect("/auth/login"); // res.redirect("/login")
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/auth/login");
  }
};
//---------------------------------------------------------------------------------------------->>>>>>>>


const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("mensajes", errors.array());
    return res.redirect("/auth/login");
  }
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    if (!user.confirmedAccount) throw new Error("User not confirmed");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error("Password incorrect");

//esta creando la sesion de usuario a traves de passport
    req.login(user, (error) => {
      if (error) throw new Error(error);
      return res.redirect("/"); 
    });
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/auth/login");
  }
};


const closeSesion = (req, res) => {
  req.logout((err) => {  // a partir de passport 0.6.0 se requiere el callback en el logout()
    if (err) return next(err);
  });
  return res.redirect("/auth/login");
};


module.exports = {
  loginForm,
  signForm,
  signUser,
  confirmAcc,
  loginUser,
  closeSesion,
};

//