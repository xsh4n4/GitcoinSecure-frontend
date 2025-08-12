// // useSubmissions.js - Enhanced custom React hook for submission management

// import { useState, useEffect, useCallback } from 'react';
// import { 
//   fetchUserSubmissions, 
//   fetchUserBounties, 
//   fetchBountySubmissions, 
//   updateSubmissionStatus,
//   getSubmissionStats,
//   generateMockUserSubmissions,
//   generateMockBountySubmissions,
//   submitVulnerabilityReport
// } from '../api/submissionAPI';

// // Global storage for bounty submissions to persist across component re-renders
// const bountySubmissionsStore = {};

// /**
//  * Generate mock submissions specific to a bounty ID
//  * @param {string} bountyId - The bounty ID
//  * @returns {Array} Array of mock submissions for the specific bounty
//  */
// const generateBountySpecificSubmissions = (bountyId) => {
//   // If we already have submissions for this bounty, return them
//   if (bountySubmissionsStore[bountyId]) {
//     return bountySubmissionsStore[bountyId];
//   }

//   // Generate different submissions based on bounty ID
//   const submissionTemplates = {
//     'bounty1': [
//       {
//         id: `${bountyId}_sub_1`,
//         title: 'Smart Contract Reentrancy Vulnerability',
//         description: 'Found a critical reentrancy vulnerability in the withdraw function that allows attackers to drain funds.',
//         severity: 'critical',
//         reward: '5.0 ETH',
//         status: 'pending',
//         submitter: '0x1234...5678',
//         bountyId: bountyId,
//         submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
//       },
//       {
//         id: `${bountyId}_sub_2`,
//         title: 'Integer Overflow in Token Calculation',
//         description: 'Discovered an integer overflow vulnerability in the token calculation logic that could lead to incorrect balances.',
//         severity: 'high',
//         reward: '5.0 ETH',
//         status: 'pending',
//         submitter: '0x9876...4321',
//         bountyId: bountyId,
//         submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
//       }
//     ],
//     'bounty2': [
//       {
//         id: `${bountyId}_sub_1`,
//         title: 'XSS Vulnerability in Trading Interface',
//         description: 'Found a cross-site scripting vulnerability in the trading interface that could compromise user accounts.',
//         severity: 'high',
//         reward: '3.5 ETH',
//         status: 'pending',
//         submitter: '0xabcd...efgh',
//         bountyId: bountyId,
//         submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
//       },
//       {
//         id: `${bountyId}_sub_2`,
//         title: 'SQL Injection in Order History',
//         description: 'Discovered SQL injection vulnerability in the order history endpoint that allows data extraction.',
//         severity: 'critical',
//         reward: '3.5 ETH',
//         status: 'pending',
//         submitter: '0x5555...6666',
//         bountyId: bountyId,
//         submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
//       },
//       {
//         id: `${bountyId}_sub_3`,
//         title: 'CSRF Token Bypass',
//         description: 'Found a way to bypass CSRF protection in the trading platform allowing unauthorized transactions.',
//         severity: 'medium',
//         reward: '3.5 ETH',
//         status: 'pending',
//         submitter: '0x7777...8888',
//         bountyId: bountyId,
//         submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
//       }
//     ],
//     'bounty3': [
//       {
//         id: `${bountyId}_sub_1`,
//         title: 'Private Key Exposure Risk',
//         description: 'Identified a vulnerability where private keys could be exposed through memory dumps on rooted devices.',
//         severity: 'critical',
//         reward: '2.0 ETH',
//         status: 'accepted',
//         submitter: '0xaaaa...bbbb',
//         bountyId: bountyId,
//         submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
//         reviewedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
//       },
//       {
//         id: `${bountyId}_sub_2`,
//         title: 'Insecure Biometric Storage',
//         description: 'Found that biometric data is stored without proper encryption, violating privacy standards.',
//         severity: 'high',
//         reward: '2.0 ETH',
//         status: 'rejected',
//         submitter: '0xcccc...dddd',
//         bountyId: bountyId,
//         submittedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
//         reviewedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
//         rejectionReason: 'Duplicate submission - already reported and fixed'
//       }
//     ],
//     'bounty4': [
//       {
//         id: `${bountyId}_sub_1`,
//         title: 'API Rate Limiting Bypass',
//         description: 'Discovered a method to bypass API rate limiting that could lead to DoS attacks.',
//         severity: 'medium',
//         reward: '4.2 ETH',
//         status: 'pending',
//         submitter: '0xeeee...ffff',
//         bountyId: bountyId,
//         submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
//       },
//       {
//         id: `${bountyId}_sub_2`,
//         title: 'Database Connection Pool Exhaustion',
//         description: 'Found a vulnerability that allows attackers to exhaust the database connection pool.',
//         severity: 'high',
//         reward: '4.2 ETH',
//         status: 'pending',
//         submitter: '0x1111...2222',
//         bountyId: bountyId,
//         submittedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
//       },
//       {
//         id: `${bountyId}_sub_3`,
//         title: 'Server-Side Request Forgery (SSRF)',
//         description: 'Identified SSRF vulnerability in the image upload functionality that could access internal services.',
//         severity: 'high',
//         reward: '4.2 ETH',
//         status: 'pending',
//         submitter: '0x3333...4444',
//         bountyId: bountyId,
//         submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
//       },
//       {
//         id: `${bountyId}_sub_4`,
//         title: 'Insecure Direct Object Reference',
//         description: 'Found IDOR vulnerability allowing users to access other users\' NFT metadata and transaction history.',
//         severity: 'medium',
//         reward: '4.2 ETH',
//         status: 'pending',
//         submitter: '0x9999...0000',
//         bountyId: bountyId,
//         submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
//       }
//     ]
//   };

