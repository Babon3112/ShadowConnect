"use client";
import { useCallback, useEffect, useState } from "react";
import { Message } from "@/models/User.model";
import { useToast } from "@/components/ui/use-toast";
import { SessionProvider, useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { acceptMessagesSchema } from "@/schemas/acceptMessageSchema";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw } from "lucide-react";
import MessageCard from "@/components/MessageCard";

const DashboardPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { data: session, status } = useSession();
  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const form = useForm({
    resolver: zodResolver(acceptMessagesSchema),
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessage");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>(
        "/api/messages/acceptMesages"
      );
      setValue("acceptMessage", response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message settings",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>(
          "/api/messages/getMessages"
        );
        setMessages(response.data.messages || []);

        if (refresh) {
          toast({
            title: "Refreshed Messages",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title:
            axiosError.response?.data.message || "Failed to fetch messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  const handleSwitchChange = async () => {
    try {
      setIsSwitchLoading(true);
      const response = await axios.put<ApiResponse>(
        "/api/messages/acceptMesages",
        {
          acceptMessages: !acceptMessages,
        }
      );
      setValue("acceptMessage", response.data.isAcceptingMessage);
      toast({
        title: response.data.message,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message settings",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  };

  let profileUrl = "";
  if (status === "authenticated") {
    const { username } = session?.user as User;
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    profileUrl = `${baseUrl}/u/${username}`;
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL copied",
      description: profileUrl,
      variant: "default",
    });
  };

  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages(false);
    fetchAcceptMessage();
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  return (
    <SessionProvider session={session}>
      <div className="bg-gray-900">
        <div className="p-8 text-gray-200 min-h-screen overscroll-auto sm:w-3/4 mx-auto max-sm:pt-16">
          <h1 className="text-4xl font-bold mt-20">User Dashboard</h1>
          <div className="mb-4">
            <h2 className="text-lg font-medium mb-2">Copy Your Unique Link</h2>
            <div className="flex items-center">
              <input
                type="text"
                value={profileUrl}
                disabled
                className="input input-bordered w-full p-2 mr-2 bg-gray-800 text-gray-300 border-gray-600"
              />
              <Button
                onClick={copyToClipboard}
                className="border-none bg-blue-500 text-gray-900 hover:bg-blue-600 rounded-md"
              >
                Copy
              </Button>
            </div>
          </div>
          <p className="mb-4">Share this link to receive messages</p>
          <div className="mb-4 flex items-center">
            <Switch
              {...register("acceptMessages")}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
              className="bg-gray-800 border-gray-600"
            />
            <span className="ml-2">
              Accept Messages: {acceptMessages ? "On" : "Off"}
            </span>
          </div>
          <Separator />
          <Button
            className="mt-4 border-none bg-blue-500 text-gray-900 hover:bg-blue-600 rounded-md"
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
          </Button>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {messages.length > 0 ? (
              messages.map((message) => (
                <MessageCard
                  key={message._id}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))
            ) : (
              <div className="flex items-center justify-center col-span-1 md:col-span-2">
                <p className="text-center">No messages to display.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SessionProvider>
  );
};

export default DashboardPage;
