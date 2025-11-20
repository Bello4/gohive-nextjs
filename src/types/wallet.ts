export interface WalletTransaction {
  id: number;
  uID: number;
  debit: number;
  credit: number;
  status: number;
  descr: string;
  ref: string;
  type: "wallet_funding" | "dispatch_payment" | "refund" | "purchase";
  created_at: string;
  updated_at: string;
}

export interface WalletFundingPayload {
  amount: number;
  email: string;
  payment_reference: string;
}

export interface WalletFundingResponse {
  success: boolean;
  message: string;
  data: {
    transaction: WalletTransaction;
    new_balance: number;
  };
}

export interface WalletBalance {
  balance: number;
  formatted_balance: string;
  pending_funds: number;
}
