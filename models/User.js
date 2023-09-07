
const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  userName: {
    type: String,
    lowercase: true,
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
    index: {unique: true}
  },
  password: {
    type: String,
    required: true
  },
  tokenConfirm: {
    type: String,
    default: null
  },
  confirmedAccount: {
    type: Boolean,
    default: false
  }
});


userSchema.pre("save", async function (next) { 
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }

})


userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    console.log(error);
  }
}




module.exports = mongoose.model("User", userSchema);