import { Persona } from '../types/finance';

interface PersonaSelectorProps {
  personas: Persona[];
  selectedPersonaId: string;
  onSelect: (id: string) => void;
}

const PersonaSelector = ({ personas, selectedPersonaId, onSelect }: PersonaSelectorProps) => {
  return (
    <div>
      <div className="flex items-center justify-between pb-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Persona</p>
          <h2 className="text-lg font-semibold text-slate-900">Choose a demo profile</h2>
          <p className="text-sm text-slate-500">Pre-seeded CSV data only. No auth or uploads.</p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {personas.map((persona) => {
          const isSelected = persona.id === selectedPersonaId;
          return (
            <button
              key={persona.id}
              type="button"
              onClick={() => onSelect(persona.id)}
              className={`rounded-lg border p-4 text-left transition hover:border-slate-400 hover:shadow-sm ${
                isSelected ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100' : 'border-slate-200 bg-white'
              }`}
            >
              <p className="text-sm font-semibold text-slate-900">{persona.name}</p>
              <p className="mt-1 text-xs text-slate-500">{persona.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PersonaSelector;
