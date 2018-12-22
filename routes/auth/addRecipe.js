var router = require('express').Router();

const db = require('../../db');
const status = require('../../status');
var _ = require('lodash');

const sql = `SELECT * from "ingredient"`;

router.post('/', function(req, res) {
  var idUser = req.body.idUser;
  var name = req.body.name;
  var content = req.body.content;
  var preparationTime = req.body.preparationTime;
  var ingredientsRQ = req.body.ingredients;

  db.query(sql)
    .then(data => {
      const ingredientsDB = data.rows;
      const ingredients = [];
      db.query('BEGIN;')
        .then(() => {
          ingredientsRQ.forEach(element => {
            var item = _.find(ingredientsDB, ['name', element.name]);
            if (!item) {
              db.query(`INSERT INTO public."ingredient" (name) VALUES($1);`, [
                element.name
              ])
                .then(() => {
                  console.log('COMMIT');
                  db.query(`SELECT * from "ingredient" where "name" = $1`, [
                    element.name
                  ])
                    .then(data => {
                      if (data.rowCount == 1) {
                        var item = data.rows[0];
                        if (item.name === element.name) {
                          ingredients.push({
                            id: item.id,
                            unit: element.unit,
                            count: element.count
                          });
                        }
                      }
                      console.log(data);
                    })
                    .catch(error => {
                      console.log(error);
                    });
                })
                .catch(error => {
                  console.log(error);
                  res.json({ status: status.Error.code, message: error });
                });
            } else {
              ingredients.push({
                id: item.id,
                unit: element.unit,
                count: element.count
              });
            }
          })
          res.json(ingredients);
        })
        .catch(error => {
          console.log(error);
        });
    })
    .catch(error => {
      res.json({ status: status.Error.code, message: error });
    });
});

module.exports = router;
