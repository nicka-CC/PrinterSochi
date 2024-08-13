import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routers/auth/authRouter.js"
dotenv.config();
const app = express();

const PORT = 7777;

//нужно использовать до остальных роутов

app.use(cors());
app.use(express.json());
app.use("/auth/", authRouter);


app.listen(PORT, () => {
  console.log(`server started, port ${PORT}`);
});

//TODO: [first]: предоставление услуги, фотоотчет, цены, оформление заказа, заказать, закаказать обратный звонок, заказать, настольные игры, заказать настолку
//TODO: [second]: спортфолио, услуги, фотосессия, блог, заказать
//TODO: [third]: аккаунт для администрирования, аккаунт для заказов клиентов