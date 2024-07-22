"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/components/ui/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const VerifyAccountPage = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();

  // Form setup with zod schema for validation
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      // Send verification request
      const response = await axios.post<ApiResponse>("/api/users/verifyCode", {
        username: params.username,
        code: data.code,
      });

      // Success toast and redirect
      toast({
        title: "Verification Successful",
        description: response.data.message,
      });
      router.replace("/signin");
    } catch (error) {
      // Handle errors and show feedback
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Verification Failed",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-200 p-6">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 bg-opacity-90 backdrop-blur-lg rounded-3xl shadow-lg border border-gray-700">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#E0E0E0] lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="text-[#B0BEC5] mb-4">
            Enter the verification code sent to your email.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        {[...Array(6)].map((_, index) => (
                          <InputOTPSlot key={index} index={index} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription className="text-[#B0BEC5]">
                    Please enter the 6-digit code.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-[#121212] rounded-md"
            >
              Verify
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyAccountPage;
