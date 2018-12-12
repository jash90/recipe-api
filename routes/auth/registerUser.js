var router = require("express").Router();

const db = require("../../db");
const status = require("../../status");

const crypto = require("crypto-js");

const sql = `INSERT INTO public."user" (login, password) VALUES($1, $2);`;

router.post("/", function (req, res) {
  var user = req.body.username;
  var pass = req.body.password;

  pass = crypto
    .SHA256(pass)
    .toString(crypto.enc.Hex);

  db
    .query(sql, [user, pass])
    .then(data => {
      res
        .status(200)
        .json({status: status.OK.code, message: status.OK.message});
    })
    .catch(error => {
      res.json({status: status.Error.code, message: error});
    });

});

module.exports = router;
