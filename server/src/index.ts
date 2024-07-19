import express from "express";
import { connectDatabase } from "./data-source";
import { UserRepository } from "./repositories/userRepository";
import usersRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();
export const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());

app.use("/users", usersRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Server running");
});

const initDb = async () => {
  let connected = false;
  let connection;
  // Loop para tentar conexão com database
  while (!connected) {
    try {
      connection = await connectDatabase();
      connected = true;
      console.log("Database conectado.");
    } catch (error) {
      console.error("Failed to connect to the database:", error);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  // Define a tabela e usuário padrão admin
  if (connection) {
    const userRepository = new UserRepository(connection);
    await userRepository.startDatabase();
  } else {
    throw new Error("Failed to connect to the database.");
  }

  return connection;
};

// Inicia a aplicação apenas com conexão ativa com o banco de dados.
initDb()
  .then(connection => {
    // Salva a conexão com o banco de dados no locals. Assim poderá ser acessada em toda aplicação.
    app.locals.db = connection;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(error => {
    console.error("Erro ao conectar com banco de dados: ", error);
    process.exit(1);
  });
