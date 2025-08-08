// submissionAPI.js - Enhanced API functions for submission management

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

/**
 * Fetch all submissions for a specific user (by wallet address)
 * @param {string} walletAddress - User's wallet address
 * @param {Object} options - Additional options (pagination, filters, etc.)
 * @returns {Promise<Array>} Array of user submissions
 */
export const fetchUserSubmissions = async (walletAddress, options = {}) => {
  try {
    const queryParams = new URLSearchParams({
      ...options,
      limit: options.limit || 50,
      offset: options.offset || 0
    });

    const response = await fetch(`${API_BASE_URL}/submissions/user/${walletAddress}?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.submissions || [];
  } catch (error) {
    console.error('Error fetching user submissions:', error);
    throw error;
  }
};

/**
 * Fetch all bounties created by a specific user
 * @param {string} walletAddress - User's wallet address
 * @param {Object} options - Additional options (pagination, filters, etc.)
 * @returns {Promise<Array>} Array of bounties created by the user
 */
export const fetchUserBounties = async (walletAddress, options = {}) => {
  try {
    const queryParams = new URLSearchParams({
      ...options,
      limit: options.limit || 20,
      offset: options.offset || 0
    });

    const response = await fetch(`${API_BASE_URL}/bounties/created-by/${walletAddress}?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.bounties || [];
  } catch (error) {
    console.error('Error fetching user bounties:', error);
    throw error;
  }
};

/**
 * Fetch all submissions for a specific bounty
 * @param {string} bountyId - Bounty ID
 * @param {Object} options - Additional options (pagination, filters, etc.)
 * @returns {Promise<Array>} Array of submissions for the bounty
 */
export const fetchBountySubmissions = async (bountyId, options = {}) => {
  try {
    const queryParams = new URLSearchParams({
      ...options,
      limit: options.limit || 100,
      offset: options.offset || 0
    });

    const response = await fetch(`${API_BASE_URL}/bounties/${bountyId}/submissions?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.submissions || [];
  } catch (error) {
    console.error('Error fetching bounty submissions:', error);
    throw error;
  }
};

/**
 * Update submission status (accept/reject)
 * @param {string} submissionId - Submission ID
 * @param {string} status - New status ('accepted' or 'rejected')
 * @param {string} reason - Reason for the status change (optional for accepted, required for rejected)
 * @param {string} reviewerAddress - Wallet address of the reviewer
 * @returns {Promise<Object>} Updated submission object
 */
export const updateSubmissionStatus = async (submissionId, status, reason = '', reviewerAddress) => {
  try {
    const response = await fetch(`${API_BASE_URL}/submissions/${submissionId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status,
        reason,
        reviewerAddress,
        reviewedAt: new Date().toISOString()
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.submission;
  } catch (error) {
    console.error('Error updating submission status:', error);
    throw error;
  }
};

/**
 * Submit a new vulnerability report
 * @param {Object} submissionData - Submission data
 * @returns {Promise<Object>} Created submission object
 */
export const submitVulnerabilityReport = async (submissionData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...submissionData,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.submission;
  } catch (error) {
    console.error('Error submitting vulnerability report:', error);
    throw error;
  }
};

/**
 * Get submission statistics for a user
 * @param {string} walletAddress - User's wallet address
 * @returns {Promise<Object>} Submission statistics
 */
export const getSubmissionStats = async (walletAddress) => {
  try {
    const response = await fetch(`${API_BASE_URL}/submissions/stats/${walletAddress}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.stats;
  } catch (error) {
    console.error('Error fetching submission stats:', error);
    throw error;
  }
};

/**
 * Get bounty statistics for a user
 * @param {string} walletAddress - User's wallet address
 * @returns {Promise<Object>} Bounty statistics
 */
export const getBountyStats = async (walletAddress) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bounties/stats/${walletAddress}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.stats;
  } catch (error) {
    console.error('Error fetching bounty stats:', error);
    throw error;
  }
};

/**
 * Bulk update multiple submissions
 * @param {Array} updates - Array of update objects {submissionId, status, reason}
 * @param {string} reviewerAddress - Wallet address of the reviewer
 * @returns {Promise<Array>} Array of updated submission objects
 */
export const bulkUpdateSubmissions = async (updates, reviewerAddress) => {
  try {
    const response = await fetch(`${API_BASE_URL}/submissions/bulk-update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        updates,
        reviewerAddress,
        reviewedAt: new Date().toISOString()
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.submissions;
  } catch (error) {
    console.error('Error bulk updating submissions:', error);
    throw error;
  }
};

/**
 * Get submission details by ID
 * @param {string} submissionId - Submission ID
 * @returns {Promise<Object>} Submission details
 */
export const getSubmissionDetails = async (submissionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/submissions/${submissionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.submission;
  } catch (error) {
    console.error('Error fetching submission details:', error);
    throw error;
  }
};

// Enhanced mock data generators for development/testing
export const generateMockUserSubmissions = (walletAddress, count = 15) => {
  const statuses = ['pending', 'accepted', 'rejected'];
  const severities = ['low', 'medium', 'high', 'critical'];
  const titles = [
    'SQL Injection in User Authentication',
    'Cross-Site Scripting (XSS) in Dashboard',
    'Authentication Bypass via JWT Manipulation',
    'CSRF Token Validation Bypass',
    'Smart Contract Reentrancy Vulnerability',
    'Privilege Escalation in Admin Panel',
    'Sensitive Data Exposure in API Response',
    'Input Validation Bypass in File Upload',
    'Race Condition in Payment Processing',
    'Insecure Direct Object Reference',
    'Server-Side Request Forgery (SSRF)',
    'XML External Entity (XXE) Injection',
    'Insecure Cryptographic Storage',
    'Business Logic Flaw in Reward System',
    'Time-based SQL Injection in Search'
  ];

  const bountyTitles = [
    'DeFi Protocol Security Audit',
    'Web3 Trading Platform Bug Hunt',
    'Mobile Wallet Security Review',
    'NFT Marketplace Infrastructure Audit',
    'Smart Contract Governance Review'
  ];
  
  return Array.from({ length: count }, (_, index) => {
    const status = statuses[index % statuses.length];
    const submittedDate = new Date(Date.now() - (index * 24 * 60 * 60 * 1000 * Math.random()));
    
    return {
      id: `sub_${walletAddress.slice(-6)}_${index + 1}`,
      title: titles[index % titles.length],
      description: `Detailed description of the ${titles[index % titles.length].toLowerCase()} vulnerability found in the system. This includes technical analysis, proof of concept, and recommended remediation steps.`,
      bountyId: `bounty_${(index % 5) + 1}`,
      bountyTitle: bountyTitles[index % bountyTitles.length],
      status: status,
      severity: severities[index % severities.length],
      submitter: walletAddress,
      submittedAt: submittedDate.toISOString(),
      reward: `${(Math.random() * 4 + 0.5).toFixed(1)} ETH`,
      ...(status === 'rejected' && {
        rejectionReason: 'Insufficient evidence provided or duplicate submission. Please provide more detailed proof of concept and impact analysis.'
      }),
      ...(status !== 'pending' && {
        reviewedAt: new Date(submittedDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        reviewedBy: '0x' + Math.random().toString(16).substr(2, 40)
      })
    };
  });
};

export const generateMockBountySubmissions = (bountyId, count = 12) => {
  const statuses = ['pending', 'accepted', 'rejected'];
  const severities = ['low', 'medium', 'high', 'critical'];
  const submitters = [
    { address: '0x1234567890123456789012345678901234567890', name: 'SecurityExpert1' },
    { address: '0x2345678901234567890123456789012345678901', name: 'BugHunter2' },
    { address: '0x3456789012345678901234567890123456789012', name: 'WhiteHat3' },
    { address: '0x4567890123456789012345678901234567890123', name: 'EthicalHacker4' },
    { address: '0x5678901234567890123456789012345678901234', name: 'CyberSec5' },
    { address: '0x6789012345678901234567890123456789012345', name: 'VulnResearcher6' }
  ];

  const vulnerabilityTypes = [
    'SQL Injection Vulnerability',
    'Cross-Site Scripting (XSS)',
    'Authentication Bypass',
    'Privilege Escalation',
    'Smart Contract Reentrancy',
    'CSRF Token Bypass',
    'Insecure Direct Object Reference',
    'Server-Side Request Forgery',
    'XML External Entity Injection',
    'Business Logic Flaw',
    'Cryptographic Weakness',
    'Race Condition Vulnerability'
  ];
  
  return Array.from({ length: count }, (_, index) => {
    const submitter = submitters[index % submitters.length];
    const status = statuses[index % statuses.length];
    const submittedDate = new Date(Date.now() - (index * 8 * 60 * 60 * 1000));
    
    return {
      id: `sub_${bountyId}_${index + 1}`,
      title: vulnerabilityTypes[index % vulnerabilityTypes.length],
      description: `Comprehensive vulnerability report detailing the ${vulnerabilityTypes[index % vulnerabilityTypes.length].toLowerCase()} found in the system. This includes detailed technical analysis, step-by-step reproduction instructions, potential impact assessment, and recommended security fixes to address the vulnerability.`,
      bountyId,
      status,
      severity: severities[index % severities.length],
      submitter: submitter.address,
      submitterName: submitter.name,
      submittedAt: submittedDate.toISOString(),
      reward: `${(Math.random() * 3 + 1).toFixed(1)} ETH`,
      ...(status === 'rejected' && {
        rejectionReason: 'Insufficient evidence provided, duplicate submission, or the reported issue does not meet the severity criteria. Please provide more detailed proof of concept and impact analysis for future submissions.'
      }),
      ...(status !== 'pending' && {
        reviewedAt: new Date(submittedDate.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString(),
        reviewedBy: '0x' + Math.random().toString(16).substr(2, 40)
      })
    };
  });
};

/**
 * Generate mock bounty data for development
 * @param {string} walletAddress - Creator's wallet address
 * @param {number} count - Number of bounties to generate
 * @returns {Array} Array of mock bounty objects
 */
export const generateMockUserBounties = (walletAddress, count = 4) => {
  const statuses = ['active', 'completed', 'expired'];
  const categories = ['smart-contract', 'web-application', 'mobile', 'infrastructure'];
  const severities = ['low', 'medium', 'high', 'critical'];
  
  const bountyTemplates = [
    {
      title: 'DeFi Protocol Security Audit',
      description: 'Comprehensive security audit for our DeFi protocol including smart contract vulnerabilities, economic attacks, and governance issues.',
      category: 'smart-contract',
      severity: 'critical'
    },
    {
      title: 'Web3 Trading Platform Bug Hunt',
      description: 'Find vulnerabilities in our decentralized trading platform including frontend, backend, and smart contract components.',
      category: 'web-application',
      severity: 'high'
    },
    {
      title: 'Mobile Wallet Security Review',
      description: 'Security review for our mobile wallet application focusing on key management, transaction security, and user privacy.',
      category: 'mobile',
      severity: 'medium'
    },
    {
      title: 'NFT Marketplace Infrastructure Audit',
      description: 'Infrastructure security audit for our NFT marketplace including API security, database protection, and server hardening.',
      category: 'infrastructure',
      severity: 'high'
    }
  ];

  return Array.from({ length: count }, (_, index) => {
    const template = bountyTemplates[index % bountyTemplates.length];
    const createdDate = new Date(Date.now() - (index * 10 * 24 * 60 * 60 * 1000));
    const deadlineDate = new Date(createdDate.getTime() + (30 + Math.random() * 60) * 24 * 60 * 60 * 1000);
    
    return {
      id: `bounty_${walletAddress.slice(-6)}_${index + 1}`,
      title: template.title,
      description: template.description,
      reward: `${(Math.random() * 4 + 1).toFixed(1)} ETH`,
      status: statuses[index % statuses.length],
      category: template.category,
      severity: template.severity,
      deadline: deadlineDate.toISOString().split('T')[0],
      submissionCount: Math.floor(Math.random() * 25) + 5,
      createdBy: walletAddress,
      createdAt: createdDate.toISOString(),
      company: `Company ${index + 1}`,
      submissions: Math.floor(Math.random() * 20) + 3
    };
  });
};

/**
 * Simulate real-time submission updates for development
 * @param {Array} submissions - Current submissions array
 * @returns {Array} Updated submissions array
 */
export const simulateSubmissionUpdates = (submissions) => {
  return submissions.map(submission => {
    // Randomly update some pending submissions
    if (submission.status === 'pending' && Math.random() > 0.9) {
      const newStatus = Math.random() > 0.6 ? 'accepted' : 'rejected';
      return {
        ...submission,
        status: newStatus,
        reviewedAt: new Date().toISOString(),
        reviewedBy: '0x' + Math.random().toString(16).substr(2, 40),
        ...(newStatus === 'rejected' && {
          rejectionReason: 'Automated review: Insufficient evidence or duplicate submission.'
        })
      };
    }
    return submission;
  });
};

/**
 * Mock API delay simulation
 * @param {number} ms - Delay in milliseconds
 * @returns {Promise} Promise that resolves after the delay
 */
export const mockApiDelay = (ms = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Add this to your existing submissionAPI.js
export const recordTransaction = async (transactionData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.transaction;
  } catch (error) {
    console.error('Error recording transaction:', error);
    throw error;
  }
};

// Add mock implementation for development
export const generateMockTransaction = (transactionData) => {
  return {
    ...transactionData,
    id: `txn_${Date.now()}`,
    timestamp: new Date().toISOString(),
    explorerUrl: `https://etherscan.io/tx/0x${Math.random().toString(16).substr(2, 64)}`
  };
};