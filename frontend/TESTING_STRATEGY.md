# Frontend testing strategy

This plan outlines how to validate the dashboard charts with React Testing Library and Vitest.

## Tooling setup
- Use `@testing-library/react` and `@testing-library/user-event` with Vitest (JSDOM environment).
- Mock `ResizeObserver` globally in `tests/setupTests.ts` (and `matchMedia` if needed) so Recharts can render without errors in JSDOM.
- Reuse a shared `FinanceSummary` fixture per suite to keep data consistent across chart assertions (see `tests/fixtures/financeSummary.ts`).

## Monthly overview area chart
- **Series coverage:** Render `SpendingCharts` with a `summary` that includes three monthly entries and assert that the chart contains exactly three `<path>` elements for the Income, Spending, and Savings areas (plus gradients). Prefer stable queries (e.g., `getAllByText` on the legend labels) to confirm all series are mounted.
- **Tooltip formatting:** Hover over a data point using `userEvent.hover` on the SVG dot/area and assert the tooltip text shows `$`-prefixed values with thousand separators.
- **Legend labels:** Verify the legend renders "Income", "Spending", and "Savings" entries with correct casing.
- **Empty state:** When `monthly_overview` is an empty array, expect an empty-state message or placeholder element (add a `role="status"` message in the component if needed) instead of rendering the chart.

## Category bar chart
- **Bar count:** With five `categories`, assert that Recharts renders five `<rect>` bars and that their order matches the input data.
- **Legend content:** Verify the custom legend shows three tone labels (Essentials, Discretionary, Neutral) with colored swatches.
- **Tooltip formatting:** Hover a bar and assert the tooltip displays both currency formatting and the computed percentage, e.g., `$1,200 (24.0%)`.
- **Empty state:** When `categories` is an empty array, expect an empty-state message or placeholder element (similar to the monthly chart handling).

## Accessibility and querying
- Prefer queries by text, role, or label over raw SVG selectors. If necessary, add `aria-label` or `data-testid` attributes to chart wrappers, tooltips, and legends to make the DOM more testable.
- Use `within` to target specific chart containers when both charts are rendered in the same component.

## Fixtures and utilities
- Create a `tests/fixtures/summary.ts` module exporting a canonical `FinanceSummary` object for reuse.
- Add small helper functions for triggering Recharts tooltips (e.g., dispatching `pointerOver` on bars/dots) to reduce repetitive code.