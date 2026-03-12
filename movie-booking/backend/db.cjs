const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "rap_chieu_phim"
});

db.connect(err => {
  if (err) {
    console.error(" MySQL lỗi:", err);
  } else {
    console.log(" MySQL connected");
  }
});

module.exports = db;
