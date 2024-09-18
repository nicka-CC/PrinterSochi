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
router.post("/post", authCheckMiddleware, async(req, res)=>{
  const {  title, about, body} = req.body;
  const userId = req.user.id;
  try{
    const user = await prisma.user.findUnique({where:{id:Number(userId)}});
    if(user && user.moderate){
      const newRecord = await prisma.photographerBlog.create({data:{title,about,body}});
      res.status(200).json(newRecord);
    }else{
      res.status(403).json({error: "Forbidden: User does not have moderation rights!"})
    }
  }catch(error){
    res.status(500).json({error: "Internal Server Error"});
  }
});
router.get("/get", async(req, res)=>{
  try{
    const Blogs = await prisma.photographerBlog.findMany();
    const IMages = await  prisma.photoPhotographerBlog.findMany();

    const combinedData = Blogs.map(blog => {

      const relatedImages = IMages.filter(image => image.photographerBlogId === blog.id).map(image=>({
        ...image,
        imageUrl: `${req.protocol}://${req.get('host')}/uploads/${image.image}`
      }));

      return {
        ...blog,
        images: relatedImages
      };
    });
    res.status(200).json(combinedData)
  }catch(error){
    res.status(500).json({
      error: "Internal Server Error",
  })}
})
router.get("/get/:id", async(req, res)=>{
  const {id} = req.params;
  try{
    const Blog = await prisma.photographerBlog.findUnique({where:{id:Number(id)}});
    const Photos = await prisma.photoPhotographerBlog.findMany({where:{photographerBlogId:Number(id)}});
    const images = Photos.map(image => ({
      ...image,
      imageUrl: `${req.protocol}://${req.get('host')}/uploads/${image.image}`
    }));
    const request = {
      ...Blog,
      images: images
    };
    res.status(200).json(request);
  }catch(error){
    res.status(500).json({
      error: "Internal Server Error",
    })}

})
router.patch("/update/:id", authCheckMiddleware, async(req, res)=>{
  const {id} = req.params;
  const userId = req.user.id;
  const {  title, about, body} = req.body;
  try{
    const user = await prisma.user.findUnique({where:{id:Number(userId)}});
    if(user && user.moderate){
      const updateRecord = await prisma.photographerBlog.update({where:{id:Number(id)}, data:{title,about,body}});
      res.status(200).json(updateRecord);
    }else{
      res.status(403).json({error: "Forbidden: User does not have moderation rights!"})
    }
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
      const deleteRecord = await prisma.photographerBlog.delete({where:{id:Number(id)}});
      res.status(200).json(deleteRecord);
    }else{
      res.status(403).json({error: "Forbidden: User does not have moderation rights!"})
    }
  }catch(error){
    res.status(500).json({
      error: "Internal Server Error",
    })
  }
})

router.post("/image/:id", authCheckMiddleware, uploadFiles.single("image"),  async(req, res)=>{
  const {id}= req.params;
  const userId = req.user.id;
  if(req.file){
    try{
      const user = await prisma.user.findUnique({where:{id:Number(userId)}});
      if(user && user.moderate){
        const newPhotos = await prisma.photoPhotographerBlog.create({
          data: {
            photographerBlogId: id ? Number(id) : null,
            image: req.file.filename || ""
          }
        });
        res.status(200).json({newPhotos: {
            photos: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
            id: newPhotos.id,
            photographerBlogId: newPhotos.photographerBlogId,
          }});
      }else{
        res.status(403).json({error: "Forbidden: User does not have moderation rights!"})
      }
    }catch(error){
      console.error("Error during request processing:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: error.message
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
    const user = await prisma.user.findUnique({where:{id:Number(userId)}});
    if(user && user.moderate){
      const deleteRecord = await prisma.photoPhotographerBlog.delete({where:{id: Number(id)}});
      res.status(200).json(deleteRecord);
    }else{
      res.status(403).json({error: "Forbidden: User does not have moderation rights!"})
    }
  }catch(error){
    res.status(500).json({ error: "Internal Server Error!" });
  }
})
export default router;