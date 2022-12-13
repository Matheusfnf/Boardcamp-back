import connection from "../database/pg.js";
import { customerSchema } from "../models/customerSchema.js";

class Customers {
  async show(req, res) {
    try {
      const customers = await connection.query("SELECT * FROM customers");
      res.send(customers.rows);
    } catch (err) {
      console.log(err);
      res.sendStatus(404);
    }
  }

  async showid(req, res) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.sendStatus(404);
      }

      if (!id) return res.status(404);

      const customersid = await connection.query(
        "SELECT * FROM customers WHERE id=$1",
        [id]
      );

      res.status(200).send(customersid.rows[0]);
    } catch (err) {
      console.log(err);
      res.sendStatus(404);
    }
  }

  async store(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    const sendObj = { name, phone, cpf, birthday };

    const validation = customerSchema.validate(sendObj, {
      abortEarly: false,
    });

    const response = await connection.query(
      `SELECT * FROM customers WHERE cpf = '${cpf}'`
    );

    if (response.rowCount > 0) {
      return res.status(422).json({
        statuscode: 422,
        message: "cpf já existente!",
      });
    }

    if (validation.error) {
      const errors = validation.error.details.map((detail) => detail.message);
      res.send(errors);
      return;
    }

    try {
      await connection.query(
        "INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)",
        [name, phone, cpf, birthday]
      );

      res.sendStatus(201);
    } catch (err) {
      console.log(err);
      res.sendStatus(422);
    }
  }

  async update(req, res) {
    const id = parseInt(req.params.id);
    const { name, phone, cpf, birthday } = req.body;

    if (isNaN(id)) {
      return res.sendStatus(404);
    }

    const sendObj = { name, phone, cpf, birthday };

    const validation = customerSchema.validate(sendObj, {
      abortEarly: false,
    });

    if (validation.error) {
      const errors = validation.error.details.map((detail) => detail.message);
      res.send(errors);
      return;
    }
    try {
      const product = await connection.query(
        `UPDATE customers SET "name" = $2, "phone" = $3, "cpf" = $4, "birthday" = $5 WHERE id=$1`,
        [id, name, phone, cpf, birthday]
      );

      res.status(200).send(product.rows[0]);
    } catch (err) {
      console.log(err);
      res.sendStatus(404);
    }
  }
}

export default new Customers();
