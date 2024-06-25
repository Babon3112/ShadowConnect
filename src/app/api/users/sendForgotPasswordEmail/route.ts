import UserMoodel from "@/models/User.model";
import { sendForgotPasswordEmail } from "@/helpers/sendForgotPasswordEmail";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { email, forgotPasswordUrl } = await request.json();

    const user = await UserMoodel.findOne({ email, isVerified: true });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "No user exists with this email",
        },
        { status: 404 }
      );
    }

    let forgotPasswordCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.forgotPasswordCode = forgotPasswordCode;
    user.forgotPasswordCodeExpiry = new Date(Date.now() + 1800000);
    await user.save();

    const emailResponse = await sendForgotPasswordEmail(
      email,
      forgotPasswordCode,
      forgotPasswordUrl
    );
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "forgot password code mail is successfully sent",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error sending forgot password mail",
      },
      { status: 500 }
    );
  }
}
