import express from 'express';
import {PrismaClient} from "@prisma/client";
import {authCheckMiddleware} from "../../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null,'./uploads');
  },
  filename: function(req,file,cb){
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random()* 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
})
const uploadFiles = multer({storage:storage})
const router = express.Router();
const prisma = new PrismaClient();
router.post("/post", async(req, res)=>{
  const {name,about} = req.body;
  try{
      const newRecord = await prisma.reviews.create({
        data:{name,about}
      })
      res.status(201).json(newRecord);

  }catch(error){
    console.log(error);
    res.status(500).json({error: "Internal Server Error!"});
  }
})
router.get("/get", async (req, res) => {
  try {
    const reviews = await prisma.reviews.findMany({
      include: {
        images: true,
      }
    });

    const filter = reviews.filter(reviev => reviev.visible === true)
      const reviewsWithImages = filter.map(review => ({
        ...review,
        images: review.images.map(image => ({
          ...image,
          images: `${req.protocol}://${req.get('host')}/uploads/${image.images}`
        }))
      }));
      res.json(reviewsWithImages);




  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
});

router.post("/upload/:id", uploadFiles.single('image'), async (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    return res.status(400).json({ error: "No file provided!" });
  }

  try {
    // Check if the review exists
    const review = await prisma.reviews.findUnique({
      where: { id: Number(id) }
    });

    if (!review) {
      return res.status(404).json({ error: "Review not found!" });
    }

    // Create a new image record and associate it with the review
    const newImage = await prisma.usersPhotosReviewsImages.create({
      data: {
        images: req.file.filename,
        reviewsId: review.id // Associate the image with the review
      }
    });

    res.json({
      ok: true,
      image: {
        id: newImage.id,
        images: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
        createdAt: newImage.createdAt,
        updatedAt: newImage.updatedAt
      }
    });
  } catch (error) {
    console.log("Error uploading image!", error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
});
router.delete("/reviewImg/:reviewId/:imgId", authCheckMiddleware, async(req, res)=>{
  const {reviewId, imgId} = req.params;
  const userId = req.user.id;
  try{
    const user = await prisma.user.findUnique({where:{id:userId}});
    if(user && user.moderate){
      const review = await prisma.reviews.findUnique({
        where: { id: Number(reviewId) }
      });
      const delImage = await prisma.usersPhotosReviewsImages.delete({
        where:{id:Number(imgId)}
      })

      res.json({
        ok: true,
        image: {
          id: imgId,
          delImage: delImage,
        },
        review: review
      });
    }else{
      res.status(403).json({error: "Forbidden: User does not have moderation rights!"})
    }

  }catch(error){
    console.log("Error uploading image!", error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
})
router.delete("/delete/:id", authCheckMiddleware, async(req, res)=>{
  const {id} = req.params;
  const userId = req.user.id;
  try{
    const user = await prisma.user.findUnique({where:{id:userId}});
    if(user && user.moderate){
      const delReview = await prisma.reviews.delete({
        where:{id:Number(id)}
      })

      res.json({
        ok: true,
        delReview: delReview,
      });
    }else{
      res.status(403).json({error: "Forbidden: User does not have moderation rights!"})
    }
  }catch(error){
    console.log("Error uploading image!", error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
})
export default router;