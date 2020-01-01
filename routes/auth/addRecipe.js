var router = require('express').Router();

const db = require('../../db');
const status = require('../../status');
var _ = require('lodash');

const sql = `SELECT * from "ingredient"`;

const getIngredient = name => {
  db.query(`SELECT * from "ingredient" where "name" = $1`, [name])
    .then(data => {
      return data.rows[0];
    })
    .catch(error => {
      return null;
    });
};

const addIngredient = name => {
  db.query(`INSERT INTO public."ingredient" (name) VALUES($1);`, [name])
    .then(data => {
      return data.rows;
    })
    .catch(error => {
      return null;
    });
};

router.post('/', async (req, res) => {
  var idUser = req.body.idUser;
  var name = req.body.name;
  var content = req.body.content;
  var preparationTime = req.body.preparationTime;
  var ingredientsRQ = req.body.ingredients;
  var ingredientsDB = [];
  let ingredients = [];
  try {
    let ingredient = await addIngredient('TEstb');
    console.log(ingredient);
    res.json({ ingredient });
  } catch (error) {
    
  }

});

module.exports = router;