//   // Get submissions for this bounty or return empty array if bounty doesn't exist
//   const submissions = submissionTemplates[bountyId] || [];
  
//   // Store in global store
//   bountySubmissionsStore[bountyId] = submissions;
  
//   return submissions;
// };

// /**
//  * Add a new submission to a specific bounty
//  * @param {string} bountyId - The bounty ID
//  * @param {Object} submissionData - The submission data
//  * @returns {Object} The new submission
//  */
// const addSubmissionToBounty = (bountyId, submissionData) => {
//   if (!bountySubmissionsStore[bountyId]) {
//     bountySubmissionsStore[bountyId] = [];
//   }

//   const newSubmission = {
//     id: `${bountyId}_sub_${Date.now()}`,
//     ...submissionData,
//     bountyId: bountyId,
//     status: 'pending',
//     submittedAt: new Date().toISOString()
//   };

//   bountySubmissionsStore[bountyId].unshift(newSubmission);
//   return newSubmission;
// };

// /**
//  * Custom hook for managing user submissions with real-time updates
//  * @param {string} walletAddress - User's wallet address
//  * @returns {Object} Submission data and management functions
//  */
// export const useUserSubmissions = (walletAddress) => {
//   const [submissions, setSubmissions] = useState([]);
//   const [stats, setStats] = useState({
//     totalSubmissions: 0,
//     pendingSubmissions: 0,
//     acceptedSubmissions: 0,
//     rejectedSubmissions: 0
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [lastUpdated, setLastUpdated] = useState(null);

//   const calculateStats = useCallback((submissionList) => {
//     const totalSubmissions = submissionList.length;
//     const pendingSubmissions = submissionList.filter(s => s.status === 'pending').length;
//     const acceptedSubmissions = submissionList.filter(s => s.status === 'accepted').length;
//     const rejectedSubmissions = submissionList.filter(s => s.status === 'rejected').length;

//     return {
//       totalSubmissions,
//       pendingSubmissions,
//       acceptedSubmissions,
//       rejectedSubmissions
//     };
//   }, []);

//   const loadSubmissions = useCallback(async (force = false) => {
//     if (!walletAddress) return;

//     // Avoid unnecessary reloads unless forced
//     if (!force && submissions.length > 0 && lastUpdated && Date.now() - lastUpdated < 30000) {
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       // For development, use enhanced mock data. In production, use the actual API
//       const isDevelopment = process.env.NODE_ENV === 'development';
      
//       let submissionData;
//       if (isDevelopment) {
//         // Use enhanced mock data for development with dynamic updates
//         submissionData = generateMockUserSubmissions(walletAddress);
        
//         // Simulate some submissions being updated based on time
//         const now = Date.now();
//         submissionData = submissionData.map(sub => {
//           // Simulate status changes for demo purposes
//           if (sub.status === 'pending' && Math.random() > 0.7) {
//             return {
//               ...sub,
//               status: Math.random() > 0.5 ? 'accepted' : 'rejected',
//               reviewedAt: new Date(now - Math.random() * 86400000).toISOString(),
//               ...(Math.random() > 0.5 && { rejectionReason: 'Insufficient evidence or duplicate submission' })
//             };
//           }
//           return sub;
//         });
//       } else {
//         // Use actual API in production
//         submissionData = await fetchUserSubmissions(walletAddress);
//       }

//       setSubmissions(submissionData);
//       setStats(calculateStats(submissionData));
//       setLastUpdated(Date.now());
//     } catch (err) {
//       setError(err.message);
//       console.error('Error loading submissions:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [walletAddress, calculateStats, submissions.length, lastUpdated]);

//   useEffect(() => {
//     loadSubmissions();
//   }, [loadSubmissions]);

//   const refreshSubmissions = useCallback(() => {
//     loadSubmissions(true);
//   }, [loadSubmissions]);

//   const addSubmission = useCallback(async (submissionData) => {
//     try {
//       const isDevelopment = process.env.NODE_ENV === 'development';
      
