import express from 'express';
import {PrismaClient} from "@prisma/client";
import {authCheckMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/create", authCheckMiddleware, async(req, res)=>{
  const {size, price, count, totalCount, lamination} = req.body;
  const userId = req.user.id;
  try{
    const user = await prisma.user.findUnique({where:{id:Number(userId)}});
    if(user && user.moderate){
      const newPrice = await prisma.pricesProducts.create({data:{size, price, count, totalCount, lamination}});
      res.status(201).json(newPrice);
    }else{
      res.status(403).json({error: "Forbidden: User does not have moderation rights!"})
    }
  }catch(error){
    console.log(error);
    res.status(500).json({error: "Internal Server Error"});
  }
})
router.get("/list", async(req, res)=>{
  const userId = req.body;
  try{
    const list = await prisma.pricesProducts.findMany();
    res.status(200).json(list);
  }catch(error){
    console.log(error);
    res.status(500).json({error: "Internal Server Error"});
  }
})
router.delete("/delete/:id", authCheckMiddleware, async(req, res)=>{
  const {id} = req.params;
  const userId = req.user.id;
  try{
    const user = await prisma.user.findUnique({where:{id:Number(userId)}});
    if(user && user.moderate){
      const deletePrice = await prisma.pricesProducts.delete({where: {id:Number(id)}});
      res.status(200).json(deletePrice);
    }else{
      res.status(403).json({error: "Forbidden: User does not have moderation rights!"})
    }
  }catch(error){
    console.log(error);
    res.status(500).json({error: "Internal Server Error"});
  }
})
router.patch("/change/:id", authCheckMiddleware, async(req, res)=>{
  const {id} = req.params;
  const {size, price, count, totalCount, lamination} = req.body;
  try{
    const user = await prisma.user.findUnique({where:{id:Number(id)}});
    if(user && user.moderate){
      const changePrice = await prisma.pricesProducts.update({where:{id:Number(id)},data:{size, price, count, totalCount, lamination}});
      res.status(200).json(changePrice);
    }else{
      res.status(403).json({error: "Forbidden: User does not have moderation rights!"})
    }
  }catch(error){
    console.log(error);
    res.status(500).json({error: "Internal Server Error"});
  }
})
export default router;