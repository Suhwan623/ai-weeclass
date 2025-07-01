export type CreateMessageType = {
    userMessage: string;
  };
  
  export type MessageResponseType = {
    id: number;
    userMessage: string;
    aiResponse: string;
  };
  
  export type MessageType = {
    isTyping: unknown;
    id?: number;
    sender: 'user' | 'ai';
    text: string;
    createdAt: string;
  };

  export type Sender = 'user' | 'ai';
  