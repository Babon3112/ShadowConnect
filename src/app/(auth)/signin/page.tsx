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
        router.replace("/");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-200 p-6">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 bg-opacity-90 backdrop-blur-lg rounded-3xl shadow-lg border border-gray-700">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-200 mb-6">
            Welcome Back
          </h1>
          <p className="text-blue-400 mb-4">
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
                      className="w-full text-gray-800 border border-gray-600 rounded-md p-2 focus:outline-none focus:border-blue-600 focus:border-2"
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
                        className="w-full text-gray-800 border border-r-0 border-gray-600 rounded-md rounded-r-none p-2 focus:outline-none focus:border-blue-600 focus:border-2 focus:border-r-0"
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                      />
                      <Button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`flex h-12 items-center text-gray-500 bg-white rounded-none rounded-r-md border border-gray-600 border-l-0 px-3 hover:bg-white ${
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
              className="w-full py-2 px-4 bg-blue-500 text-gray-900 rounded-md hover:bg-blue-600"
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
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-blue-400">
              New to ShadowConnect?{" "}
              <Link
                href="/signup"
                className="text-blue-500 hover:text-blue-600"
              >
                Sign up
              </Link>
            </p>
          </div>
          <div className="text-center">
            <Link
              href="/sendForgotPasswordEmail"
              className="text-blue-500 hover:text-blue-600"
            >
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
