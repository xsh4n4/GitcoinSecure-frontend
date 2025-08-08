
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Shield, Zap, Lock, CheckCircle, ArrowRight, Code, Coins, Users, Clock, AlertTriangle, Eye } from 'lucide-react';
// import { useAccount } from 'wagmi'; // Add this import
// import AnimatedCard from '../components/AnimatedCard';
// import AnimatedCounter from '../components/AnimatedCounter';
// import ProgressBar from '../components/ProgressBar';
// import { useBounties } from '../hooks/useBounties';

// const Payouts = () => {
//   const navigate = useNavigate();
//   const { address: currentUserAddress } = useAccount(); // Replace hardcoded address with wagmi hook

//   const { 
//     bounties, 
//     isLoading: bountiesLoading, 
//     error: bountiesError,
//     getUserBounties,
//     getOtherBounties,
//     getBountyStats,
//     getBountyTransactions
//   } = useBounties(currentUserAddress);

//   // State for real-time updates
//   const [lastUpdate, setLastUpdate] = useState(new Date());

//   // Set up real-time updates for user's bounties
//   useEffect(() => {
//     const interval = setInterval(() => {
//       // Trigger a re-render to show updated transaction data
//       setLastUpdate(new Date());
//     }, 30000); // Update every 30 seconds

//     return () => clearInterval(interval);
//   }, []);

//   const handleViewTransactions = async (bounty) => {
//     // Get the latest transaction data and stats
//     const transactions = getBountyTransactions(bounty.id);
//     const stats = getBountyStats(bounty.id);

//     navigate('/transactions', {
//       state: {
//         bounty: {
//           ...bounty,
//           ...stats
//         },
//         transactions: transactions
//       }
//     });
//   };

//   const isMyBounty = (bounty) => {
//     return bounty.createdBy === currentUserAddress;
//   };

//   const payoutSteps = [
//     {
//       step: '1',
//       title: 'Vulnerability Submission',
//       description: 'Security researcher submits a detailed vulnerability report through our platform',
//       icon: Shield,
//       color: 'from-blue-500 to-blue-600'
//     },
//     {
//       step: '2',
//       title: 'Automated Validation',
//       description: 'Smart contract validates submission requirements and locks bounty funds in escrow',
//       icon: CheckCircle,
//       color: 'from-green-500 to-green-600'
//     },
//     {
//       step: '3',
//       title: 'Review Process',
//       description: 'Project team reviews the submission and confirms the vulnerability severity',
//       icon: Users,
//       color: 'from-purple-500 to-purple-600'
//     },
//     {
//       step: '4',
//       title: 'Instant Payout',
//       description: 'Upon approval, smart contract automatically releases payment to researcher\'s wallet',
//       icon: Zap,
//       color: 'from-yellow-500 to-yellow-600'
//     }
//   ];

//   const payoutStats = [
//     { label: 'Total Paid Out', value: '2847.5', suffix: ' ETH', color: 'text-green-400' },
//     { label: 'Average Payout Time', value: '2.3', suffix: ' minutes', color: 'text-blue-400' },
//     { label: 'Success Rate', value: '99.8', suffix: '%', color: 'text-purple-400' },
//     { label: 'Gas Fees Saved', value: '156.2', suffix: ' ETH', color: 'text-yellow-400' }
//   ];

//   if (bountiesLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
//           <p className="text-white text-lg">Loading bounties...</p>
//         </div>
//       </div>
//     );
//   }

//   if (bountiesError) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
//         <div className="text-center">
//           <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
//           <p className="text-red-400 text-lg">Error loading bounties: {bountiesError}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="py-12 px-4 sm:px-6 lg:px-8 space-y-16 max-w-7xl mx-auto relative overflow-hidden">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500/3 rounded-full animate-pulse"></div>
//         <div className="absolute bottom-40 left-20 w-48 h-48 bg-purple-500/3 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
//         <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-green-500/3 rounded-full animate-pulse" style={{ animationDelay: '4s' }}></div>
//       </div>

//       {/* Hero Section */}
//       <section className="text-center space-y-8 relative z-10">
//         <AnimatedCard delay={200}>
//           <div className="space-y-6">
//             <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-6 py-2">
//               <Coins className="h-5 w-5 text-blue-400" />
//               <span className="text-blue-400 font-medium">Smart Contract Bounties</span>
//             </div>

//             <h1 className="text-4xl md:text-6xl font-bold text-white">
//               Automated <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">Payouts</span>
//             </h1>

