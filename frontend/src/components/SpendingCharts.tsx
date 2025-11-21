import { FinanceSummary } from '../types/finance';

interface SpendingChartsProps {
  summary: FinanceSummary;
}

const SpendingCharts = ({ summary }: SpendingChartsProps) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between pb-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Charts</p>
          <h2 className="text-lg font-semibold text-slate-900">Spending trends</h2>
          <p className="text-sm text-slate-500">Placeholder layout. Wire up Recharts later.</p>
        </div>
      </div>

      <div className="space-y-3 text-sm text-slate-600">
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/70 p-4 text-center">
          <p className="font-medium">Monthly Overview</p>
          <p className="text-xs text-slate-500">
            TODO: render line/bar chart for spending, income, and savings over time.
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs">
            {summary.monthly_overview.map((month) => (
              <span
                key={month.month}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 shadow-sm"
              >
                {month.month}: ${month.total.toLocaleString()}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/70 p-4 text-center">
          <p className="font-medium">Categories</p>
          <p className="text-xs text-slate-500">TODO: render pie/bar chart for category spending split.</p>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {summary.categories.map((category) => (
              <div
                key={category.name}
                className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-left shadow-sm"
              >
                <span className="text-sm font-medium text-slate-900">{category.name}</span>
                <span className="text-xs text-slate-500">${category.latest.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendingCharts;
