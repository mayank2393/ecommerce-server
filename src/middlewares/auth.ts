import { Request, Response, NextFunction } from "express";
import jwt, {JwtPayload} from "jsonwebtoken";
import { prisma } from "..";
import AuthenticatedRequest from "../interfaces/AuthenticatedRequest";

interface CustomJwtPayload extends JwtPayload {
  id: string;
}


export const isgoauthLogin = async(req : Request , res : Response , next : NextFunction)=>{
    if(req.isAuthenticated()){
        next();
    }else{
        res.send("You are not authenticated");
    }
}

export const verifyJWT = async(req : Request , res : Response , next : NextFunction)=>{
    try {
        const token = (req as AuthenticatedRequest).cookie?.accessToken || req
          .header("Authorization")
          ?.replace("Bearer", "");
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Unauthorized"
            })
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as CustomJwtPayload;
    
        const user = await prisma.user.findUnique({
            where:{
                id:decodedToken?.id
            }
        });
    
        if(!user){
            return res.status(401).json({
                success:false,
                message:"Unauthorized"
            })
        }
    
        (req as AuthenticatedRequest).user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"Middleware failed"
        })
    }
}

export const CustomerAuth = async(req : AuthenticatedRequest , res : Response , next : NextFunction)=>{
    try {
        if(req.user?.role === "customer"){
            next();
        }
        else{
            return res.status(401).json({
                success:false,
                message:"Unauthorized"
            })
        }
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"Unauthorized"
        })
    }
}

export const AdminAuth = async(req : AuthenticatedRequest , res : Response , next : NextFunction)=>{
    try {
        if(req.user?.role === "admin"){
            next();
        }
        else{
            return res.status(401).json({
                success:false,
                message:"Unauthorized"
            })
        }
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"Unauthorized"
        })
    }
}

export const SellerAuth = async(req : AuthenticatedRequest , res : Response , next : NextFunction)=>{   
    try {
        if(req.user?.role === "seller"){
            next();
        }
        else{
            return res.status(401).json({
                success:false,
                message:"Unauthorized"
            })
        }
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"Unauthorized"
        })
    }
}
