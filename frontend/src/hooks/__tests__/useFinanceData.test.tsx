import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import useFinanceData from '../useFinanceData';
import { Persona } from '../../types/finance';

type MockResponseBody = Record<string, unknown> | unknown[];

const createMockResponse = (body: MockResponseBody, ok = true, status = 200): Response => ({
  ok,
  status,
  json: async () => body,
} as Response);

const createDeferred = <T,>() => {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

const personaList: Persona[] = [
  { id: 'p1', name: 'Persona One', description: 'First persona' },
  { id: 'p2', name: 'Persona Two', description: 'Second persona' },
];

const TestComponent = () => {
  const {
    personas,
    personasLoading,
    personasError,
    selectedPersonaId,
    selectPersona,
    summary,
    summaryLoading,
    summaryError,
  } = useFinanceData();

  return (
    <div>
      <div data-testid="personas-loading">{personasLoading ? 'loading' : 'idle'}</div>
      <div data-testid="summary-loading">{summaryLoading ? 'loading' : 'idle'}</div>
      {personasError && <div role="alert">Unable to load personas: {personasError}</div>}
      {summaryError && <div role="status">{summaryError}</div>}
      <ul>
        {personas.map((persona) => (
          <li key={persona.id}>
            <button type="button" onClick={() => selectPersona(persona.id)}>
              {persona.name}
              {selectedPersonaId === persona.id && (
                <span data-testid="selected-persona" aria-hidden="true">{persona.id}</span>
              )}
            </button>
          </li>
        ))}
      </ul>
      {summary && <div data-testid="summary-goal">{summary.goals.target_savings_rate}</div>}
    </div>
  );
};

describe('useFinanceData', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it("shows persona loading state and then renders the loaded list and summary", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(createMockResponse([personaList[0]]))
      .mockResolvedValueOnce(
        createMockResponse({
          summary: {
            monthly_overview: [],
            categories: [],
            goals: { target_savings_rate: 15, current_savings_rate: 5 },
          },
        })
      );

    globalThis.fetch = fetchMock as unknown as typeof fetch;

    render(<TestComponent />);

    expect(screen.getByTestId("personas-loading")).toHaveTextContent("loading");

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Persona One" })
      ).toBeInTheDocument()
    );

    expect(screen.getByTestId("personas-loading")).toHaveTextContent("idle");

    await waitFor(() =>
      expect(screen.getByTestId("summary-goal")).toHaveTextContent("15")
    );
    expect(screen.getByTestId("summary-loading")).toHaveTextContent("idle");

    expect(fetchMock).toHaveBeenCalledWith("/personas");
    expect(fetchMock).toHaveBeenCalledWith("/personas/p1/summary");
  });

  it("surfaces persona loading errors to the UI", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(createMockResponse({}, false, 500));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    render(<TestComponent />);

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(
        /Unable to load personas:/i
      )
    );
    expect(screen.getByTestId("personas-loading")).toHaveTextContent("idle");
  });

  it("restarts summary loading when switching personas while a fetch is in flight", async () => {
    const p1Deferred = createDeferred<void>();

    const fetchMock = vi.fn((url: string) => {
      if (url === "/personas") {
        return Promise.resolve(createMockResponse(personaList));
      }

      if (url.includes("/personas/p1/summary")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => {
            await p1Deferred.promise;
            return {
              summary: {
                monthly_overview: [],
                categories: [],
                goals: { target_savings_rate: 10, current_savings_rate: 4 },
              },
            };
          },
        } as Response);
      }

      if (url.includes("/personas/p2/summary")) {
        return Promise.resolve(
          createMockResponse({
            summary: {
              monthly_overview: [],
              categories: [],
              goals: { target_savings_rate: 25, current_savings_rate: 14 },
            },
          })
        );
      }

      throw new Error(`Unexpected request: ${url}`);
    });

    globalThis.fetch = fetchMock as unknown as typeof fetch;

    render(<TestComponent />);

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Persona One" })
      ).toBeInTheDocument()
    );

    expect(screen.getByTestId("summary-loading")).toHaveTextContent("loading");

    fireEvent.click(screen.getByRole("button", { name: "Persona Two" }));

    p1Deferred.reject(new DOMException("Aborted", "AbortError"));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Persona Two" })
      ).toContainElement(screen.getByTestId("selected-persona"))
    );

    await waitFor(() =>
      expect(screen.getByTestId("summary-goal")).toHaveTextContent("25")
    );

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByTestId("summary-loading")).toHaveTextContent("idle");

    expect(fetchMock).toHaveBeenCalledWith("/personas/p1/summary");
    expect(fetchMock).toHaveBeenCalledWith("/personas/p2/summary");
  });

  it("reuses cached summaries instead of issuing redundant requests", async () => {
    const fetchMock = vi.fn((url: string) => {
      if (url === "/personas") {
        return Promise.resolve(createMockResponse(personaList));
      }

      if (url.includes("/personas/p1/summary")) {
        return Promise.resolve(
          createMockResponse({
            summary: {
              monthly_overview: [],
              categories: [],
              goals: { target_savings_rate: 11, current_savings_rate: 6 },
            },
          })
        );
      }

      if (url.includes("/personas/p2/summary")) {
        return Promise.resolve(
          createMockResponse({
            summary: {
              monthly_overview: [],
              categories: [],
              goals: { target_savings_rate: 22, current_savings_rate: 12 },
            },
          })
        );
      }

      throw new Error(`Unexpected request: ${url}`);
    });

    globalThis.fetch = fetchMock as unknown as typeof fetch;

    render(<TestComponent />);

    await waitFor(() =>
      expect(screen.getByTestId("summary-goal")).toHaveTextContent("11")
    );

    fireEvent.click(screen.getByRole("button", { name: "Persona Two" }));
    await waitFor(() =>
      expect(screen.getByTestId("summary-goal")).toHaveTextContent("22")
    );

    fireEvent.click(screen.getByRole("button", { name: "Persona One" }));

    await waitFor(() =>
      expect(screen.getByTestId("summary-goal")).toHaveTextContent("11")
    );

    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});
