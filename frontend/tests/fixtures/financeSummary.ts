import { FinanceSummary } from '../../src/types/finance';

export const financeSummaryFixture: FinanceSummary = {
  monthly_overview: [
    { month: '2024-01', total: 3200, income: 5000, savings: 1800 },
    { month: '2024-02', total: 3400, income: 5100, savings: 1700 },
  ],
  categories: [
    { name: 'Housing', latest: 1800, essential: true },
    { name: 'Dining', latest: 400, essential: false },
    { name: 'Other', latest: 300, essential: false },
  ],
  goals: {
    target_savings_rate: 0.2,
    current_savings_rate: 0.15,
  },
};
