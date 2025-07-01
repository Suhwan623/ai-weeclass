import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { MessageType } from '../types/message.type';
import { postWithToken, getWithToken } from '../api';
import { getCookie } from '../utils';

interface ServerMessage {
  id: number;
  userMessage: string | null;
  aiResponse: string | null;
  createdAt: string;
}

export const useChat = (roomId: number) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [currentTypingId, setCurrentTypingId] = useState<number | null>(null);
  const [question, setQuestion] = useState<string>('');
  const accessToken = getCookie('accessToken');

  const fetchMessages = async () => {
    const res = await getWithToken(accessToken, `/chat/room/${roomId}`);
    return res.data as ServerMessage[];
  };

  const {
    data: serverMessages,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['chatMessages', roomId],
    queryFn: fetchMessages,
    enabled: !!roomId,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (serverMessages) {
      const formatted: MessageType[] = serverMessages.flatMap((msg: ServerMessage) => {
        const msgs: MessageType[] = [];

        if (msg.userMessage) {
          msgs.push({
            id: msg.id * 2,
            sender: 'user',
            text: msg.userMessage,
            createdAt: msg.createdAt,
            isTyping: false,
          });
        }

        if (msg.aiResponse) {
          msgs.push({
            id: msg.id * 2 + 1,
            sender: 'ai',
            text: msg.aiResponse,
            createdAt: msg.createdAt,
            isTyping: false,
          });
        }

        return msgs;
      });

      formatted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      setMessages(formatted);
    }
  }, [serverMessages]);

  const mutation = useMutation({
    mutationFn: async (question: string) => {
      const res = await postWithToken(accessToken, `/chat/${roomId}`, {
        userMessage: question,
      });
      return res.data as ServerMessage;
    },
    onMutate: (question: string) => {
      const id = Date.now();
      const now = new Date().toISOString();
      setMessages(prev => [
        ...prev,
        {
          id,
          sender: 'user',
          text: question,
          createdAt: now,
          isTyping: false,
        },
        {
          id: id + 1,
          sender: 'ai',
          text: '답변을 준비 중입니다...',
          createdAt: now,
          isTyping: true,
        },
      ]);
      setCurrentTypingId(id + 1);
      setQuestion('');
    },
    onSuccess: (data: ServerMessage) => {
      const aiMessage = {
        id: data.id * 2 + 1,
        sender: 'ai' as const,
        text: data.aiResponse || 'AI 응답이 없습니다.',
        createdAt: new Date().toISOString(),
        isTyping: false,
      };
      setMessages(prev =>
        prev.map(msg =>
          msg.id === currentTypingId ? aiMessage : msg
        )
      );
      setCurrentTypingId(null);
      refetch();
    },
    onError: () => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === currentTypingId
            ? { ...msg, text: '에러가 발생했어요.', isTyping: false }
            : msg
        )
      );
      setCurrentTypingId(null);
    },
  });

  const sendMessage = () => {
    if (question.trim() && !mutation.isPending) {
      mutation.mutate(question);
    }
  };

  return {
    messages,
    question,
    setQuestion,
    sendMessage,
    isLoading,
    error,
    isSubmitting: mutation.isPending,
  };
};
