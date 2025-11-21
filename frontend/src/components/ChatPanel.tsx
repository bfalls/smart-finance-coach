import useChat from '../hooks/useChat';

interface ChatPanelProps {
  personaId: string;
}

const ChatPanel = ({ personaId }: ChatPanelProps) => {
  const { messages, input, setInput, sendMessage } = useChat(personaId);

  return (
    <div className="flex h-[480px] flex-col">
      <div className="pb-3">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Chat</p>
        <h2 className="text-lg font-semibold text-slate-900">Coach conversation</h2>
        <p className="text-sm text-slate-500">Placeholder AI replies. Hook up backend /chat later.</p>
      </div>

      <div className="flex-1 space-y-3 overflow-auto rounded-lg border border-slate-200 bg-slate-50/60 p-3">
        {messages.map((message) => (
          <div key={message.id} className="space-y-1">
            <p className="text-xs uppercase tracking-[0.15em] text-slate-500">{message.role}</p>
            <div
              className={`w-fit max-w-full rounded-lg px-3 py-2 text-sm shadow-sm ${
                message.role === 'user'
                  ? 'ml-auto bg-blue-600 text-white'
                  : 'bg-white text-slate-900 border border-slate-200'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      <form
        className="mt-3 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          sendMessage();
        }}
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about spending, budgets, goals..."
          className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