//       let newSubmission;
//       if (isDevelopment) {
//         // Create mock submission for development
//         newSubmission = {
//           id: `sub_${Date.now()}`,
//           ...submissionData,
//           status: 'pending',
//           submittedAt: new Date().toISOString(),
//           submitter: walletAddress
//         };
        
//         // Add to local state
//         setSubmissions(prev => [newSubmission, ...prev]);
//         setStats(prev => ({
//           ...prev,
//           totalSubmissions: prev.totalSubmissions + 1,
//           pendingSubmissions: prev.pendingSubmissions + 1
//         }));

//         // Also add to the specific bounty if bountyId is provided
//         if (submissionData.bountyId) {
//           addSubmissionToBounty(submissionData.bountyId, submissionData);
//         }
//       } else {
//         newSubmission = await submitVulnerabilityReport({
//           ...submissionData,
//           submitter: walletAddress
//         });
        
//         // Refresh submissions to get updated data
//         refreshSubmissions();
//       }
      
//       return newSubmission;
//     } catch (err) {
//       setError(err.message);
//       console.error('Error adding submission:', err);
//       throw err;
//     }
//   }, [walletAddress, refreshSubmissions]);

//   const updateSubmissionStatus = useCallback(async (submissionId, status, reason = '') => {
//     try {
//       const isDevelopment = process.env.NODE_ENV === 'development';
      
//       if (isDevelopment) {
//         // Update local state for development
//         setSubmissions(prev => 
//           prev.map(sub => 
//             sub.id === submissionId 
//               ? { 
//                   ...sub, 
//                   status,
//                   ...(status === 'rejected' && reason ? { rejectionReason: reason } : {}),
//                   reviewedAt: new Date().toISOString(),
//                   reviewedBy: walletAddress
//                 }
//               : sub
//           )
//         );
        
//         // Recalculate stats
//         const updatedSubmissions = submissions.map(sub => 
//           sub.id === submissionId ? { ...sub, status } : sub
//         );
//         setStats(calculateStats(updatedSubmissions));
//       } else {
//         // Use actual API in production
//         await updateSubmissionStatus(submissionId, status, reason, walletAddress);
//         refreshSubmissions();
//       }

//       return true;
//     } catch (err) {
//       setError(err.message);
//       console.error('Error updating submission status:', err);
//       return false;
//     }
//   }, [submissions, calculateStats, walletAddress, refreshSubmissions]);

//   const getSubmissionsByStatus = useCallback((status) => {
//     if (status === 'all') return submissions;
//     return submissions.filter(sub => sub.status === status);
//   }, [submissions]);

//   const getRecentSubmissions = useCallback((limit = 5) => {
//     return submissions
//       .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
//       .slice(0, limit);
//   }, [submissions]);

//   return {
//     submissions,
//     stats,
//     isLoading,
//     error,
//     lastUpdated,
//     refreshSubmissions,
//     addSubmission,
//     updateSubmissionStatus,
//     getSubmissionsByStatus,
//     getRecentSubmissions
//   };
// };

// /**
//  * Enhanced custom hook for managing user's created bounties
//  * @param {string} walletAddress - User's wallet address
//  * @returns {Object} Bounty data and management functions
//  */
// export const useUserBounties = (walletAddress) => {
//   const [bounties, setBounties] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [lastUpdated, setLastUpdated] = useState(null);

//   const loadBounties = useCallback(async (force = false) => {
//     if (!walletAddress) return;

//     // Avoid unnecessary reloads unless forced
//     if (!force && bounties.length > 0 && lastUpdated && Date.now() - lastUpdated < 30000) {
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       // For development, use enhanced mock data
//       const isDevelopment = process.env.NODE_ENV === 'development';
      
