const mongoose = require("mongoose");


const timeSchema = new mongoose.Schema({
    userid: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
  
  });
  
  module.exports = mongoose.model("Mainaa", timeSchema);