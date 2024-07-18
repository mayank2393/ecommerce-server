import { Request, Response } from "express";
import { prisma } from "..";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens";
import AuthenticatedRequest from "../interfaces/AuthenticatedRequest";
import MulterFileRequest from "../interfaces/MulterFileRequest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { handleUpload } from "../utils/cloudinaryManager";
import otpGenerator from "otp-generator";
import { hash } from "crypto";
import { emailVerificationTemplate } from "../view/mail/templates/emailVerificationTemplate";
import { mailSender } from "../config/mailSender";

export const sendotpHandler = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const checkUserPresent = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already exists",
      });
    }

    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const result = await prisma.otp.findFirst({
      where: {
        otp: otp,
      },
    });
    console.log("Otp Generated", result);

    // make sure otp generated is unique
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
    }

    const otpBody = await prisma.otp.create({
      data: {
        otp: otp,
        email: email,
      },
    });

    // sending otp mail to the registered user
    try {
      const mailResponse = await mailSender(
        email,
        "OTP Verification Email",
        emailVerificationTemplate(otp)
      );
      console.log("Mail Send Successfully", mailResponse?.response);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    console.log(otpBody);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otpBody,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const signupHandler = async (req: Request, res: Response) => {
  try {
    const {
      email,
      role,
      firstName,
      lastName,
      profile_picture,
      house_address,
      pincode,
      city,
      state,
      country,
      phone_number,
      password,
      otp,
    } = req.body;

    if (
      !email ||
      !firstName ||
      !lastName ||
      !phone_number ||
      !password ||
      !house_address ||
      !pincode ||
      !city ||
      !state ||
      !country ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all the details",
      });
    }

    const checkUserPresent = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already exists",
      });
    }

    const response = await prisma.otp.findMany({
      where: {
        email: email,
      },
      orderBy: {
        createdAt: "desc", // Sort by createdAt in descending order
      },
      take: 1, // Limit the results to 1
    });

    console.log(response);

    if (response.length === 0) {
      // OTP not found for the email
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      });
    } else if (otp !== response[0].otp) {
      // Invalid OTP
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        role,
        password: hashedPassword,
      },
    });

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

    const profile = await prisma.profile.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        firstName,
        lastName,
        profile_picture: profilePictureUrl,
        house_address,
        pincode,
        city,
        state,
        country,
        phone_number,
      },
    });

    // Update the User to include the profile_id in additional_details
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        additional_details: {
          connect: {
            p_id: profile.p_id,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user: updatedUser,
      profile,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all the details",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: refreshToken,
        accessToken: accessToken,
      },
    });

    const options = {
      httpOnly: true,
      secure: true,
    };

    res.cookie("refreshToken", refreshToken, options);
    res.cookie("accessToken", accessToken, options);

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const logoutHandler = async (req: Request, res: Response) => {
  try {
    const user_id = (req as AuthenticatedRequest).user.id;
    console.log("user_id", user_id);
    console.log("logout Handler called")
    await prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        refreshToken: undefined,
        accessToken: undefined,
      },
    });

    const options = {
      httpOnly: true,
      secure: true,
    };

    res.clearCookie("refreshToken", options);
    res.clearCookie("accessToken", options);

    if (req.session) {
    req.session.destroy((err: any) => {
        if (err) {
        console.error("Failed to destroy session during logout", err);
        }
    });
    }

    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
