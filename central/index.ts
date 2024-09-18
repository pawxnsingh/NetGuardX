import express from "express";
import cors from "cors"
import mainRouter from "./routes/index"
import dotenv from "dotenv"

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/api/v1",mainRouter)

app.listen(3000);