//             <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
//               Experience the future of bug bounty payments with our Ethereum-powered smart contracts. 
//               Secure, instant, and transparent payouts guaranteed by blockchain technology.
//             </p>
//           </div>
//         </AnimatedCard>

//         {/* Stats */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
//           {payoutStats.map((stat, index) => (
//             <AnimatedCard key={index} delay={600 + index * 100} hover={false}>
//               <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 text-center h-full">
//                 <div className={`text-2xl md:text-3xl font-bold ${stat.color} mb-2`}>
//                   <AnimatedCounter 
//                     end={stat.value} 
//                     suffix={stat.suffix}
//                     duration={2500}
//                     decimals={stat.value.includes(".") ? 1 : 0}
//                   />
//                 </div>
//                 <div className="text-gray-300 text-sm font-medium">{stat.label}</div>
//               </div>
//             </AnimatedCard>
//           ))}
//         </div>
//       </section>

//       {/* Bounties Section */}
//       <section className="space-y-12">
//         <AnimatedCard delay={1000} className="text-center">
//           <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Active Bounties</h2>
//           <p className="text-gray-300 max-w-2xl mx-auto">
//             View and manage your bounty payouts. Track transactions and monitor pool distributions in real-time.
//           </p>
//         </AnimatedCard>

//         <div className="grid gap-8">
//           {bounties.map((bounty, index) => {
//             const myBounty = isMyBounty(bounty);
//             const stats = getBountyStats(bounty.id);
//             const transactions = getBountyTransactions(bounty.id);

//             return (
//               <AnimatedCard key={bounty.id} delay={1400 + index * 200} className="group">
//                 <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-blue-400/50 transition-all duration-300 h-full">
//                   {/* Bounty Header */}
//                   <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
//                     <div className="flex-1">
//                       <div className="flex items-center gap-3 mb-2 flex-wrap">
//                         <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">
//                           {bounty.title}
//                         </h3>
//                         {myBounty && (
//                           <span className="bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1 text-green-400 text-sm font-medium">
//                             Your Bounty
//                           </span>
//                         )}
//                       </div>
//                       <div className="flex items-center gap-4 text-sm text-gray-300 flex-wrap">
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                           bounty.status === 'active' 
//                             ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
//                             : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
//                         }`}>
//                           {bounty.status}
//                         </span>
//                         <span>Company: {bounty.company}</span>
//                         <span>Submissions: {bounty.submissions}</span>
//                         <span>Transactions: {transactions.length}</span>
//                       </div>
//                     </div>

//                     <button
//                       onClick={() => handleViewTransactions(bounty)}
//                       className="inline-flex items-center space-x-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 rounded-lg px-4 py-2 text-blue-400 hover:text-blue-300 transition-all duration-300"
//                     >
//                       <Eye className="h-4 w-4" />
//                       <span>View Transactions</span>
//                       <ArrowRight className="h-4 w-4" />
//                     </button>
//                   </div>

//                   {/* Progress Bar */}
//                   <div className="mb-4">
//                     <div className="flex justify-between text-sm text-gray-300 mb-2">
//                       <span>Pool Distribution</span>
//                       <span>{stats.totalPool > 0 ? ((stats.transactedPool / stats.totalPool) * 100).toFixed(1) : 0}% distributed</span>
//                     </div>
//                     <div className="w-full bg-gray-700 rounded-full h-2">
//                       <div 
//                         className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-500"
//                         style={{ 
//                           width: `${stats.totalPool > 0 ? (stats.transactedPool / stats.totalPool) * 100 : 0}%` 
//                         }}
//                       ></div>
//                     </div>
//                   </div>
//                 </div>
//               </AnimatedCard>
//             );
//           })}
//         </div>
//       </section>




//       {/* Smart Contract Code Example */}
//       <section className="space-y-8">
//         <AnimatedCard delay={3600} className="text-center">
//           <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Smart Contract Logic</h2>
//           <p className="text-gray-300 max-w-2xl mx-auto">
//             Here's a simplified view of how our bounty smart contract handles automated payouts.
//           </p>
//         </AnimatedCard>

//         <AnimatedCard delay={4000}>
//           <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-6 py-4 border-b border-white/10">
//               <div className="flex items-center space-x-2">
//                 <Code className="h-5 w-5 text-blue-400" />
//                 <span className="text-white font-medium">BountyPayout.sol</span>
//               </div>
//             </div>

