import express from 'express';
import {PrismaClient} from "@prisma/client";
import {authCheckMiddleware} from "../middleware/authMiddleware.js";


import multer from "multer";
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

router.post("/new", authCheckMiddleware, async(req, res)=>{
  const userId = req.user.id;
  const {title} = req.body;
  try{
    const user = await prisma.user.findUnique({where:{id:Number(userId)}});
    if(user && user.moderate){
      const Record = await prisma.photosessionsPhotographer.create({data:{title}});
      res.status(200).json(Record);
    }else{
      res.status(403).json({error: "Forbidden: User does not have moderation rights!"})
    }
  }catch(error){
    res.status(500).json({error: "Internal Server Error"})
  }
})
router.get("/list", async(req, res)=>{
  try{
    const Photosessions = await prisma.photosessionsPhotographer.findMany();
    const Images = await prisma.photosPhotographerPortfolio.findMany();
    const combinedData = Photosessions.map(photosession =>{
      const corrImages = Images.filter(image => image.photosessionsPhotographerId === photosession.id).map(image => ({
        ...image,
        imageUrl: `${req.protocol}://${req.get('host')}/uploads/${image.photos}`,
      }));
      return{
        ...photosession,
        images: corrImages
      }
    })
    res.status(200).json(combinedData);
  }catch(error){
    res.status(500).json({
      error: "Internal Server Error",
    })
  }
})
router.get("/:id", async(req, res)=>{
  const {id} = req.params;
  try{
    const Photosession = await prisma.photosessionsPhotographer.findUnique({where:{id:Number(id)}});
    const Photos = await prisma.photosPhotographerPortfolio.findMany({where:{photosessionsPhotographerId:Number(id)}});
    const imgs = Photos.map(ps => ({
      ...ps,
      imageUrl: `${req.protocol}://${req.get('host')}/uploads/${ps.photos}`,
    }))
    const request = {
      ...Photosession,
      images: imgs
    }
    res.status(200).json(request);
  }catch(error){
    res.status(500).json({
      error: "Internal Server Error",
    })
  }
})
router.delete("/:id", authCheckMiddleware, async(req, res)=>{
  const {id} = req.params;
  const userId = req.user.id;
  try{
    const user = await prisma.user.findUnique({where:{id:Number(userId)}});
    if(user && user.moderate){
      const DeleteRecord = await prisma.photosessionsPhotographer.delete({where:{id:Number(id)}});
      res.status(200).json(DeleteRecord);
    }else{
      res.status(403).json({error: "Forbidden: User does not have moderation rights!"})
    }
  }catch(error){
    res.status(500).json({
      error: "Internal Server Error",
    })
  }
})






router.post("/image/:id", authCheckMiddleware, uploadFiles.single("image"), async(req, res)=>{
  const userId = req.user.id;
  const {id} = req.params;
  if(req.file){
    try{
      const user = await prisma.user.findUnique({where:{id:Number(userId)}});
      if(user && user.moderate){
        const newRecord = await prisma.photosPhotographerPortfolio.create({data:{
            photosessionsPhotographerId: Number(id),
            photos: req.file.filename || ""
          }});
        res.status(200).json({newRecord:{
            photos: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
            id: newRecord.id,
            photosessionsPhotographerId: newRecord.photosessionsPhotographerId,
          }});
      }else{
        res.status(403).json({error: "Forbidden: User does not have moderation rights!"})
      }
    }catch(error){
      res.status(500).json({
        error: "Internal Server Error"
      });
    }
  }else{
    res.status(400).json({ error: "No file provided!" });
  }
})
router.delete("/image/:id", authCheckMiddleware, async(req, res)=>{
  const {id} = req.params;
  const userId = req.user.id;
  try{
    const user = await prisma.user.findUnique({where: {id: Number(userId)}});
    if(user && user.moderate){
      const deletePhoto = await prisma.photosPhotographerPortfolio.delete({where:{id:Number(id)}});
      res.status(200).json(deletePhoto);
    }else{
      res.status(403).json({error: "Forbidden: User does not have moderation rights!"})
    }
  }catch(error){
    res.status(500).json({
      error: "Internal Server Error"
    });
  }
})
export default router;