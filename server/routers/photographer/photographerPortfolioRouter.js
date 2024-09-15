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

router.post("/new/:photographerPortfolioId", authCheckMiddleware, async (req, res) => {
  const userId = req.user.id;
  const {icon, about} = req.body;
  const {photographerPortfolioId} = req.params;
  try{
    const user = await prisma.user.findUnique({
      where: {id:Number(userId)}
    });
    if(user && user.moderate){
      const newRecord = await prisma.contacts.create({data:{icon, about, photographerPortfolioId: Number(photographerPortfolioId)}});
      res.status(200).json(newRecord);
    }else{
      res.status(403).json({error: "Forbidden: User does not have moderation rights!"})
    }
  }catch(error){
    res.status(500).json({error: "Internal Server Error"});
  }
})
router.patch("/update-contacts/:id", authCheckMiddleware, async(req, res)=>{
  const userId = req.user.id;
  const {icon, about} = req.body;
  const {id} = req.params;
  try{
    const user = await prisma.user.findUnique({where: {id: Number(userId)}});
    if(user && user.moderate){
      const updateContact = await prisma.contacts.update({where: {id: Number(id)},data:{icon, about}});
      res.status(200).json(updateContact);
    }else{
      res.status(403).json({error: "Forbidden: User does not have moderation rights!"})
    }
  }catch{
    console.log(error);
    res.status(500).json({error: "Internal Server Error"});
  }
})
router.get("/get-all/:id", async(req, res)=>{
  const {id} = req.params;
  try{
      const getAll = await prisma.contacts.findMany({where: {photographerPortfolioId: Number(id)}});
      res.status(200).json(getAll);

  }catch(error){
    console.log(error);
    res.status(500).json({error: "Internal Server Error"});
  }
})
router.delete("/contact-delete/:id", authCheckMiddleware, async(req, res)=>{
  const userId = req.user.id;
  const {id} = req.params;
  try{
    const user = await prisma.user.findUnique({where: {id: Number(userId)}});
    if(user && user.moderate){
      const deleteContact = await prisma.contacts.delete({where: {id:Number(id)}});
      res.status(200).json(deleteContact);
    }else{
      res.status(403).json({error: "Forbidden: User does not have moderation rights!"})
    }
  }catch(error){
    console.log(error);
    res.status(500).json({error: "Internal Server Error"});
  }
})






router.post("/new-photos/:id",authCheckMiddleware, uploadFiles.single("images"), async(req, res)=>{
  const {id} = req.params;
  const userId = req.user.id;
  if(req.file){
    try{
      const user = await prisma.user.findUnique({
        where: {
          id: Number(userId)
        }
      });
      if(user && user.moderate){
        const newPhotos = await prisma.photosPhotographerPortfolio.create({data:{photographerPortfolioId:Number(id), photos: req.file.filename || ""}});
        res.status(200).json({newPhotos: {
          photos: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
            id: newPhotos.id,
            photographerPortfolioId: newPhotos.photographerPortfolioId,
          }});
      }else{
        res.status(403).json({error: "Forbidden: User does not have moderation rights!"})
      }
    }catch (error){
      console.log("Error updating review!", error);
      res.status(500).json({ error: "Internal Server Error!" });
    }
  }else{
    res.status(400).json({ error: "No file provided!" });
  }
})
router.get("/get-all-photos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const getPhotosAll = await prisma.photosPhotographerPortfolio.findMany({
      where: { photographerPortfolioId: Number(id) },
    });

    const photosData = getPhotosAll.map(photo => ({
      photos: `${req.protocol}://${req.get('host')}/uploads/${photo.photos}`,
      id: photo.id,
      photographerPortfolioId: photo.photographerPortfolioId,
    }));

    res.status(200).json({
      photos: photosData,
    });
  } catch (error) {
    console.log("Error updating review!", error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
});
router.delete("/photo-delete/:photoId", authCheckMiddleware, async(req, res)=>{
  const {photoId} = req.params;
  const userId = req.user.id;
  try{
    const user = await prisma.user.findUnique({where:{id:Number(userId)}});
    if(user && user.moderate){
      const deleteRecord = await prisma.photosPhotographerPortfolio.delete({where:{id:Number(photoId)}});
      res.status(200).json(deleteRecord);
    }else{
      res.status(403).json({error: "Forbidden: User does not have moderation rights!"})
    }
  }catch(error){
    console.log("Error updating review!", error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
})










router.post("/new", authCheckMiddleware, async (req, res) => {
  const userId = req.user.id;
  try{
    const user = await prisma.user.findUnique({
      where: {id:Number(userId)}
    });
    if(user && user.moderate){
      const newRecord = await prisma.photographerPortfolio.create({data:{}});
      res.status(200).json(newRecord);
    }else{
      res.status(403).json({error: "Forbidden: User does not have moderation rights!"})
    }
  }catch(error){

    res.status(500).json({error: "Internal Server Error"});
  }
})
router.get("/get-alls/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const getPhotosAll = await prisma.photosPhotographerPortfolio.findMany({
      where: { photographerPortfolioId: Number(id) },
    });

    const photosData = getPhotosAll.map(photo => ({
      photos: `${req.protocol}://${req.get('host')}/uploads/${photo.photos}`,
      id: photo.id,
      photographerPortfolioId: photo.photographerPortfolioId,
    }));
    const getAllContacts = await prisma.contacts.findMany({where: {photographerPortfolioId: Number(id)}});

    res.status(200).json({
      photos: photosData,
      contacts: getAllContacts,
    });
  } catch (error) {
    console.log("Error updating review!", error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
})
router.delete("/photographer-del/:id", authCheckMiddleware, async(req, res)=>{
  const {id} = req.params;
  const userId = req.user.id;
  try{
    const user = await prisma.user.findUnique({where:{id:Number(userId)
    }});
    if(user && user.moderate){
      const deleteRecord = await prisma.photographerPortfolio.delete({where:{id:Number(id)}});
      res.status(200).json(deleteRecord);
    }else{
      res.status(403).json({error: "Forbidden: User does not have moderation rights!"})
    }
  }catch(error){
    console.log("Error updating review!", error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
})

export default router;