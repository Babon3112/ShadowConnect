"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signinSchema } from "@/schemas/signinSchema";
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
import { Loader2, Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";

const SigninPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Initialize form with zod schema validation
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      if (result?.error) {
        console.log(result.error);

        toast({
          title: "Login Failed",
          description: result.error,
          variant: "destructive",
        });
        setIsSubmitting(false);
      } else if (result?.url) {
        router.replace("/dashboard");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#121212] text-[#E0E0E0]">
      <div className="w-full max-w-md p-8 space-y-8 bg-[#1A1A2E] bg-opacity-90 backdrop-blur-lg rounded-3xl shadow-lg border border-[#2E2E3A]">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#E0E0E0] mb-6">
            Welcome Back
          </h1>
          <p className="text-[#B0BEC5] mb-4">
            Sign in to continue your adventure with ShadowConnect
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Your Email"
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
                "Sign In"
              )}
            </Button>
          </form>
        </Form>

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
        <div className="text-center mt-4">
          <Link
            href="/sendForgotPasswordEmail"
            className="text-[#5D5FEF] hover:text-[#4B4BCB]"
          >
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
