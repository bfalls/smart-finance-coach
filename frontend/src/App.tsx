import PersonaSelector from './components/PersonaSelector';
import SpendingCharts from './components/SpendingCharts';
import SummaryPanel from './components/SummaryPanel';
import ChatPanel from './components/ChatPanel';
import useFinanceData from './hooks/useFinanceData';
import './index.css';

function App() {
  const { personas, selectedPersonaId, selectPersona, summary } = useFinanceData();

  return (
    <div className="min-h-screen text-slate-900">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Demo Only</p>
            <h1 className="text-xl font-semibold">Smart Finance Coach</h1>
          </div>
          <p className="text-sm text-slate-500">No auth. Pre-seeded persona data only.</p>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-6 lg:grid-cols-3">
        <section className="space-y-4 lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <PersonaSelector
              personas={personas}
              selectedPersonaId={selectedPersonaId}
              onSelect={selectPersona}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <SummaryPanel summary={summary} />
            <SpendingCharts summary={summary} />
          </div>
        </section>

        <section className="lg:col-span-1">
          <div className="h-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <ChatPanel personaId={selectedPersonaId} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
