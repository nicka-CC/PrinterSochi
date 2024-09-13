import express from 'express';
import {PrismaClient} from "@prisma/client";
import {authCheckMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();
router.post("/newwwww", authCheckMiddleware, async(req, res)=>{

  const {fullName, phone, status} = req.body;
  const userId = req.user.id;
  try{
    const user = await prisma.user.findUnique({where:{id:Number(userId)}});
    if(user){
      const EUC = await prisma.usersExplotanCats.create({data:{fullName, phone, status,totalprice:0}});
      res.status(200).json(EUC);
    }else{
      res.status(403).json({error: "Forbidden: User does not have moderation rights!"})
    }
  }catch(error){
    console.log(error);
    res.status(500).json({error: "Internal Server Error"});
  }
})
router.patch("/update/:id", authCheckMiddleware,async(req, res)=>{
  const {fullName, phone, status} = req.body;
  const {id} = req.params;
  const userId = req.user.id;
  try{
    const user = await prisma.user.findUnique({where:{id:Number(userId)}})
    if(user && user.moderate){
      const updateEUC = await prisma.usersExplotanCats.update({where:{id:Number(id)}, data:{fullName, phone, status}})
      res.status(200).json(updateEUC);
    }else{
      res.status(403).json({error: "Forbidden: User does not have moderation rights!"})
    }
  }catch(error){
    console.log(error);
    res.status(500).json({error: "Internal Server Error"});
  }

});
router.get("/get", authCheckMiddleware, async(req, res)=>{
  const userId = req.user.id;
  try{
    const user = await prisma.user.findUnique(({where:{id:Number(userId)}}));
    if(user && user.moderate){
      const get = await prisma.usersExplotanCats.findMany();
      res.status(200).json(get);
    }else{
      res.status(403).json({error: "Forbidden: User does not have moderation rights!"})
    }
  }catch(error){
    console.log(error);
    res.status(500).json({error: "Internal Server Error"});
  }
})
export default router;