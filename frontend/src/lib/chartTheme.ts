export type ChartMode = 'light' | 'dark';

const basePalette = {
  brand: '#2563eb',
  accent: '#0ea5e9',
  savings: '#22c55e',
  spending: '#475569',
  income: '#0ea5e9',
  essential: '#f97316',
  discretionary: '#a855f7',
  neutral: '#cbd5e1',
  grid: '#e2e8f0',
  gridDark: '#1e293b',
  background: '#ffffff',
  backgroundDark: '#0f172a',
  text: '#0f172a',
  textDark: '#e2e8f0',
  surface: '#f8fafc',
  surfaceDark: '#1e293b',
};

export const chartColors = {
  monthlyOverview: {
    spending: basePalette.spending,
    income: basePalette.income,
    savings: basePalette.savings,
    highlight: basePalette.brand,
  },
  categories: {
    essential: basePalette.essential,
    discretionary: basePalette.discretionary,
    neutral: basePalette.neutral,
  },
  background: {
    light: basePalette.background,
    dark: basePalette.backgroundDark,
  },
  surface: {
    light: basePalette.surface,
    dark: basePalette.surfaceDark,
  },
  text: {
    light: basePalette.text,
    dark: basePalette.textDark,
  },
  grid: {
    light: basePalette.grid,
    dark: basePalette.gridDark,
  },
  tooltip: {
    light: '#0b1224',
    dark: '#e2e8f0',
  },
};

export const chartTypography = {
  heading: {
    fontSize: 16,
    fontWeight: 600,
    letterSpacing: 0.2,
  },
  caption: {
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: 0.1,
  },
};

export const getChartTheme = (mode: ChartMode = 'light') => ({
  mode,
  background: chartColors.background[mode],
  surface: chartColors.surface[mode],
  textColor: chartColors.text[mode],
  gridColor: chartColors.grid[mode],
  tooltipBg: chartColors.tooltip[mode],
});
