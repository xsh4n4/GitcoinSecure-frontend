


import { useState, useEffect, useCallback } from 'react';

const mockBountyData = {
  'bounty_user_1_0xUserAddress123': {
    id: 'bounty_user_1_0xUserAddress123',
    title: 'Smart Contract Security Audit',
    company: 'DeFi Protocol',
    reward: '5.0 ETH',
    status: 'active',
    submissions: 12,
    createdBy: '0xUserAddress123',
    description: 'Find vulnerabilities in our smart contract',
    endDate: '2024-12-31',
    transactions: [
      { address: '0xResearcherA1', severity: 'Critical', amount: 1.5, timestamp: '2024-01-15T10:30:00Z' },
      { address: '0xResearcherB2', severity: 'High', amount: 1.0, timestamp: '2024-01-14T15:45:00Z' },
      { address: '0xResearcherC3', severity: 'Medium', amount: 0.5, timestamp: '2024-01-13T09:20:00Z' },
    ]
  },
  'bounty_user_2_0xUserAddress123': {
    id: 'bounty_user_2_0xUserAddress123',
    title: 'Web Application Penetration Test',
    company: 'TechCorp',
    reward: '3.0 ETH',
    status: 'active',
    submissions: 8,
    createdBy: '0xUserAddress123',
    description: 'Security assessment of our web application',
    endDate: '2024-11-30',
    transactions: [
      { address: '0xResearcherD4', severity: 'High', amount: 1.2, timestamp: '2024-01-12T14:10:00Z' },
    ]
  },
  'bounty_public_1': {
    id: 'bounty_public_1',
    title: 'Mobile App Security Review',
    company: 'StartupXYZ',
    reward: '8.0 ETH',
    status: 'active',
    submissions: 15,
    createdBy: '0xOtherUser456',
    description: 'Comprehensive security review of mobile application',
    endDate: '2024-12-15',
    transactions: [
      { address: '0xResearcherE5', severity: 'Critical', amount: 3.0, timestamp: '2024-01-11T11:30:00Z' },
      { address: '0xResearcherF6', severity: 'High', amount: 2.0, timestamp: '2024-01-10T16:45:00Z' },
    ]
  },
  'bounty_public_2': {
    id: 'bounty_public_2',
    title: 'API Security Assessment',
    company: 'CloudService Inc',
    reward: '4.5 ETH',
    status: 'active',
    submissions: 6,
    createdBy: '0xOtherUser789',
    description: 'Security testing of REST API endpoints',
    endDate: '2024-12-20',
    transactions: [
      { address: '0xResearcherG7', severity: 'High', amount: 2.5, timestamp: '2024-01-09T13:20:00Z' },
    ]
  },
  'bounty_public_3': {
    id: 'bounty_public_3',
    title: 'Infrastructure Security Audit',
    company: 'Enterprise Solutions',
    reward: '6.0 ETH',
    status: 'completed',
    submissions: 20,
    createdBy: '0xOtherUser101',
    description: 'Complete infrastructure security assessment',
    endDate: '2024-01-15',
    transactions: [
      { address: '0xResearcherH8', severity: 'Medium', amount: 1.0, timestamp: '2024-01-08T10:15:00Z' },
    ]
  }
};

