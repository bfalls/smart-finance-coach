import { useEffect, useMemo, useState } from 'react';
import { endpoints, postJson } from '../lib/api';
import { ChatMessage, ChatMetadata, ChatResponse, FinanceSummary } from '../types/finance';
import { generateId } from "../lib/uuid";


const useChat = (personaId: string, summary: FinanceSummary | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<ChatMetadata | null>(null);

  useEffect(() => {
    const introMessages: ChatMessage[] = [
      {
        id: `${personaId}-assistant-intro`,
        role: 'assistant',
        content: 'Hi! I am your finance coach for this persona. Ask me about spending or goals.',
      },
    ];
    setMessages(introMessages);
    setInput('');
    setIsSending(false);
    setError(null);
    setMetadata(null);
  }, [personaId]);

  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content: trimmedInput,
    };

    const pendingMessage: ChatMessage = {
      id: generateId(),
      role: "assistant",
      content: "Thinking…",
    };

    const history = [...messages, userMessage];
    setMessages([...history, pendingMessage]);
    setInput('');
    setIsSending(true);
    setError(null);

    try {
      if (!summary) {
        throw new Error('Finance summary is still loading. Please try again shortly.');
      }

      const data = await postJson<ChatResponse>(endpoints.chat, {
        personaId,
        messages: history,
        summary,
      });

      const assistantMessage: ChatMessage = data?.message ?? {
        id: generateId(),
        role: "assistant",
        content:
          "I could not read the server response, but I am here to help with your budget.",
      };

      setMessages([...history, assistantMessage]);
      setMetadata(data?.metadata ?? null);
    } catch (err) {
      const fallback: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content:
          "Sorry, I could not fetch a reply right now. Please try again.",
      };

      setMessages([...history, fallback]);

      const message = err instanceof Error ? err.message : 'Unable to send message.';
      setError(message);
      setMetadata(null);
    } finally {
      setIsSending(false);
    }
  };

  return useMemo(
    () => ({
      messages,
      input,
      setInput,
      sendMessage,
      isSending,
      error,
      metadata,
    }),
    [messages, input, isSending, error, metadata],
  );
};

export default useChat;
