import { useEffect, useMemo, useState } from 'react';
import { ChatMessage } from '../types/finance';

const useChat = (personaId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const introMessages: ChatMessage[] = [
      {
        id: `${personaId}-assistant-intro`,
        role: 'assistant',
        content: 'Hi! I am your demo finance coach. Ask me about spending or goals.',
      },
    ];
    setMessages(introMessages);
  }, [personaId]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
    };

    const assistantReply: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content:
        'This is a placeholder response. TODO: call POST /chat with the selected persona and summary context.',
    };

    setMessages((prev) => [...prev, userMessage, assistantReply]);
    setInput('');
  };

  return useMemo(
    () => ({
      messages,
      input,
      setInput,
      sendMessage,
    }),
    [messages, input],
  );
};

export default useChat;
