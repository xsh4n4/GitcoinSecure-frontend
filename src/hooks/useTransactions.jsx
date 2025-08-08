import { useState, useEffect, useCallback } from 'react';

// Mock transaction data for demonstration
const mockTransactions = {
  [`bounty_user_1_0xUserAddress123`]: [
    { address: '0xResearcherA1', severity: 'Critical', amount: 1.5 },
    { address: '0xResearcherB2', severity: 'High', amount: 1.0 },
    { address: '0xResearcherC3', severity: 'Medium', amount: 0.5 },
  ],
  [`bounty_user_2_0xUserAddress123`]: [
    { address: '0xResearcherD4', severity: 'High', amount: 1.2 },
  ],
  'bounty_public_1': [
    { address: '0xResearcherE5', severity: 'Critical', amount: 3.0 },
    { address: '0xResearcherF6', severity: 'High', amount: 2.0 },
  ],
  'bounty_public_2': [
    { address: '0xResearcherG7', severity: 'High', amount: 2.5 },
  ],
  'bounty_public_3': [
    { address: '0xResearcherH8', severity: 'Medium', amount: 1.0 },
  ],
};

// Simulate real-time data updates for user's bounties
const getDynamicTransactions = (bountyId) => {
  return new Promise((resolve) => {
    const baseTransactions = mockTransactions[bountyId] || [];
    
    // Add dynamic transaction for user's bounties
    if (bountyId.includes('bounty_user_1')) {
      setTimeout(() => {
        resolve([
          ...baseTransactions,
          {
            address: '0xResearcherX9',
            severity: 'Low',
            amount: 0.3,
          },
        ]);
      }, 1500);
    } else if (bountyId.includes('bounty_user_2')) {
      setTimeout(() => {
        resolve([
          ...baseTransactions,
          {
            address: '0xResearcherY0',
            severity: 'Medium',
            amount: 0.8,
          },
        ]);
      }, 2000);
    } else {
      resolve(baseTransactions);
    }
  });
};

export const useTransactions = (bountyId, isMyBounty = false) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchTransactions = useCallback(async () => {
    if (!bountyId) return;

    setIsLoading(true);
    setError(null);

    try {
      let transactionData;
      
      if (isMyBounty) {
        // For user's bounties, fetch dynamic/real-time data
        transactionData = await getDynamicTransactions(bountyId);
      } else {
        // For other bounties, use static mock data
        transactionData = mockTransactions[bountyId] || [];
      }

      setTransactions(transactionData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
      console.error('Error fetching transactions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [bountyId, isMyBounty]);

  // Initial fetch
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Set up real-time updates for user's bounties
  useEffect(() => {
    if (!isMyBounty || !bountyId) return;

    const interval = setInterval(() => {
      fetchTransactions();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [isMyBounty, bountyId, fetchTransactions]);

  const refreshTransactions = useCallback(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const getTransactionStats = useCallback(() => {
    const totalTransactions = transactions.length;
    const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    const averageAmount = totalTransactions > 0 ? totalAmount / totalTransactions : 0;
    
    const severityCounts = transactions.reduce((counts, tx) => {
      const severity = tx.severity.toLowerCase();
      counts[severity] = (counts[severity] || 0) + 1;
      return counts;
    }, {});

    return {
      totalTransactions,
      totalAmount,
      averageAmount,
      severityCounts,
    };
  }, [transactions]);

  return {
    transactions,
    isLoading,
    error,
    lastUpdated,
    refreshTransactions,
    getTransactionStats,
  };
};

export default useTransactions;

