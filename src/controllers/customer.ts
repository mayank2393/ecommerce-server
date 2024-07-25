import { prisma } from "..";
import { Request, Response } from "express";
import AuthenticatedRequest from "../interfaces/AuthenticatedRequest";
import MulterFileRequest from "../interfaces/MulterFileRequest";


// Order Related Routes
export const initiateOrder = async (req: Request, res: Response) => {
    try {
        const customer_id = (req as AuthenticatedRequest).user.id;
        const { product_id, quantity } = req.body;
        
        const customer = await prisma.user.findUnique({
            where: {
                id: customer_id
            }
        });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        const product = await prisma.product.findUnique({
            where: {
                id: product_id
            }
        });
    
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
    
        var TotalPrice = product.price * quantity;
    
        var order = await prisma.order.create({
          data: {
            user_id: customer_id,
            quantity: quantity,
            amount: TotalPrice,
          },
        });

        const order_id = order.id;

        const orderProduct = await prisma.orderProduct.create({
            data: {
                order_id: order_id,
                product_id: product_id,
            }
        });

        const order_product_id = orderProduct.id;

        await prisma.order.update({
            where: {
                id: order_id
            },
            data: {
                products : {
                    connect : {
                        id : order_product_id
                    }
                }
            }
        });

        await prisma.user.update({
            where:{
                id:customer_id
            },
            data:{
                orders:{
                    connect:{
                        id:order_id
                    }
                }
            }
        })
        
        return res.status(200).json({
            success: true,
            message: "Order placed successfully",
            order : order,
            product : product,
            customer : customer
        })

    } catch (error:any) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }


};

export const getOrders = async (req: Request, res: Response) => {
    try {
        const customer_id = (req as AuthenticatedRequest).user.id;
        const orders = await prisma.order.findMany({
            where: {
                user_id: customer_id
            },
            include: {
                products: true
            }
        });
        if(orders.length === 0){
            return res.status(200).json({
                success: true,
                message: "No orders found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Orders found",
            orders: orders
        });
    } catch (error:any) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
        
    }
};

export const getOrdersById = async (req: Request, res: Response) => {
    try {
        const customer_id = (req as AuthenticatedRequest).user.id;
        const order_id = req.params.id;
        const order = await prisma.order.findUnique({
            where: {
                id: order_id
            },
            include: {
                products: true
            }
        });
        if (!order) {
            return res.status(200).json({
                success: true,
                message: "No order found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Order found",
            order: order
        });
    } catch (error:any) {
        return res.status(500).json({
            success: false,
            message: error.message
        
        });
    }
};


// Wishlist Related Routes
export const addToWishlist = async (req: Request, res: Response) => {
    try {
        const customer_id = (req as AuthenticatedRequest).user.id;
        const { product_id } = req.body;

        const customer = await prisma.user.findUnique({
            where: {
                id: customer_id
            }
        });

        if(!customer){
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        const product = await prisma.product.findUnique({
            where: {
                id: product_id
            }
        });

        if(!product){
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const wishlist = await prisma.wishlist.create({
            data: {
                user_id: customer_id,
                products:{
                    connect:{
                        id: product_id
                    }
                }
            }
        });

        const wishlist_id = wishlist.wishlist_id;

        await prisma.user.update({
            where:{
                id:customer_id
            },
            data:{
                wishlist:{
                    connect:{
                        wishlist_id:wishlist_id
                    }
                }
            }
        });
    } catch (error:any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getWishlists = async (req: Request, res: Response) => {
    try {
        const customer_id = (req as AuthenticatedRequest).user.id;
        const wishlists = await prisma.wishlist.findMany({
            where: {
                user_id: customer_id
            },
            include: {
                products: true
            }
        });
        if(wishlists.length === 0){
            return res.status(200).json({
                success: true,
                message: "No wishlists found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Wishlists found",
            wishlists: wishlists
        });

    } catch (error:any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });    
    }
};

export const deleteProductFromWishlist = async (req: Request, res: Response) => {
    try {
        const customer_id = (req as AuthenticatedRequest).user.id;
        const product_id = req.params.product_id;

        await prisma.wishlist.update({
            where:{
                user_id:customer_id
            },
            data:{
                products:{
                    disconnect:{
                        id:product_id
                    }
                }
            }
        })

        return res.status(200).json({
            success: true,
            message: "Product removed from wishlist"
        });
    } catch (error:any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Review Related Routes
export const postReview = async (req: Request, res: Response) => {
    try {
        const customer_id = (req as AuthenticatedRequest).user.id;
        const product_id = req.params.product_id;
        const {rating , comments } = req.body;

        if(!product_id || !rating || !comments){
            return res.status(400).json({
                success: false,
                message: "Please provide all the required fields"
            });
        }

        const review = await prisma.review.create({
            data:{
                user_id: customer_id,
                product_id: product_id,
                rating: rating,
                comments: comments
            }
        });
        
        const product = await prisma.product.update({
            where:{
                id:product_id
            },
            data:{
                reviews:{
                    connect:{
                        id:review.id
                    }
                }
            }
        })

        const user = await prisma.user.update({
            where:{
                id:customer_id
            },
            data:{
                reviews:{
                    connect:{
                        id:review.id
                    }
                }
            }
        })

        return res.status(200).json({
            success: true,
            message: "Review posted successfully",
            review: review,
            product : product,
            customer : user
        });
    } catch (error:any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getReviews = async (req: Request, res: Response) => {
    try {
        const customer_id = (req as AuthenticatedRequest).user.id;
        const reviews = await prisma.review.findMany({
            where:{
                user_id:customer_id
            }
        });

        if(reviews.length === 0){
            return res.status(200).json({
                success: true,
                message: "No reviews found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Reviews found",
            reviews: reviews
        });
    } catch (error:any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateReview = async (req: Request, res: Response) => {
    try {
        const customer_id = (req as AuthenticatedRequest).user.id;
        const review_id = req.params.id;
        const { rating, comments } = req.body;

        const review = await prisma.review.update({
            where:{
                id:review_id
            },
            data:{
                rating: rating,
                comments: comments
            }
        });

        return res.status(200).json({
            success: true,
            message: "Review updated successfully",
            review: review
        });

    } catch (error:any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteReview = async(req: Request, res: Response) => {
    try {
        const customer_id = (req as AuthenticatedRequest).user.id;
        const review_id = req.params.id;

        const review = await prisma.review.findUnique({
            where:{
                id:review_id
            }
        });

        if(!review){
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        await prisma.review.delete({
            where:{
                id:review_id
            }
        });

        return res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        });
    } catch (error:any) {
        return res.status(500).json({
            success:false,
            message: error.message
        })
    }
};