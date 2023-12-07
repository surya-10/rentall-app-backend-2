import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { client } from "./db.js";
import multer from "multer";
import bodyParser from "body-parser";
import imagesRouter from "./uploadImages.js";
import userRouter from "./constollers/userControl.js";
import { isAuth } from "./auth.js";
dotenv.config()

let app = express();
app.use(cors());
app.use(express.json());

app.use("/", imagesRouter);
app.use("/", userRouter);
let port = process.env.port;



app.listen(port, ()=>console.log("server ready"));

