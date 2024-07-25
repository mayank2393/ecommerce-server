import { prisma } from "..";
import { Request, Response } from "express";
import AuthenticatedRequest from "../interfaces/AuthenticatedRequest";
import MulterFileRequest from "../interfaces/MulterFileRequest";
import { handleUpload } from "../utils/cloudinaryManager";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const seller_id = (req as AuthenticatedRequest).user.id;
    const {
      product_name,
      product_description,
      brand_name,
      price,
      category_name,
      product_image
    } = req.body;

    if (
      !product_name ||
      !product_description ||
      !brand_name ||
      !price ||
      !category_name 
    ) {
      return res.status(400).json({ error: "Please provide all fields" });
    }

    let category = await prisma.category.findUnique({
      where: {
        category_name: category_name,
      },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          category_name: category_name,
        },
      });
    }

    // Upload picture through multer
    let productUrl: string | null = null;
    if ((req as MulterFileRequest).file) {
      try {
        console.log("File:", (req as MulterFileRequest).file); // Log the file
        const b64 = Buffer.from(
          (req as MulterFileRequest).file.buffer
        ).toString("base64");
        const dataURI = `data:${
          (req as MulterFileRequest).file.mimetype
        };base64,${b64}`;
        console.log("Data URI:", dataURI); // Log the data URI
        productUrl = await handleUpload(dataURI);
        console.log("Profile Picture URL:", productUrl); // Log the Cloudinary response
      } catch (error: any) {
        console.error("Error uploading picture:", error); // Log the error
      }
    }
    // if (!productUrl) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Please provide a product image",
    //   });
    // }
    const product = await prisma.product.create({
      data: {
        product_name,
        product_description,
        brand_name,
        price,
        product_image: productUrl? productUrl : "null",
        category_name: category_name,
        seller_id,
      },
    });

    await prisma.category.update({
      where: {
        category_name: category_name,
      },
      data: {
        products: {
          connect: {
            id: product.id,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
      category,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// using pagination here
export const getProducts = async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = 30;
    const offset = (page - 1) * limit;

    const products = await prisma.product.findMany({
      take: limit,
      skip: offset,
    });

    const totalProducts = await prisma.product.count();
    const totalPages = Math.ceil(totalProducts / limit);

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products,
      pagination: {
        page,
        limit,
        totalProducts,
        totalPages,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product_id = req.params.id;
    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a product id",
      });
    }

    const product = await prisma.product.findUnique({
      where: {
        id: product_id,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      product,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const seller_id = (req as AuthenticatedRequest).user.id;
  const product_id = req.params.id;

  let {
    product_name,
    product_description,
    brand_name,
    price,
    category_name,
    product_image,
  } = req.body;

  const product = await prisma.product.findUnique({
    where: {
      id: product_id,
    },
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  if (!product_name) {
    product_name = product.product_name;
  }
  if (!product_description) {
    product_description = product.product_description;
  }
  if (!brand_name) {
    brand_name = product.brand_name;
  }
  if (!price) {
    price = product.price;
  }
  if (!category_name) {
    category_name = product.category_name;
  }
  if (!product_image) {
    product_image = product.product_image;
  }
  if (product_image) {
    try {
      // Upload picture through multer
      let productUrl: string | null = null;
      if ((req as MulterFileRequest).file) {
        try {
          console.log("File:", (req as MulterFileRequest).file); // Log the file
          const b64 = Buffer.from(
            (req as MulterFileRequest).file.buffer
          ).toString("base64");
          const dataURI = `data:${
            (req as MulterFileRequest).file.mimetype
          };base64,${b64}`;
          console.log("Data URI:", dataURI); // Log the data URI
          productUrl = await handleUpload(dataURI);
          console.log("Profile Picture URL:", productUrl); // Log the Cloudinary response
        } catch (error: any) {
          console.error("Error uploading picture:", error); // Log the error
        }
      }
      if (!productUrl) {
        return res.status(400).json({
          success: false,
          message: "Please provide a product image",
        });
      }
      product_image = productUrl;
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: "Error while updating product Image",
      });
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id: product_id,
      },
      data: {
        product_name,
        product_description,
        brand_name,
        price,
        category_name,
        product_image: product_image,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      updatedProduct,
    });
  }
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const role = (req as AuthenticatedRequest).user.role;
    if (role === "customer") {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to delete a product",
      });
    }
    const product_id = req.params.id;

    await prisma.product.delete({
      where: {
        id: product_id,
      },
    });
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getReviews = async (req: Request, res: Response) => { 
  try {
      const product_id = req.params.id;
      if (!product_id) {
          return res.status(400).json({
              success: false,
              message: "Please provide a product id"
          });
      }
      const product = await prisma.product.findUnique({
          where:{
              id: product_id
          }
      })
      if (!product) {
          return res.status(404).json({
              success: false,
              message: "Product not found"
          });
      }

      const reviews = await prisma.review.findMany({
          where:{
              product_id: product_id
          }
      });

      return res.status(200).json({
          success: true,
          message: "Reviews fetched successfully",
          reviews
      });
  } catch (error:any) {
      return res.status(500).json({ 
          success: false, 
          message: error.message
      });
  }
};