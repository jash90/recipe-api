var router = require("express").Router();

const db = require("../../db");
const status = require("../../status");
var _ = require('lodash');

const sql = `SELECT * from "ingredient"`;

router.post("/", function (req, res) {
    var idUser = req.body.idUser;
    var name = req.body.name;
    var content = req.body.content;
    var preparationTime = req.body.preparationTime;
    var ingredientsRQ = req.body.ingredients;

    db
        .query(sql)
        .then(data => {
            const ingredientsDB = data.rows;
         
         

        })
        .catch(error => {
            res.json({status: status.Error.code, message: error});
        });

});

module.exports = router;
