import express from 'express';
import {PrismaClient} from "@prisma/client";
import {authCheckMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient()

router.post("/new", authCheckMiddleware, async(req, res)=>{
  const userId = req.user.id;
  const {price,title,sizes,paperType} = req.body;
  try{
    const user = await prisma.user.findUnique({where:{id:Number(userId)}});
    if(user){
      let data = { price, title, userId };

      if (sizes) data.sizes = sizes;
      if (paperType) data.paperType = paperType;

      const NewRecord = await prisma.cart.create({data});
      res.status(200).json(NewRecord)
    }else{
      res.status(403).json({error: "Unauthorized!"})
    }
  }catch(error){

  }
})
router.get("/list", authCheckMiddleware, async(req, res)=>{
  const userId = req.user.id
  try{
    const user = await prisma.user.findUnique(({where:{id:Number(userId)}}))
    if(user){
      const Records = await prisma.cart.findMany({where:{userId}})
      res.status(200).json(Records);
    }else{
      res.status(403).json({error: "Unauthorized!"})
    }
  }catch(error){
    console.error("Error details:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
})
router.delete("/:id", authCheckMiddleware, async(req, res)=>{
  const userId = req.user.id;
  const {id} = req.params;
  try{
    const user = await prisma.user.findUnique({where:{id:Number(userId)}});
    if(user){
      const deleteRecord = await prisma.cart.delete({where:{id:Number(id)}})
      res.status(200).json(deleteRecord);
    }else{
      res.status(403).json({error: "Unauthorized!"})
    }
  }catch(error){
    console.error("Error details:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
})


export default router;