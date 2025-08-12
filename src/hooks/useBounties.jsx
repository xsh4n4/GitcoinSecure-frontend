
import { useState, useEffect, useCallback } from 'react';

const mockBountyData = {
  'bounty_user_1_0xUserAddress123': {
    id: 'bounty_user_1_0xUserAddress123',
    title: 'Smart Contract Security Audit',
    company: 'DeFi Protocol',
    deadline: '2025-09-12',
    reward: '5.0 ETH',
    status: 'active',
    submissions: 12,
    createdBy: '0xUserAddress123',
    description: 'Find vulnerabilities in our smart contract',
    endDate: '2024-12-31',
    severity: 'high',
    scope: 'The scope of this audit includes all smart contracts deployed under the DeFi Protocol, specifically focusing on the staking, lending, and governance modules. All associated libraries and dependencies are also in scope. Please refer to the GitHub repository for the latest contract addresses and source code.',
    resources: 'https://github.com/DeFiProtocol/smart-contracts, https://docs.defi-protocol.io/security-audit-guide',
    rules: 'Submissions must include a detailed report with clear reproduction steps, impact analysis, and suggested remediations. No denial-of-service attacks or social engineering. Do not disclose vulnerabilities publicly before a fix is implemented and verified. Follow responsible disclosure guidelines.',
    website: 'https://www.defi-protocol.io',
    contact: 'security@defi-protocol.io',
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
    severity: 'medium',
    scope: 'Full penetration test of the TechCorp customer portal web application, including user authentication, data management, and API integrations. Excludes third-party services and internal network infrastructure.',
    resources: 'https://techcorp.com/portal, https://docs.techcorp.com/api-spec',
    rules: 'Automated scanning is permitted, but manual testing is preferred. Do not attempt to access or modify production data. Report all findings through the designated submission platform.',
    website: 'https://www.techcorp.com',
    contact: 'security@techcorp.com',
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
    severity: 'critical',
    scope: 'Security review of the StartupXYZ mobile application (iOS and Android versions). Focus on client-side vulnerabilities, secure data storage, and communication with backend APIs. Source code will be provided upon request.',
    resources: 'https://startupxyz.com/mobile-app, https://github.com/StartupXYZ/mobile-app',
    rules: 'No reverse engineering of the compiled application is allowed. All testing must be performed on a test environment provided by StartupXYZ. Do not impact other users or the availability of the service.',
    website: 'https://www.startupxyz.com',
    contact: 'bugs@startupxyz.com',
    transactions: [
      { address: '0xResearcherE5', severity: 'Critical', amount: 3.0, timestamp: '2024-01-11T11:30:00Z' },
      { address: '0xResearcherF6', severity: 'High', amount: 2.0, timestamp: '2024-01-10T16:45:00Z' },
    ]
  },
  // 'bounty_public_2': {
  //   id: 'bounty_public_2',
  //   title: 'API Security Assessment',
  //   company: 'CloudService Inc',
  //   reward: '4.5 ETH',
  //   status: 'active',
  //   submissions: 6,
  //   createdBy: '0xOtherUser789',
  //   description: 'Security testing of REST API endpoints',
  //   endDate: '2024-12-20',
  //   severity: 'high',
  //   scope: 'Assessment of all public-facing REST API endpoints for CloudService Inc. This includes authentication, authorization, input validation, and rate limiting mechanisms. Documentation for all API endpoints is available.',
  //   resources: 'https://api.cloudservice.com/docs, https://cloudservice.com/developer-portal',
  //   rules: 'Automated tools are permitted for initial reconnaissance. Any identified vulnerabilities must be reported immediately. Do not perform any actions that could lead to data loss or service disruption.',
  //   website: 'https://www.cloudservice.com',
  //   contact: 'api-security@cloudservice.com',
  //   transactions: [
  //     { address: '0xResearcherG7', severity: 'High', amount: 2.5, timestamp: '2024-01-09T13:20:00Z' },
  //   ]
  // },
  // 'bounty_public_3': {
  //   id: 'bounty_public_3',
  //   title: 'Infrastructure Security Audit',
  //   company: 'Enterprise Solutions',
  //   reward: '6.0 ETH',
  //   status: 'completed',
  //   submissions: 20,
  //   createdBy: '0xOtherUser101',
  //   description: 'Complete infrastructure security assessment',
  //   endDate: '2024-01-15',
  //   severity: 'medium',
  //   scope: 'Audit of Enterprise Solutions\' cloud infrastructure (AWS). This includes network configurations, IAM roles, S3 bucket policies, and EC2 instance configurations. Access to a read-only AWS account will be provided.',
  //   resources: 'https://docs.enterprisesolutions.com/infrastructure, https://aws.amazon.com/documentation',
  //   rules: 'Do not attempt to gain write access to any resources. All testing must be confined to the provided test environment. Any potential misconfigurations or vulnerabilities should be documented with clear steps to reproduce.',
  //   website: 'https://www.enterprisesolutions.com',
  //   contact: 'infra-security@enterprisesolutions.com',
  //   transactions: [
//       { address: '0xResearcherH8', severity: 'Medium', amount: 1.0, timestamp: '2024-01-08T10:15:00Z' },
//     ]
//   }
};

export const useBounties = (userAddress) => {
  const [bounties, setBounties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to load bounties from localStorage or mock data
  const loadBounties = useCallback(() => {
    try {
      setIsLoading(true);
      const storedBounties = localStorage.getItem('bounties');
      let initialBounties;
      
      if (storedBounties) {
        initialBounties = JSON.parse(storedBounties);
      } else {
        initialBounties = Object.values(mockBountyData);
        localStorage.setItem('bounties', JSON.stringify(initialBounties));
      }
      
      setBounties(initialBounties);
      console.log('Bounties initialized/reloaded:', initialBounties);
      setError(null);
    } catch (err) {
      console.error('Error initializing/reloading bounties:', err);
      setError('Failed to load bounties');
      setBounties(Object.values(mockBountyData));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize bounties on component mount
  useEffect(() => {
    loadBounties();
  }, [loadBounties]); // Depend on loadBounties to avoid stale closure issues

  // Get bounty by ID
  const getBountyById = useCallback((bountyId) => {
    return bounties.find(b => b.id === bountyId);
  }, [bounties]);

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
        
        localStorage.setItem('bounties', JSON.stringify(updatedBounties));
        console.log('Bounties updated in localStorage');
        
        return updatedBounties;
      });
      
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      loadBounties(); // Call the shared loadBounties function
    } catch (err) {
      console.error('Error refreshing bounties:', err);
      setError('Failed to refresh bounties');
    } finally {
      setIsLoading(false);
    }
  }, [loadBounties]);

  // Add a new bounty
  const addBounty = useCallback(async (bountyData) => {
    try {
      const newBounty = {
        ...bountyData,
        id: `bounty_user_${Date.now()}_${userAddress}`,
        createdBy: userAddress,
        transactions: [],
        submissions: 0,
        status: 'active'
      };
      
      setBounties(prevBounties => {
        const updatedBounties = [...prevBounties, newBounty];
        localStorage.setItem('bounties', JSON.stringify(updatedBounties));
        return updatedBounties;
      });
      
      // After adding, force a reload to ensure all components get the latest state
      loadBounties(); 

      return newBounty;
    } catch (error) {
      console.error('Error adding bounty:', error);
      throw error;
    }
  }, [userAddress, loadBounties]);

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

