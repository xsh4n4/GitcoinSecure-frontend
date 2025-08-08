import { useState, useEffect, useCallback } from 'react';
import { useBounties } from './useBounties';

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

export const useBountyTransactions = (currentUserAddress = '0xUserAddress123') => {
  // Use the useBounties hook to get bounty data
  const { 
    bounties, 
    isLoading: bountiesLoading, 
    error: bountiesError,
    getUserBounties,
    getOtherBounties 
  } = useBounties(currentUserAddress);

  const [allTransactions, setAllTransactions] = useState(mockTransactions);
  const [loadingStates, setLoadingStates] = useState({});
  const [errors, setErrors] = useState({});
  const [lastUpdated, setLastUpdated] = useState({});

  const updateLoadingState = useCallback((bountyId, isLoading) => {
    setLoadingStates(prev => ({
      ...prev,
      [bountyId]: isLoading
    }));
  }, []);

  const updateError = useCallback((bountyId, error) => {
    setErrors(prev => ({
      ...prev,
      [bountyId]: error
    }));
  }, []);

  const updateLastUpdated = useCallback((bountyId) => {
    setLastUpdated(prev => ({
      ...prev,
      [bountyId]: new Date()
    }));
  }, []);

  const fetchBountyTransactions = useCallback(async (bountyId, isMyBounty) => {
    updateLoadingState(bountyId, true);
    updateError(bountyId, null);

    try {
      let transactionData;
      
      if (isMyBounty) {
        // For user's bounties, fetch dynamic/real-time data
        transactionData = await getDynamicTransactions(bountyId);
      } else {
        // For other bounties, use static mock data
        transactionData = mockTransactions[bountyId] || [];
      }

      setAllTransactions(prev => ({
        ...prev,
        [bountyId]: transactionData
      }));
      
      updateLastUpdated(bountyId);
    } catch (error) {
      updateError(bountyId, error.message);
      console.error(`Error fetching transactions for bounty ${bountyId}:`, error);
    } finally {
      updateLoadingState(bountyId, false);
    }
  }, [updateLoadingState, updateError, updateLastUpdated]);

  const loadAllTransactions = useCallback(async () => {
    if (bountiesLoading || bounties.length === 0) return;

    const userBounties = getUserBounties();
    const otherBounties = getOtherBounties();

    // Load user's bounties with real-time data
    for (const bounty of userBounties) {
      await fetchBountyTransactions(bounty.id, true);
    }

    // Load other bounties with static data
    for (const bounty of otherBounties) {
      await fetchBountyTransactions(bounty.id, false);
    }
  }, [bounties, bountiesLoading, getUserBounties, getOtherBounties, fetchBountyTransactions]);

  // Initial load
  useEffect(() => {
    loadAllTransactions();
  }, [loadAllTransactions]);

  // Set up real-time updates for user's bounties
  useEffect(() => {
    if (bountiesLoading || bounties.length === 0) return;

    const userBounties = getUserBounties();
    
    if (userBounties.length === 0) return;

    const intervals = userBounties.map(bounty => {
      return setInterval(() => {
        fetchBountyTransactions(bounty.id, true);
      }, 30000); // Update every 30 seconds
    });

    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }, [bounties, bountiesLoading, getUserBounties, fetchBountyTransactions]);

  const getBountyStats = useCallback((bountyId) => {
    const bounty = bounties.find(b => b.id === bountyId);
    const transactions = allTransactions[bountyId] || [];
    
    // Extract numeric value from reward string (e.g., "5.0 ETH" -> 5.0)
    const totalPool = parseFloat(bounty?.reward?.replace(/[^\d.]/g, '') || '0');
    const transactedPool = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    const remainingPool = totalPool - transactedPool;
    
    return {
      totalPool,
      transactedPool,
      remainingPool,
      transactionCount: transactions.length,
      utilizationPercentage: totalPool > 0 ? (transactedPool / totalPool) * 100 : 0
    };
  }, [bounties, allTransactions]);

  const refreshBountyTransactions = useCallback((bountyId) => {
    const bounty = bounties.find(b => b.id === bountyId);
    if (bounty) {
      const isMyBounty = bounty.createdBy === currentUserAddress;
      fetchBountyTransactions(bountyId, isMyBounty);
    }
  }, [bounties, currentUserAddress, fetchBountyTransactions]);

  const getTransactionsByBounty = useCallback((bountyId) => {
    return allTransactions[bountyId] || [];
  }, [allTransactions]);

  const isLoadingBounty = useCallback((bountyId) => {
    return loadingStates[bountyId] || false;
  }, [loadingStates]);

  const getBountyError = useCallback((bountyId) => {
    return errors[bountyId] || null;
  }, [errors]);

  const getBountyLastUpdated = useCallback((bountyId) => {
    return lastUpdated[bountyId] || null;
  }, [lastUpdated]);

  const isMyBounty = useCallback((bountyId) => {
    const bounty = bounties.find(b => b.id === bountyId);
    return bounty?.createdBy === currentUserAddress;
  }, [bounties, currentUserAddress]);

  return {
    bounties,
    allTransactions,
    isLoading: bountiesLoading,
    error: bountiesError,
    getBountyStats,
    getTransactionsByBounty,
    refreshBountyTransactions,
    isLoadingBounty,
    getBountyError,
    getBountyLastUpdated,
    isMyBounty,
    loadAllTransactions,
    getUserBounties,
    getOtherBounties,
  };
};

export default useBountyTransactions;


