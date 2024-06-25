"use client";
import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import * as z from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";
import { useParams } from "next/navigation";
import { messageSchema } from "@/schemas/messageSchema";

export default function SendMessage() {
  const initialMessageString =
    "What's your favorite movie?||Do you have any pets?||What's your dream job?";

  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);

  const params = useParams<{ username: string }>();
  const username = params.username;

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch("content");

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>(
        "/api/messages/sendMessage",
        {
          ...data,
          username,
        }
      );

      toast({
        title: response.data.message,
        variant: "default",
      });
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);
    try {
      const response = await axios.post("/api/messages/suggestMessages");
      console.log(response);

      const questionsArray = response.data.message.split("||");
      setSuggestedQuestions(questionsArray);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to fetch suggest message",
        variant: "destructive",
      });
    } finally {
      setIsSuggestLoading(false);
    }
  };

  useEffect(() => {
    const initialMessagesArray = initialMessageString.split("||");
    setSuggestedQuestions(initialMessagesArray);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#121212] text-[#E0E0E0]">
      <div className=" w-3/4 p-8 space-y-8 bg-[#1A1A2E] bg-opacity-90 backdrop-blur-lg rounded-3xl shadow-lg border border-[#2E2E3A] mt-32">
        <h1 className="text-4xl font-bold text-center text-[#E0E0E0]">
          Public Profile Link
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your anonymous message here"
                      className="resize-none w-full border border-[#4C4C6D] bg-[#1E1E1E] rounded-md p-2 focus:outline-none focus:border-[#C0392B] focus:border-2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              {isLoading ? (
                <Button
                  disabled
                  className="flex items-center bg-[#5D5FEF] text-[#121212] rounded-md"
                >
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading || !messageContent}
                  className="px-4 py-2 bg-[#5D5FEF] text-[#121212] hover:bg-[#4B4BCB] rounded-md"
                >
                  Send It
                </Button>
              )}
            </div>
          </form>
        </Form>
        <div className="space-y-4">
          <div className="space-y-2 text-center">
            <Button
              onClick={fetchSuggestedMessages}
              disabled={isSuggestLoading}
              className="px-4 py-2 bg-[#5D5FEF] text-[#121212] hover:bg-[#4B4BCB] rounded-md"
            >
              {isSuggestLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suggesting Messages
                </>
              ) : (
                "Suggest Messages"
              )}
            </Button>
            <p className="text-[#B0BEC5]">
              Click on any message below to select it.
            </p>
          </div>
          <Card className="rounded-md shadow-sm border-2 border-[#4C4C6D]">
            <CardHeader className="bg-[#1E1E1E] p-4 border-b-2 border-[#4C4C6D]">
              <h3 className="text-xl font-semibold text-[#E0E0E0]">Messages</h3>
            </CardHeader>
            <CardContent className="p-4 flex flex-col space-y-4 bg-[#121212]">
              {suggestedQuestions.map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="border-none text-[#E0E0E0] bg-[#1E1E1E] p-4 rounded-md hover:bg-[#4B4BCB] hover:text-[#ffffff] hover:font-bold text-wrap"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        <Separator className="bg-[#5D5FEF]" />

        <div className="text-center">
          <div className="mb-4 text-[#B0BEC5]">Get Your Message Board</div>
          <Link href={"/sign-up"}>
            <Button className="bg-[#5D5FEF] text-[#121212] hover:bg-[#4B4BCB] rounded-md">
              Create Your Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
