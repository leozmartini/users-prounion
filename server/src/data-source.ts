import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const connectionConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

export const connectDatabase = async () => {
  try {
    const connection = await mysql.createConnection(connectionConfig);

    // Fecha o servidor caso ocorra algum erro na conexão com o banco de dados.
    connection.on("error", err => {
      console.error("Database connection error:", err);
      process.exit(1);
    });

    return connection;
  } catch (error) {
    console.error("Problema de conexão com banco de dados:", error);
    process.exit(1);
  }
};
