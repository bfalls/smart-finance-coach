export interface Persona {
  id: string;
  name: string;
  description: string;
}

export interface MonthlyOverview {
  month: string; // YYYY-MM
  total: number;
  income: number;
  savings: number;
}

export interface CategorySummary {
  name: string;
  latest: number;
  essential: boolean;
}

export interface FinanceSummary {
  monthly_overview: MonthlyOverview[];
  categories: CategorySummary[];
  goals: {
    target_savings_rate: number;
    current_savings_rate: number;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatMetadata {
  model: string;
  latency_ms: number;
}

export interface ChatResponse {
  message: ChatMessage;
  metadata: ChatMetadata;
}
