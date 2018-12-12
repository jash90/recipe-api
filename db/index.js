const {Pool} = require("pg");
const pool = new Pool({user: "admin", host: "localhost", database: "recipeDb", password: "psB2r#e4", port: 5432});

const status = require("../status");
const sql = 
`select "id"
from "user"
where "accessToken" = $1 AND "accessTokenExpiresAt" > NOW()`;
module.exports = {
  query: (text, params) => pool.query(text, params),
  auth: token => pool
    .query(sql, [token])
    .then(data => {
      if (data.rowCount == 1) {
        return {data: data.rows[0], status: status.OK.code, message: status.OK.message};
      } else {
        return {status: status.Unauthorized.code, message: status.Unauthorized.message};
      }
    })
    .catch(error => {
      return {status: status.Error.code, message: error.detail};
    })
};
