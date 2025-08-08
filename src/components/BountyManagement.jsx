import React, { useState } from 'react'
import { Eye, Users, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp, Award, Calendar, Activity } from 'lucide-react'
import AnimatedCard from '../components/AnimatedCard'
import AnimatedCounter from '../components/AnimatedCounter'
import SubmissionReviewModal from '../components/SubmissionReviewModal'
import { useBounties } from '../hooks/useBounties'
import { useBountySubmissions } from '../hooks/useSubmissions'

const BountyManagement = ({ walletAddress }) => {
  const { getUserBounties } = useBounties(walletAddress)
  const bounties = getUserBounties()
  const isLoading = false
  const error = null
  const refreshBounties = () => {}
  const [expandedBounty, setExpandedBounty] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [isUpdatingSubmission, setIsUpdatingSubmission] = useState(false)

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10'
      case 'completed': return 'text-blue-400 bg-blue-400/10'
      case 'expired': return 'text-red-400 bg-red-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-400/10'
      case 'high': return 'text-orange-400 bg-orange-400/10'
      case 'medium': return 'text-yellow-400 bg-yellow-400/10'
      case 'low': return 'text-green-400 bg-green-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  if (isLoading) {
    return (
      <AnimatedCard delay={100}>
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
            <p className="text-gray-300 mt-4">Loading your bounties...</p>
          </div>
        </div>
      </AnimatedCard>
    )
  }

  if (error) {
    return (
      <AnimatedCard delay={100}>
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <div className="text-center py-8">
            <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-400">Error loading bounties: {error}</p>
          </div>
        </div>
      </AnimatedCard>
    )
  }

  if (bounties.length === 0) {
    return (
      <AnimatedCard delay={100}>
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <div className="text-center py-8">
            <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-white text-lg font-medium mb-2">No Bounties Created</h3>
            <p className="text-gray-400">You haven't created any bounties yet. Create your first bounty to get started!</p>
          </div>
        </div>
      </AnimatedCard>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">Your Bounties ({bounties.length})</h3>
          <button
            onClick={refreshBounties}
            className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1 transition-colors duration-300"
          >
            <Activity className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>

        {bounties.map((bounty, index) => (
          <BountyCard
            key={bounty.id}
            bounty={bounty}
            index={index}
            isExpanded={expandedBounty === bounty.id}
            onToggleExpansion={() => toggleBountyExpansion(bounty.id)}
            getStatusColor={getStatusColor}
            getSeverityColor={getSeverityColor}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            onReviewSubmission={handleReviewSubmission}
            walletAddress={walletAddress}
          />
        ))}
      </div>

      {/* Review Modal */}
      <SubmissionReviewModal
        submission={selectedSubmission}
        isOpen={reviewModalOpen}
        onClose={handleCloseReviewModal}
        onUpdateStatus={async (submissionId, status, reason) => {
          setIsUpdatingSubmission(true)
          try {
            // This would typically call an API to update the submission
            // For now, we'll simulate the update
            console.log('Updating submission:', { submissionId, status, reason })
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // Refresh the bounties to get updated submission data
            refreshBounties()
            
            return true
          } catch (error) {
            console.error('Error updating submission:', error)
            throw error
          } finally {
            setIsUpdatingSubmission(false)
          }
        }}
        isUpdating={isUpdatingSubmission}
      />
    </>
  )
}

