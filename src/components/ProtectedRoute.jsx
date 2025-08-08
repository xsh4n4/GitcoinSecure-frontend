import React from 'react'
import { useAccount } from 'wagmi'
import { useAuth } from '../hooks/useAuth'
import { AlertTriangle, Github, Shield } from 'lucide-react'

const ProtectedRoute = ({ children, requireGitHub = true }) => {
  const { isConnected } = useAccount()
  const { isGitHubConnected, isVerified, connectGitHub } = useAuth()

  if (!isConnected) {
    return (
      <div className="text-center space-y-6">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10 max-w-md mx-auto mt-20">
          <AlertTriangle className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-300 mb-6">
            Please connect your wallet to access this feature.
          </p>
          <div className="text-sm text-gray-400">
            Use the "Connect Wallet" button in the top navigation.
          </div>
        </div>
      </div>
    )
  }

  if (requireGitHub && !isGitHubConnected) {
    return (
      <div className="text-center space-y-6">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10 max-w-md mx-auto mt-20">
          <Github className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">GitHub Verification Required</h2>
          <p className="text-gray-300 mb-6">
            You need to connect and verify your GitHub account to access this feature.
          </p>
          <button
            onClick={connectGitHub}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <Github className="h-5 w-5" />
            <span>Connect GitHub</span>
          </button>
          <div className="mt-4 text-sm text-gray-400">
            This helps us verify your identity and maintain platform security.
          </div>
        </div>
      </div>
    )
  }

  if (requireGitHub && isGitHubConnected && !isVerified) {
    // ⚠️ Optional: skip this if you don't need verification gating
    return (
      <div className="text-center space-y-6">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10 max-w-md mx-auto">
          <Shield className="h-16 w-16 text-orange-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Verification Pending</h2>
          <p className="text-gray-300 mb-6">
            Your GitHub account is connected but verification is still pending.
          </p>
          <div className="bg-orange-400/10 border border-orange-400/20 rounded-lg p-4">
            <p className="text-orange-400 text-sm">
              Please wait or refresh the page if you're already verified.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute
