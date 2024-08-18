import express from 'express';
import {PrismaClient} from "@prisma/client";
import {authCheckMiddleware} from "../middleware/authMiddleware.js";
import bcrypt from "bcrypt";

const router = express.Router();
const prisma = new PrismaClient();

router.patch("/update-number", authCheckMiddleware, async (req, res) => {
  const {phone, newPhone, email, checkPassword} = req.body;
  if (!phone || !newPhone || !email || !checkPassword) {
    return res.status(400).send("Please enter a valid email");
  }
  try{
    const user = await prisma.user.findUnique({where: {email: email, phone:phone}});
    if (!user){
      return res.status(400).send("User not found");
    }
    const passwordMatch = await bcrypt.compare(checkPassword, user.password);
    if (!passwordMatch){
      return res.status(400).send("Password is incorrect.")
    }
    const updatedUser = await prisma.user.update({
      where: {email: email, phone:phone},
      data: {phone: newPhone},
    });
    console.log("Updated user:", updatedUser);
    res.json({ok: true, message: "Username updated successfully."});
  }catch (error) {
    console.error("Error updating number:", error.message, error.stack);
    res.status(500).json({error: "Internal server error."});
  }
});
router.patch("/update-email",authCheckMiddleware,async (req,res)=>{
  const {phone, email, newEmail, checkPassword} = req.body;
  if (!phone || !email || !newEmail || !checkPassword){
    return res.status(400).send("Please enter a valid data");
  }
  try{
    const user = await prisma.user.findUnique({where:{email:email,phone:phone}});
    if (!user){
      return res.status(400).send("User not found");
    }
    const passwordMatch = await bcrypt.compare(checkPassword, user.password);
    if (!passwordMatch)
    {
      return res.status(400).send("Password is incorrect.")
    }
    const updateUser = await prisma.user.update({
      where:{email:email, phone:phone},
      data:{email:newEmail},
    });
    console.log("Updated user:", updateUser);
    res.json({ok:true, message: "Email update successfully."})
  }catch(error){
    console.error("Error updating email:", error.message, error.stack);
    res.status(500).json({error: "Internal server error."});
  }
})
router.patch("/update-fullName", authCheckMiddleware, async(req,res)=>{
  const {phone, email, newName, checkPassword} = req.body;
  if(!phone || !email || !newName || !checkPassword){
    return res.status(400).send("Please enter a valid data");
  }
  try{
    const user = await prisma.user.findUnique({where:{email:email, phone:phone}});
    if (!user){
      return res.status(400).send("User not found");
    }
    const passwordMatch = await bcrypt.compare(checkPassword, user.password);
    if(!passwordMatch){
      return res.status(400).send("Password is incorrect!");
    }
    const updateUser = await prisma.user.update({
      where:{email:email,phone:phone},
      data:{fullName:newName},
    })
    console.log("Updated user:",updateUser);
    res.json({ok:true, message: "Email update successfully."})
  }catch(error){
    console.error("Error updating email:", error.message, error.stack);
    res.status(500).json({error: "Internal server error."})
  }
})
router.patch("/update-Password", authCheckMiddleware, async(req, res)=>{
  const {phone, email, newPassword, checkPassword} = req.body;
  if(!phone || !email || !newPassword || !checkPassword){
    return res.status(400).send("Please enter a valid data");
  }
  try{
    const user = await prisma.user.findUnique({where:{email:email, phone:phone}});
    if(!user){
      return res.status(400).send("User not found!");
    }
    const passwordMatch = await bcrypt.compare(checkPassword, user.password);
    if(!passwordMatch){
      return res.status(400).send("Password is incorrect!");
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 13);
    const updateUser = await prisma.user.update({
      where:{email:email,phone:phone},
      data:{password:hashedNewPassword},
    })
    console.log("Updated user:",updateUser);
    res.json({ok:true, message: "Password update successfully."})
  }catch(error){
    console.error("Error updating password:", error.message, error.stack);
    res.status(500).json({error: "Internal server error."})
  }
})
export default router;