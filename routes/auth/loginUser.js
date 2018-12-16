var router = require("express").Router();

const db = require("../../db");
const status = require("../../status");

const crypto = require("crypto-js");

const { LocalDateTime, nativeJs } = require("js-joda");

const sql = `UPDATE public."user"
set "accessToken" = $3 , "accessTokenExpiresAt" = NOW()+ INTERVAL '1 day', "refreshToken" = $4, "refreshTokenExpiresAt" = NOW() + INTERVAL '1 week'
where "login" = $1 AND "password" = $2 AND "accessTokenExpiresAt" < NOW() OR "refreshTokenExpiresAt" < NOW() OR "accessTokenExpiresAt" IS NULL OR "refreshTokenExpiresAt" IS NULL;

SELECT "accessToken", "accessTokenExpiresAt", "refreshToken" , "refreshTokenExpiresAt" 
from "user"
where "login" = $1`;

const sql1 = `SELECT "accessToken", "accessTokenExpiresAt", "refreshToken" , "refreshTokenExpiresAt" 
from "user"
where "login" = $1 AND "password" = $2`;

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

  db
    .query(sql1, [user, pass])
    .then(response => {
      if (response.rowCount == 0 || response.rowCount > 1) {
        res.json({status: status.DeniedLogin.code, message: status.DeniedLogin.message});
      } else {
        const data = response.rows[0];
        const {accessToken, accessTokenExpiresAt, refreshToken, refreshTokenExpiresAt} = data;
        const now = LocalDateTime.now();
        const accessTokenDate = LocalDateTime.from(nativeJs(new Date(accessTokenExpiresAt)));
        const refreshTokenDate = LocalDateTime.from(nativeJs(new Date(refreshTokenExpiresAt)));
        if (accessToken && refreshToken &&  refreshTokenDate.isAfter(now))
          res.json({data, status: status.OK.code, message: status.OK.message});
        }
      
    })
    .catch(error => res.json({status: status.Error.code, message: error}));

});

module.exports = router;