import PersonaSelector from './components/PersonaSelector';
import SpendingCharts from './components/SpendingCharts';
import SummaryPanel from './components/SummaryPanel';
import ChatPanel from './components/ChatPanel';
import useFinanceData from './hooks/useFinanceData';
import './index.css';

function App() {
  const {
    personas,
    personasLoading,
    personasError,
    selectedPersonaId,
    selectPersona,
    summary,
    summaryLoading,
    summaryError,
    fetchPersonas,
    fetchSummary,
  } = useFinanceData();

  const personaReady = !personasLoading && !personasError && Boolean(selectedPersonaId);

  return (
    <div className="min-h-screen text-slate-900">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Demo Only
            </p>
            <h1 className="text-xl font-semibold">Smart Finance Coach</h1>
          </div>
          <p className="text-sm text-slate-500">
            No auth. Pre-seeded persona data only.
          </p>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-6 lg:grid-cols-3">
        <section className="space-y-4 lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            {personasLoading && (
              <div className="animate-pulse space-y-3">
                <div className="h-4 w-32 rounded bg-slate-200" />
                <div className="h-6 w-48 rounded bg-slate-200" />
                <div className="grid gap-3 md:grid-cols-3">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="h-24 rounded-lg border border-slate-200 bg-slate-100"
                    />
                  ))}
                </div>
              </div>
            )}
            {personasError && (
              <div
                role="alert"
                className="flex flex-col gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                <p>Unable to load personas: {personasError}</p>
                <button
                  type="button"
                  onClick={fetchPersonas}
                  className="inline-flex w-fit items-center gap-2 rounded-md border border-red-200 bg-white px-3 py-1 text-sm font-medium text-red-700 shadow-sm transition hover:border-red-300 hover:text-red-800"
                >
                  Retry loading personas
                </button>
              </div>
            )}
            {!personasLoading &&
              !personasError &&
              personas.length > 0 &&
              selectedPersonaId && (
                <PersonaSelector
                  personas={personas}
                  selectedPersonaId={selectedPersonaId}
                  onSelect={selectPersona}
                />
              )}
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {summaryLoading && (
              <>
                <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="h-4 w-32 rounded bg-slate-200" />
                  <div className="mt-3 h-6 w-full rounded bg-slate-100" />
                  <div className="mt-2 h-6 w-3/4 rounded bg-slate-100" />
                </div>
                <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="h-4 w-28 rounded bg-slate-200" />
                  <div className="mt-3 h-24 w-full rounded bg-slate-100" />
                </div>
              </>
            )}
            {summaryError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <p className="leading-relaxed">{summaryError}</p>
                  <button
                    type="button"
                    onClick={fetchSummary}
                    className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-white px-3 py-1 text-xs font-medium text-red-700 shadow-sm transition hover:border-red-300 hover:text-red-800"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}
            {!summaryLoading && !summaryError && summary && (
              <>
                <SummaryPanel summary={summary} />
                <SpendingCharts summary={summary} />
              </>
            )}
            {!summaryLoading && !summaryError && !summary && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500 shadow-sm">
                Select a persona to view their finance summary.
              </div>
            )}
          </div>
        </section>

        <section className="lg:col-span-1">
          <div className="h-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            {personasLoading && (
              <p className="text-sm text-slate-500">
                Loading personas before chat becomes available…
              </p>
            )}
            {personasError && (
              <div className="space-y-2 text-sm text-red-700">
                <p>Chat is unavailable because personas failed to load.</p>
                <button
                  type="button"
                  onClick={fetchPersonas}
                  className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-white px-3 py-1 text-xs font-medium text-red-700 shadow-sm transition hover:border-red-300 hover:text-red-800"
                >
                  Retry loading personas
                </button>
              </div>
            )}
            {!personasLoading && !personasError && !selectedPersonaId && (
              <p className="text-sm text-slate-500">
                Choose a persona to start chatting.
              </p>
            )}
            {personaReady && selectedPersonaId && (
              <ChatPanel personaId={selectedPersonaId} summary={summary} />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
