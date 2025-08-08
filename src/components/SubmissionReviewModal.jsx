import React, { useState } from 'react'
import { X, CheckCircle, XCircle, Eye, User, Calendar, Award, AlertTriangle } from 'lucide-react'

const SubmissionReviewModal = ({ 
  submission, 
  isOpen, 
  onClose, 
  onUpdateStatus, 
  isUpdating = false 
}) => {
  const [reviewAction, setReviewAction] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [showReasonField, setShowReasonField] = useState(false)

  const handleActionSelect = (action) => {
    setReviewAction(action)
    setShowReasonField(action === 'reject')
    if (action === 'accept') {
      setRejectionReason('')
    }
  }

  const handleSubmitReview = async () => {
    if (!reviewAction) return

    if (reviewAction === 'reject' && !rejectionReason.trim()) {
      alert('Please provide a reason for rejection')
      return
    }

    try {
      await onUpdateStatus(submission.id, reviewAction, rejectionReason.trim())
      handleClose()
    } catch (error) {
      console.error('Error updating submission:', error)
      alert('Failed to update submission. Please try again.')
    }
  }

  const handleClose = () => {
    setReviewAction('')
    setRejectionReason('')
    setShowReasonField(false)
    onClose()
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-400/10 border-red-400/20'
      case 'high': return 'text-orange-400 bg-orange-400/10 border-orange-400/20'
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      case 'low': return 'text-green-400 bg-green-400/10 border-green-400/20'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }

  if (!isOpen || !submission) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <Eye className="h-6 w-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Review Submission</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors duration-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6 space-y-6">
            {/* Submission Info */}
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="flex flex-col lg:flex-row justify-between items-start space-y-4 lg:space-y-0 lg:space-x-6">
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{submission.title}</h3>
                    <div className="flex items-center space-x-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(submission.severity)}`}>
                        {submission.severity} severity
                      </span>
                      <span className="text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full text-sm font-medium">
                        {submission.status}
                      </span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{submission.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <User className="h-4 w-4" />
                      <span>Submitted by: {submission.submitterName || submission.submitter}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>Date: {formatDate(submission.submittedAt)}</span>
                    </div>
                    {submission.reward && (
                      <div className="flex items-center space-x-2 text-green-400">
                        <Award className="h-4 w-4" />
                        <span>Potential Reward: {submission.reward}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Report Section */}
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4">Vulnerability Details</h4>
              <div className="space-y-4">
                <div>
                  <h5 className="text-white font-medium mb-2">Description</h5>
                  <p className="text-gray-300 bg-white/5 p-4 rounded-lg border border-white/10">
                    {submission.description || 'Detailed vulnerability description would be shown here. This includes the technical details of the security issue, how it was discovered, and its potential impact on the system.'}
                  </p>
                </div>

                <div>
                  <h5 className="text-white font-medium mb-2">Steps to Reproduce</h5>
                  <div className="text-gray-300 bg-white/5 p-4 rounded-lg border border-white/10">
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Navigate to the vulnerable endpoint</li>
                      <li>Craft malicious payload</li>
                      <li>Execute the attack vector</li>
                      <li>Observe the security breach</li>
                    </ol>
                  </div>
                </div>

                <div>
                  <h5 className="text-white font-medium mb-2">Impact Assessment</h5>
                  <p className="text-gray-300 bg-white/5 p-4 rounded-lg border border-white/10">
                    This vulnerability could potentially allow unauthorized access to sensitive user data, 
                    compromise system integrity, or lead to financial losses. The severity is classified as 
                    {' '}<span className={`font-medium ${submission.severity === 'critical' ? 'text-red-400' : 
                      submission.severity === 'high' ? 'text-orange-400' : 
                      submission.severity === 'medium' ? 'text-yellow-400' : 'text-green-400'}`}>
                    {submission.severity}
                    </span> based on the potential impact and exploitability.
                  </p>
                </div>

                <div>
                  <h5 className="text-white font-medium mb-2">Recommended Fix</h5>
                  <p className="text-gray-300 bg-white/5 p-4 rounded-lg border border-white/10">
                    Implement proper input validation, sanitization, and security controls. 
                    Update the affected components and conduct thorough testing to ensure the fix is effective.
                  </p>
                </div>
              </div>
            </div>

            {/* Review Actions */}
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4">Review Decision</h4>
              
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => handleActionSelect('accept')}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all duration-300 ${
                      reviewAction === 'accept'
                        ? 'border-green-400 bg-green-400/10 text-green-400'
                        : 'border-white/20 bg-white/5 text-gray-300 hover:border-green-400/50 hover:bg-green-400/5'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <CheckCircle className="h-6 w-6" />
                      <div className="text-left">
                        <div className="font-medium">Accept Submission</div>
                        <div className="text-sm opacity-80">Valid vulnerability, approve for reward</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleActionSelect('reject')}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all duration-300 ${
                      reviewAction === 'reject'
                        ? 'border-red-400 bg-red-400/10 text-red-400'
                        : 'border-white/20 bg-white/5 text-gray-300 hover:border-red-400/50 hover:bg-red-400/5'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <XCircle className="h-6 w-6" />
                      <div className="text-left">
                        <div className="font-medium">Reject Submission</div>
                        <div className="text-sm opacity-80">Invalid or duplicate report</div>
                      </div>
                    </div>
                  </button>
                </div>

                {showReasonField && (
                  <div className="space-y-2">
                    <label className="block text-white font-medium">
                      Rejection Reason <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Please provide a detailed reason for rejecting this submission..."
                      className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 resize-none"
                      rows={4}
                    />
                    <div className="flex items-start space-x-2 text-sm text-gray-400">
                      <AlertTriangle className="h-4 w-4 mt-0.5 text-yellow-400" />
                      <span>
                        Providing clear feedback helps researchers improve their future submissions 
                        and maintains a positive community environment.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-white/10 bg-white/2">
          <button
            onClick={handleClose}
            className="px-6 py-2 text-gray-400 hover:text-white transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitReview}
            disabled={!reviewAction || isUpdating || (reviewAction === 'reject' && !rejectionReason.trim())}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg flex items-center space-x-2 transition-all duration-300"
          >
            {isUpdating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                {reviewAction === 'accept' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : reviewAction === 'reject' ? (
                  <XCircle className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span>
                  {reviewAction === 'accept' ? 'Accept Submission' : 
                   reviewAction === 'reject' ? 'Reject Submission' : 'Submit Review'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SubmissionReviewModal

