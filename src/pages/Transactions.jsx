

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Coins, Wallet, CheckCircle, ArrowLeft, Clock, TrendingUp, Activity, AlertCircle, Copy, ExternalLink } from 'lucide-react';


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
    if (bountyId && bountyId.includes('bounty_user_1')) {
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
    } else if (bountyId && bountyId.includes('bounty_user_2')) {
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

const Transactions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Robust state extraction with fallbacks
  const state = location.state || {};
  const bounty = state.bounty || null;
  const initialTransactions = state.transactions || [];
  
  const [transactions, setTransactions] = useState(initialTransactions);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [error, setError] = useState(null);

  // Simulate current user address
  const currentUserAddress = '0xUserAddress123';
  const isMyBounty = bounty?.createdBy === currentUserAddress;

  // If no bounty data is passed, try to create a fallback from URL params or localStorage
  useEffect(() => {
    if (!bounty) {
      // Try to get bounty data from localStorage or URL params as fallback
      const urlParams = new URLSearchParams(location.search);
      const bountyId = urlParams.get('bountyId');
      
      if (bountyId) {
        // Create a minimal bounty object for demonstration
        const fallbackBounty = {
          id: bountyId,
          title: `Bounty ${bountyId}`,
          status: 'active',
          company: 'Unknown',
          reward: '5.0 ETH',
          createdBy: bountyId.includes('user') ? currentUserAddress : 'other',
          totalPool: 5.0,
          transactedPool: 0,
          remainingPool: 5.0
        };
        
        // Set fallback transactions
        const fallbackTransactions = mockTransactions[bountyId] || [];
        setTransactions(fallbackTransactions);
        
        // Update the state to include the fallback bounty
        location.state = {
          bounty: fallbackBounty,
          transactions: fallbackTransactions
        };
      }
    }
  }, [bounty, location, currentUserAddress]);

  useEffect(() => {
    if (!bounty) return;

    const loadRealTimeTransactions = async () => {
      if (isMyBounty) {
        setIsLoading(true);
        setError(null);
        try {
          const dynamicTxs = await getDynamicTransactions(bounty.id);
          setTransactions(dynamicTxs);
          setLastUpdated(new Date());
        } catch (error) {
          console.error('Error loading real-time transactions:', error);
          setError('Failed to load real-time transactions');
        } finally {
          setIsLoading(false);
        }
      }
    };

    // Only load real-time transactions if it's my bounty and initial transactions are not already loaded
    if (isMyBounty && initialTransactions.length === 0) {
      loadRealTimeTransactions();
    }

    // Set up real-time updates for user's bounties
    if (isMyBounty) {
      const interval = setInterval(loadRealTimeTransactions, 30000);
      return () => clearInterval(interval);
    }
  }, [bounty, isMyBounty, initialTransactions]);

  const copyToClipboard = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  const formatAddress = (address) => {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getSeverityColor = (severity) => {
    if (!severity) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'high':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'low':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  // If no bounty data is available at all, show error
  if (!bounty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10 text-center">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <p className="text-red-400 text-lg font-semibold mb-4">No bounty data found</p>
            <p className="text-gray-300 text-sm mb-4">
              Please navigate to this page from the bounties list by clicking "View Transactions"
            </p>
            <button
              onClick={() => navigate('/payouts')}
              className="inline-flex items-center space-x-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 rounded-lg px-4 py-2 text-blue-400 hover:text-blue-300 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Go to Payouts</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Extract values with robust fallbacks
  const totalPool = bounty.totalPool || parseFloat(bounty.reward?.replace(/[^\d.]/g, '') || '0') || 0;
  const transactedPool = bounty.transactedPool || transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
  const remainingPool = bounty.remainingPool || Math.max(0, totalPool - transactedPool);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg px-4 py-2 text-white hover:text-blue-300 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Payouts</span>
          </button>

          {isMyBounty && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
                <Activity className="h-4 w-4 text-green-400" />
                <span className="text-green-400 text-sm font-medium">Real-time Updates</span>
              </div>
              <div className="text-gray-300 text-sm">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <span className="text-red-400">{error}</span>
            </div>
          </div>
        )}

        {/* Bounty Info */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{bounty.title || 'Unknown Bounty'}</h1>
                {isMyBounty && (
                  <span className="bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1 text-green-400 text-sm font-medium">
                    My Bounty
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-gray-300">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  bounty.status === 'active' 
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                    : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                }`}>
                  {bounty.status || 'unknown'}
                </span>
                <span className="text-sm">Bounty ID: {bounty.id || 'N/A'}</span>
                <span className="text-sm">Company: {bounty.company || 'Unknown'}</span>
              </div>
            </div>
            
            <div className="mt-4 lg:mt-0 flex items-center space-x-2 text-gray-300">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} processed
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Coins className="h-8 w-8 text-blue-400" />
              </div>
              <div>
                <p className="text-blue-300 text-sm font-medium">Total Prize Pool</p>
                <p className="text-3xl font-bold text-blue-400">{totalPool.toFixed(2)} ETH</p>
                <p className="text-blue-300 text-xs">Initial bounty amount</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-lg rounded-xl p-6 border border-green-500/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Wallet className="h-8 w-8 text-green-400" />
              </div>
              <div>
                <p className="text-green-300 text-sm font-medium">Remaining Pool</p>
                <p className="text-3xl font-bold text-green-400">{remainingPool.toFixed(2)} ETH</p>
                <p className="text-green-300 text-xs">
                  {totalPool > 0 ? ((remainingPool / totalPool) * 100).toFixed(1) : 0}% remaining
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <TrendingUp className="h-8 w-8 text-purple-400" />
              </div>
              <div>
                <p className="text-purple-300 text-sm font-medium">Transacted Pool</p>
                <p className="text-3xl font-bold text-purple-400">{transactedPool.toFixed(2)} ETH</p>
                <p className="text-purple-300 text-xs">
                  {totalPool > 0 ? ((transactedPool / totalPool) * 100).toFixed(1) : 0}% distributed
                </p>
              </div>
            </div>
          </div>
        </div>

    

        {/* Transactions Table */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold text-white">Transaction History</h2>
              {isLoading && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
              )}
              {isMyBounty && !isLoading && (
                <span className="bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1 text-green-400 text-sm font-medium">
                  Live Data
                </span>
              )}
            </div>
            <div className="text-gray-300 text-sm">
              Total: {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-300 font-medium">Contract Address</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-medium">Severity</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-medium">Amount Transferred</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && transactions.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center">
                      <div className="flex items-center justify-center space-x-2 text-gray-400">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
                        <span>Loading transactions...</span>
                      </div>
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center">
                      <div className="text-gray-400">
                        <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="text-lg font-medium">No transactions yet</p>
                        <p className="text-sm">Transactions will appear here once vulnerabilities are accepted and paid out.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx, index) => (
                    <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <span className="font-mono text-gray-300">{formatAddress(tx.address)}</span>
                          <button
                            onClick={() => copyToClipboard(tx.address)}
                            className="p-1 hover:bg-white/10 rounded transition-colors duration-200"
                            title="Copy full address"
                          >
                            <Copy className="h-4 w-4 text-gray-400 hover:text-white" />
                          </button>
                          <button
                            onClick={() => window.open(`https://etherscan.io/address/${tx.address}`, '_blank')}
                            className="p-1 hover:bg-white/10 rounded transition-colors duration-200"
                            title="View on Etherscan"
                          >
                            <ExternalLink className="h-4 w-4 text-gray-400 hover:text-white" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(tx.severity)}`}>
                          {tx.severity || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-semibold text-white">{(tx.amount || 0).toFixed(2)} ETH</span>
                          <span className="text-gray-400 text-sm">
                            (~${((tx.amount || 0) * 2000).toLocaleString()})
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="bg-green-500/10 border border-green-500/20 rounded-full px-2 py-1 text-green-400 text-xs font-medium">
                            Completed
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transaction Summary */}
        {transactions.length > 0 && (
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Transaction Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">{transactions.length}</p>
                <p className="text-gray-300 text-sm">Total Transactions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-400">
                  {transactions.filter(tx => tx.severity?.toLowerCase() === 'critical').length}
                </p>
                <p className="text-gray-300 text-sm">Critical Issues</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-400">
                  {transactions.filter(tx => tx.severity?.toLowerCase() === 'high').length}
                </p>
                <p className="text-gray-300 text-sm">High Severity</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">
                  {transactions.length > 0 ? (transactedPool / transactions.length).toFixed(2) : 0} ETH
                </p>
                <p className="text-gray-300 text-sm">Average Payout</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;

