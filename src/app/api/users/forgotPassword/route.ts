import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { email, forgotPasswordCode, newPassword, confirmPassword } =
      await request.json();
    const decodedEmail = decodeURIComponent(email);
    const user = await UserModel.findOne({
      email: decodedEmail,
      isVerified: true,
    });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    console.log(forgotPasswordCode);

    const isCodeValid = user.forgotPasswordCode === forgotPasswordCode;
    const isCodeNotExpired =
      new Date(user.forgotPasswordCodeExpiry!) > new Date();

    if (!isCodeValid) {
      return Response.json(
        {
          success: false,
          message: "Code is not valid",
        },
        { status: 400 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Code is expired",
        },
        { status: 400 }
      );
    } else {
      let password;
      if (newPassword !== confirmPassword) {
        return Response.json(
          {
            success: false,
            message: "Passwords do not match",
          },
          { status: 400 }
        );
      } else {
        password = newPassword;
      }
      const samePassword = await bcrypt.compare(password, user.password);
      if (samePassword) {
        return Response.json(
          {
            success: false,
            message: "New password cannot be same as old password",
          },
          { status: 400 }
        );
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      user.forgotPasswordCode = undefined;
      user.forgotPasswordCodeExpiry = undefined;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "Password reset successfully",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error resetting password", error);
    return Response.json(
      {
        success: false,
        message: "Error resetting password",
      },
      { status: 500 }
    );
  }
}
