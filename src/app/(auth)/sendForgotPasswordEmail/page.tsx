"use client";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";

const SendForgotPasswordEmailPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    let forgotPasswordUrl = "";
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    forgotPasswordUrl = `${baseUrl}/forgotPassword/${email}`;

    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>(
        "/api/users/sendForgotPasswordEmail",
        { email, forgotPasswordUrl }
      );
      toast({ title: "Email sent", description: response.data.message });
      router.replace(`/forgotPassword/${email}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Email Failed",
        description: axiosError.response?.data.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-200 p-6">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 bg-opacity-90 backdrop-blur-lg rounded-3xl shadow-lg border border-gray-700">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-100 mb-6">
            Confirm Identity
          </h1>
          <p className="text-blue-400 mb-4">
            You need to confirm your email to change your password
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-100"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-gray-900 border border-gray-600 rounded-md p-2 focus:outline-none focus:border-blue-600 focus:border-2"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-blue-600 text-gray-900 rounded-md hover:bg-blue-500"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
              </>
            ) : (
              "Send Code"
            )}
          </Button>
        </form>
        <div className="text-center mt-4">
          <p className="text-blue-400">
            New to ShadowConnect?{" "}
            <Link href="/signup" className="text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SendForgotPasswordEmailPage;
