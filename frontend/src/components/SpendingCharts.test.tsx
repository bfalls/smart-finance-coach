import { render, screen } from '@testing-library/react';
import { Children, isValidElement } from 'react';
import { vi } from 'vitest';
import SpendingCharts from './SpendingCharts';
import { financeSummaryFixture } from '../../tests/fixtures/financeSummary';

type RechartsModule = typeof import('recharts');

vi.mock('recharts', async () => {
  const actual = await vi.importActual<RechartsModule>('recharts');

  const ResponsiveContainer = ({ children }: any) => (
    <div data-testid="responsive-container">
      {typeof children === 'function' ? children({ width: 800, height: 400 }) : children}
    </div>
  );

  const stripGradients = (chartChildren: any) =>
    Children.map(chartChildren, (child) => {
      if (isValidElement(child) && ['defs', 'linearGradient', 'stop'].includes(String(child.type))) {
        return null;
      }
      return child;
    });

  const AreaChart = ({ children }: any) => (
    <div data-testid="area-chart">{stripGradients(children)}</div>
  );
  const BarChart = ({ children }: any) => (
    <div data-testid="bar-chart">{stripGradients(children)}</div>
  );

  const Area = ({ name, dataKey }: any) => <div role="img" aria-label={name ?? dataKey} />;
  const Bar = ({ children }: any) => <div data-testid="bar-wrapper">{children}</div>;
  const Cell = ({ name }: any) => <div data-testid="category-cell" data-name={name} />;

  const Legend = ({ content, children }: any) => (
    <div data-testid="legend">{content ? content() : children}</div>
  );

  const Tooltip = ({ formatter }: any) => {
    const formatted = formatter ? formatter(12345) : '';
    const tooltipText = Array.isArray(formatted) ? formatted[0] : formatted;
    return <div data-testid="tooltip-value">{tooltipText}</div>;
  };

  const YAxis = ({ tickFormatter }: any) => (
    <div data-testid="y-axis">{tickFormatter ? tickFormatter(12345) : ''}</div>
  );

  const XAxis = ({ children }: any) => <div data-testid="x-axis">{children}</div>;
  const CartesianGrid = ({ children }: any) => <div data-testid="grid">{children}</div>;

  return {
    ...actual,
    ResponsiveContainer,
    AreaChart,
    BarChart,
    Area,
    Bar,
    Cell,
    Legend,
    Tooltip,
    YAxis,
    XAxis,
    CartesianGrid,
  };
});

describe('SpendingCharts', () => {
  it('renders the expected monthly series and category bars', () => {
    render(<SpendingCharts summary={financeSummaryFixture} />);

    const series = screen.getAllByRole('img').map((el) => el.getAttribute('aria-label'));
    expect(series).toEqual(expect.arrayContaining(['Income', 'Spending', 'Savings']));

    expect(screen.getAllByTestId('category-cell')).toHaveLength(financeSummaryFixture.categories.length);
    expect(screen.getByText('Essentials')).toBeInTheDocument();
    expect(screen.getByText('Discretionary')).toBeInTheDocument();
    expect(screen.getByText('Neutral')).toBeInTheDocument();
  });

  it('formats currency values in tooltips and axes', () => {
    render(<SpendingCharts summary={financeSummaryFixture} />);

    const [monthlyTooltip, categoryTooltip] = screen.getAllByTestId('tooltip-value');
    expect(monthlyTooltip).toHaveTextContent('$12,345');
    expect(categoryTooltip).toHaveTextContent('$12,345');
    expect(categoryTooltip).toHaveTextContent('%');

    const [yAxis] = screen.getAllByTestId('y-axis');
    expect(yAxis).toHaveTextContent('$12,345');
  });

  it('shows empty states when no data is provided', () => {
    render(
      <SpendingCharts
        summary={{ ...financeSummaryFixture, monthly_overview: [], categories: [] }}
      />
    );

    expect(screen.getByText('No monthly overview data available.')).toBeInTheDocument();
    expect(screen.getByText('No category data available.')).toBeInTheDocument();
    expect(screen.queryByTestId('area-chart')).not.toBeInTheDocument();
    expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
  });
});
