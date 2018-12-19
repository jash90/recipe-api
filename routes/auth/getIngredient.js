var router = require("express").Router();

const db = require("../../db");
const status = require("../../status");

const sql = `SELECT name from "ingredient"`;

router.post("/", function (req, res) {
    db
        .query(sql)
        .then(data => {
            res.json({ data : data.rows , status: status.OK.code, message: status.OK.message });
        })
        .catch(error => {
            res.json({ status: status.Error.code, message: error });
        });

});

module.exports = router;
