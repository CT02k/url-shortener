import { RequestHandler } from "express";
import { LoginBody, RegisterBody } from "../validators/auth.validator";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { env } from "../lib/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register: RequestHandler = async (req, res, next) => {
  try {
    const { password } = req.body as RegisterBody;

    const username = (req.body as RegisterBody).username.toLowerCase();

    const hashed = await bcrypt.hash(password, 10);

    try {
      const user = await prisma.user.create({
        data: { username, password: hashed },
      });

      const token = jwt.sign({ id: user.id }, env.JWT_SECRET);

      res.status(201).json({
        token,
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          return res.status(409).json({
            message: "Username already used",
          });
        }
      }
      next(err);
    }
  } catch (err) {
    next(err);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { password } = req.body as LoginBody;

    const username = (req.body as LoginBody).username.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({
        message: "Username or password invalid",
      });
    }

    const comparation = await bcrypt.compare(password, user.password);

    if (!comparation) {
      return res.status(401).json({
        message: "Username or password invalid",
      });
    }

    const token = jwt.sign({ id: user.id }, env.JWT_SECRET);

    res.status(200).json({
      token,
    });
  } catch (err) {
    next(err);
  }
};