//             <div className="p-6">
//               <pre className="text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap">
//                 <code>{`pragma solidity ^0.8.0;

// contract BountyPayout {
//     struct Bounty {
//         address creator;
//         uint256 reward;
//         bool isActive;
//         bool isPaid;
//     }

//     mapping(uint256 => Bounty) public bounties;

//     event ReportSubmitted(uint256 bountyId, address researcher, string report);
//     event PayoutExecuted(uint256 bountyId, address researcher, uint256 amount);

//     modifier onlyBountyCreator(uint256 bountyId) {
//         require(msg.sender == bounties[bountyId].creator, "Not bounty creator");
//         _;
//     }

//     function submitReport(uint256 bountyId, string memory report) external {
//         require(bounties[bountyId].isActive, "Bounty not active");
//         // Store report and trigger review process
//         emit ReportSubmitted(bountyId, msg.sender, report);
//     }

//     function approvePayout(uint256 bountyId, address researcher)
//         external
//         onlyBountyCreator(bountyId)
//     {
//         Bounty storage bounty = bounties[bountyId];
//         require(!bounty.isPaid, "Already paid");

//         // Automatic payout execution
//         bounty.isPaid = true;
//         payable(researcher).transfer(bounty.reward);

//         emit PayoutExecuted(bountyId, researcher, bounty.reward);
//     }
// }`}</code>
//               </pre>
//             </div>
//           </div>
//         </AnimatedCard>
//       </section>

//       {/* Security & Trust */}
//       <section className="space-y-8">
//         <AnimatedCard delay={4400} className="text-center">
//           <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Security & Trust</h2>
//           <p className="text-gray-300 max-w-2xl mx-auto">
//             Our smart contracts are audited, tested, and designed with security as the top priority.
//           </p>
//         </AnimatedCard>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {[
//             {
//               icon: Shield,
//               title: 'Audited Contracts',
//               description: 'All smart contracts are professionally audited by leading security firms',
//               metric: '100%',
//               metricLabel: 'Security Score'
//             },
//             {
//               icon: Lock,
//               title: 'Multi-Sig Protection',
//               description: 'Critical functions require multiple signatures for enhanced security',
//               metric: '3/5',
//               metricLabel: 'Required Signatures'
//             },
//             {
//               icon: Clock,
//               title: 'Time-Lock Delays',
//               description: 'Important changes have mandatory waiting periods for transparency',
//               metric: '48h',
//               metricLabel: 'Minimum Delay'
//             }
//           ].map((item, index) => (
//             <AnimatedCard key={index} delay={4800 + index * 200} className="group h-full">
//               <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-green-400/50 transition-all duration-300 text-center h-full flex flex-col">
//                 <div className="p-4 bg-green-500/10 rounded-full w-fit mx-auto mb-4 transform group-hover:scale-110 transition-transform duration-300">
//                   <item.icon className="h-8 w-8 text-green-400" />
//                 </div>

//                 <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-400 transition-colors duration-300">
//                   {item.title}
//                 </h3>

//                 <p className="text-gray-300 text-sm mb-4 leading-relaxed flex-grow">{item.description}</p>

//                 <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
//                   <div className="text-2xl font-bold text-green-400">{item.metric}</div>
//                   <div className="text-green-300 text-xs">{item.metricLabel}</div>
//                 </div>
//               </div>
//             </AnimatedCard>
//           ))}
//         </div>
//       </section>

//       {/* Gas Optimization */}
//       <section className="space-y-8">
//         <AnimatedCard delay={5600}>
//           <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-lg rounded-xl p-8 border border-yellow-500/20">
//             <div className="text-center space-y-6">
//               <div className="inline-flex items-center space-x-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-2">
//                 <Zap className="h-5 w-5 text-yellow-400" />
//                 <span className="text-yellow-400 font-medium">Gas Optimized</span>
//               </div>

//               <h2 className="text-3xl font-bold text-white">Minimal Gas Fees</h2>

//               <p className="text-gray-300 max-w-2xl mx-auto">
//                 Our smart contracts are optimized for minimal gas consumption, ensuring cost-effective transactions for all users.
//               </p>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
//                 {[
//                   { label: 'Bounty Creation', cost: '~$2.50', savings: '60%' },
//                   { label: 'Report Submission', cost: '~$1.20', savings: '45%' },
//                   { label: 'Payout Execution', cost: '~$0.80', savings: '70%' }
//                 ].map((item, index) => (
//                   <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
//                     <div className="text-yellow-400 font-medium text-sm">{item.label}</div>
//                     <div className="text-white text-xl font-bold">{item.cost}</div>
//                     <div className="text-green-400 text-sm">↓ {item.savings} saved</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </AnimatedCard>
//       </section>

