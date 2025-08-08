

// import React, { useState } from 'react';
// import { X, CheckCircle, XCircle, AlertTriangle, DollarSign } from 'lucide-react';
// import { useAccount, useContractRead, useSigner } from 'wagmi';
// import { ethers } from 'ethers';
// import { toast } from 'react-hot-toast';

// // Enhanced Bounty Contract ABI (key functions for payments)
// const ENHANCED_BOUNTY_ABI = [
//   "function approveSubmissionWithCustomPayment(uint256 _submissionId, uint256 _paymentAmount, string memory _severityAssessment) external",
//   "function rejectSubmission(uint256 _submissionId, string memory _feedback) external",
//   "function canMakePayment(uint256 _amount) external view returns (bool)",
//   "function getBountyInfo() external view returns (address _owner, string memory _title, string memory _description, uint256 _totalReward, uint256 _remainingReward, uint256 _deadline, string memory _severity, uint8 _status, uint256 _minimumReward, uint256 _maximumReward, uint256 _submissionCount, uint256 _paymentCount)"
// ];

// const SubmissionReviewModal = ({ 
//   isOpen, 
//   onClose, 
//   submission, 
//   onApprove, 
//   onReject,
//   bountyAddress // Add bounty address prop
// }) => {
//   const [feedback, setFeedback] = useState('');
//   const [paymentAmount, setPaymentAmount] = useState('');
//   const [severityAssessment, setSeverityAssessment] = useState('');
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [useSmartContract, setUseSmartContract] = useState(true);

//   const { address } = useAccount();
//   const { data: signer } = useSigner();

//   // Smart contract payment function
//   const handleSmartContractPayment = async () => {
//     if (!bountyAddress || !signer || !paymentAmount || !severityAssessment) {
//       toast.error('Missing required information for smart contract payment');
//       return;
//     }

//     setIsProcessing(true);
//     try {
//       // Create contract instance
//       const bountyContract = new ethers.Contract(bountyAddress, ENHANCED_BOUNTY_ABI, signer);
      
//       // Convert payment amount to wei
//       const paymentAmountWei = ethers.parseEther(paymentAmount);
      
//       // Check if payment can be made
//       const canPay = await bountyContract.canMakePayment(paymentAmountWei);
//       if (!canPay) {
//         throw new Error('Insufficient bounty balance for this payment amount');
//       }

//       // Execute smart contract payment
//       const tx = await bountyContract.approveSubmissionWithCustomPayment(
//         submission.id,
//         paymentAmountWei,
//         severityAssessment
//       );

//       toast.loading(`Processing payment transaction: ${tx.hash.slice(0, 10)}...`);
      
//       // Wait for transaction confirmation
//       const receipt = await tx.wait();
      
//       toast.success(`Payment successful! ${paymentAmount} ETH sent to hunter`);
      
//       // Call original onApprove with additional smart contract data
//       onApprove(submission.id, {
//         feedback: `Approved with ${severityAssessment} severity. Payment: ${paymentAmount} ETH`,
//         smartContract: {
//           transactionHash: tx.hash,
//           blockNumber: receipt.blockNumber,
//           paymentAmount,
//           severityAssessment,
//           bountyAddress
//         }
//       });
      
//       onClose();
      
//     } catch (error) {
//       console.error('Smart contract payment failed:', error);
//       toast.error(`Payment failed: ${error.message}`);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Smart contract rejection function
//   const handleSmartContractRejection = async () => {
//     if (!bountyAddress || !signer || !feedback) {
//       toast.error('Missing required information for smart contract rejection');
//       return;
//     }

//     setIsProcessing(true);
//     try {
//       const bountyContract = new ethers.Contract(bountyAddress, ENHANCED_BOUNTY_ABI, signer);
      
//       const tx = await bountyContract.rejectSubmission(submission.id, feedback);
      
//       toast.loading(`Processing rejection transaction: ${tx.hash.slice(0, 10)}...`);
      
//       const receipt = await tx.wait();
      
//       toast.success('Submission rejected on blockchain');
      
//       onReject(submission.id, {
//         feedback,
//         smartContract: {
//           transactionHash: tx.hash,
//           blockNumber: receipt.blockNumber,
//           bountyAddress
//         }
//       });
      
//       onClose();
      
//     } catch (error) {
//       console.error('Smart contract rejection failed:', error);
//       toast.error(`Rejection failed: ${error.message}`);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleApprove = () => {
//     if (useSmartContract && bountyAddress) {
//       handleSmartContractPayment();
//     } else {
//       // Fallback to original approval method
//       onApprove(submission.id, feedback);
//       onClose();
//     }
//   };

