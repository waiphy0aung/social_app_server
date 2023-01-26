import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import multer from "multer";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

/* CONFIGURATION */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy : "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit:"30mb",extended : true}));
app.use(bodyParser.urlencoded({ limit : "30mb" , extended : true }));
app.use("/assets",express.static(path.join(__dirname,"public/assets")));
app.use(cors());

/* FILE sTORAGE */
const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,"public/assets");
    },
    filename: (req,file,cb) => {
        cb(null,file.originalname)
    }
});

const upload = multer({ storage });

/* MONGO SETUP */

const port = process.env.PORT || 6001;
mongoose.set('strictQuery',true);
mongoose
    .connect(process.env.MONGO_URL,{
        useNewUrlParser : true,
        useUnifiedTopology: true,
    }).then(() => {
        app.listen(port,() => console.log(`Server Port: ${port}`));
    })
    .catch(error => console.log(`${error} didn't connect`));