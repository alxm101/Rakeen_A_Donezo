import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import todoRouter from "./routes/todo.js";
import { authenticateToken } from "./middleware/auth.js";

dotenv.config();

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

app.use("/todos", authenticateToken, todoRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
