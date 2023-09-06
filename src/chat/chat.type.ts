export interface ConversationBody {
  users: string[];
}

export interface SendMessageBody {
  userId: string;
  content: string;
  conversation: string;
}
