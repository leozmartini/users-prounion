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

    // Pode ser interessante adicionar um evento de erro no caso de perda de conexão
    connection.on("error", err => {
      console.error("Database connection error:", err);
    });

    return connection;
  } catch (error) {
    console.error("O servidor irá tentar uma nova conexão.");
    throw error;
  }
};
