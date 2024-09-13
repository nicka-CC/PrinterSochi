import express from 'express';
import {PrismaClient} from "@prisma/client";
import {authCheckMiddleware} from "../middleware/authMiddleware.js";
import multer from "multer";
// const multer = require("multer");
// const path = require("path");
import path from "path";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadFiles = multer({ storage: storage });
const router = express.Router();
const prisma = new PrismaClient();

router.post("/create", authCheckMiddleware, async(req, res)=>{
  const {title, status,price,image}=req.body;
  const userId = req.user.id;
  try{
    const user = await prisma.user.findUnique({where:{id:Number(userId)}});
    if(user && user.moderate){
      const newExplotanCats = await prisma.explotanCats.create({
        data:{status:status, title: title, price:price,image}
      })
      res.status(200).json(newExplotanCats);
    }else{
      res.status(403).json({error: "Forbidden: User does not have moderation rights!"})
    }}catch(error){
    console.log(error);
    res.status(500).json({error: "Internal Server Error"});
  }
})
router.post("/post-image/:id", authCheckMiddleware, uploadFiles.single("image") ,async(req, res)=>{
  const {id} = req.params;
  if(req.file){
    try{
      const imagePost = await  prisma.explotanCats.findUnique({where: {id: Number(id)}});
      if(imagePost){
        const updateImage = await prisma.explotanCats.update({where:{id:Number(id)},data:{image: req.file.filename || ""}});
        res.json({ok:true,
        updateImage:{
          id: updateImage.id,
          image: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
          createdAt: updateImage.createdAt,
          updatedAt: updateImage.updatedAt
        }})
      }
    }catch(error){
      console.log("Error updating review!", error);
      res.status(500).json({ error: "Internal Server Error!" });
    }
  }else{
    res.status(400).json({ error: "No file provided!" });
  }
})
router.patch("/update/:id", authCheckMiddleware, async(req, res)=>{
  const {id} = req.params;
  const {title, status,price}=req.body;
  const userId = req.user.id;
  try{
    const user = await prisma.user.findUnique({where:{id:Number(userId)}});
    if(user && user.moderate){
      const updateExplotanCats = await prisma.explotanCats.update({where: {id:Number(id)},data:{title, status,price}});
      res.status(200).json(updateExplotanCats);
    }else{
      res.status(403).json({error: "Forbidden: User does not have moderation rights!"})
    }
  }catch(error){
    console.log("Error updating review!", error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
});
router.delete("/delete/:id", authCheckMiddleware, async(req, res)=>{
  const {id} = req.params;
  const userId = req.user.id;
  try{
    const user = await prisma.user.findUnique({where:{id:Number(userId)}});
    if(user && user.moderate){
      const deleteExplotanCats = await prisma.explotanCats.delete({where:{id:Number(id)}});
      res.status(200).json(deleteExplotanCats);
    }else{
      res.status(403).json({error: "Forbidden: User does not have moderation rights!"})
    }
  }catch(error){
    console.log(error);
    res.status(500).json({error: "Internal Server Error"});
  }
});
router.get("/get", async(req, res)=>{
  try{
    const getCats = await prisma.explotanCats.findMany();
    res.status(201).json(getCats);
  }catch(error){
    console.log(error);
    res.status(500).json({error: "Internal Server Error"});
  }
})
export default router;