
const mongoose = require("mongoose");


mongoose
  .connect(process.env.URI)
  .then(() => {
    console.log("Conexion exitosa al servidor con mongoose");
  })
  .catch((err) =>
    console.log("Hubo un error al conectarse al servidor con mongoose", { err })
  );