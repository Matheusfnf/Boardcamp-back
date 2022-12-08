import express from "express";
import pg from "pg";

const { Pool } = pg;

const connection = new Pool({
  user: "postgres",
  host: "localhost",
  port: 5432,
  database: "exerciciomystore",
  password: "snowfoda5",
});

const app = express();
app.use(express.json());

app.get("/api/products", async (req, res) => {
  const products = await connection.query("SELECT * FROM produtos");
  res.send(products.rows);
});

app.get("/api/products/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.sendStatus(400);
  }

  const product = await connection.query("SELECT * FROM produtos WHERE id=$1", [
    id,
  ]);

  res.status(200).send(product.rows[0]);
});

app.post("/api/products", async (req, res) => {
  const { nome, preco, condicao } = req.body;

  await connection.query(
    "INSERT INTO produtos (nome, preco, condicao) VALUES ($1, $2, $3)",
    [nome, preco, condicao]
  );

  res.sendStatus(201);
});

app.listen(4000, () => {
  console.log("Server listening on port 4000.");
});
