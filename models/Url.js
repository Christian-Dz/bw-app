const mongoose = require("mongoose");
const { Schema } = mongoose;
const { nanoid } = require("nanoid");


const urlSchema = new Schema({
  origin: {
    type: String,
    unique: true,
    required: true,
  },
  shortUrl: {
    type: String,
    unique: true,
    required: true,
    default: () => nanoid(6)
  }
});

const Url = mongoose.model("Url", urlSchema);

module.exports = Url;