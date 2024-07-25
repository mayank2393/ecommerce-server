import { prisma } from "..";
import { Request, Response } from "express";
import AuthenticatedRequest from "../interfaces/AuthenticatedRequest";
import MulterFileRequest from "../interfaces/MulterFileRequest";

export const getUserCart = async (req: Request, res: Response) => {
    try {
        const user_id = (req as AuthenticatedRequest).user.id;
        if(!user_id){
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const cart = await prisma.cart.findUnique({
            where: {
                user_id,
            },
            include: {
                products: true,
            },
        });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }
        const cartProducts = await prisma.cartProduct.findUnique({
            where: {
                cart_id: cart.cart_id,
            },
            include: {
                product: true,
            },
        })

        return res.status(200).json({
            success: true,
            cart:cart,
            cartProducts:cartProducts,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
        
    }
};

