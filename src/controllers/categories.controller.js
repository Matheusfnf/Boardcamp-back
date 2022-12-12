import connection from "../database/pg.js";
import { categorieSchema } from "../models/categorieSchema.js";

class Categories {
  async show(req, res) {
    try {
      const categories = await connection.query("SELECT * FROM categories");
      res.send(categories.rows);
    } catch (e) {
      console.log(e);
      res.status(400).json(e);
    }
  }

  async store(req, res) {
    const { name } = req.body;
    const sendObj = { name };

    const validation = categorieSchema.validate(sendObj, { abortEarly: false });

    if (validation.error) {
      const errors = validation.error.details.map((detail) => detail.message);
      res.send(errors);
      return;
    }

    try {
      const categories = await connection.query(
        "INSERT INTO categories (name) VALUES ($1)",
        [name]
      );
      console.log(req.body);

      return res.status(200).json(req.body);
    } catch (e) {
      console.log(e);
      res.status(400).json(e);
    }
  }
}

export default new Categories();
