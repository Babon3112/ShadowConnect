"use client";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export const SendForgotPasswordEmailPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      let forgotPasswordUrl = "";
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      forgotPasswordUrl = `${baseUrl}/forgotPassword/${email}`;
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
    <div className="flex justify-center items-center min-h-screen bg-[#121212] text-[#E0E0E0]">
      <div className="w-full max-w-md p-8 space-y-8 bg-[#1A1A2E] bg-opacity-90 backdrop-blur-lg rounded-3xl shadow-lg border border-[#2E2E3A]">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#E0E0E0] mb-6">
            Confirm Identity
          </h1>
          <p className="text-[#A5A6F6] mb-4">
            You need to confirm your email to change your password
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#E0E0E0]"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full text-gray-800 border border-[#4C4C6D] rounded-md p-2 focus:outline-none focus:border-[#C0392B] focus:border-2"
            required
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-[#5D5FEF] text-[#121212] rounded-md hover:bg-[#4B4BCB] focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:ring-opacity-50"
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
          <p className="text-[#A5A6F6]">
            New to ShadowConnect?{" "}
            <Link
              href="/signup"
              className="text-[#5D5FEF] hover:text-[#4B4BCB]"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