const BountyCard = ({ 
  bounty, 
  index, 
  isExpanded, 
  onToggleExpansion, 
  getStatusColor, 
  getSeverityColor,
  selectedStatus,
  setSelectedStatus,
  onReviewSubmission,
  walletAddress
}) => {
  const { submissions, isLoading, getSubmissionsByStatus, getSubmissionStats, updateSubmission } = useBountySubmissions(bounty.id)
  
  // Utility functions
  const getSubmissionStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'text-green-400 bg-green-400/10'
      case 'rejected': return 'text-red-400 bg-red-400/10'
      case 'pending': return 'text-yellow-400 bg-yellow-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }
  
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  const submissionStats = getSubmissionStats()
  const filteredSubmissions = getSubmissionsByStatus(selectedStatus)

  const handleQuickAction = async (submissionId, action, submission) => {
    if (action === 'view') {
      onReviewSubmission(submission)
      return
    }

    const reason = action === 'reject' ? 'Quick rejection - insufficient evidence or duplicate submission' : ''
    
    try {
      await updateSubmission(submissionId, action, reason, walletAddress)
    } catch (error) {
      console.error('Error updating submission:', error)
      alert('Failed to update submission. Please try again.')
    }
  }

  return (
    <AnimatedCard delay={100 + index * 50} className="group">
      <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden transition-all duration-300">
        {/* Bounty Header */}
        <div className="p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start space-y-4 lg:space-y-0">
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h4 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">
                  {bounty.title}
                </h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bounty.status)}`}>
                  {bounty.status}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(bounty.severity)}`}>
                  {bounty.severity}
                </span>
              </div>

              <p className="text-gray-300 text-sm line-clamp-2">{bounty.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Deadline: {bounty.deadline}</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{bounty.submissionCount || submissionStats.total} submissions</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:items-end space-y-3">
              <div className="text-right">
                <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                  {bounty.reward}
                </div>
                <div className="text-gray-400 text-xs">Reward</div>
              </div>

              <button
                onClick={onToggleExpansion}
                className="group bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 transform hover:scale-105"
              >
                <Eye className="h-4 w-4" />
                <span>View Submissions</span>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                ) : (
                  <ChevronDown className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Submissions Section */}
        {isExpanded && (
          <div className="border-t border-white/10 bg-white/2">
            <div className="p-6 space-y-6">
              {/* Submission Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    <AnimatedCounter end={submissionStats.total} duration={1000} />
                  </div>
                  <div className="text-gray-400 text-sm">Total</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    <AnimatedCounter end={submissionStats.pending} duration={1000} />
                  </div>
                  <div className="text-gray-400 text-sm">Pending</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">
                    <AnimatedCounter end={submissionStats.accepted} duration={1000} />
                  </div>
                  <div className="text-gray-400 text-sm">Accepted</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-400">
                    <AnimatedCounter end={submissionStats.rejected} duration={1000} />
                  </div>
                  <div className="text-gray-400 text-sm">Rejected</div>
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'All', count: submissionStats.total },
                  { value: 'pending', label: 'Pending', count: submissionStats.pending },
                  { value: 'accepted', label: 'Accepted', count: submissionStats.accepted },
                  { value: 'rejected', label: 'Rejected', count: submissionStats.rejected }
                ].map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setSelectedStatus(filter.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      selectedStatus === filter.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {filter.label} ({filter.count})
                  </button>
                ))}
              </div>

              {/* Submissions List */}
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mx-auto"></div>
                  <p className="text-gray-300 mt-2 text-sm">Loading submissions...</p>
                </div>
              ) : filteredSubmissions.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">
                    {selectedStatus === 'all' ? 'No submissions yet' : `No ${selectedStatus} submissions`}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredSubmissions.map((submission, submissionIndex) => (
                    <SubmissionItem
                      key={submission.id}
                      submission={submission}
                      index={submissionIndex}
                      getSubmissionStatusColor={getSubmissionStatusColor}
                      formatTimeAgo={formatTimeAgo}
                      bountyId={bounty.id}
                      onQuickAction={handleQuickAction}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AnimatedCard>
  )
}

const SubmissionItem = ({ submission, index, getSubmissionStatusColor, formatTimeAgo, bountyId, onQuickAction }) => {
  return (
    <div className="bg-white/5 rounded-lg p-4 border border-white/5 hover:border-white/20 transition-all duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start space-y-3 md:space-y-0">
        <div className="flex-1 space-y-2">
          <div className="flex items-center space-x-3">
            <h5 className="text-white font-medium">{submission.title}</h5>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSubmissionStatusColor(submission.status)}`}>
              {submission.status}
            </span>
          </div>
          
          <p className="text-gray-400 text-sm line-clamp-2">{submission.description}</p>
          
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>By: {submission.submitterName || submission.submitter}</span>
            <span>•</span>
            <span>Submitted: {formatTimeAgo(submission.submittedAt)}</span>
            {submission.reward && (
              <>
                <span>•</span>
                <span className="text-green-400">Reward: {submission.reward}</span>
              </>
            )}
          </div>

          {submission.rejectionReason && (
            <div className="bg-red-400/10 border border-red-400/20 rounded-lg p-3 mt-2">
              <p className="text-red-400 text-sm">
                <strong>Rejection Reason:</strong> {submission.rejectionReason}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {submission.status === 'pending' && (
            <>
              <button 
                onClick={() => onQuickAction(submission.id, 'accept', submission)}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1 transition-colors duration-300"
              >
                <CheckCircle className="h-3 w-3" />
                <span>Accept</span>
              </button>
              <button 
                onClick={() => onQuickAction(submission.id, 'reject', submission)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1 transition-colors duration-300"
              >
                <XCircle className="h-3 w-3" />
                <span>Reject</span>
              </button>
            </>
          )}
          
          <button 
            onClick={() => onQuickAction(submission.id, 'view', submission)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1 transition-colors duration-300"
          >
            <Eye className="h-3 w-3" />
            <span>Review</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default BountyManagement

