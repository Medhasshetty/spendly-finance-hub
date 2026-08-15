import type { Summary, Transaction, TxType } from "./spendly-core";

const API_BASE = (import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api").replace(/\/$/, "");

export type ApiTransactionPayload = {
  type: TxType;
  category: string;
  amount: number;
  date: string;
  description?: string | null;
};

export type ApiSummaryResponse = {
  total_income: number;
  total_expense: number;
  balance: number;
  transaction_count?: number;
};

export class ApiError extends Error {
  status: number;
  fields?: Record<string, string>;

  constructor(message: string, status: number, fields?: Record<string, string>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fields = fields;
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  let response: Response;

  try {
    response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(options?.headers || {}),
      },
    });
  } catch {
    throw new ApiError(
      "Unable to connect to Spendly Flask backend. Ensure Flask is running on port 5000.",
      0
    );
  }

  if (!response.ok) {
    let errorData: { error?: string; message?: string; fields?: Record<string, string> } = {};
    try {
      errorData = await response.json();
    } catch {
      // Body not JSON
    }

    const message =
      errorData.error || errorData.message || `Server returned status ${response.status}`;
    throw new ApiError(message, response.status, errorData.fields);
  }

  return response.json();
}

export const spendlyApi = {
  async getTransactions(): Promise<Transaction[]> {
    const data = await request<Array<{
      id: number | string;
      type: TxType;
      category: string;
      amount: number;
      date: string;
      description?: string | null;
      created_at?: string;
    }>>("/transactions");

    return (data ?? []).map((row) => ({
      id: String(row.id),
      type: row.type,
      category: row.category,
      amount: Number(row.amount),
      date: row.date,
      description: row.description || null,
    }));
  },

  async getSummary(): Promise<Summary> {
    const data = await request<ApiSummaryResponse>("/summary");
    const income = Number(data.total_income || 0);
    const expenses = Number(data.total_expense || 0);
    const balance = Number(data.balance || 0);
    const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 1000) / 10 : 0;

    return {
      income,
      expenses,
      balance,
      savingsRate,
      transactionCount: data.transaction_count ?? 0,
    };
  },

  async createTransaction(payload: ApiTransactionPayload): Promise<Transaction> {
    const row = await request<{
      id: number | string;
      type: TxType;
      category: string;
      amount: number;
      date: string;
      description?: string | null;
    }>("/transactions", {
      method: "POST",
      body: JSON.stringify({
        type: payload.type,
        category: payload.category,
        amount: Number(payload.amount),
        date: payload.date,
        description: payload.description || null,
      }),
    });

    return {
      id: String(row.id),
      type: row.type,
      category: row.category,
      amount: Number(row.amount),
      date: row.date,
      description: row.description || null,
    };
  },

  async updateTransaction(id: string | number, payload: ApiTransactionPayload): Promise<Transaction> {
    const row = await request<{
      id: number | string;
      type: TxType;
      category: string;
      amount: number;
      date: string;
      description?: string | null;
    }>(`/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        type: payload.type,
        category: payload.category,
        amount: Number(payload.amount),
        date: payload.date,
        description: payload.description || null,
      }),
    });

    return {
      id: String(row.id),
      type: row.type,
      category: row.category,
      amount: Number(row.amount),
      date: row.date,
      description: row.description || null,
    };
  },

  async deleteTransaction(id: string | number): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/transactions/${id}`, {
      method: "DELETE",
    });
  },
};
