


import React, { useState, useEffect } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { User, Eye, Clock, CheckCircle, XCircle, Github, Trophy, RefreshCw, ChevronDown, ChevronUp, Calendar, Users, Activity, Award, LogOut , ArrowRight} from 'lucide-react'
import ProtectedRoute from '../components/ProtectedRoute'
import AnimatedCard from '../components/AnimatedCard'
import AnimatedCounter from '../components/AnimatedCounter'
import SubmissionReviewModal from '../components/SubmissionReviewModal'
import { useUserSubmissions, useBountySubmissions } from '../hooks/useSubmissions'
import { useBounties } from '../hooks/useBounties'

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

const getDynamicTransactions = (bountyId) => {
  return new Promise((resolve) => {
    const baseTransactions = mockTransactions[bountyId] || [];

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

const Profile = () => {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { submissions, stats, isLoading, refreshSubmissions } = useUserSubmissions(address)
  const { getUserBounties, updateBountyTransaction } = useBounties(address)
  const userBounties = getUserBounties()
  const [githubConnected, setGithubConnected] = useState(true)
  const [showAllSubmissions, setShowAllSubmissions] = useState(false)
  const [expandedBounty, setExpandedBounty] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [isUpdatingSubmission, setIsUpdatingSubmission] = useState(false)
  const [bountySubmissionStatuses, setBountySubmissionStatuses] = useState({})

  useEffect(() => {
    // Check if GitHub is connected
  }, [])

  // const handleDisconnectGithub = () => {
  //   setGithubConnected(false)
  //   console.log('GitHub disconnected')
  // }

  const handleDisconnectGithub = async () => {
  try {
    await fetch('/api/disconnect-github', { method: 'POST' });
    // Optionally clear user data locally
    localStorage.removeItem('githubUser');
    // Maybe redirect or update UI
    window.location.reload(); // or setAuth(null)
  } catch (err) {
    console.error('Failed to disconnect GitHub:', err);
  }
};


  

  const handleDisconnectWallet = () => {
    disconnect()
    console.log('Wallet disconnected')
  }

  const handleAcceptBountySubmission = async (submissionId, bountyId, amount, researcherAddress) => {
    setIsUpdatingSubmission(true);
    try {
      const newTransaction = {
        address: researcherAddress,
        severity: selectedSubmission?.severity || 'Unknown',
        amount: parseFloat(amount),
        timestamp: new Date().toISOString(),
      };

      await updateBountyTransaction(bountyId, newTransaction);

      setBountySubmissionStatuses(prev => ({
        ...prev,
        [submissionId]: 'accepted'
      }));
      refreshSubmissions();
      handleCloseReviewModal();
    } catch (error) {
      console.error('Error accepting bounty submission:', error);
    } finally {
      setIsUpdatingSubmission(false);
    }
  };

  const handleRejectBountySubmission = (submissionId) => {
    setIsUpdatingSubmission(true);
    try {
      setBountySubmissionStatuses(prev => ({
        ...prev,
        [submissionId]: 'rejected'
      }));
      refreshSubmissions();
      handleCloseReviewModal();
    } catch (error) {
      console.error('Error rejecting bounty submission:', error);
    } finally {
      setIsUpdatingSubmission(false);
    }
  };

  const getBountySubmissionStatus = (submission) => {
    return bountySubmissionStatuses[submission.id] || submission.status || 'pending'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'rejected': return 'text-red-400 bg-red-400/10 border-red-400/20'
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="h-4 w-4 mr-1" />;
      case 'rejected': return <XCircle className="h-4 w-4 mr-1" />;
      case 'pending': return <Clock className="h-4 w-4 mr-1" />;
      default: return null;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-400/10'
      case 'high': return 'text-orange-400 bg-orange-400/10'
      case 'medium': return 'text-yellow-400 bg-yellow-400/10'
      case 'low': return 'text-green-400 bg-green-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  const getBountyStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10'
      case 'completed': return 'text-blue-400 bg-blue-400/10'
      case 'expired': return 'text-red-400 bg-red-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const toggleBountyExpansion = (bountyId) => {
    setExpandedBounty(expandedBounty === bountyId ? null : bountyId)
  }

  const handleReviewSubmission = (submission) => {
    setSelectedSubmission(submission)
    setReviewModalOpen(true)
  }

  const handleCloseReviewModal = () => {
    setReviewModalOpen(false)
    setSelectedSubmission(null)
  }

  const profileStats = [
    {
      label: 'Total Submissions',
      value: stats.totalSubmissions,
      icon: Eye,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      label: 'Pending Reviews',
      value: stats.pendingSubmissions,
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10'
    },
    {
      label: 'Accepted',
      value: stats.acceptedSubmissions,
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
    {
      label: 'Rejected',
      value: stats.rejectedSubmissions,
      icon: XCircle,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10'
    }
  ]

  const allRecentSubmissions = submissions
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))

  const displayedSubmissions = showAllSubmissions
    ? allRecentSubmissions
    : allRecentSubmissions.slice(0, 2)

  return (
    <ProtectedRoute requireGitHub={true}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="space-y-8">
          {/* Profile Header */}
          <AnimatedCard delay={100}>
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-6 lg:space-y-0">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-white" />
                </div>

                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white">Profile</h1>
                  <p className="text-gray-300 mt-1">
                    {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
                  </p>

                  <div className="flex items-center space-x-4 mt-3">
                    {githubConnected && (
                      <div className="flex items-center space-x-2 text-green-400">
                        <Github className="h-4 w-4" />
                        <span className="text-sm">GitHub Connected</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-3">
                {/* <button
                  onClick={handleDisconnectGithub}
                  className="group bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 min-w-[180px] justify-center"
                >
                  <Github className="h-4 w-4" />
                  <span>Disconnect GitHub</span>
                  <LogOut className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button> */}

                <button
                  onClick={handleDisconnectWallet}
                  className="group bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 min-w-[180px] justify-center"
                >
                  <User className="h-4 w-4" />
                  <span>Disconnect Wallet</span>
                  <LogOut className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </AnimatedCard>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {profileStats.map((stat, index) => (
              <AnimatedCard key={index} delay={200 + index * 100} className="group">
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.color}`}>
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div>
                        ) : (
                          <AnimatedCounter end={stat.value} duration={2000} />
                        )}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor} transform group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>

          {/* My Bounties Section */}
          <AnimatedCard delay={800}>
            <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white flex items-center mb-6">
                  <Trophy className="h-6 w-6 mr-3 text-purple-400" />
                  Your Bounties
                </h2>

                {userBounties.length === 0 ? (
                  <div className="text-center py-12">
                    <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-white text-lg font-medium mb-2">No bounties created yet</h4>
                    <p className="text-gray-400">Create your first bounty to start receiving submissions from security researchers.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userBounties.map((bounty) => {
                      const BountySubmissions = ({ bountyId }) => {
                        const { submissions: bountySubmissions, isLoading: submissionsLoading } = useBountySubmissions(bountyId)

                        const filteredSubmissions = selectedStatus === 'all'
                          ? bountySubmissions
                          : bountySubmissions.filter(sub => getBountySubmissionStatus(sub) === selectedStatus)

                        return (
                          <div className="space-y-4 mt-4">
                            {submissionsLoading ? (
                              <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
                                <p className="text-white">Loading submissions...</p>
                              </div>
                            ) : filteredSubmissions.length === 0 ? (
                              <div className="text-center py-8">
                                <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-400">No {selectedStatus !== 'all' && selectedStatus} submissions for this bounty.</p>
                              </div>
                            ) : (
                              filteredSubmissions.map((submission) => {
                                const status = getBountySubmissionStatus(submission);
                                return (
                                  <div
                                    key={submission.id}
                                    className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-white/20 transition-colors duration-300"
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <h4 className="text-white font-semibold text-lg whitespace-pre-wrap break-words overflow-hidden">{submission.title}</h4>
                                        <p className="text-gray-300 mt-2 whitespace-pre-wrap break-words overflow-hidden">{submission.description}</p>
                                        <p className="text-blue-400 text-sm mt-1 whitespace-pre-wrap break-words overflow-hidden">Researcher: {submission.researcher}</p>

                                        <div className="flex items-center space-x-4 mt-4">
                                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                                            {getStatusIcon(status)}
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                          </span>
                                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(submission.severity)}`}>
                                            {submission.severity}
                                          </span>
                                          <span className="text-gray-500 text-sm">
                                            Submitted: {formatDate(submission.submittedAt)}
                                          </span>
                                        </div>

                                        {status === 'rejected' && submission.rejectionReason && (
                                          <div className="mt-3 p-3 bg-red-400/10 border border-red-400/20 rounded-lg">
                                            <p className="text-red-400 text-sm">
                                              <strong>Rejection Reason:</strong> {submission.rejectionReason}
                                            </p>
                                          </div>
                                        )}
                                      </div>

                                      <div className="text-right ml-6">
                                        <div className="text-2xl font-bold text-green-400">{submission.reward}</div>
                                        <div className="text-gray-400 text-sm">Suggested Reward</div>

                                        {status === 'pending' && (
                                          <div className="mt-4 flex space-x-2">
                                            <button
                                              onClick={() => handleAcceptBountySubmission(submission.id, bounty.id, submission.reward, submission.researcher)}
                                              className="flex items-center gap-1 px-3 py-1 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 hover:border-green-500/40 text-green-400 rounded-lg transition-colors"
                                              disabled={isUpdatingSubmission}
                                            >
                                              <CheckCircle className="h-4 w-4" />
                                              Accept
                                            </button>
                                            <button
                                              onClick={() => handleRejectBountySubmission(submission.id)}
                                              className="flex items-center gap-1 px-3 py-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 rounded-lg transition-colors"
                                              disabled={isUpdatingSubmission}
                                            >
                                              <XCircle className="h-4 w-4" />
                                              Reject
                                            </button>
                                           {/* Remove the status === 'pending' condition to always show the button */}

                                          </div>
                                        )}

                                        <div className="mt-4 flex space-x-2">
  <button
    onClick={() => handleReviewSubmission(submission)}
    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm flex items-center space-x-1 transition-colors"
  >
    <span>Review</span>
    <ArrowRight className="h-3 w-3" />
  </button>
</div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })
                            )}
                          </div>
                        )
                      }

                      return (
                        <div key={bounty.id} className="bg-white/5 rounded-xl p-6 border border-white/10">
                          <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleBountyExpansion(bounty.id)}
                          >
                            <div className="flex items-center space-x-3">
                              <h3 className="text-xl font-semibold text-white">{bounty.title}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBountyStatusColor(bounty.status)}`}>
                                {bounty.status}
                              </span>
                              <span className="text-gray-400 text-sm">received submissions</span>
                            </div>
                            <div>
                              {expandedBounty === bounty.id ? (
                                <ChevronUp className="h-5 w-5 text-white" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-white" />
                              )}
                            </div>
                          </div>

                          {expandedBounty === bounty.id && (
                            <div className="mt-4">
                              <div className="flex space-x-2 mb-4">
                                {['all', 'pending', 'accepted', 'rejected'].map(status => (
                                  <button
                                    key={status}
                                    onClick={() => setSelectedStatus(status)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${selectedStatus === status
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                      }`}
                                  >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                  </button>
                                ))}
                              </div>
                              <BountySubmissions bountyId={bounty.id} />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </AnimatedCard>

          {/* Recent Submissions Section */}
          <AnimatedCard delay={600}>
            <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <Eye className="h-6 w-6 mr-3 text-blue-400" />
                    Recent Submissions
                  </h2>
                  <button
                    onClick={refreshSubmissions}
                    className="group bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 transform hover:scale-105"
                  >
                    <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                    <span>Refresh</span>
                  </button>
                </div>

                {displayedSubmissions.length === 0 ? (
                  <div className="text-center py-12">
                    <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-white text-lg font-medium mb-2">No submissions yet</h4>
                    <p className="text-gray-400">Start participating in bug bounty programs to see your submissions here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {displayedSubmissions.map((submission) => {
                      const status = submission.status || 'pending';
                      return (
                        <div
                          key={submission.id}
                          className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-white/20 transition-colors duration-300"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-white font-semibold text-lg">{submission.title}</h4>
                              <p className="text-gray-300 mt-2">{submission.description}</p>
                              <p className="text-blue-400 text-sm mt-1">Bounty: {submission.bountyTitle}</p>

                              <div className="flex items-center space-x-4 mt-4">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                                  {getStatusIcon(status)}
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(submission.severity)}`}>
                                  {submission.severity}
                                </span>
                                <span className="text-gray-500 text-sm">
                                  Submitted: {formatDate(submission.submittedAt)}
                                </span>
                                {submission.reviewedAt && (
                                  <span className="text-gray-500 text-sm">
                                    Reviewed: {formatDate(submission.reviewedAt)}
                                  </span>
                                )}
                              </div>

                              {status === 'rejected' && submission.rejectionReason && (
                                <div className="mt-3 p-3 bg-red-400/10 border border-red-400/20 rounded-lg">
                                  <p className="text-red-400 text-sm">
                                    <strong>Rejection Reason:</strong> {submission.rejectionReason}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="text-right ml-6">
                              <div className="text-2xl font-bold text-green-400">{submission.reward}</div>
                              <div className="text-gray-400 text-sm">Potential Reward</div>
                            </div>
                          </div>
                        </div>
                      )
                    })}

                    {allRecentSubmissions.length > 2 && (
                      <div className="text-center pt-4">
                        <button
                          onClick={() => setShowAllSubmissions(!showAllSubmissions)}
                          className="group bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-300 mx-auto"
                        >
                          <span>{showAllSubmissions ? 'Show Less' : `Show More (${allRecentSubmissions.length - 2} more)`}</span>
                          {showAllSubmissions ? (
                            <ChevronUp className="h-4 w-4 group-hover:-translate-y-1 transition-transform duration-300" />
                          ) : (
                            <ChevronDown className="h-4 w-4 group-hover:translate-y-1 transition-transform duration-300" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </AnimatedCard>
        </div>
      </div>
      {selectedSubmission && (
        <SubmissionReviewModal
          isOpen={reviewModalOpen}
          onClose={handleCloseReviewModal}
          submission={selectedSubmission}
          onAccept={handleAcceptBountySubmission}
          onReject={handleRejectBountySubmission}
          isProcessing={isUpdatingSubmission}
        />
      )}
    </ProtectedRoute>
  )
}

export default Profile