import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import cors from 'cors';


dotenv.config();
// process.env.SECRET_CODE
// SECRET_CODE=1234

const app: Application = express();

// if you want only your frontend to connect
app.use(cors({ origin: "http://localhost:3000" }))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Healthy");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});