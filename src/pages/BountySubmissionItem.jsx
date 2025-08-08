import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useBountyTransactions } from './useBountyTransactions';
import { useSubmissions } from './useSubmissions';

const BountySubmissionItem = ({ submission, bounty }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { addTransaction } = useBountyTransactions();
  const { updateSubmission } = useSubmissions(bounty.id);

  const handleAccept = async () => {
    setIsUpdating(true);
    try {
      // 1. Update the submission status
      await updateSubmission(
        submission.id,
        'accepted',
        '',
        bounty.createdBy // reviewer address
      );

      // 2. Add the transaction
      await addTransaction({
        bountyId: bounty.id,
        submissionId: submission.id,
        researcherAddress: submission.researcher.walletAddress,
        contractAddress: submission.researcher.contractAddress,
        amount: parseFloat(submission.reward),
        severity: submission.severity,
        status: 'completed',
        timestamp: new Date().toISOString()
      });

      toast.success('Bounty accepted and transaction recorded!');
    } catch (error) {
      toast.error(`Failed to accept bounty: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="border border-gray-700 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start">
        {/* ... existing submission details ... */}
        
        <div className="text-right ml-6">
          <div className="text-2xl font-bold text-green-400">{submission.reward} ETH</div>
          <div className="text-gray-400 text-sm">Suggested Reward</div>

          {submission.status === 'pending' && (
            <div className="mt-4 flex space-x-2">
              <button
                onClick={handleAccept}
                className="flex items-center gap-1 px-3 py-1 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 hover:border-green-500/40 text-green-400 rounded-lg transition-colors"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <span className="animate-spin">↻</span>
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                Accept
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Contract address display */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 text-sm">Contract Address:</span>
          <span className="font-mono text-sm">{submission.researcher.contractAddress}</span>
        </div>
      </div>
    </div>
  );
};

export default BountySubmissionItem;