import { Request,Response } from "express";
import { prisma } from "..";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens";
import AuthenticatedRequest from "../interfaces/AuthenticatedRequest";
import MulterFileRequest from "../interfaces/MulterFileRequest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { handleUpload } from "../utils/cloudinaryManager";


