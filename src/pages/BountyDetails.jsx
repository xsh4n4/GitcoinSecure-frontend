import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { Calendar, Coins, Users, AlertTriangle, CheckCircle, Github, Globe, Send, ArrowLeft, FileText, Shield, Mail } from 'lucide-react';
import ProtectedRoute from '../components/ProtectedRoute';
import { useBounties } from '../hooks/useBounties';

const BountyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { address } = useAccount();
  const { getBountyById, isLoading } = useBounties(address);
  
  const bounty = getBountyById(id);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-400/10';
      case 'high': return 'text-orange-400 bg-orange-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'low': return 'text-green-400 bg-green-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10';
      case 'completed': return 'text-blue-400 bg-blue-400/10';
      case 'expired': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute requireGitHub={true}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
            <p className="text-gray-300">Loading bounty details...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!bounty) {
    return (
      <ProtectedRoute requireGitHub={true}>
        <div className="text-center space-y-6">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10 max-w-md mx-auto">
            <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Bounty Not Found</h2>
            <p className="text-gray-300 mb-6">
              The bounty you're looking for could not be found.
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
    <ProtectedRoute requireGitHub={true}>
      <div className="max-w-6xl mx-auto space-y-8 px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">{bounty.title}</h1>
            <p className="text-gray-300">by {bounty.company}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bounty Info */}
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(bounty.severity)}`}>
                  {bounty.severity}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bounty.status)}`}>
                  {bounty.status}
                </span>
                <span className="text-gray-400 text-sm">Category: {bounty.category}</span>
              </div>

              <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
              <p className="text-whiteleading-relaxed">{bounty.description}</p>
            </div>

            {/* Scope Section */}
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-5 w-5 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">Scope</h2>
              </div>
              <div className="bg-blue-500/30 rounded-lg p-4">
                <p className="text-white whitespace-pre-wrap">
                  {bounty.scope}
                </p>
              </div>
            </div>

            {/* Rules Section */}
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-5 w-5 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">Rules & Guidelines</h2>
              </div>
              <div className="bg-blue-500/30 rounded-lg p-4">
                <p className="text-white whitespace-pre-wrap">
                  {bounty.rules}
                </p>
              </div>
            </div>

            {/* Resources Section */}
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">Resources</h2>
              <div className="space-y-4">
                {bounty.github && (
                  <div className="flex items-center space-x-4 p-3 bg-blue-500/30 rounded-lg">
                    <Github className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <a
                      href={bounty.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-blue-300 break-all"
                    >
                      {bounty.github}
                    </a>
                  </div>
                )}
                
                {bounty.website && (
                  <div className="flex items-center space-x-4 p-3 bg-blue-500/30 rounded-lg">
                    <Globe className="h-5 w-5 text-white flex-shrink-0" />
                    <a
                      href={bounty.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-blue-300 break-all"
                    >
                      {bounty.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Reward Card */}
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">{bounty.reward}</div>
              <div className="text-gray-400 text-sm mb-4">Total Reward</div>
              
              {bounty.status === 'active' && (
                <Link
                  to={`/bounty/${id}/submit`}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                >
                  <Send className="h-4 w-4" />
                  <span>Submit Report</span>
                </Link>
              )}
              
              {bounty.status === 'completed' && (
                <div className="w-full bg-gray-600 text-gray-300 px-6 py-3 rounded-lg flex items-center justify-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Completed</span>
                </div>
              )}
              
              {bounty.status === 'expired' && (
                <div className="w-full bg-red-600 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Expired</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Bounty Stats</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">Deadline</span>
                  </div>
                  <span className="text-white">{bounty.deadline}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">Submissions</span>
                  </div>
                  <span className="text-white">{bounty.submissions}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">Created</span>
                  </div>
                  <span className="text-white">{new Date(bounty.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
              
              {bounty.email && (
                <div className="flex items-center space-x-3 p-3 bg-blue-500/30 rounded-lg">
                  <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <a
                    href={`mailto:${bounty.email}`}
                    className="text-white hover:text-blue-300 break-all"
                  >
                    {bounty.email}
                  </a>
                </div>
              )}
              
              <div className="mt-4 text-sm text-gray-400">
                <p>For questions about this bounty, please contact the project maintainers.</p>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
              <h3 className="text-blue-400 font-semibold mb-3">Submission Guidelines</h3>
              <ul className="text-sm text-blue-300 space-y-2">
                <li>• Provide detailed vulnerability description</li>
                <li>• Include step-by-step reproduction steps</li>
                <li>• Attach proof-of-concept code if applicable</li>
                <li>• Suggest remediation recommendations</li>
                <li>• Follow responsible disclosure practices</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default BountyDetails;