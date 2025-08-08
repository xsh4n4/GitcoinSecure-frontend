

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Send, AlertCircle, Shield, Bug, Loader2, CheckCircle } from 'lucide-react';
import ProtectedRoute from '../components/ProtectedRoute';
import { useBounties } from '../hooks/useBounties';
import { useUserSubmissions } from '../hooks/useSubmissions';

const SubmitReport = () => {
  const navigate = useNavigate();
  const { id: bountyId } = useParams();
  const { address } = useAccount();
  const { getBountyById } = useBounties(address);
  const { addSubmission } = useUserSubmissions(address);
  
  const [bounty, setBounty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [loadError, setLoadError] = useState(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    reset,
    watch
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  });

  useEffect(() => {
    let isMounted = true;
    
    const fetchBounty = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const bountyData = await getBountyById(bountyId);
        
        if (!isMounted) return;
        
        if (!bountyData) {
          throw new Error('Bounty not found');
        }

        setBounty(bountyData);
      } catch (error) {
        if (isMounted) {
          console.error('Error loading bounty:', error);
          setLoadError(error.message || 'Failed to load bounty details');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (bountyId) {
      fetchBounty();
    }

    return () => {
      isMounted = false;
    };
  }, [bountyId, getBountyById]);

  const onSubmit = async (data) => {
    if (!bounty) return;
    
    try {
      setIsSubmitting(true);
      setSubmitError('');

      const submission = {
        id: `sub-${Date.now()}`,
        bountyId,
        bountyTitle: bounty.title,
        bountyReward: bounty.reward,
        bountySeverity: bounty.severity,
        hunterAddress: address,
        status: 'pending',
        createdAt: new Date().toISOString(),
        ...data
      };

      await addSubmission(submission);

      setShowSuccess(true);
      reset();
      
      setTimeout(() => {
        navigate(`/bounty/${bountyId}`, {
          state: { 
            message: 'Report submitted successfully!',
            isNewSubmission: true
          }
        });
      }, 2000);
      
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(error.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
            <p className="text-gray-300">Loading bounty details...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (loadError) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-6 max-w-md mx-auto p-6 bg-white/5 rounded-xl">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold text-white">Error Loading Bounty</h2>
            <p className="text-gray-300 mb-6">
              {loadError}
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!bounty) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-6 max-w-md mx-auto p-6 bg-white/5 rounded-xl">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold text-white">Bounty Not Found</h2>
            <p className="text-gray-300 mb-6">
              The bounty you're trying to access doesn't exist or may have been removed.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(`/bounty/${bountyId}`)}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Submit Vulnerability Report</h1>
            <p className="text-gray-300">For: {bounty.title}</p>
          </div>
        </div>

        {showSuccess && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center animate-pulse">
            <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
            <span className="text-green-400 font-medium">Report submitted successfully! Redirecting...</span>
          </div>
        )}

        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title *
              </label>
              <input
                {...register('title', { 
                  required: 'Title is required' // Removed minLength validation
                })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 whitespace-pre-wrap break-words overflow-hidden"
                placeholder="Brief title of the vulnerability"
                disabled={isSubmitting || showSuccess}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Severity *
              </label>
              <select
                {...register('severity', { required: 'Please select severity' })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 whitespace-pre-wrap break-words overflow-hidden"
                disabled={isSubmitting || showSuccess}
              >
                <option value="">Select severity level</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              {errors.severity && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.severity.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                {...register('description', { 
                  required: 'Description is required' // Removed minLength validation
                })}
                rows={5}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 whitespace-pre-wrap break-words overflow-hidden"
                placeholder="Detailed description of the vulnerability..."
                disabled={isSubmitting || showSuccess}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Proof of Concept *
              </label>
              <textarea
                {...register('proofOfConcept', { 
                  required: 'Proof of concept is required' // Removed minLength validation
                })}
                rows={6}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 whitespace-pre-wrap break-words overflow-hidden"
                placeholder="Step-by-step reproduction instructions..."
                disabled={isSubmitting || showSuccess}
              />
              {errors.proofOfConcept && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.proofOfConcept.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Recommended Fix (Optional)
              </label>
              <textarea
                {...register('recommendation')}
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 whitespace-pre-wrap break-words overflow-hidden"
                placeholder="Suggested fixes or mitigations..."
                disabled={isSubmitting || showSuccess}
              />
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h4 className="text-blue-400 font-medium mb-2 flex items-center">
                <Bug className="h-4 w-4 mr-2" />
                Submission Guidelines
              </h4>
              <ul className="text-sm text-blue-300 space-y-1">
                <li>• Provide clear reproduction steps</li>
                <li>• Include screenshots or code snippets when possible</li>
                <li>• Be specific about impact and attack vectors</li>
              </ul>
            </div>

            {submitError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <span className="text-red-400">{submitError}</span>
              </div>
            )}

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(`/bounty/${bountyId}`)}
                className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                disabled={isSubmitting || showSuccess}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || showSuccess || !isValid}
                className={`px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200 ${
                  isSubmitting || showSuccess || !isValid
                    ? 'bg-blue-600/50 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : showSuccess ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span>Submitted!</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Submit Report</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default SubmitReport;