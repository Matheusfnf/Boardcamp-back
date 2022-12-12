import connection from "../database/pg.js";
import { rentalSchema } from "../models/rentalSchema.js";

class Rentals {
  async show(req, res) {
    const name = req.query.name;

    // if (name) {
    //   const response = await connection.query(
    //     `SELECT rentals.*, customers.id FROM rentals INNER JOIN rentals."customerID" ON customers.id = rentals."customerId";`
    //   );
    //   console.log(response);
    //   return res.status(200).json(response);
    // }

    try {
      const rentals = await connection.query(
        `SELECT rentals.*, customers.id as customerId, customers.name, customers.phone, customers.cpf, customers.birthday, games.id as "gamesId", games.name as "gameName", games."categoryId" FROM rentals INNER JOIN customers ON rentals."customerId" = customers.id INNER JOIN games ON rentals."gameId" = games.id`
      );

      console.log(rentals.rows);

      const arr = rentals.rows.map((row) => {
        const obj = {
          id: row.id,
          customer: {
            id: row.customerId,
            name: row.name,
            phone: row.phone,
            cpf: row.cpf,
            birthday: row.birthday,
          },
          game: {
            id: row.gamesId,
            name: row.gameName,
            categoryId: row.categoryId,
            categoryName: "Estratégia",
          },

          rentDate: row.rentDate,
          daysRented: row.daysRented,
          returnDate: row.returnDate,
          originalPrice: row.originalPrice,
          delayFee: row.delayFee,
        };
        return obj;
      });

      res.status(200).send(arr);
    } catch (err) {
      console.log(err);
      return res.status(500).send(err);
    }
  }

  async store(req, res) {
    try {
      const { customerId, gameId, daysRented } = req.body;

      const game = await connection.query(
        `SELECT games."pricePerDay" FROM games WHERE id = ${gameId}`
      );

      const gameValue = game.rows[0].pricePerDay;
      const rentDate = new Date().toLocaleString();
      const returnDate = null;
      const originalPrice = gameValue * Number(daysRented);
      const delayFee = null;

      const response = await connection.query(
        `INSERT INTO rentals("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7);`,
        [
          customerId,
          gameId,
          rentDate,
          daysRented,
          returnDate,
          originalPrice,
          delayFee,
        ]
      );

      return res.status(200).json(response);
    } catch (e) {
      console.log(e);
      return res.status(400).json(e);
    }
  }

  async update(req, res) {
    try {
      const response = await connection.query(
        `SELECT * FROM rentals WHERE id = ${req.params.id}`
      );

      const game = await connection.query(
        `SELECT games."pricePerDay" FROM games WHERE id = ${response.rows[0].gameId}`
      );

      const initialDate = String(response.rows[0].rentDate);
      const date = new Date(initialDate);
      const today = new Date();
      const todayDate = today.getDate();
      const initialDay = date.getDate();
      let fee = null;
      const returnDate = new Date().toISOString();
      if (todayDate - initialDay > Number(response.rows[0].daysRented)) {
        fee = (todayDate - initialDay) * Number(game.rows[0].pricePerDay);
      }

      const updated = await connection.query(
        `UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = ${req.params.id}`,
        [returnDate.split("T")[0], fee]
      );

      return res.status(200).json(updated);
    } catch (e) {
      console.log(e);
      return res.status(400).json(e);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: "Missing ID" });

      const response = await connection.query(
        `DELETE FROM rentals WHERE id = ${req.params.id}`
      );

      console.log(response);

      return res.status(200).json({ success: "success" });
    } catch (e) {
      console.log(e);
      return res.status(400).json(e);
    }
  }
}

export default new Rentals();
