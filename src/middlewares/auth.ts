import { Request, Response, NextFunction } from "express";

export const isgoauthLogin = async(req : Request , res : Response , next : NextFunction)=>{
    if(req.isAuthenticated()){
        next();
    }else{
        res.send("You are not authenticated");
    }
}