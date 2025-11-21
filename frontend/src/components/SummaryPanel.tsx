import { FinanceSummary } from '../types/finance';

interface SummaryPanelProps {
  summary: FinanceSummary;
}

const SummaryPanel = ({ summary }: SummaryPanelProps) => {
  const totalMonthlySpend = summary.monthly_overview.at(-1)?.total ?? 0;
  const totalIncome = summary.monthly_overview.at(-1)?.income ?? 0;
  const savingsRate = summary.goals.current_savings_rate;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between pb-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Summary</p>
          <h2 className="text-lg font-semibold text-slate-900">Key metrics</h2>
          <p className="text-sm text-slate-500">Mock values for now. Hook up to backend summaries later.</p>
        </div>
      </div>

      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 shadow-sm">
          <dt className="text-xs uppercase tracking-[0.15em] text-slate-500">Monthly spend</dt>
          <dd className="mt-2 text-xl font-semibold text-slate-900">${totalMonthlySpend.toLocaleString()}</dd>
          <p className="text-xs text-slate-500">Latest month total</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 shadow-sm">
          <dt className="text-xs uppercase tracking-[0.15em] text-slate-500">Income</dt>
          <dd className="mt-2 text-xl font-semibold text-slate-900">${totalIncome.toLocaleString()}</dd>
          <p className="text-xs text-slate-500">Gross income for the latest month</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 shadow-sm">
          <dt className="text-xs uppercase tracking-[0.15em] text-slate-500">Savings rate</dt>
          <dd className="mt-2 text-xl font-semibold text-slate-900">{(savingsRate * 100).toFixed(0)}%</dd>
          <p className="text-xs text-slate-500">
            Goal: {(summary.goals.target_savings_rate * 100).toFixed(0)}% (to refine with AI later)
          </p>
        </div>
      </dl>
    </div>
  );
};

export default SummaryPanel;