//       {/* Call to Action */}
//       <section className="space-y-8">
//         <AnimatedCard delay={6000}>
//           <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-lg rounded-xl p-12 border border-blue-500/20 text-center">
//             <div className="space-y-6">
//               <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2">
//                 <AlertTriangle className="h-5 w-5 text-blue-400" />
//                 <span className="text-blue-400 font-medium">Ready to Get Started?</span>
//               </div>

//               <h2 className="text-3xl md:text-4xl font-bold text-white">
//                 Start Earning with Smart Contract Bounties
//               </h2>

//               <p className="text-gray-300 max-w-2xl mx-auto text-lg">
//                 Join thousands of security researchers who trust our platform for fast, secure, and transparent bug bounty payments.
//               </p>

//             </div>
//           </div>
//         </AnimatedCard>
//       </section>
//     </div>
//   );
// };

// export default Payouts;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Zap, Lock, CheckCircle, ArrowRight, Code, Coins,
  Users, Clock, AlertTriangle, Eye, Search, Filter, ChevronDown, ChevronUp
} from 'lucide-react';
import { useAccount } from 'wagmi';
import AnimatedCard from '../components/AnimatedCard';
import AnimatedCounter from '../components/AnimatedCounter';
import ProgressBar from '../components/ProgressBar';
import { useBounties } from '../hooks/useBounties';

