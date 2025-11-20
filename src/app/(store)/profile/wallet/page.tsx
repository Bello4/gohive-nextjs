"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/auth";
import { getWalletBalance, getWalletTransactions } from "@/queries/wallet";
import FundWalletForm from "@/components/wallet/fund-wallet-form";
import { Wallet, Plus, History, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WalletPage() {
  const { user } = useAuth();
  const [showFundForm, setShowFundForm] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);

  // Load wallet data
  const loadWalletData = async () => {
    try {
      const [balanceRes, transactionsRes] = await Promise.all([
        getWalletBalance(),
        getWalletTransactions(),
      ]);

      setBalance(balanceRes.data.balance);
      setTransactions(transactionsRes.data);
    } catch (error) {
      console.error("Failed to load wallet data:", error);
    }
  };

  const handleFundingSuccess = (newBalance: number) => {
    setBalance(newBalance);
    loadWalletData(); // Refresh transactions
  };

  if (!user) {
    return <div>Please log in to view your wallet</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-2">
          <h1 className="text-xl font-bold text-gray-900">My Wallet</h1>
          <p className="text-gray-600 mt-2">
            Manage your funds and payment methods
          </p>
        </div>

        {showFundForm ? (
          <FundWalletForm
            onSuccess={handleFundingSuccess}
            onClose={() => setShowFundForm(false)}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Balance Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Wallet Balance
                    </h2>
                    <p className="text-gray-600">
                      Available funds for payments
                    </p>
                  </div>
                  <Wallet className="w-8 h-8 text-orange-500" />
                </div>

                <div className="text-center py-2">
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    ₦{balance.toLocaleString()}
                  </div>
                  <p className="text-gray-600">Current Balance</p>
                </div>

                <Button
                  onClick={() => setShowFundForm(true)}
                  className="w-full bg-gradient-to-r from-[#ff0a0a] to-[#ff7539] hover:from-[#ff7539] hover:to-[#ff0a0a]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Funds
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <History className="w-4 h-4 mr-2" />
                    Transaction History
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Payment Methods
                  </Button>
                </div>
              </div>

              {/* Recent Transactions Preview */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Recent Transactions
                </h3>
                {transactions.length > 0 ? (
                  <div className="space-y-3">
                    {transactions.slice(0, 3).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex justify-between items-center py-2 border-b"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {transaction.descr}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(
                              transaction.created_at
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div
                          className={`text-sm font-semibold ${
                            transaction.credit > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.credit > 0 ? "+" : ""}₦
                          {Math.abs(
                            transaction.credit - transaction.debit
                          ).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4">
                    No transactions yet
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
