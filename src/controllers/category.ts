import { prisma } from "..";
import { Request, Response } from "express";
import AuthenticatedRequest from "../interfaces/AuthenticatedRequest";

export const getCategory = async(req : Request, res : Response) => {
    try {
        const categories = await prisma.category.findMany();
        return res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            categories,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
        
    }
};

export const createCategory = async(req : Request, res : Response) => {
    try {
        const { category_name } = req.body;
        const exists = await prisma.category.findUnique({
            where: {
                category_name,
            },
        });
        
        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Category already exists",
            });
        }

        const category = await prisma.category.create({
            data: {
                category_name,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            category,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
        
    }
};