//   const handleReject = () => {
//     if (useSmartContract && bountyAddress) {
//       handleSmartContractRejection();
//     } else {
//       // Fallback to original rejection method
//       onReject(submission.id, feedback);
//       onClose();
//     }
//   };

//   // Suggested payment amounts based on severity
//   const getSuggestedAmount = (severity) => {
//     const suggestions = {
//       'Low': '0.01',
//       'Medium': '0.05',
//       'High': '0.1',
//       'Critical': '0.25'
//     };
//     return suggestions[severity] || '0.01';
//   };

//   if (!isOpen || !submission) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between p-6 border-b">
//           <h2 className="text-xl font-semibold text-gray-900">Review Submission</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             <X className="h-6 w-6" />
//           </button>
//         </div>

//         <div className="p-6 space-y-6">
//           {/* Submission Details */}
//           <div className="bg-gray-50 rounded-lg p-4">
//             <h3 className="font-medium text-gray-900 mb-2">Submission Details</h3>
//             <div className="space-y-2 text-sm">
//               <div><span className="font-medium">Hunter:</span> {submission.hunter}</div>
//               <div><span className="font-medium">Title:</span> {submission.title}</div>
//               <div><span className="font-medium">Description:</span> {submission.description}</div>
//               <div><span className="font-medium">Submitted:</span> {new Date(submission.timestamp).toLocaleDateString()}</div>
//             </div>
//           </div>

//           {/* Smart Contract Toggle */}
//           {bountyAddress && (
//             <div className="bg-blue-50 rounded-lg p-4">
//               <div className="flex items-center space-x-3">
//                 <input
//                   type="checkbox"
//                   id="useSmartContract"
//                   checked={useSmartContract}
//                   onChange={(e) => setUseSmartContract(e.target.checked)}
//                   className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                 />
//                 <label htmlFor="useSmartContract" className="text-sm font-medium text-gray-900">
//                   Use Smart Contract Payment (Recommended)
//                 </label>
//               </div>
//               <p className="text-xs text-gray-600 mt-1">
//                 Payments will be processed automatically via blockchain when approved
//               </p>
//             </div>
//           )}

//           {/* Payment Amount Input (for smart contract) */}
//           {useSmartContract && bountyAddress && (
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Payment Amount (ETH) *
//                 </label>
//                 <div className="flex space-x-2">
//                   <input
//                     type="number"
//                     step="0.001"
//                     value={paymentAmount}
//                     onChange={(e) => setPaymentAmount(e.target.value)}
//                     placeholder="0.01"
//                     className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                   <DollarSign className="h-10 w-10 text-gray-400 p-2" />
//                 </div>
//                 <div className="flex space-x-2 mt-2">
//                   {['Low', 'Medium', 'High', 'Critical'].map((severity) => (
//                     <button
//                       key={severity}
//                       onClick={() => {
//                         setPaymentAmount(getSuggestedAmount(severity));
//                         setSeverityAssessment(severity);
//                       }}
//                       className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
//                     >
//                       {severity} ({getSuggestedAmount(severity)} ETH)
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Severity Assessment *
//                 </label>
//                 <select
//                   value={severityAssessment}
//                   onChange={(e) => setSeverityAssessment(e.target.value)}
//                   className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   <option value="">Select Severity</option>
//                   <option value="Low">Low</option>
//                   <option value="Medium">Medium</option>
//                   <option value="High">High</option>
//                   <option value="Critical">Critical</option>
//                 </select>
//               </div>
//             </div>
//           )}

//           {/* Feedback Input */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               {useSmartContract ? 'Additional Feedback (Optional)' : 'Feedback *'}
//             </label>
//             <textarea
//               value={feedback}
//               onChange={(e) => setFeedback(e.target.value)}
//               rows={4}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder={useSmartContract ? "Any additional comments..." : "Provide feedback for your decision..."}
//             />
//           </div>

//           {/* Action Buttons */}
//           <div className="flex space-x-3 pt-4">
//             <button
//               onClick={handleApprove}
//               disabled={isProcessing || (useSmartContract && (!paymentAmount || !severityAssessment))}
//               className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center space-x-2"
//             >
//               {isProcessing ? (
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//               ) : (
//                 <CheckCircle className="h-4 w-4" />
//               )}
//               <span>
//                 {useSmartContract ? `Approve & Pay ${paymentAmount || '0'} ETH` : 'Approve'}
//               </span>
//             </button>
            