export const useBounties = (userAddress) => {
  const [bounties, setBounties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Get bounty by ID
const getBountyById = useCallback((bountyId) => {
  return bounties.find(b => b.id === bountyId);
}, [bounties]);


  // Initialize bounties from localStorage or use mock data
  useEffect(() => {
    const initializeBounties = () => {
      try {
        setIsLoading(true);
        
        // Try to get bounties from localStorage first
        const storedBounties = localStorage.getItem('bounties');
        let initialBounties;
        
        if (storedBounties) {
          initialBounties = JSON.parse(storedBounties);
        } else {
          // Use mock data and save to localStorage
          initialBounties = Object.values(mockBountyData);
          localStorage.setItem('bounties', JSON.stringify(initialBounties));
        }
        
        setBounties(initialBounties);
        console.log('Bounties initialized:', initialBounties);
        setError(null);
      } catch (err) {
        console.error('Error initializing bounties:', err);
        setError('Failed to load bounties');
        // Fallback to mock data
        setBounties(Object.values(mockBountyData));
      } finally {
        setIsLoading(false);
      }
    };

    initializeBounties();
  }, []);

  // Get bounties created by the current user
  const getUserBounties = useCallback(() => {
    return bounties.filter(bounty => bounty.createdBy === userAddress);
  }, [bounties, userAddress]);

  // Get bounties created by other users
  const getOtherBounties = useCallback(() => {
    return bounties.filter(bounty => bounty.createdBy !== userAddress);
  }, [bounties, userAddress]);

  // Update a bounty's transaction list
  const updateBountyTransaction = useCallback(async (bountyId, newTransaction) => {
    try {
      console.log(`Adding transaction to bounty ${bountyId}:`, newTransaction);
      
      // Update the bounties state
      setBounties(prevBounties => {
        const updatedBounties = prevBounties.map(bounty => {
          if (bounty.id === bountyId) {
            const updatedTransactions = [...(bounty.transactions || []), newTransaction];
            return {
              ...bounty,
              transactions: updatedTransactions
            };
          }
          return bounty;
        });
        
        // Save to localStorage
        localStorage.setItem('bounties', JSON.stringify(updatedBounties));
        console.log('Bounties updated in localStorage');
        
        return updatedBounties;
      });
      
      // Simulate blockchain transaction processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`Transaction successfully added to bounty ${bountyId}`);
      return true;
    } catch (error) {
      console.error('Error updating bounty transaction:', error);
      throw error;
    }
  }, []);

  // Get transactions for a specific bounty
  const getBountyTransactions = useCallback((bountyId) => {
    const bounty = bounties.find(b => b.id === bountyId);
    return bounty?.transactions || [];
  }, [bounties]);

  // Calculate bounty statistics
  const getBountyStats = useCallback((bountyId) => {
    const bounty = bounties.find(b => b.id === bountyId);
    if (!bounty) return { totalPool: 0, transactedPool: 0, remainingPool: 0 };
    
    const totalPool = parseFloat(bounty.reward?.replace(/[^\d.]/g, '') || '0');
    const transactions = bounty.transactions || [];
    const transactedPool = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
    const remainingPool = Math.max(0, totalPool - transactedPool);
    
    return { totalPool, transactedPool, remainingPool };
  }, [bounties]);

  // Refresh bounties (simulate API call)
  const refreshBounties = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would fetch from your backend
      const storedBounties = localStorage.getItem('bounties');
      if (storedBounties) {
        setBounties(JSON.parse(storedBounties));
      }
      
      setError(null);
    } catch (err) {
      console.error('Error refreshing bounties:', err);
      setError('Failed to refresh bounties');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add a new bounty (for future use)
  const addBounty = useCallback(async (bountyData) => {
    try {
      const newBounty = {
        ...bountyData,
        id: `bounty_user_${Date.now()}_${userAddress}`,
        createdBy: userAddress,
        transactions: [],
        submissions: 0,
        status: 'active'
        // bountyDataTag: 'user-created' 
      };
      
      setBounties(prevBounties => {
        const updatedBounties = [...prevBounties, newBounty];
        localStorage.setItem('bounties', JSON.stringify(updatedBounties));
        return updatedBounties;
      });
      
      return newBounty;
    } catch (error) {
      console.error('Error adding bounty:', error);
      throw error;
    }
  }, [userAddress]);

  const deleteBounty = useCallback((bountyId) => {
  setBounties(prevBounties => {
    const updatedBounties = prevBounties.filter(bounty => bounty.id !== bountyId);
    localStorage.setItem('bounties', JSON.stringify(updatedBounties));
    return updatedBounties;
  });
}, []);


  return {
    bounties,
    isLoading,
    error,
    getUserBounties,
    getOtherBounties,
    updateBountyTransaction,
    getBountyTransactions,
    getBountyStats,
    refreshBounties,
    addBounty,
    getBountyById, 
    deleteBounty
  };
};

