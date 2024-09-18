import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routers/auth/authRouter.js"
import reviewRouter from "./routers/reviews/review/reviewRouter.js";
import feedbackRouter from "./routers/feedback/feedbackRouter.js"
import promocodeRouter from "./routers/promocodes/promocodesRouter.js"
import pricesProductRouter from "./routers/pricesproduct/pricesProductRouter.js";
import explotanCatsRouter from "./routers/explotanCats/explotanCatsRouter.js";
import uEcRouter from "./routers/uec/explotanUserCatsRouter.js";
import photographerPortfolioRouter from "./routers/photographer/photographerPortfolioRouter.js"
import photographerBlogRouter from "./routers/photographer/photographerBlogRouter.js"
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
app.use("/feedback", feedbackRouter);
app.use("/promocode", promocodeRouter);
app.use("/pricesproduct", pricesProductRouter);
app.use("/explotan-cats-router", explotanCatsRouter);
app.use("/uec", uEcRouter);
app.use("/photographer-portfolio", photographerPortfolioRouter);
app.use("/photographer-blog", photographerBlogRouter);


app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.listen(PORT, () => {
  console.log(`server started, port ${PORT}`);
});

//TODO: [first]: предоставление услуги, фотоотчет, цены, оформление заказа, заказать, закаказать обратный звонок, настольные игры, заказать настолку
//TODO: [second]:  услуги, фотосессия, заказать
//TODO: [third]: аккаунт для администрирования, аккаунт для заказов клиентов