import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routers/auth/authRouter.js"
import reviewRouter from "./routers/reviews/review/reviewRouter.js";
import path from "path";
import { fileURLToPath } from 'url';
dotenv.config();
const app = express();

const PORT = 7777;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//нужно использовать до остальных роутов

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/auth/", authRouter);
app.use("/review",reviewRouter);



app.listen(PORT, () => {
  console.log(`server started, port ${PORT}`);
});

//TODO: [first]: предоставление услуги, фотоотчет, цены, оформление заказа, заказать, закаказать обратный звонок, заказать, настольные игры, заказать настолку
//TODO: [second]: спортфолио, услуги, фотосессия, блог, заказать
//TODO: [third]: аккаунт для администрирования, аккаунт для заказов клиентов