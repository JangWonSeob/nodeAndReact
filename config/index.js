const dotenv = require("dotenv");
dotenv.config();

const configfile = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
};

module.exports = configfile;
