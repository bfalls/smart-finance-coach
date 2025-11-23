import useChat from '../hooks/useChat';
import { FinanceSummary } from '../types/finance';

interface ChatPanelProps {
  personaId: string;
  summary: FinanceSummary | null;
  summaryError: string | null;
  summaryLoading: boolean;
  onRetrySummary: () => void;
}

const ChatPanel = ({
  personaId,
  summary,
  summaryError,
  summaryLoading,
  onRetrySummary,
}: ChatPanelProps) => {
  const { messages, input, setInput, sendMessage, isSending, error, metadata } = useChat(
    personaId,
    summary,
  );

  const isChatDisabled = isSending || summaryLoading || !summary;
  const showConnecting = (summaryLoading || !summary) && !summaryError;

  return (
    <div className="flex h-[480px] flex-col">
      <div className="pb-3">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Chat</p>
        <h2 className="text-lg font-semibold text-slate-900">Coach conversation</h2>
        <p className="text-sm text-slate-500">
          Ask for budgeting tips, spending insights, or ideas to reach your savings target.
        </p>
      </div>

      {showConnecting && (
        <div className="mb-3 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-800">
          <span>Connecting to your coach and loading summary…</span>
          {summaryLoading && <span className="animate-pulse text-[10px] uppercase tracking-[0.2em]">Connecting…</span>}
        </div>
      )}

      {summaryError && (
        <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
          <p className="font-medium">Chat needs the latest summary to respond.</p>
          <p className="text-slate-800">{summaryError}</p>
          <button
            type="button"
            onClick={onRetrySummary}
            className="mt-2 inline-flex items-center gap-2 rounded-md border border-amber-200 bg-white px-3 py-1 text-[11px] font-medium text-amber-900 shadow-sm transition hover:border-amber-300 hover:text-amber-950"
          >
            Retry loading summary
          </button>
        </div>
      )}

      {error && (
        <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          {error}
        </div>
      )}

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
        {metadata && (
          <p className="pt-2 text-right text-[11px] uppercase tracking-[0.15em] text-slate-500">
            Provider: {metadata.provider} · Model: {metadata.model} · Latency: {metadata.latency_ms}ms
          </p>
        )}
      </div>

      <form
        className="mt-3 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          if (!isChatDisabled) {
            sendMessage();
          }
        }}
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about spending, budgets, goals..."
          className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          disabled={isChatDisabled}
        />
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          disabled={isChatDisabled}
        >
          {isSending ? 'Sending…' : showConnecting ? 'Connecting…' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
