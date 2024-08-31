import express from 'express';
import {PrismaClient} from "@prisma/client";
import {authCheckMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/post", async(req, res)=>{
  const {fullName, phone} = req.body;
  if (!fullName || !phone) {
    return res.status(400).json({ error: "FullName and phone are required." });
  }
  try{
    const newFeedBack = await prisma.feetback.create({
      data:{fullName, phone}
    })
    res.status(201).json(newFeedBack);
  }catch(error){
    console.error("Error creating feedback:", error.message, error.stack);

    res.status(500).json({error: "Internal Server Error"});
  }
})
router.get("/get", async(req, res)=>{
  try{
    const feedBacks = await prisma.feetback.findMany();
    res.json(feedBacks);
  }catch(error){
    res.status(500).json({error: "Internal Server Error"});
  }
})
router.patch("/change-status/:id", authCheckMiddleware, async(req, res)=>{
  const {id} = req.params;
  const {status} = req.body;
  const userId = req.user.id;
  try{
    const user = await prisma.user.findUnique({where: {id:Number(userId)}});
    if(user && user.moderate){
      const newFeedback = await prisma.feetback.update({
        where: {id: Number(id)},
        data: {status: status}
      })
      res.status(200).json(newFeedback);
    }else{
      res.status(403).json({error: "Forbidden: User does not have moderation rights!"})
    }

  }catch(error){
    console.log(error);
    res.status(500).json({error: "Internal Server Error"});
  }
})
router.delete("/delete/:id", authCheckMiddleware, async(req, res)=>{
  const {id} = req.params;
  const userId = req.user.id;
  try{
    const user = await prisma.user.findUnique({where: {id:Number(userId)}});
    if(user && user.moderate){
      const deleteFeddBack = await prisma.feetback.delete({where:{id:Number(id)}})
      res.status(200).json(deleteFeddBack);
    }else{
      res.status(403).json({error: "Forbidden: User does not have moderation rights!"})
    }
  }catch(error){
    console.log(error);
    res.status(500).json({error: "Internal Server Error"});
  }
})
export default router;