import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { chartColors, chartTypography, getChartTheme } from '../lib/chartTheme';
import { FinanceSummary } from '../types/finance';

interface SpendingChartsProps {
  summary: FinanceSummary;
}

const SpendingCharts = ({ summary }: SpendingChartsProps) => {
  const chartTheme = getChartTheme('light');

  const monthlyData = summary.monthly_overview.map((month) => ({
    monthLabel: formatMonthLabel(month.month),
    spending: month.total,
    income: month.income,
    savings: month.savings,
  }));

  const categoryData = summary.categories.map((category) => ({
    name: category.name,
    value: category.latest,
    tone: category.essential
      ? 'essential'
      : category.name.toLowerCase().includes('other')
        ? 'neutral'
        : 'discretionary',
  }));

  const monthlyChartHeight = 280;
  const categoryChartHeight = Math.max(56 * categoryData.length, 260);

  return (
    <div
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      style={{ backgroundColor: chartTheme.surface, borderColor: chartColors.grid.light }}
    >
      <div className="flex flex-col gap-1 pb-4">
        <p
          className="text-xs uppercase text-slate-500"
          style={{ letterSpacing: `${chartTypography.heading.letterSpacing}em` }}
        >
          Charts
        </p>
        <h2 className="text-lg font-semibold text-slate-900">Spending trends</h2>
        <p className="text-sm text-slate-500">
          High-level spending patterns and category splits based on the selected persona.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 shadow-sm">
          <div className="flex flex-col gap-1 pb-3">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Monthly Overview</p>
            <h3 className="text-base font-semibold text-slate-900">Income, spending, savings</h3>
            <p className="text-xs text-slate-500">Stacked area view with the latest months of activity.</p>
          </div>
          <div className="w-full" style={{ minHeight: monthlyChartHeight }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ left: 0, right: 8 }}>
                <defs>
                  <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColors.monthlyOverview.spending} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={chartColors.monthlyOverview.spending} stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColors.monthlyOverview.income} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={chartColors.monthlyOverview.income} stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColors.monthlyOverview.savings} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={chartColors.monthlyOverview.savings} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={chartColors.grid.light} strokeDasharray="3 3" />
                <XAxis dataKey="monthLabel" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                  width={80}
                />
                <Tooltip
                  cursor={{ stroke: chartColors.grid.light }}
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                  contentStyle={{
                    borderRadius: 12,
                    border: `1px solid ${chartColors.grid.light}`,
                    boxShadow: '0 10px 20px rgba(15, 23, 42, 0.08)',
                  }}
                />
                <Legend verticalAlign="bottom" height={40} />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke={chartColors.monthlyOverview.income}
                  fill="url(#colorIncome)"
                  strokeWidth={2}
                  name="Income"
                />
                <Area
                  type="monotone"
                  dataKey="spending"
                  stroke={chartColors.monthlyOverview.spending}
                  fill="url(#colorSpending)"
                  strokeWidth={2}
                  name="Spending"
                />
                <Area
                  type="monotone"
                  dataKey="savings"
                  stroke={chartColors.monthlyOverview.savings}
                  fill="url(#colorSavings)"
                  strokeWidth={2}
                  name="Savings"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 shadow-sm">
          <div className="flex flex-col gap-1 pb-3">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Spending by Category</p>
            <h3 className="text-base font-semibold text-slate-900">Latest month split</h3>
            <p className="text-xs text-slate-500">Quick comparison of essential, discretionary, and other costs.</p>
          </div>
          <div className="w-full" style={{ minHeight: categoryChartHeight }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                layout="vertical"
                margin={{ left: 12, right: 12 }}
                barSize={16}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid.light} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={120} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(148, 163, 184, 0.15)' }}
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                  contentStyle={{
                    borderRadius: 12,
                    border: `1px solid ${chartColors.grid.light}`,
                    boxShadow: '0 10px 20px rgba(15, 23, 42, 0.08)',
                  }}
                />
                <Legend verticalAlign="bottom" height={32} />
                <Bar dataKey="value" name="Spend">
                  {categoryData.map((entry) => (
                    <Cell
                      key={entry.name}
                      radius={6}
                      fill={chartColors.categories[entry.tone as keyof typeof chartColors.categories]}
                      stroke={chartColors.categories[entry.tone as keyof typeof chartColors.categories]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const formatMonthLabel = (month: string) => {
  const date = new Date(`${month}-01`);
  return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
};

export default SpendingCharts;
