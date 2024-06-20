import { Message } from "@/models/User.model";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptMessage?: boolean;
  messages?: Array<Message>;
}
