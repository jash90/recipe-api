var router = require("express").Router();

const db = require("../../db");
const status = require("../../status");

const crypto = require("crypto-js");

const sql = `UPDATE public."user"
set "accessToken" = $3 , "accessTokenExpiresAt" = NOW()+ INTERVAL '1 day', "refreshToken" = $4, "refreshTokenExpiresAt" = NOW() + INTERVAL '1 week'
where "login" = $1 AND "password" = $2 AND "accessTokenExpiresAt" < NOW() OR "refreshTokenExpiresAt" < NOW() OR "accessTokenExpiresAt" IS NULL OR "refreshTokenExpiresAt" IS NULL;

SELECT "accessToken", "accessTokenExpiresAt", "refreshToken" , "refreshTokenExpiresAt" 
from "user"
where "login" = $1`;

router.post("/", function (req, res) {
  var user = req.body.username;
  var pass = crypto
    .SHA256(req.body.password)
    .toString(crypto.enc.Hex);
  var accessToken = crypto
    .SHA256(user + new Date().toString())
    .toString(crypto.enc.Hex);
  var refreshToken = crypto
    .SHA256(user + new Date().toString())
    .toString(crypto.enc.Hex);
    console.log("password "+pass);
    console.log("accessToken "+accessToken);
    console.log("refreshToken "+refreshToken);

  db
    .query(sql, [user, pass, accessToken, refreshToken])
    .then(response => {
        res.json({ data: response, status: status.OK.code, message: status.OK.message });
    })
    .catch(error => res.json({ status: status.Error.code, message: error }));

});

module.exports = router;