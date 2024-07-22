"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useParams, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { forgotPasswordSchema } from "@/schemas/forgotPasswordSchema";

const ForgotPasswordPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams<{ email: string }>();

  // Initialize form with zod schema validation
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      forgotPasswordCode: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    setIsSubmitting(true);
    try {
      if (data.newPassword !== data.confirmPassword) {
        toast({
          title: "Passwords mismatch",
          description: "Both passwords must match",
          variant: "destructive",
        });
        return;
      }

      console.log(data.forgotPasswordCode);

      const response = await axios.post<ApiResponse>(
        "/api/users/forgotPassword",
        { email: params.email, ...data }
      );
      toast({ title: "Password reseted", description: response.data.message });
      router.replace("/signin");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "password reset Failed",
        description: axiosError.response?.data.message,
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
          <h1 className="text-4xl font-bold tracking-tight text-[#E0E0E0] mb-6">
            Reset Password
          </h1>
          <p className="text-blue-400 mb-4">
            Reset Password and enjoy ShadowConnect
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="forgotPasswordCode"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    forgot password code
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter received code"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                      className="w-full text-gray-800 border border-[#4C4C6D] rounded-md p-2 focus:outline-none focus:border-blue-600 focus:border-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="newPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      {...field}
                      className="w-full text-gray-800 border border-[#4C4C6D] rounded-md p-2 focus:outline-none focus:border-blue-600 focus:border-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Now confirm password"
                        {...field}
                        className="w-full text-gray-800 border border-r-0 border-[#4C4C6D] rounded-md rounded-r-none p-2 focus:outline-none focus:border-blue-600 focus:border-2 focus:border-r-0"
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                      />
                      <Button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`flex h-12 items-center text-gray-500 bg-white rounded-none rounded-r-md border border-[#4C4C6D] border-l-0 px-3 hover:bg-white ${
                          isFocused
                            ? "outline-none border-blue-600 border-2 border-l-0"
                            : ""
                        }`}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-4 bg-blue-500 text-[#121212] rounded-md hover:bg-blue-600"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                  wait...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p className="text-blue-400">
            Already a member?{" "}
            <Link href="/signin" className="text-blue-500 hover:text-blue-600">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
