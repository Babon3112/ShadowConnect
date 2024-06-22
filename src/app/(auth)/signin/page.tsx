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
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";

const SigninPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        toast({
          title: "Login Failed",
          description: "Incorrect email or password",
          variant: "destructive",
        });
        setIsSubmitting(false);
      }

      if (result?.url) {
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
      <div className="w-full max-w-md p-8 space-y-8 bg-[#1E1E1E] bg-opacity-90 backdrop-blur-lg rounded-3xl shadow-lg border border-[#373737]">
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
                      className="w-full border border-[#80CBC4] rounded-md p-2 focus:outline-none focus:border-[#004D40] focus:ring focus:ring-[#004D40] focus:ring-opacity-50"
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
                    <Input
                      type="password"
                      placeholder="Your Password"
                      {...field}
                      className="w-full border border-[#80CBC4] rounded-md p-2 focus:outline-none focus:border-[#004D40] focus:ring focus:ring-[#004D40] focus:ring-opacity-50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-4 bg-[#004D40] text-[#121212] rounded-md hover:bg-[#00695C] focus:outline-none focus:ring-2 focus:ring-[#004D40] focus:ring-opacity-50"
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
          <p className="text-[#B0BEC5]">
            New to ShadowConnect?{" "}
            <Link
              href="/signup"
              className="text-[#80CBC4] hover:text-[#004D40]"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
