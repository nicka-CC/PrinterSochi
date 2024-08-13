import express from 'express';
import {PrismaClient} from "@prisma/client"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const router = express.Router();

router.post("/reg", async (req, res) => {
  const {fullName, phone,email , password} = req.body;
  try {
    let alredayCreatedUser = await prisma.user.findUnique({
      where: {phone: phone , email: email}
    })
    if (alredayCreatedUser) {
      return res.status(409).json({
        ok: false,
        message: "Profile with this number already exists",
      })
    }
    let hashed_password = await bcrypt.hash(password, 13)
    let user = await prisma.user.create({
      data: {phone, fullName,email, password: hashed_password}
    })
    res.json({ok: true, result: user})

  } catch (error) {
    res.status(500).json({ok: false, result: undefined, errMsg: error})
  } finally {
    prisma.$disconnect()
  }
})

router.post("/login", async (req, res) => {
  const {phone,email, password} = req.body;

  try {
    let candidate = await prisma.user.findUnique({
      where: {phone: phone,email:email}
    });

    if (!candidate) {
      return res.status(200).json({ok: false, message: "Invalid credentials"});
    }

    const compare_pwd = await bcrypt.compare(password, candidate.password);

    if (!compare_pwd) {
      return res.status(200).json({ok: false, message: "Invalid credentials"});
    }

    const _user = {id: candidate.id, phone: candidate.phone,email: candidate.email, fullName: candidate.fullnName, moderate: candidate.moderate};

    const token = jwt.sign(_user, "PRINTER-SOCHI-NICKA-CC", {expiresIn: "12h"});

    return res.json({ok: true, user: _user, token});
  } catch (error) {
    return res.status(500).json({ok: false, errMsg: error.message});
  } finally {
    prisma.$disconnect();
  }
});

export default router;
