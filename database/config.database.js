const mongoose = require("mongoose");

/*=============================================
MONGOOSE DEPRECATIONS
=============================================*/

const optionsMongoose = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

const dbConection = async () => {
  try {
    await mongoose.connect(
      `${process.env.DBURL}${process.env.DBPORT}/${process.env.DBNAME}`,
      optionsMongoose,
      (err, res) => {
        if (err) throw new Error("Error connecting to Database");
      }
    );
    console.log("Connected to Database successfully");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  dbConection,
};
