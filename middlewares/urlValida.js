const { URL } = require("url");

const urlValidar = (req, res, next) => {
  try {
    const { origin } = req.body;
    const urlFrontend = new URL(origin);
    if (urlFrontend.origin !== "null") {
      if (
        urlFrontend.protocol === "http:" ||
        urlFrontend.protocol === "https:"
      ) {
        return next();
      }
    } else {
      throw new Error("Url no válida");
    }
  } catch (error) {
    // console.log(error);
    return res.send("url no valida");
  }
};

module.exports = urlValidar;
