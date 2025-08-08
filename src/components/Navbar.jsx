// import React from 'react'
// import { Link, useLocation } from 'react-router-dom'
// import { ConnectButton } from '@rainbow-me/rainbowkit'
// import { useAccount } from 'wagmi'
// import { Shield, Home, Plus, User, BarChart3, Github, CheckCircle } from 'lucide-react'
// import { useAuth } from '../hooks/useAuth'

// const Navbar = () => {
//   const location = useLocation()
//   const { isConnected } = useAccount()
//   const { isGitHubConnected, isVerified, connectGitHub, user } = useAuth()

//   const navItems = [
//     { path: '/', label: 'Home', icon: Home },
//     { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
//     { path: '/create-bounty', label: 'Create Bounty', icon: Plus },
//     { path: '/payouts', label: 'Payouts', icon: Shield },
//     { path: '/profile', label: 'Profile', icon: User },
//   ]

//   return (
//     <nav className="bg-black/20 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <Link to="/" className="flex items-center space-x-2 group">
//             <Shield className="h-6 w-8 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
//             <span className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
//               GitCoin Secure
//             </span>
//           </Link>

//           {/* Navigation Links */}
//           <div className="hidden md:flex items-center space-x-8">
//             {navItems.map(({ path, label, icon: Icon }) => (
//               <Link
//                 key={path}
//                 to={path}
//                 className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-300 ${
//                   location.pathname === path
//                     ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
//                     : 'text-gray-300 hover:text-white hover:bg-white/10'
//                 }`}
//               >
//                 <Icon className="h-3.5 w-3.5" />
//                 <span>{label}</span>
//               </Link>
//             ))}
//           </div>

//           {/* Right side buttons */}
//           <div className="flex items-center space-x-3">
//             {/* GitHub Connection Status */}
//             {isConnected && (
//               <div className="flex items-center space-x-2">
//                 {isGitHubConnected && isVerified ? (
//                   <div className="flex items-center space-x-2 bg-green-600/20 border border-green-600/30 px-3 py-2 rounded-lg">
//                     <CheckCircle className="h-3.5 w-3.5 text-green-400" />
//                     <span className="text-green-400 text-sm font-medium">
//                       {user?.username || 'Verified'}
//                     </span>
//                   </div>
//                 ) : isGitHubConnected && !isVerified ? (
//                   <div className="flex items-center space-x-2 bg-yellow-600/20 border border-yellow-600/30 px-3 py-2 rounded-lg">
//                     <Github className="h-3.5 w-3.5 text-yellow-400" />
//                     <span className="text-yellow-400 text-sm font-medium">Pending</span>
//                   </div>
//                 ) : (
//                   <button
//                     onClick={connectGitHub}
//                     className="group flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-gray-500 px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
//                   >
//                     <Github className="h-3.5 w-3.5 text-gray-300 group-hover:text-white" />
//                     <span className="text-gray-300 group-hover:text-white text-sm font-medium">
//                       Connect GitHub
//                     </span>
//                   </button>
//                 )}
//               </div>
//             )}

//             {/* Connect Wallet Button */}
//             <ConnectButton />
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         <div className="md:hidden pb-4">
//           <div className="flex flex-wrap gap-2 mb-3">
//             {navItems.map(({ path, label, icon: Icon }) => (
//               <Link
//                 key={path}
//                 to={path}
//                 className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-300 ${
//                   location.pathname === path
//                     ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
//                     : 'text-gray-300 hover:text-white hover:bg-white/10'
//                 }`}
//               >
//                 <Icon className="h-3.5 w-3.5" />
//                 <span className="text-sm">{label}</span>
//               </Link>
//             ))}
//           </div>

