import { useMemo, useState } from 'react';
import { FinanceSummary, Persona } from '../types/finance';

const mockPersonas: Persona[] = [
  {
    id: 'single-demo',
    name: 'Single Demo',
    description: 'Urban renter focused on cutting dining + rideshare costs.',
  },
  {
    id: 'family-demo',
    name: 'Family Demo',
    description: 'Parents optimizing groceries, childcare, and subscriptions.',
  },
  {
    id: 'recent-grad-demo',
    name: 'Recent Grad Demo',
    description: 'Early career budget with student loan considerations.',
  },
];

const mockSummary: FinanceSummary = {
  monthly_overview: [
    { month: '2025-06', total: 3200, income: 4500, savings: 1300 },
    { month: '2025-07', total: 3400, income: 4500, savings: 1100 },
    { month: '2025-08', total: 3300, income: 4500, savings: 1200 },
  ],
  categories: [
    { name: 'Rent', latest: 1500, essential: true },
    { name: 'Restaurants', latest: 520, essential: false },
    { name: 'Groceries', latest: 480, essential: true },
    { name: 'Transportation', latest: 260, essential: true },
    { name: 'Shopping', latest: 390, essential: false },
  ],
  goals: { target_savings_rate: 0.2, current_savings_rate: 0.12 },
};

const useFinanceData = () => {
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>(mockPersonas[0].id);

  const summary = useMemo(() => {
    // TODO: replace with GET /personas/{id}/summary
    return mockSummary;
  }, [selectedPersonaId]);

  const personas = useMemo(() => {
    // TODO: replace with GET /personas
    return mockPersonas;
  }, []);

  const selectPersona = (id: string) => setSelectedPersonaId(id);

  return { personas, selectedPersonaId, selectPersona, summary };
};

export default useFinanceData;
