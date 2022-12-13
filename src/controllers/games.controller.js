import connection from "../database/pg.js";
import { GameSchema } from "../models/gameSchema.js";

class Games {
  async show(req, res) {
    const name = req.query.name;

    if (name) {
      const response = await connection.query(
        `SELECT * FROM games WHERE name LIKE '%${name}%'`
      );
      return res.send(response.rows);
    }

    try {
      const games = await connection.query(
        'SELECT c.name as "categoryName", g.name, g.id, g.image, g."stockTotal",g."categoryId", g."pricePerDay" FROM categories as c, games as g WHERE c.id = g."categoryId"'
      );
      console.log(games);

      res.send(games.rows);
    } catch (err) {
      console.log(err);
      return res.status(500).send(err);
    }
  }

  async store(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    const sendObj = { name, image, stockTotal, categoryId, pricePerDay };

    const validation = GameSchema.validate(sendObj, {
      abortEarly: false,
    });
    if (validation.error) {
      const errors = validation.error.details.map((detail) => detail.message);
      res.send(errors);
      return;
    }

    try {
      await connection.query(
        'INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)',
        [name, image, stockTotal, categoryId, pricePerDay]
      );

      res.sendStatus(201);
    } catch (err) {
      console.log(err);
      res.sendStatus(422);
    }
  }
}

export default new Games();
