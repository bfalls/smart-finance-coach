import { useCallback, useEffect, useState } from 'react';
import { endpoints, getJson } from '../lib/api';
import { FinanceSummary, Persona } from '../types/finance';

type SummaryCache = Record<string, FinanceSummary>;

const normalizePersona = (data: any): Persona | null => {
  const id = typeof data.id === 'string' ? data.id : String(data.id ?? '').trim();
  const name = typeof data.name === 'string' ? data.name : '';
  const description = typeof data.description === 'string' ? data.description : '';

  if (!id || !name) return null;

  return { id, name, description };
};

const normalizeSummary = (data: any): FinanceSummary => {
  const payload = data?.summary ?? data ?? {};

  const monthly_overview = Array.isArray(payload.monthly_overview)
    ? payload.monthly_overview
        .map((item: any) => ({
          month: typeof item.month === 'string' ? item.month : String(item.month ?? ''),
          total: Number(item.total ?? 0),
          income: Number(item.income ?? 0),
          savings: Number(item.savings ?? 0),
        }))
        .filter((item) => item.month)
    : [];

  const categories = Array.isArray(payload.categories)
    ? payload.categories
        .map((item: any) => ({
          name: typeof item.name === 'string' ? item.name : '',
          latest: Number(item.latest ?? 0),
          essential: Boolean(item.essential),
        }))
        .filter((item) => item.name)
    : [];

  const goalsPayload = payload.goals ?? {};

  const goals = {
    target_savings_rate: Number(goalsPayload.target_savings_rate ?? 0),
    current_savings_rate: Number(goalsPayload.current_savings_rate ?? 0),
  };

  return { monthly_overview, categories, goals };
};

const useFinanceData = () => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [personasLoading, setPersonasLoading] = useState<boolean>(false);
  const [personasError, setPersonasError] = useState<string | null>(null);

  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);

  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [summaryCache, setSummaryCache] = useState<SummaryCache>({});
  const [summaryLoading, setSummaryLoading] = useState<boolean>(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const fetchPersonas = useCallback(async () => {
    if (personasLoading) return;

    try {
      setPersonasLoading(true);
      setPersonasError(null);

      const data = await getJson<unknown>(endpoints.personas);
      const rawList = Array.isArray(data) ? data : (data as any)?.personas ?? [];
      const normalized = rawList
        .map(normalizePersona)
        .filter((persona): persona is Persona => Boolean(persona));

      if (normalized.length === 0) {
        throw new Error("No personas available.");
      }

      setPersonas(normalized);
      setSelectedPersonaId((prev) => prev ?? normalized[0]?.id ?? null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load personas.";
      setPersonasError(message);
    } finally {
      setPersonasLoading(false);
    }
  }, [personasLoading]);

  useEffect(() => {
    if (personas.length > 0 || personasLoading || personasError) return;

    fetchPersonas();
  }, [fetchPersonas, personas, personasLoading, personasError]);

  const fetchSummary = useCallback(async () => {
    if (!selectedPersonaId || summaryLoading) return;

    const cachedSummary = summaryCache[selectedPersonaId];
    if (cachedSummary) {
      setSummary(cachedSummary);
      setSummaryError(null);
      return;
    }

    try {
      setSummaryLoading(true);
      setSummaryError(null);

      const data = await getJson<unknown>(endpoints.personaSummary(selectedPersonaId));
      const normalized = normalizeSummary(data);

      setSummary(normalized);
      setSummaryCache((prev) => ({ ...prev, [selectedPersonaId]: normalized }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to load summary data.';
      setSummaryError(message);
      setSummary(null);
    } finally {
      setSummaryLoading(false);
    }
  }, [selectedPersonaId, summaryCache, summaryLoading]);

  useEffect(() => {
    if (!selectedPersonaId) return;

    fetchSummary();
  }, [fetchSummary, selectedPersonaId]);

  const selectPersona = (id: string) => setSelectedPersonaId(id);

  return {
    personas,
    personasLoading,
    personasError,
    selectedPersonaId,
    selectPersona,
    summary,
    summaryLoading,
    summaryError,
    fetchPersonas,
    fetchSummary,
  };
};

export default useFinanceData;
