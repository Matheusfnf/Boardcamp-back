import express from "express";
import dotenv from "dotenv";
import categoriesRoutes from "./routes/categoriesRoutes.js";
import customersRoutes from "./routes/customersRoutes.js";
import gamesRoutes from "./routes/gamesRoutes.js";
import rentalRoutes from "./routes/rentalsRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use(categoriesRoutes);
app.use(customersRoutes);
app.use(gamesRoutes);
app.use("/rentals", rentalRoutes);

app.listen(process.env.PORT, () => {
  console.log("Running on port " + process.env.PORT);
});