//             <button
//               onClick={handleReject}
//               disabled={isProcessing || (!feedback && !useSmartContract)}
//               className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center space-x-2"
//             >
//               {isProcessing ? (
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//               ) : (
//                 <XCircle className="h-4 w-4" />
//               )}
//               <span>Reject</span>
//             </button>
//           </div>

//           {/* Smart Contract Info */}
//           {useSmartContract && bountyAddress && (
//             <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
//               <div className="flex items-start space-x-2">
//                 <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
//                 <div className="text-sm text-yellow-800">
//                   <p className="font-medium">Smart Contract Payment</p>
//                   <p>This action will trigger a blockchain transaction. Make sure you have enough ETH for gas fees.</p>
//                   <p className="text-xs mt-1 font-mono">Bounty: {bountyAddress.slice(0, 10)}...{bountyAddress.slice(-8)}</p>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubmissionReviewModal;


// import React, { useState } from 'react';
// import { X, CheckCircle, XCircle, AlertTriangle, DollarSign } from 'lucide-react';
// import { useAccount, useContractRead, useSigner } from 'wagmi';
// import { ethers } from 'ethers';
// import { toast } from 'react-hot-toast';

// // Enhanced Bounty Contract ABI (key functions for payments)
// const ENHANCED_BOUNTY_ABI = [
//   "function approveSubmissionWithCustomPayment(uint256 _submissionId, uint256 _paymentAmount, string memory _severityAssessment) external",
//   "function rejectSubmission(uint256 _submissionId, string memory _feedback) external",
//   "function canMakePayment(uint256 _amount) external view returns (bool)",
//   "function getBountyInfo() external view returns (address _owner, string memory _title, string memory _description, uint256 _totalReward, uint256 _remainingReward, uint256 _deadline, string memory _severity, uint8 _status, uint256 _minimumReward, uint256 _maximumReward, uint256 _submissionCount, uint256 _paymentCount)"
// ];

// const SubmissionReviewModal = ({ 
//   isOpen, 
//   onClose, 
//   submission, 
//   onApprove, 
//   onReject,
//   bountyAddress
// }) => {
//   const [feedback, setFeedback] = useState('');
//   const [paymentAmount, setPaymentAmount] = useState('');
//   const [severityAssessment, setSeverityAssessment] = useState('');
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [useSmartContract, setUseSmartContract] = useState(true);

//   const { address } = useAccount();
//   const { data: signer } = useSigner();

//   const handleSmartContractPayment = async () => {
//     if (!bountyAddress || !signer || !paymentAmount || !severityAssessment) {
//       toast.error('Missing required information for smart contract payment');
//       return;
//     }

//     setIsProcessing(true);
//     try {
//       const bountyContract = new ethers.Contract(bountyAddress, ENHANCANCED_BOUNTY_ABI, signer);
//       const paymentAmountWei = ethers.parseEther(paymentAmount);
      
//       const canPay = await bountyContract.canMakePayment(paymentAmountWei);
//       if (!canPay) {
//         throw new Error('Insufficient bounty balance for this payment amount');
//       }

//       const tx = await bountyContract.approveSubmissionWithCustomPayment(
//         submission.id,
//         paymentAmountWei,
//         severityAssessment
//       );

//       toast.loading(`Processing payment transaction: ${tx.hash.slice(0, 10)}...`);
//       const receipt = await tx.wait();
//       toast.success(`Payment successful! ${paymentAmount} ETH sent to hunter`);
      
//       onApprove(submission.id, {
//         feedback: `Approved with ${severityAssessment} severity. Payment: ${paymentAmount} ETH`,
//         smartContract: {
//           transactionHash: tx.hash,
//           blockNumber: receipt.blockNumber,
//           paymentAmount,
//           severityAssessment,
//           bountyAddress
//         }
//       });
      
//       onClose();
//     } catch (error) {
//       console.error('Smart contract payment failed:', error);
//       toast.error(`Payment failed: ${error.message}`);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleSmartContractRejection = async () => {
//     if (!bountyAddress || !signer || !feedback) {
//       toast.error('Missing required information for smart contract rejection');
//       return;
//     }

//     setIsProcessing(true);
//     try {
//       const bountyContract = new ethers.Contract(bountyAddress, ENHANCED_BOUNTY_ABI, signer);
//       const tx = await bountyContract.rejectSubmission(submission.id, feedback);
      
//       toast.loading(`Processing rejection transaction: ${tx.hash.slice(0, 10)}...`);
//       const receipt = await tx.wait();
//       toast.success('Submission rejected on blockchain');
      