//       let bountyData;
//       if (isDevelopment) {
//         // Enhanced mock bounties data with dynamic submission counts
//         bountyData = [
//           {
//             id: 'bounty1',
//             title: 'DeFi Protocol Security Audit',
//             description: 'Comprehensive security audit for our DeFi protocol including smart contract vulnerabilities, economic attacks, and governance issues.',
//             reward: '5.0 ETH',
//             status: 'active',
//             category: 'smart-contract',
//             severity: 'critical',
//             deadline: '2024-02-15',
//             expiryDate: '2024-02-15',
//             submissionCount: bountySubmissionsStore['bounty1']?.length || 0,
//             createdBy: walletAddress,
//             createdAt: '2024-01-01T00:00:00Z'
//           },
//           {
//             id: 'bounty2',
//             title: 'Web3 Trading Platform Bug Hunt',
//             description: 'Find vulnerabilities in our decentralized trading platform including frontend, backend, and smart contract components.',
//             reward: '3.5 ETH',
//             status: 'active',
//             category: 'web-application',
//             severity: 'high',
//             deadline: '2024-02-20',
//             expiryDate: '2024-02-20',
//             submissionCount: bountySubmissionsStore['bounty2']?.length || 0,
//             createdBy: walletAddress,
//             createdAt: '2024-01-05T00:00:00Z'
//           },
//           {
//             id: 'bounty3',
//             title: 'Mobile Wallet Security Review',
//             description: 'Security review for our mobile wallet application focusing on key management, transaction security, and user privacy.',
//             reward: '2.0 ETH',
//             status: 'completed',
//             category: 'mobile',
//             severity: 'medium',
//             deadline: '2024-01-30',
//             expiryDate: '2024-01-30',
//             submissionCount: bountySubmissionsStore['bounty3']?.length || 0,
//             createdBy: walletAddress,
//             createdAt: '2023-12-15T00:00:00Z'
//           },
//           {
//             id: 'bounty4',
//             title: 'NFT Marketplace Infrastructure Audit',
//             description: 'Infrastructure security audit for our NFT marketplace including API security, database protection, and server hardening.',
//             reward: '4.2 ETH',
//             status: 'active',
//             category: 'infrastructure',
//             severity: 'high',
//             deadline: '2024-03-01',
//             expiryDate: '2024-03-01',
//             submissionCount: bountySubmissionsStore['bounty4']?.length || 0,
//             createdBy: walletAddress,
//             createdAt: '2024-01-10T00:00:00Z'
//           }
//         ];
//       } else {
//         bountyData = await fetchUserBounties(walletAddress);
//       }

//       setBounties(bountyData);
//       setLastUpdated(Date.now());
//     } catch (err) {
//       setError(err.message);
//       console.error('Error loading bounties:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [walletAddress, bounties.length, lastUpdated]);

//   useEffect(() => {
//     loadBounties();
//   }, [loadBounties]);

//   const refreshBounties = useCallback(() => {
//     loadBounties(true);
//   }, [loadBounties]);

//   const getBountyById = useCallback((bountyId) => {
//     return bounties.find(bounty => bounty.id === bountyId);
//   }, [bounties]);

//   const getActiveBounties = useCallback(() => {
//     return bounties.filter(bounty => bounty.status === 'active');
//   }, [bounties]);

//   const getBountyStats = useCallback(() => {
//     const total = bounties.length;
//     const active = bounties.filter(b => b.status === 'active').length;
//     const completed = bounties.filter(b => b.status === 'completed').length;
//     const totalSubmissions = bounties.reduce((sum, b) => sum + (b.submissionCount || 0), 0);

//     return { total, active, completed, totalSubmissions };
//   }, [bounties]);

//   return {
//     bounties,
//     isLoading,
//     error,
//     lastUpdated,
//     refreshBounties,
//     getBountyById,
//     getActiveBounties,
//     getBountyStats
//   };
// };

// /**
//  * Enhanced custom hook for managing submissions for a specific bounty
//  * @param {string} bountyId - Bounty ID
//  * @returns {Object} Submission data and management functions
//  */
// export const useBountySubmissions = (bountyId) => {
//   const [submissions, setSubmissions] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [lastUpdated, setLastUpdated] = useState(null);

//   const loadSubmissions = useCallback(async (force = false) => {
//     if (!bountyId) return;

//     // Avoid unnecessary reloads unless forced
//     if (!force && submissions.length > 0 && lastUpdated && Date.now() - lastUpdated < 30000) {
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       const isDevelopment = process.env.NODE_ENV === 'development';
      
//       let submissionData;
//       if (isDevelopment) {
//         // Use the new bounty-specific submission generator
//         submissionData = generateBountySpecificSubmissions(bountyId);
        
//         // Add some dynamic behavior for demo
//         submissionData = submissionData.map(sub => ({
//           ...sub,
//           submittedAt: sub.submittedAt || new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
//         }));
//       } else {
//         submissionData = await fetchBountySubmissions(bountyId);
//       }

//       setSubmissions(submissionData);
//       setLastUpdated(Date.now());
//     } catch (err) {
//       setError(err.message);
//       console.error('Error loading bounty submissions:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [bountyId, submissions.length, lastUpdated]);

//   useEffect(() => {
//     loadSubmissions();
//   }, [loadSubmissions]);

//   const updateSubmission = useCallback(async (submissionId, status, reason = '', reviewerAddress) => {
//     try {
//       const isDevelopment = process.env.NODE_ENV === 'development';
      
//       if (isDevelopment) {
//         // Update local state for development
//         setSubmissions(prev => 
//           prev.map(sub => 
//             sub.id === submissionId 
//               ? { 
//                   ...sub, 
//                   status,
//                   ...(status === 'rejected' && reason ? { rejectionReason: reason } : {}),
//                   reviewedAt: new Date().toISOString(),
//                   reviewedBy: reviewerAddress
//                 }
//               : sub
//           )
//         );

