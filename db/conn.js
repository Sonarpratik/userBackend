const mongoose = require("mongoose");

const DB = process.env.MONGO_URL;

mongoose.set('strictQuery', true);
mongoose
  .connect(DB)
  .then(() => {
    console.log("Connection Successfull");
  })
  .catch((err) => console.log("NO connection"+err));