//       onReject(submission.id, {
//         feedback,
//         smartContract: {
//           transactionHash: tx.hash,
//           blockNumber: receipt.blockNumber,
//           bountyAddress
//         }
//       });
      
//       onClose();
//     } catch (error) {
//       console.error('Smart contract rejection failed:', error);
//       toast.error(`Rejection failed: ${error.message}`);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleApprove = () => {
//     if (useSmartContract && bountyAddress) {
//       handleSmartContractPayment();
//     } else {
//       onApprove(submission.id, feedback);
//       onClose();
//     }
//   };

//   const handleReject = () => {
//     if (useSmartContract && bountyAddress) {
//       handleSmartContractRejection();
//     } else {
//       onReject(submission.id, feedback);
//       onClose();
//     }
//   };

//   const getSuggestedAmount = (severity) => {
//     const suggestions = {
//       'Low': '0.01',
//       'Medium': '0.05',
//       'High': '0.1',
//       'Critical': '0.25'
//     };
//     return suggestions[severity] || '0.01';
//   };

//   if (!isOpen || !submission) return null;

//   return (
//     <div className="fixed inset-0 bg-blue-900 bg-opacity-70 flex items-center justify-center z-50 p-4">
//       <div className="bg-blue-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-blue-600 shadow-xl">
//         <div className="flex items-center justify-between p-6 border-b border-blue-700">
//           <h2 className="text-xl font-semibold text-blue-100">Review Submission</h2>
//           <button
//             onClick={onClose}
//             className="text-blue-300 hover:text-blue-100 transition-colors"
//           >
//             <X className="h-6 w-6" />
//           </button>
//         </div>

//         <div className="p-6 space-y-6">
//           {/* Submission Details */}
//           <div className="bg-blue-900/50 rounded-lg p-4 border border-blue-700">
//             <h3 className="font-medium text-blue-100 mb-2">Submission Details</h3>
//             <div className="space-y-2 text-sm text-blue-200">
//               <div><span className="font-medium">Title:</span> {submission.title}</div>
//               <div><span className="font-medium">Severity:</span> {submission.severity}</div>
//               <div><span className="font-medium">Description:</span> {submission.description}</div>
//               <div><span className="font-medium">Proof of Concept:</span> {submission.proofOfConcept}</div>
//               {submission.recommendation && (
//                 <div><span className="font-medium">Recommended Fix:</span> {submission.recommendation}</div>
//               )}
//             </div>
//           </div>

//           {/* Smart Contract Toggle */}
//           {bountyAddress && (
//             <div className="bg-blue-700/50 rounded-lg p-4 border border-blue-600">
//               <div className="flex items-center space-x-3">
//                 <input
//                   type="checkbox"
//                   id="useSmartContract"
//                   checked={useSmartContract}
//                   onChange={(e) => setUseSmartContract(e.target.checked)}
//                   className="h-4 w-4 text-blue-400 focus:ring-blue-300 border-blue-500 rounded"
//                 />
//                 <label htmlFor="useSmartContract" className="text-sm font-medium text-blue-100">
//                   Use Smart Contract Payment (Recommended)
//                 </label>
//               </div>
//               <p className="text-xs text-blue-300 mt-1">
//                 Payments will be processed automatically via blockchain when approved
//               </p>
//             </div>
//           )}

//           {/* Payment Amount Input */}
//           {useSmartContract && bountyAddress && (
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-blue-100 mb-2">
//                   Payment Amount (ETH) *
//                 </label>
//                 <div className="flex space-x-2">
//                   <input
//                     type="number"
//                     step="0.001"
//                     value={paymentAmount}
//                     onChange={(e) => setPaymentAmount(e.target.value)}
//                     placeholder="0.01"
//                     className="flex-1 bg-blue-900/50 border border-blue-600 text-blue-100 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
//                   />
//                   <DollarSign className="h-10 w-10 text-blue-400 p-2" />
//                 </div>
//                 <div className="flex space-x-2 mt-2">
//                   {['Low', 'Medium', 'High', 'Critical'].map((severity) => (
//                     <button
//                       key={severity}
//                       onClick={() => {
//                         setPaymentAmount(getSuggestedAmount(severity));
//                         setSeverityAssessment(severity);
//                       }}
//                       className="px-3 py-1 text-xs bg-blue-700 hover:bg-blue-600 text-blue-100 rounded-md transition-colors"
//                     >
//                       {severity} ({getSuggestedAmount(severity)} ETH)
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-blue-100 mb-2">
//                   Severity Assessment *
//                 </label>
//                 <select
//                   value={severityAssessment}
//                   onChange={(e) => setSeverityAssessment(e.target.value)}
//                   className="w-full bg-blue-900/50 border border-blue-600 text-blue-100 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
//                 >
//                   <option value="">Select Severity</option>
//                   <option value="Low">Low</option>
//                   <option value="Medium">Medium</option>
//                   <option value="High">High</option>
//                   <option value="Critical">Critical</option>
//                 </select>
//               </div>
//             </div>
//           )}

