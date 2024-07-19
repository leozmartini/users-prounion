import { User } from "../entity/User";
import { Connection } from "mysql2/promise";

export class UserRepository {
  // Define a conexão com o banco de dados para toda a classe.
  constructor(private readonly db: Connection) {}

  // Método executar comandos no banco de dados de forma mais simples nas seguintes chamadas.
  private async executeQuery(sql: string, params?: any[]): Promise<any[]> {
    const [results] = await this.db.execute(sql, params);
    return results as any[];
  }

  async findAll(): Promise<User[]> {
    return this.executeQuery("SELECT * FROM users") as Promise<User[]>;
  }

  async findById(id: number): Promise<User | null> {
    const results = (await this.executeQuery("SELECT * FROM users WHERE id = ?", [id])) || [];
    return results.length > 0 ? (results[0] as User) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const results = await this.executeQuery("SELECT * FROM users WHERE email = ?", [email]);
    return results.length > 0 ? (results[0] as User) : null;
  }

  async create(user: Omit<User, "id">): Promise<void> {
    await this.db.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [
      user.name,
      user.email,
      user.password,
    ]);
  }

  async update(id: number, user: Partial<Omit<User, "id">>): Promise<void> {
    // Define quantas "?" serão necessárias para a quantidade de campos a serem atualizados
    const fieldsToUpdate = Object.keys(user)
      .map(field => `${field} = ?`)
      .join(", ");

    // Cria um array de valores a serem atualizados. O ID no final serve para o próprio banco de dados definir um único.
    const valuesToUpdate = [...Object.values(user), id];

    // Monta a query SQL de atualização com os campos e valores preparados
    const query = `UPDATE users SET ${fieldsToUpdate} WHERE id = ?`;

    await this.db.execute(query, valuesToUpdate);
  }

  async delete(id: number): Promise<void> {
    await this.db.execute("DELETE FROM users WHERE id = ?", [id]);
  }

  public async startDatabase(): Promise<void> {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      )
    `;
    await this.db.execute(createTableQuery);

    // Define o usuário inicial
    const initialUser = {
      name: "Admin",
      email: "admin@prounion.com",
      password: "$2b$10$Le7Q5O.rZq.gtIlRix5ZyOiBfSDGhwOEEo/xpLLamPW/wP62JvuLO",
    };

    // Verifica se o usuário inicial já existe
    const existingUser = await this.findByEmail(initialUser.email);

    !existingUser && (await this.create(initialUser));
  }
}
