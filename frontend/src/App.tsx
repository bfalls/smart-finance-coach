import PersonaSelector from './components/PersonaSelector';
import PersonaSelectorSkeleton from './components/PersonaSelectorSkeleton';
import SpendingCharts from './components/SpendingCharts';
import SpendingChartsSkeleton from './components/SpendingChartsSkeleton';
import SummaryPanel from './components/SummaryPanel';
import SummaryPanelSkeleton from './components/SummaryPanelSkeleton';
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
        <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between px-4 py-4 xl:max-w-[1800px]">
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

      <main className="mx-auto grid w-full max-w-screen-2xl grid-cols-1 gap-4 px-4 py-6 lg:grid-cols-3 xl:max-w-[1800px]">
        <section className="space-y-4 lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            {personasLoading && <PersonaSelectorSkeleton />}
            {personasError && (
              <div
                role="alert"
                className="flex flex-col gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm"
              >
                <p className="font-medium">Unable to load personas.</p>
                <p className="text-slate-700">
                  {personasError} Please check your connection and retry.
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={fetchPersonas}
                    className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-white px-3 py-1 text-sm font-medium text-red-700 shadow-sm transition hover:border-red-300 hover:text-red-800"
                  >
                    Retry loading personas
                  </button>
                </div>
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
                <SummaryPanelSkeleton />
                <SpendingChartsSkeleton />
              </>
            )}
            {summaryError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm lg:col-span-2">
                <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                  <p className="leading-relaxed">
                    We hit a snag loading the finance summary: {summaryError}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={fetchSummary}
                      className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-white px-3 py-1 text-xs font-medium text-red-700 shadow-sm transition hover:border-red-300 hover:text-red-800"
                    >
                      Retry summary
                    </button>
                  </div>
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
              <ChatPanel
                personaId={selectedPersonaId}
                summary={summary}
                summaryError={summaryError}
                summaryLoading={summaryLoading}
                onRetrySummary={fetchSummary}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
