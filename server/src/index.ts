import express from "express";
import { connectDatabase } from "./data-source";
import usersRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";

require("dotenv").config();
export const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());

app.use("/users", usersRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Server running");
});

// Inicia a aplicação apenas com conexão ativa com o banco de dados.
connectDatabase()
  .then(connection => {
    // Salva a conexão com o banco de dados no locals. Assim poderá ser acessada em toda aplicação.
    app.locals.db = connection;
    app.listen(port, () => {
      console.log(`Server running: ${port}`);
    });
  })
  .catch(error => {
    console.error("Erro ao conectar com banco de dados: ", error);
    process.exit(1);
  });
