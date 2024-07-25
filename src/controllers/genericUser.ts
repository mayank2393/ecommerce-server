import { prisma } from "..";
import { Request, Response } from "express";
import AuthenticatedRequest from "../interfaces/AuthenticatedRequest";
import MulterFileRequest from "../interfaces/MulterFileRequest";
import { handleUpload } from "../utils/cloudinaryManager";

export const viewProfile = async (req: Request, res: Response) => {
  try {
    const user_id = (req as AuthenticatedRequest).user.id;
    const user = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
      include: {
        additional_details: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user: user,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
      const user_id = (req as AuthenticatedRequest).user.id;
      const {
        profile_picture,
        house_address,
        pincode,
        city,
        state,
        country,
        phone_number,
      } = req.body;

      // Upload picture through multer
      let profilePictureUrl: string | null = null;
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
          profilePictureUrl = await handleUpload(dataURI);
          console.log("Profile Picture URL:", profilePictureUrl); // Log the Cloudinary response
        } catch (error: any) {
          console.error("Error uploading picture:", error); // Log the error
        }
      }

        const profile = await prisma.profile.update({
            where: {
            user_id,
            },
            data: {
            profile_picture: profilePictureUrl,
            house_address,
            pincode,
            city,
            state,
            country,
            phone_number,
            },
        });
    } catch (error:any) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};


export const deleteAccount = async(req: Request, res: Response) => {
    try {
        const user_id = (req as AuthenticatedRequest).user.id;

        await prisma.user.delete({
            where: {
                id: user_id
            }
        });

        return res.status(200).json({
            success: true,
            message: "Account deleted successfully"
        })

    } catch (error:any) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
        
    }
};