//           {/* Feedback Input */}
//           <div>
//             <label className="block text-sm font-medium text-blue-100 mb-2">
//               {useSmartContract ? 'Additional Feedback (Optional)' : 'Feedback *'}
//             </label>
//             <textarea
//               value={feedback}
//               onChange={(e) => setFeedback(e.target.value)}
//               rows={4}
//               className="w-full bg-blue-900/50 border border-blue-600 text-blue-100 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
//               placeholder={useSmartContract ? "Any additional comments..." : "Provide feedback for your decision..."}
//             />
//           </div>

//           {/* Action Buttons */}
//           <div className="flex space-x-3 pt-4">
//             <button
//               onClick={handleApprove}
//               disabled={isProcessing || (useSmartContract && (!paymentAmount || !severityAssessment))}
//               className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center space-x-2"
//             >
//               {isProcessing ? (
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//               ) : (
//                 <CheckCircle className="h-4 w-4" />
//               )}
//               <span>
//                 {useSmartContract ? `Approve & Pay ${paymentAmount || '0'} ETH` : 'Approve'}
//               </span>
//             </button>
            
//             <button
//               onClick={handleReject}
//               disabled={isProcessing || (!feedback && !useSmartContract)}
//               className="flex-1 bg-red-600 hover:bg-red-500 disabled:bg-red-800 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center space-x-2"
//             >
//               {isProcessing ? (
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//               ) : (
//                 <XCircle className="h-4 w-4" />
//               )}
//               <span>Reject</span>
//             </button>
//           </div>

//           {/* Smart Contract Info */}
//           {useSmartContract && bountyAddress && (
//             <div className="bg-blue-700/30 border border-blue-600 rounded-lg p-3">
//               <div className="flex items-start space-x-2">
//                 <AlertTriangle className="h-4 w-4 text-blue-300 mt-0.5" />
//                 <div className="text-sm text-blue-200">
//                   <p className="font-medium">Smart Contract Payment</p>
//                   <p>This action will trigger a blockchain transaction. Make sure you have enough ETH for gas fees.</p>
//                   <p className="text-xs mt-1 font-mono">Bounty: {bountyAddress.slice(0, 10)}...{bountyAddress.slice(-8)}</p>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubmissionReviewModal;

// components/SubmissionReviewModal.jsx

import React from 'react';
import { X, Bug } from 'lucide-react';

const SubmissionReviewModal = ({ isOpen, onClose, submission }) => {
  if (!isOpen || !submission) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center px-4">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 w-full max-w-2xl relative overflow-y-auto max-h-[90vh]">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-1">Vulnerability Report</h2>
        <p className="text-gray-300 mb-4">{submission?.bountyTitle} • Severity: <span className="capitalize font-medium">{submission?.bountySeverity}</span></p>

        <div className="space-y-5">
          <div>
            <h4 className="text-white font-medium mb-1">Title</h4>
            <p className="text-gray-300 whitespace-pre-wrap">{submission?.title}</p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-1">Severity</h4>
            <p className="text-gray-300 capitalize">{submission?.severity}</p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-1">Description</h4>
            <p className="text-gray-300 whitespace-pre-wrap">{submission?.description}</p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-1">Proof of Concept</h4>
            <p className="text-gray-300 whitespace-pre-wrap">{submission?.proofOfConcept}</p>
          </div>

          {submission?.recommendation && (
            <div>
              <h4 className="text-white font-medium mb-1">Recommended Fix</h4>
              <p className="text-gray-300 whitespace-pre-wrap">{submission?.recommendation}</p>
            </div>
          )}
        </div>

        <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <h4 className="text-blue-400 font-medium mb-2 flex items-center">
            <Bug className="h-4 w-4 mr-2" />
            Report Metadata
          </h4>
          <ul className="text-sm text-blue-300 space-y-1">
            <li>Submitted by: <span className="font-medium">{submission?.hunterAddress}</span></li>
            <li>Status: <span className="capitalize">{submission?.status}</span></li>
            <li>Submitted at: {new Date(submission?.createdAt).toLocaleString()}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SubmissionReviewModal;
