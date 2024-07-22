import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import { X } from "lucide-react";
import { Message } from "@/models/User.model";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const { toast } = useToast();

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/messages/deleteMessage/${message._id}`
      );
      toast({
        title: response.data.message,
      });
      onMessageDelete(message._id);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="card-bordered bg-gray-800 text-gray-200 p-4 rounded-3xl shadow-lg border-gray-700 border-2">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">
            {message.content}
          </CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="p-2 rounded-full ml-4">
                <X className="w-6 h-6" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-gray-900">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                  This action cannot be undone. This will permanently delete
                  this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="text-gray-400 hover:text-blue-500 mr-2">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-md px-4 py-2"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="text-sm mt-2 text-gray-400">
          {dayjs(message.createdAt).format("MMM D, YYYY h:mm A")}
        </div>
      </CardHeader>
    </Card>
  );
};

export default MessageCard;
