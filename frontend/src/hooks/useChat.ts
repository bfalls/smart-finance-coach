import { useEffect, useMemo, useState } from 'react';
import { endpoints, postJson } from '../lib/api';
import { ChatMessage, FinanceSummary } from '../types/finance';

const useChat = (personaId: string, summary: FinanceSummary | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  }, [personaId]);

  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmedInput,
    };

    const pendingId = crypto.randomUUID();
    const pendingMessage: ChatMessage = {
      id: pendingId,
      role: 'assistant',
      content: 'Thinking…',
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

      const data = await postJson<{ message?: ChatMessage }>(endpoints.chat, {
        personaId,
        persona_id: personaId,
        messages: history,
        summary,
      });
      const assistantMessage: ChatMessage = data?.message ?? {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'I could not read the server response, but I am here to help with your budget.',
      };

      setMessages((prev) =>
        prev.map((message) => (message.id === pendingId ? assistantMessage : message)),
      );
    } catch (err) {
      const fallback: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Sorry, I could not fetch a reply right now. Please try again.',
      };

      setMessages((prev) =>
        prev.map((message) => (message.id === pendingId ? fallback : message)),
      );

      const message = err instanceof Error ? err.message : 'Unable to send message.';
      setError(message);
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
    }),
    [messages, input, isSending, error],
  );
};

export default useChat;
