import express from 'express';
import {PrismaClient} from "@prisma/client";
import {authCheckMiddleware} from "../../middleware/authMiddleware.js";
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
// const uploadFiles = multer({dest: "./uploads/"});
router.get("/get", async (req,res)=>{
  try{
    const reviews = await prisma.reviewsInstagram.findMany();
    res.json(reviews);
  }catch(error){
    console.error(error);
    res.status(500).json({error:"Internsl Server Error!"})
  }
})
router.post("/post", authCheckMiddleware, async (req, res)=>{
  const {images} = req.body;
  const userId = req.user.id;
  try{
    const user = await prisma.user.findUnique({where:{id:userId}});
    if(user && user.moderate){
      const newRecord = await prisma.reviewsInstagram.create({
        data:{images}
      });
      res.status(201).json(newRecord);
    }else{
      res.status(403).json({error: "Forbidden: User does not have moderation rights!"})
    }
  }catch(error){
    console.log(error);
    res.status(500).json({error: "Internal Server Error"});
  }
})
router.post("/post/:id", authCheckMiddleware, uploadFiles.single("image"), async (req, res) => {
  const { id } = req.params;
  if (req.file) {
    try {
      const review = await prisma.reviewsInstagram.findUnique({
        where: { id: Number(id) },
      });
      if (review) {
        const updateReview = await prisma.reviewsInstagram.update({
          where: { id: Number(id) },
          data: {
            images: req.file.filename || "",
          }
        });
        res.json({
          ok: true,
          updateReview: {
            id: updateReview.id,
            images: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
            createdAt: updateReview.createdAt,
            updatedAt: updateReview.updatedAt
          }
        });
      }
    } catch (error) {
      console.log("Error updating review!", error);
      res.status(500).json({ error: "Internal Server Error!" });
    }
  } else {
    res.status(400).json({ error: "No file provided!" });
  }
});



export default router;