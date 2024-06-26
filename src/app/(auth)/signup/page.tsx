"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signupSchema } from "@/schemas/signupSchema";
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

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const debounced = useDebounceCallback(setUsername, 400);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/users/checkUniqueUsername?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error while checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };

    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    try {
      let verifyUrl = "";
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      verifyUrl = `${baseUrl}/verify/${username}`;
      const response = await axios.post<ApiResponse>("/api/users/signup", {
        verifyUrl,
        ...data,
      });
      toast({ title: "Signup Success", description: response.data.message });
      router.replace(`/verify/${username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Signup Failed",
        description: axiosError.response?.data.message,
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
            Join ShadowConnect
          </h1>
          <p className="text-[#B0BEC5] mb-4">
            Sign up to start your anonymous adventure
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                      className="w-full text-gray-800 border border-[#4C4C6D] rounded-md p-2 focus:outline-none focus:border-[#C0392B] focus:border-2"
                    />
                  </FormControl>
                  {isCheckingUsername && (
                    <Loader2 className="animate-spin mx-auto mt-2 text-[#80CBC4]" />
                  )}
                  <p
                    className={`text-sm mt-1 ${
                      usernameMessage === "Username is available"
                        ? "text-[#80CBC4]"
                        : "text-[#FF7043]"
                    }`}
                  >
                    {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      className="w-full text-gray-800 border border-[#4C4C6D] rounded-md p-2 focus:outline-none focus:border-[#C0392B] focus:border-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Your Password"
                        {...field}
                        className="w-full text-gray-800 border border-r-0 border-[#4C4C6D] rounded-md rounded-r-none p-2 focus:outline-none focus:border-[#C0392B] focus:border-2 focus:border-r-0"
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                      />
                      <Button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`flex h-12 items-center text-gray-500 bg-white rounded-none rounded-r-md border border-[#4C4C6D] border-l-0 px-3 hover:bg-white ${
                          isFocused
                            ? "outline-none border-[#C0392B] border-2 border-l-0"
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
              className="w-full py-2 px-4 bg-[#5D5FEF] text-[#121212] rounded-md hover:bg-[#4B4BCB] focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:ring-opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                  wait...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p className="text-[#A5A6F6]">
            Already a member?{" "}
            <Link
              href="/signin"
              className="text-[#5D5FEF] hover:text-[#4B4BCB]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
