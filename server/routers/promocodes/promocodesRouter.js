import express from 'express';
import {PrismaClient} from "@prisma/client";
import {authCheckMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/post", authCheckMiddleware, async(req, res)=>{
  const {code} = req.body;
  const userId = req.user.id;
  try{
    const user = await prisma.user.findUnique({where:{id:Number(userId)}});
    if(user && user.moderate){
      const newCode = await prisma.promocode.create({
        data:{code, userId:Number(userId)}
      })
      res.status(201).json(newCode);
    }else{
      res.status(403).json({error: "Forbidden: User does not have moderation rights!"})
    }
  }catch(error){
    console.error("Error creating feedback:", error.message, error.stack);
    res.status(500).json({error: "Internal Server Error"});
  }
})
router.get("/get", async(req, res)=>{
  try{
    const promocodes = await prisma.promocode.findMany();
    res.status(200).json(promocodes);
  }catch(error){
    console.log(error);
    res.status(500).json({error: "Internal Server Error"});
  }
})
router.delete("/delete/:id", authCheckMiddleware, async(req, res)=>{
  const {id} = req.params;
  const userId = req.user.id;
  try{
    const user = await prisma.user.findUnique({
      where: {id:Number(userId)}
    })
    if(user && user.moderate){
      const deletePromocode = await prisma.promocode.delete({where:{id:Number(id)}});
      res.status(200).json(deletePromocode);
    }else{
      res.status(403).json({error: "Forbidden: User does not have moderation rights!"})
    }
  }catch(error){
    console.log(error);
    res.status(500).json({error: "Internal Server Error"});
  }
})
export default router;