const Payouts = () => {
  const navigate = useNavigate();
  const { address: currentUserAddress } = useAccount();
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyMyBounties, setShowOnlyMyBounties] = useState(false);
  const [showAllBounties, setShowAllBounties] = useState(false);

  const {
    bounties,
    isLoading: bountiesLoading,
    error: bountiesError,
    getUserBounties,
    getOtherBounties,
    getBountyStats,
    getBountyTransactions
  } = useBounties(currentUserAddress);

  // Set up real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredBounties = bounties.filter(bounty => {
    const matchesSearch =
      bounty.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bounty.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bounty.company.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMyBounties = !showOnlyMyBounties || bounty.createdBy === currentUserAddress;
    return matchesSearch && matchesMyBounties;
  });

  const isMyBounty = (bounty) => {
    return bounty.createdBy === currentUserAddress;
  };

  const handleViewTransactions = async (bounty) => {
    const transactions = getBountyTransactions(bounty.id);
    const stats = getBountyStats(bounty.id);
    navigate('/transactions', {
      state: {
        bounty: { ...bounty, ...stats },
        transactions: transactions
      }
    });
  };

  // Static data arrays remain the same as your original
  const payoutSteps = [{
    step: '1',
    title: 'Vulnerability Submission',
    description: 'Security researcher submits a detailed vulnerability report through our platform',
    icon: Shield,
    color: 'from-blue-500 to-blue-600'
  },
  {
    step: '2',
    title: 'Automated Validation',
    description: 'Smart contract validates submission requirements and locks bounty funds in escrow',
    icon: CheckCircle,
    color: 'from-green-500 to-green-600'
  },
  {
    step: '3',
    title: 'Review Process',
    description: 'Project team reviews the submission and confirms the vulnerability severity',
    icon: Users,
    color: 'from-purple-500 to-purple-600'
  },
  {
    step: '4',
    title: 'Instant Payout',
    description: 'Upon approval, smart contract automatically releases payment to researcher\'s wallet',
    icon: Zap,
    color: 'from-yellow-500 to-yellow-600'
  }
  ];
  const payoutStats = [
    { label: 'Total Paid Out', value: '2847.5', suffix: ' ETH', color: 'text-green-400' },
    { label: 'Average Payout Time', value: '2.3', suffix: ' minutes', color: 'text-blue-400' },
    { label: 'Success Rate', value: '99.8', suffix: '%', color: 'text-purple-400' },
    { label: 'Gas Fees Saved', value: '156.2', suffix: ' ETH', color: 'text-yellow-400' }
  ];

  if (bountiesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading bounties...</p>
        </div>
      </div>
    );
  }

  if (bountiesError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 text-lg">Error loading bounties: {bountiesError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 space-y-16 max-w-7xl mx-auto relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500/3 rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-48 h-48 bg-purple-500/3 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-green-500/3 rounded-full animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="text-center space-y-8 relative z-10">
        <AnimatedCard delay={200}>
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-6 py-2">
              <Coins className="h-5 w-5 text-blue-400" />
              <span className="text-blue-400 font-medium">Smart Contract Bounties</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Automated <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">Payouts</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Experience the future of bug bounty payments with our Ethereum-powered smart contracts.
              Secure, instant, and transparent payouts guaranteed by blockchain technology.
            </p>
          </div>
        </AnimatedCard>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {payoutStats.map((stat, index) => (
            <AnimatedCard key={index} delay={600 + index * 100} hover={false}>
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 text-center h-full">
                <div className={`text-2xl md:text-3xl font-bold ${stat.color} mb-2`}>
                  <AnimatedCounter
                    end={stat.value}
                    suffix={stat.suffix}
                    duration={2500}
                    decimals={stat.value.includes(".") ? 1 : 0}
                  />
                </div>
                <div className="text-gray-300 text-sm font-medium">{stat.label}</div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* Bounties Section */}
      <section className="space-y-12">
        <AnimatedCard delay={1000} className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Active Bounties</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-6">
            View and manage your bounty payouts. Track transactions and monitor pool distributions in real-time.
          </p>

          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
            {/* Search Bar */}
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search bounties..."
                className="block w-full pl-10 pr-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* My Bounties Toggle */}
            <button
              onClick={() => setShowOnlyMyBounties(!showOnlyMyBounties)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${showOnlyMyBounties
                  ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                  : 'bg-white/5 border-white/20 text-gray-300 hover:border-white/40'
                }`}
            >
              <Filter className="h-5 w-5" />
              <span>{showOnlyMyBounties ? 'Showing My Bounties' : 'Filter My Bounties'}</span>
            </button>
          </div>
        </AnimatedCard>

        <div className="grid gap-8">
          {filteredBounties
            .slice(0, showAllBounties ? filteredBounties.length : 3)
            .map((bounty, index) => {
              const myBounty = isMyBounty(bounty);
              const stats = getBountyStats(bounty.id);
              const transactions = getBountyTransactions(bounty.id);

              return (
                <AnimatedCard key={bounty.id} delay={1400 + index * 200} className="group">
                  <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-blue-400/50 transition-all duration-300 h-full">
                    {/* Bounty Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">
                            {bounty.title}
                          </h3>
                          {myBounty && (
                            <span className="bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1 text-green-400 text-sm font-medium">
                              Your Bounty
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-300 flex-wrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${bounty.status === 'active'
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                              : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                            }`}>
                            {bounty.status}
                          </span>
                          <span>Company: {bounty.company}</span>
                          <span>Submissions: {bounty.submissions}</span>
                          <span>Transactions: {transactions.length}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleViewTransactions(bounty)}
                        className="inline-flex items-center space-x-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 rounded-lg px-4 py-2 text-blue-400 hover:text-blue-300 transition-all duration-300"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Transactions</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-300 mb-2">
                        <span>Pool Distribution</span>
                        <span>{stats.totalPool > 0 ? ((stats.transactedPool / stats.totalPool) * 100).toFixed(1) : 0}% distributed</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${stats.totalPool > 0 ? (stats.transactedPool / stats.totalPool) * 100 : 0}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              );
            })}

          {/* Show More/Less Button */}
          {filteredBounties.length > 3 && (
            <div className="flex justify-center">
              <button
                onClick={() => setShowAllBounties(!showAllBounties)}
                className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 rounded-lg text-white transition-colors"
              >
                {showAllBounties ? (
                  <>
                    <ChevronUp className="h-5 w-5" />
                    <span>Show Less</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-5 w-5" />
                    <span>Show All ({filteredBounties.length - 3} more)</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </section>
      {/* Smart Contract Code Example */}
      <section className="space-y-8">
        <AnimatedCard delay={3600} className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Smart Contract Logic</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Here's a simplified view of how our bounty smart contract handles automated payouts.
          </p>
        </AnimatedCard>

        <AnimatedCard delay={4000}>
          <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-6 py-4 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Code className="h-5 w-5 text-blue-400" />
                <span className="text-white font-medium">BountyPayout.sol</span>
              </div>
            </div>

            <div className="p-6">
              <pre className="text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap">
                <code>{`pragma solidity ^0.8.0;

 contract BountyPayout {
     struct Bounty {
         address creator;
         uint256 reward;
         bool isActive;
         bool isPaid;
     }

     mapping(uint256 => Bounty) public bounties;

     event ReportSubmitted(uint256 bountyId, address researcher, string report);
     event PayoutExecuted(uint256 bountyId, address researcher, uint256 amount);

    modifier onlyBountyCreator(uint256 bountyId) {
        require(msg.sender == bounties[bountyId].creator, "Not bounty creator");
        _;
     }

     function submitReport(uint256 bountyId, string memory report) external {
         require(bounties[bountyId].isActive, "Bounty not active");
        // Store report and trigger review process
        emit ReportSubmitted(bountyId, msg.sender, report);
     }

     function approvePayout(uint256 bountyId, address researcher)
        external
        onlyBountyCreator(bountyId)
    {
         Bounty storage bounty = bounties[bountyId];
         require(!bounty.isPaid, "Already paid");

         // Automatic payout execution
         bounty.isPaid = true;
         payable(researcher).transfer(bounty.reward);

         emit PayoutExecuted(bountyId, researcher, bounty.reward);
     }
 }`}</code>
              </pre>
            </div>
          </div>
        </AnimatedCard>
      </section>

      {/* Security & Trust */}
      <section className="space-y-8">
        <AnimatedCard delay={4400} className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Security & Trust</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Our smart contracts are audited, tested, and designed with security as the top priority.
          </p>
        </AnimatedCard>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Shield,
              title: 'Audited Contracts',
              description: 'All smart contracts are professionally audited by leading security firms',
              metric: '100%',
              metricLabel: 'Security Score'
            },
            {
              icon: Lock,
              title: 'Multi-Sig Protection',
              description: 'Critical functions require multiple signatures for enhanced security',
              metric: '3/5',
              metricLabel: 'Required Signatures'
            },
            {
              icon: Clock,
              title: 'Time-Lock Delays',
              description: 'Important changes have mandatory waiting periods for transparency',
              metric: '48h',
              metricLabel: 'Minimum Delay'
            }
          ].map((item, index) => (
            <AnimatedCard key={index} delay={4800 + index * 200} className="group h-full">
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-green-400/50 transition-all duration-300 text-center h-full flex flex-col">
                <div className="p-4 bg-green-500/10 rounded-full w-fit mx-auto mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="h-8 w-8 text-green-400" />
                </div>

                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-400 transition-colors duration-300">
                  {item.title}
                </h3>

                <p className="text-gray-300 text-sm mb-4 leading-relaxed flex-grow">{item.description}</p>

                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-400">{item.metric}</div>
                  <div className="text-green-300 text-xs">{item.metricLabel}</div>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* Gas Optimization */}
      <section className="space-y-8">
        <AnimatedCard delay={5600}>
          <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-lg rounded-xl p-8 border border-yellow-500/20">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center space-x-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                <span className="text-yellow-400 font-medium">Gas Optimized</span>
              </div>

              <h2 className="text-3xl font-bold text-white">Minimal Gas Fees</h2>

              <p className="text-gray-300 max-w-2xl mx-auto">
                Our smart contracts are optimized for minimal gas consumption, ensuring cost-effective transactions for all users.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                {[
                  { label: 'Bounty Creation', cost: '~$2.50', savings: '60%' },
                  { label: 'Report Submission', cost: '~$1.20', savings: '45%' },
                  { label: 'Payout Execution', cost: '~$0.80', savings: '70%' }
                ].map((item, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="text-yellow-400 font-medium text-sm">{item.label}</div>
                    <div className="text-white text-xl font-bold">{item.cost}</div>
                    <div className="text-green-400 text-sm">↓ {item.savings} saved</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedCard>
      </section>

      {/* Call to Action */}
      <section className="space-y-8">
        <AnimatedCard delay={6000}>
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-lg rounded-xl p-12 border border-blue-500/20 text-center">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2">
                <AlertTriangle className="h-5 w-5 text-blue-400" />
                <span className="text-blue-400 font-medium">Ready to Get Started?</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Start Earning with Smart Contract Bounties
              </h2>

              <p className="text-gray-300 max-w-2xl mx-auto text-lg">
                Join thousands of security researchers who trust our platform for fast, secure, and transparent bug bounty payments.
              </p>

            </div>
          </div>
        </AnimatedCard>
      </section>
    </div>

  );
};

export default Payouts;