//         // Also update in the global store
//         if (bountySubmissionsStore[bountyId]) {
//           bountySubmissionsStore[bountyId] = bountySubmissionsStore[bountyId].map(sub => 
//             sub.id === submissionId 
//               ? { 
//                   ...sub, 
//                   status,
//                   ...(status === 'rejected' && reason ? { rejectionReason: reason } : {}),
//                   reviewedAt: new Date().toISOString(),
//                   reviewedBy: reviewerAddress
//                 }
//               : sub
//           );
//         }
//       } else {
//         // Use actual API in production
//         const updatedSubmission = await updateSubmissionStatus(submissionId, status, reason, reviewerAddress);
        
//         setSubmissions(prev => 
//           prev.map(sub => 
//             sub.id === submissionId ? updatedSubmission : sub
//           )
//         );
//       }

//       return true;
//     } catch (err) {
//       setError(err.message);
//       console.error('Error updating submission:', err);
//       return false;
//     }
//   }, [bountyId]);

//   const refreshSubmissions = useCallback(() => {
//     loadSubmissions(true);
//   }, [loadSubmissions]);

//   const getSubmissionsByStatus = useCallback((status) => {
//     if (status === 'all') return submissions;
//     return submissions.filter(sub => sub.status === status);
//   }, [submissions]);

//   const getSubmissionStats = useCallback(() => {
//     const total = submissions.length;
//     const pending = submissions.filter(s => s.status === 'pending').length;
//     const accepted = submissions.filter(s => s.status === 'accepted').length;
//     const rejected = submissions.filter(s => s.status === 'rejected').length;

//     return { total, pending, accepted, rejected };
//   }, [submissions]);

//   const getSubmissionById = useCallback((submissionId) => {
//     return submissions.find(sub => sub.id === submissionId);
//   }, [submissions]);

//   const getRecentSubmissions = useCallback((limit = 10) => {
//     return submissions
//       .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
//       .slice(0, limit);
//   }, [submissions]);

//   return {
//     submissions,
//     isLoading,
//     error,
//     lastUpdated,
//     updateSubmission,
//     refreshSubmissions,
//     getSubmissionsByStatus,
//     getSubmissionStats,
//     getSubmissionById,
//     getRecentSubmissions
//   };
// };

// // Export the helper functions for external use
// export { generateBountySpecificSubmissions, addSubmissionToBounty };

// useSubmissions.js - Enhanced custom React hook for submission management

import { useState, useEffect, useCallback } from 'react';
import {
  fetchUserSubmissions,
  fetchUserBounties,
  fetchBountySubmissions,
  updateSubmissionStatus,
  getSubmissionStats,
  generateMockUserSubmissions,
  generateMockBountySubmissions,
  submitVulnerabilityReport
} from '../api/submissionAPI';

// Define fixed amounts for each severity level
const SEVERITY_AMOUNTS = {
  critical: 2.0, // ETH
  high: 1.0,     // ETH
  medium: 0.5,   // ETH
  low: 0.1,      // ETH
};

// Global storage for bounty submissions to persist across component re-renders
const bountySubmissionsStore = {};

/**
 * Generate mock submissions specific to a bounty ID
 * @param {string} bountyId - The bounty ID
 * @returns {Array} Array of mock submissions for the specific bounty
 */