//           {/* Mobile GitHub Connection */}
//           {isConnected && (
//             <div className="flex justify-center">
//               {isGitHubConnected && isVerified ? (
//                 <div className="flex items-center space-x-2 bg-green-600/20 border border-green-600/30 px-3 py-2 rounded-lg">
//                   <CheckCircle className="h-3.5 w-3.5 text-green-400" />
//                   <span className="text-green-400 text-sm font-medium">
//                     GitHub: {user?.username || 'Verified'}
//                   </span>
//                 </div>
//               ) : isGitHubConnected && !isVerified ? (
//                 <div className="flex items-center space-x-2 bg-yellow-600/20 border border-yellow-600/30 px-3 py-2 rounded-lg">
//                   <Github className="h-3.5 w-3.5 text-yellow-400" />
//                   <span className="text-yellow-400 text-sm font-medium">GitHub: Pending</span>
//                 </div>
//               ) : (
//                 <button
//                   onClick={connectGitHub}
//                   className="group flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-gray-500 px-3 py-2 rounded-lg transition-all duration-300"
//                 >
//                   <Github className="h-3.5 w-3.5 text-gray-300 group-hover:text-white" />
//                   <span className="text-gray-300 group-hover:text-white text-sm font-medium">
//                     Connect GitHub
//                   </span>
//                 </button>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   )
// }

// export default Navbar
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { Shield, Home, Plus, User, BarChart3, Github, CheckCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const Navbar = () => {
  const location = useLocation()
  const { isConnected } = useAccount()
  const { isGitHubConnected, isVerified, connectGitHub, user } = useAuth()

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/create-bounty', label: 'Create Bounty', icon: Plus },
    { path: '/payouts', label: 'Payouts', icon: Shield },
    { path: '/profile', label: 'Profile', icon: User },
  ]

  return (
    <nav className="bg-black/20 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-3 md:px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 group whitespace-nowrap"
          >
            <Shield className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
            <span className="text-base md:text-lg font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
              GitCoin Secure
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-sm whitespace-nowrap transition-all duration-300 ${
  location.pathname === path
    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
    : 'text-gray-300 hover:text-white hover:bg-white/10'
} ${location.pathname === path ? '!text-white' : ''}`}

              >
                <Icon className="h-4 w-4" />
                <span className="truncate">{label}</span>
              </Link>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {isConnected && (
              <div className="flex items-center space-x-2">
                {isGitHubConnected && isVerified ? (
                  <div className="flex items-center space-x-1.5 bg-green-600/20 border border-green-600/30 px-2.5 py-1.5 rounded-md text-sm whitespace-nowrap">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-green-400 font-medium">
                      {user?.username || 'Verified'}
                    </span>
                  </div>
                ) : isGitHubConnected && !isVerified ? (
                  <div className="flex items-center space-x-1.5 bg-yellow-600/20 border border-yellow-600/30 px-2.5 py-1.5 rounded-md text-sm whitespace-nowrap">
                    <Github className="h-4 w-4 text-yellow-400" />
                    <span className="text-yellow-400 font-medium">Pending</span>
                  </div>
                ) : (
                  <button
                    onClick={connectGitHub}
                    className="group flex items-center space-x-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-gray-500 px-2.5 py-1.5 rounded-md text-sm whitespace-nowrap transition-all duration-300 transform hover:scale-[1.03]"
                  >
                    <Github className="h-4 w-4 text-gray-300 group-hover:text-white" />
                    <span className="text-gray-300 group-hover:text-white font-medium">
                      Connect GitHub
                    </span>
                  </button>
                )}
              </div>
            )}

            <div className="scale-90 whitespace-nowrap">
              <ConnectButton />
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-sm whitespace-nowrap transition-all duration-300 ${
                  location.pathname === path
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="truncate">{label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile GitHub Connection */}
          {isConnected && (
            <div className="flex justify-center mt-3">
              {isGitHubConnected && isVerified ? (
                <div className="flex items-center space-x-1.5 bg-green-600/20 border border-green-600/30 px-2.5 py-1.5 rounded-md text-sm whitespace-nowrap">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 font-medium">
                    GitHub: {user?.username || 'Verified'}
                  </span>
                </div>
              ) : isGitHubConnected && !isVerified ? (
                <div className="flex items-center space-x-1.5 bg-yellow-600/20 border border-yellow-600/30 px-2.5 py-1.5 rounded-md text-sm whitespace-nowrap">
                  <Github className="h-4 w-4 text-yellow-400" />
                  <span className="text-yellow-400 font-medium">GitHub: Pending</span>
                </div>
              ) : (
                <button
                  onClick={connectGitHub}
                  className="group flex items-center space-x-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-gray-500 px-2.5 py-1.5 rounded-md text-sm whitespace-nowrap transition-all duration-300"
                >
                  <Github className="h-4 w-4 text-gray-300 group-hover:text-white" />
                  <span className="text-gray-300 group-hover:text-white font-medium">
                    Connect GitHub
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
