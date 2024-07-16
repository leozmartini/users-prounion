import express from "express";
import { AppDataSource } from "./data-source";
import usersRoutes from "./routes/users";
import cookieParser from "cookie-parser";

require("dotenv").config();
const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());

app.use("/users", usersRoutes);

app.get("/", (req, res) => {
  res.send("Server running");
});

AppDataSource.initialize()
  .then(async () => {
    console.log("Database connected");
    app.listen(port, () => {
      console.log(`Server running: ${port}`);
    });
  })
  .catch(error => console.log(error));
