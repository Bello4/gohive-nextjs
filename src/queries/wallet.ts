import axios from "@/lib/axios";
import {
  WalletFundingPayload,
  WalletFundingResponse,
  WalletBalance,
  WalletTransaction,
} from "@/types/wallet";

export async function fundWallet(
  payload: WalletFundingPayload
): Promise<WalletFundingResponse> {
  const response = await axios.post("/api/v1/fund", payload);
  return response.data;
}

export async function getWalletBalance(): Promise<{ data: WalletBalance }> {
  const response = await axios.get("/api/v1/balance");
  return response.data;
}

export async function getWalletTransactions(params?: {
  page?: number;
  per_page?: number;
  type?: string;
}): Promise<{ data: WalletTransaction[] }> {
  const response = await axios.get("/api/v1/transactions", { params });
  return response.data;
}

export async function verifyWalletFunding(
  reference: string
): Promise<WalletFundingResponse> {
  const response = await axios.post("/api/v1/verify-funding", {
    reference,
  });
  return response.data;
}
