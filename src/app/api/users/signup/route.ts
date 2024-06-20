import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import bcryptjs from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    const existingUserVerifiedByEmail = await UserModel.findOne({
      username: username,
      isVerified: true,
    });
    if (existingUserVerifiedByEmail) {
      return Response.json(
        {
          success: false,
          message: "username is already taken",
        },
        { status: 400 }
      );
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    let createdUser;
    const existingUserByEmail = await UserModel.findOne({ email });
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcryptjs.hash(password, 10);
        existingUserByEmail.username = username;
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        const savedUser = await existingUserByEmail.save();
        createdUser = await UserModel.findById(savedUser._id).select("-password");
      }
    } else {
      const hashedPassword = await bcryptjs.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
      });

      const savedUser = await newUser.save();
      createdUser = await UserModel.findById(savedUser._id).select("-password");
    }

    //Send Verification email
    const emailRespone = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    console.log(emailRespone);

    if (!emailRespone.success) {
      return Response.json(
        {
          success: false,
          message: emailRespone.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your account",
        newUser: createdUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to register user", error);
    return Response.json(
      {
        success: false,
        message: "Failed to register user",
      },
      { status: 500 }
    );
  }
}