const generateBountySpecificSubmissions = (bountyId) => {
  // If we already have submissions for this bounty, return them
  if (bountySubmissionsStore[bountyId]) {
    return bountySubmissionsStore[bountyId];
  }

  // Generate different submissions based on bounty ID
  const submissionTemplates = {
    'bounty1': [
      {
        id: `${bountyId}_sub_1`,
        title: 'Smart Contract Reentrancy Vulnerability',
        description: 'Found a critical reentrancy vulnerability in the withdraw function that allows attackers to drain funds.',
        severity: 'critical',
        reward: '5.0 ETH',
        status: 'pending',
        submitter: '0x1234...5678',
        bountyId: bountyId,
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `${bountyId}_sub_2`,
        title: 'Integer Overflow in Token Calculation',
        description: 'Discovered an integer overflow vulnerability in the token calculation logic that could lead to incorrect balances.',
        severity: 'high',
        reward: '5.0 ETH',
        status: 'pending',
        submitter: '0x9876...4321',
        bountyId: bountyId,
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    'bounty2': [
      {
        id: `${bountyId}_sub_1`,
        title: 'XSS Vulnerability in Trading Interface',
        description: 'Found a cross-site scripting vulnerability in the trading interface that could compromise user accounts.',
        severity: 'high',
        reward: '3.5 ETH',
        status: 'pending',
        submitter: '0xabcd...efgh',
        bountyId: bountyId,
        submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `${bountyId}_sub_2`,
        title: 'SQL Injection in Order History',
        description: 'Discovered SQL injection vulnerability in the order history endpoint that allows data extraction.',
        severity: 'critical',
        reward: '3.5 ETH',
        status: 'pending',
        submitter: '0x5555...6666',
        bountyId: bountyId,
        submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `${bountyId}_sub_3`,
        title: 'CSRF Token Bypass',
        description: 'Found a way to bypass CSRF protection in the trading platform allowing unauthorized transactions.',
        severity: 'medium',
        reward: '3.5 ETH',
        status: 'pending',
        submitter: '0x7777...8888',
        bountyId: bountyId,
        submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    'bounty3': [
      {
        id: `${bountyId}_sub_1`,
        title: 'Private Key Exposure Risk',
        description: 'Identified a vulnerability where private keys could be exposed through memory dumps on rooted devices.',
        severity: 'critical',
        reward: '2.0 ETH',
        status: 'accepted',
        submitter: '0xaaaa...bbbb',
        bountyId: bountyId,
        submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        reviewedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `${bountyId}_sub_2`,
        title: 'Insecure Biometric Storage',
        description: 'Found that biometric data is stored without proper encryption, violating privacy standards.',
        severity: 'high',
        reward: '2.0 ETH',
        status: 'rejected',
        submitter: '0xcccc...dddd',
        bountyId: bountyId,
        submittedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        reviewedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        rejectionReason: 'Insufficient evidence or duplicate submission'
      }
    ],
    'bounty4': [
      {
        id: `${bountyId}_sub_1`,
        title: 'API Rate Limiting Bypass',
        description: 'Discovered a method to bypass API rate limiting that could lead to DoS attacks.',
        severity: 'medium',
        reward: '4.2 ETH',
        status: 'pending',
        submitter: '0xeeee...ffff',
        bountyId: bountyId,
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `${bountyId}_sub_2`,
        title: 'Database Connection Pool Exhaustion',
        description: 'Found a vulnerability that allows attackers to exhaust the database connection pool.',
        severity: 'high',
        reward: '4.2 ETH',
        status: 'pending',
        submitter: '0x1111...2222',
        bountyId: bountyId,
        submittedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `${bountyId}_sub_3`,
        title: 'Server-Side Request Forgery (SSRF)',
        description: 'Identified SSRF vulnerability in the image upload functionality that could access internal services.',
        severity: 'high',
        reward: '4.2 ETH',
        status: 'pending',
        submitter: '0x3333...4444',
        bountyId: bountyId,
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `${bountyId}_sub_4`,
        title: 'Insecure Direct Object Reference',
        description: 'Found IDOR vulnerability allowing users to access other users\' NFT metadata and transaction history.',
        severity: 'medium',
        reward: '4.2 ETH',
        status: 'pending',
        submitter: '0x9999...0000',
        bountyId: bountyId,
        submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  };

  // Get submissions for this bounty or return empty array if bounty doesn't exist
  const submissions = submissionTemplates[bountyId] || [];
  
  // Store in global store
  bountySubmissionsStore[bountyId] = submissions;
  
  return submissions;
};

/**
 * Add a new submission to a specific bounty
 * @param {string} bountyId - The bounty ID
 * @param {Object} submissionData - The submission data
 * @returns {Object} The new submission
 */
const addSubmissionToBounty = (bountyId, submissionData) => {
  if (!bountySubmissionsStore[bountyId]) {
    bountySubmissionsStore[bountyId] = [];
  }

  const newSubmission = {
    id: `${bountyId}_sub_${Date.now()}`,
    ...submissionData,
    bountyId: bountyId,
    status: 'pending',
    submittedAt: new Date().toISOString()
  };

  bountySubmissionsStore[bountyId].unshift(newSubmission);
  return newSubmission;
};

/**
 * Custom hook for managing user submissions with real-time updates
 * @param {string} walletAddress - User's wallet address
 * @returns {Object} Submission data and management functions
 */
export const useUserSubmissions = (walletAddress) => {
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    pendingSubmissions: 0,
    acceptedSubmissions: 0,
    rejectedSubmissions: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const calculateStats = useCallback((submissionList) => {
    const totalSubmissions = submissionList.length;
    const pendingSubmissions = submissionList.filter(s => s.status === 'pending').length;
    const acceptedSubmissions = submissionList.filter(s => s.status === 'accepted').length;
    const rejectedSubmissions = submissionList.filter(s => s.status === 'rejected').length;

    return {
      totalSubmissions,
      pendingSubmissions,
      acceptedSubmissions,
      rejectedSubmissions
    };
  }, []);

  const loadSubmissions = useCallback(async (force = false) => {
    if (!walletAddress) return;

    // Avoid unnecessary reloads unless forced
    if (!force && submissions.length > 0 && lastUpdated && Date.now() - lastUpdated < 30000) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // For development, use enhanced mock data. In production, use the actual API
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      let submissionData;
      if (isDevelopment) {
        // Use enhanced mock data for development with dynamic updates
        submissionData = generateMockUserSubmissions(walletAddress);
        
        // Simulate some submissions being updated based on time
        const now = Date.now();
        submissionData = submissionData.map(sub => {
          // Simulate status changes for demo purposes
          if (sub.status === 'pending' && Math.random() > 0.7) {
            return {
              ...sub,
              status: Math.random() > 0.5 ? 'accepted' : 'rejected',
              reviewedAt: new Date(now - Math.random() * 86400000).toISOString(),
              ...(Math.random() > 0.5 && { rejectionReason: 'Insufficient evidence or duplicate submission' })
            };
          }
          return sub;
        });
      } else {
        // Use actual API in production
        submissionData = await fetchUserSubmissions(walletAddress);
      }

      setSubmissions(submissionData);
      setStats(calculateStats(submissionData));
      setLastUpdated(Date.now());
    } catch (err) {
      setError(err.message);
      console.error('Error loading submissions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress, calculateStats, submissions.length, lastUpdated]);

  useEffect(() => {
    localStorage.removeItem('submissions');
    loadSubmissions();
  }, [loadSubmissions]);

  const refreshSubmissions = useCallback(() => {
    loadSubmissions(true);
  }, [loadSubmissions]);

  const addSubmission = useCallback(async (submissionData) => {
    try {
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      let newSubmission;
      if (isDevelopment) {
        // Create mock submission for development
        newSubmission = {
          id: `sub_${Date.now()}`,
          ...submissionData,
          status: 'pending',
          submittedAt: new Date().toISOString(),
          submitter: walletAddress
        };
        
        // Add to local state
        setSubmissions(prev => [newSubmission, ...prev]);
        setStats(prev => ({
          ...prev,
          totalSubmissions: prev.totalSubmissions + 1,
          pendingSubmissions: prev.pendingSubmissions + 1
        }));

        // Also add to the specific bounty if bountyId is provided
        if (submissionData.bountyId) {
          addSubmissionToBounty(submissionData.bountyId, submissionData);
        }
      } else {
        newSubmission = await submitVulnerabilityReport({
          ...submissionData,
          submitter: walletAddress
        });
        
        // Refresh submissions to get updated data
        refreshSubmissions();
      }
      
      return newSubmission;
    } catch (err) {
      setError(err.message);
      console.error('Error adding submission:', err);
      throw err;
    }
  }, [walletAddress, refreshSubmissions]);

  const updateSubmissionStatus = useCallback(async (submissionId, status, reason = '') => {
    try {
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      if (isDevelopment) {
        // Get the submission to be updated
        const submissionToUpdate = submissions.find(sub => sub.id === submissionId);
        if (!submissionToUpdate) {
          throw new Error('Submission not found');
        }

        // Determine the amount based on severity
        const amount = SEVERITY_AMOUNTS[submissionToUpdate.severity.toLowerCase()] || 0;

        // Update local state for development
        setSubmissions(prev => 
          prev.map(sub => 
            sub.id === submissionId 
              ? { 
                  ...sub, 
                  status,
                  ...(status === 'rejected' && reason ? { rejectionReason: reason } : {}),
                  reviewedAt: new Date().toISOString(),
                  reviewedBy: walletAddress,
                  // Add transaction details if accepted
                  ...(status === 'accepted' && {
                    transaction: {
                      address: submissionToUpdate.submitter, // Submitter's address
                      severity: submissionToUpdate.severity,
                      amount: amount,
                      timestamp: new Date().toISOString(),
                    }
                  })
                }
              : sub
          )
        );
        
        // Recalculate stats
        const updatedSubmissions = submissions.map(sub => 
          sub.id === submissionId ? { ...sub, status } : sub
        );
        setStats(calculateStats(updatedSubmissions));
      } else {
        // Use actual API in production
        await updateSubmissionStatus(submissionId, status, reason, walletAddress);
        refreshSubmissions();
      }

      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error updating submission status:', err);
      return false;
    }
  }, [submissions, calculateStats, walletAddress, refreshSubmissions]);

  const getSubmissionsByStatus = useCallback((status) => {
    if (status === 'all') return submissions;
    return submissions.filter(sub => sub.status === status);
  }, [submissions]);

  const getRecentSubmissions = useCallback((limit = 5) => {
    return submissions
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
      .slice(0, limit);
  }, [submissions]);

  return {
    submissions,
    stats,
    isLoading,
    error,
    lastUpdated,
    refreshSubmissions,
    addSubmission,
    updateSubmissionStatus,
    getSubmissionsByStatus,
    getRecentSubmissions
  };
};

/**
 * Enhanced custom hook for managing user's created bounties
 * @param {string} walletAddress - User's wallet address
 * @returns {Object} Bounty data and management functions
 */
export const useUserBounties = (walletAddress) => {
  const [bounties, setBounties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadBounties = useCallback(async (force = false) => {
    if (!walletAddress) return;

    // Avoid unnecessary reloads unless forced
    if (!force && bounties.length > 0 && lastUpdated && Date.now() - lastUpdated < 30000) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // For development, use enhanced mock data
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      let bountyData;
      if (isDevelopment) {
        // Enhanced mock bounties data with dynamic submission counts
        bountyData = [
          {
            id: 'bounty1',
            title: 'DeFi Protocol Security Audit',
            description: 'Comprehensive security audit for our DeFi protocol including smart contract vulnerabilities, economic attacks, and governance issues.',
            reward: '5.0 ETH',
            status: 'active',
            category: 'smart-contract',
            severity: 'critical',
            deadline: '2024-02-15',
            expiryDate: '2024-02-15',
            submissionCount: bountySubmissionsStore['bounty1']?.length || 0,
            createdBy: walletAddress,
            createdAt: '2024-01-01T00:00:00Z'
          },
          {
            id: 'bounty2',
            title: 'Web3 Trading Platform Bug Hunt',
            description: 'Find vulnerabilities in our decentralized trading platform including frontend, backend, and smart contract components.',
            reward: '3.5 ETH',
            status: 'active',
            category: 'web-application',
            severity: 'high',
            deadline: '2024-02-20',
            expiryDate: '2024-02-20',
            submissionCount: bountySubmissionsStore['bounty2']?.length || 0,
            createdBy: walletAddress,
            createdAt: '2024-01-05T00:00:00Z'
          },
          {
            id: 'bounty3',
            title: 'Mobile Wallet Security Review',
            description: 'Security review for our mobile wallet application focusing on key management, transaction security, and user privacy.',
            reward: '2.0 ETH',
            status: 'completed',
            category: 'mobile',
            severity: 'medium',
            deadline: '2024-01-30',
            expiryDate: '2024-01-30',
            submissionCount: bountySubmissionsStore['bounty3']?.length || 0,
            createdBy: walletAddress,
            createdAt: '2023-12-15T00:00:00Z'
          },
          {
            id: 'bounty4',
            title: 'DApp Smart Contract Audit',
            description: 'Audit of a decentralized application\'s smart contracts for security vulnerabilities and adherence to best practices.',
            reward: '4.2 ETH',
            status: 'active',
            category: 'smart-contract',
            severity: 'high',
            deadline: '2024-03-10',
            expiryDate: '2024-03-10',
            submissionCount: bountySubmissionsStore['bounty4']?.length || 0,
            createdBy: walletAddress,
            createdAt: '2024-01-10T00:00:00Z'
          },
        ];

        // Filter bounties by the current user's wallet address
        bountyData = bountyData.filter(bounty => bounty.createdBy === walletAddress);

      } else {
        // Use actual API in production
        bountyData = await fetchUserBounties(walletAddress);
      }

      setBounties(bountyData);
      setLastUpdated(Date.now());
    } catch (err) {
      setError(err.message);
      console.error('Error loading user bounties:', err);
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress, bounties.length, lastUpdated]);

  useEffect(() => {
    loadBounties();
  }, [loadBounties]);

  const refreshBounties = useCallback(() => {
    loadBounties(true);
  }, [loadBounties]);

  return {
    bounties,
    isLoading,
    error,
    lastUpdated,
    refreshBounties,
  };
};

/**
 * Custom hook for managing submissions for a specific bounty
 * @param {string} bountyId - The ID of the bounty to fetch submissions for
 * @returns {Object} Submission data and management functions for the specific bounty
 */
export const useBountySubmissions = (bountyId) => {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadSubmissions = useCallback(async (force = false) => {
    if (!bountyId) return;

    // Avoid unnecessary reloads unless forced
    if (!force && submissions.length > 0 && lastUpdated && Date.now() - lastUpdated < 30000) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const isDevelopment = process.env.NODE_ENV === 'development';
      let submissionData;

      if (isDevelopment) {
        // Use mock data for development
        submissionData = generateBountySpecificSubmissions(bountyId);
      } else {
        // Use actual API in production
        submissionData = await fetchBountySubmissions(bountyId);
      }

      setSubmissions(submissionData);
      setLastUpdated(Date.now());
    } catch (err) {
      setError(err.message);
      console.error(`Error loading submissions for bounty ${bountyId}:`, err);
    } finally {
      setIsLoading(false);
    }
  }, [bountyId, submissions.length, lastUpdated]);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  const refreshSubmissions = useCallback(() => {
    loadSubmissions(true);
  }, [loadSubmissions]);

  const getSubmissionById = useCallback((submissionId) => {
    return submissions.find(sub => sub.id === submissionId);
  }, [submissions]);

  return {
    submissions,
    isLoading,
    error,
    lastUpdated,
    refreshSubmissions,
    getSubmissionById
  };
};

