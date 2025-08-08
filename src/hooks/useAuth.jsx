// import { useState, useEffect, createContext, useContext } from 'react'
// import { useAccount } from 'wagmi'
// import axios from 'axios'

// const AuthContext = createContext(null)

// export const useAuth = () => {
//   const context = useContext(AuthContext)
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }
//   return context
// }

// export const AuthProvider = ({ children }) => {
//   const { address: walletAddress, isConnected } = useAccount();
//   const [user, setUser] = useState(null)
//   const [username, setUsername] = useState(null);
//   const [isGitHubConnected, setIsGitHubConnected] = useState(false)
//   const [isLoading, setIsLoading] = useState(true)
//   const [isVerified, setIsVerified] = useState(false)



// // useEffect(() => {
// //   if (address) {
// //     fetch(`http://localhost:5000/api/user/${address}`)
// //       .then((res) => res.json())
// //       .then((data) => {
// //         if (data.user) {
// //           setIsGitHubConnected(!!data.user.githubId);
// //           setIsVerified(data.user.isVerified);
// //           setUsername(data.user.username);
// //         }
// //       });
// //   }
// // }, [address]);
// useEffect(() => {
//   const fetchUserData = async () => {
//     if (!walletAddress) return;

//     try {
//       const res = await axios.get(`http://localhost:5000/api/user/${walletAddress}`);
//       const user = res.data.user;

//       setIsGitHubConnected(!!user.githubId);
//       setIsVerified(user.isVerified);
//       setUsername(user.username); 
//       // optionally: setUser(user);
//     } catch (err) {
//       console.error("Failed to fetch user:", err);
//     }
//   };

//   fetchUserData();
// }, [walletAddress]);


//   // Check for GitHub connection success on page load
//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search)
//     const githubStatus = urlParams.get('github')
//     const walletParam = urlParams.get('wallet')
    
//     if (githubStatus === 'connected' && walletParam && address) {
//       // Clear URL parameters
//       window.history.replaceState({}, document.title, window.location.pathname)
//       // Refresh auth status
//       setTimeout(() => {
//         checkAuthStatus()
//       }, 1000)
//     }
//   }, [address])

//   const checkAuthStatus = async () => {
//     if (!address) return
    
//     try {
//       setIsLoading(true)
//       const res = await axios.get(`http://localhost:5000/auth/github/callback/api/user/${address}`)
//       const userData = res.data.user

//       setUser(userData)
//       setIsGitHubConnected(!!userData.githubId)
//       setIsVerified(userData.isVerified && !!userData.githubId)
//     } catch (err) {
//       console.error('Error checking auth status:', err)
//       setUser(null)
//       setIsGitHubConnected(false)
//       setIsVerified(false)
//     } finally {
//       setIsLoading(false)
//     }
//   }
// const connectGitHub = () => {
//   if (!address) {
//     console.error('No wallet address available');
//     return;
//   }

//   try {
//     // Correct GitHub OAuth redirect URL with wallet address
//     const githubAuthUrl = `http://localhost:5000/auth/github?wallet=${address}`;
//     window.location.href = githubAuthUrl;
//   } catch (error) {
//     console.error('Error initiating GitHub connection:', error);
//   }
// };


//   const disconnectGitHub = async () => {
//     if (!address) return
    
//     try {
//       await axios.post('http://localhost:5000/auth/github/callback/api/disconnect-github', {
//         walletAddress: address,
//       })
//       setIsGitHubConnected(false)
//       setIsVerified(false)
//       await checkAuthStatus()
//     } catch (err) {
//       console.error('Error disconnecting GitHub:', err)
//       throw err
//     }
//   }

//   const linkWallet = async (walletAddress) => {
//     try {
//       const response = await axios.post('http://localhost:5000/auth/github/callback/api/link-wallet', {
//         walletAddress,
//       })
//       await checkAuthStatus()
//       return response.data
//     } catch (err) {
//       console.error('Error linking wallet:', err)
//       throw err
//     }
//   }

//   const value = {
//     user,
//     githubUser: user,
//     isGitHubConnected,
//     isVerified,
//     isLoading,
//     connectGitHub,
//     disconnectGitHub,
//     linkWallet,
//     checkAuthStatus,
 
//   }

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export default AuthContext
import { useState, useEffect, createContext, useContext } from 'react'
import { useAccount } from 'wagmi'
import axios from 'axios'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const { address: walletAddress, isConnected } = useAccount()

  const [user, setUser] = useState(null)
  const [username, setUsername] = useState(null)
  const [isGitHubConnected, setIsGitHubConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isVerified, setIsVerified] = useState(false)

  // ✅ Fetch user on wallet connect
  const fetchUserData = async () => {
    if (!walletAddress) return

    try {
      const res = await axios.get(`http://localhost:5000/api/user/${walletAddress}`)
      const user = res.data.user
      setUser(user)
      setIsGitHubConnected(!!user.githubId)
      setIsVerified(user.isVerified)
      setUsername(user.username)
    } catch (err) {
      console.error("Failed to fetch user:", err)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [walletAddress])

  // ✅ GitHub callback handler
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const githubStatus = urlParams.get('github')
    const walletParam = urlParams.get('wallet')

    if (githubStatus === 'connected' && walletParam && walletAddress) {
      window.history.replaceState({}, document.title, window.location.pathname)
      setTimeout(() => {
        checkAuthStatus()
      }, 1000)
    }
  }, [walletAddress])

  const checkAuthStatus = async () => {
    if (!walletAddress) return

    try {
      setIsLoading(true)
      const res = await axios.get(`http://localhost:5000/api/user/${walletAddress}`)
      const userData = res.data.user

      setUser(userData)
      setIsGitHubConnected(!!userData.githubId)
      setIsVerified(userData.isVerified && !!userData.githubId)
    } catch (err) {
      console.error('Error checking auth status:', err)
      setUser(null)
      setIsGitHubConnected(false)
      setIsVerified(false)
    } finally {
      setIsLoading(false)
    }
  }

  const connectGitHub = () => {
    if (!walletAddress) {
      console.error('No wallet address available')
      return
    }

    try {
      const githubAuthUrl = `http://localhost:5000/auth/github?wallet=${walletAddress}`
      window.location.href = githubAuthUrl
    } catch (error) {
      console.error('Error initiating GitHub connection:', error)
    }
  }

  const disconnectGitHub = async () => {
    if (!walletAddress) return

    try {
      await axios.post('http://localhost:5000/api/disconnect-github', {
        walletAddress,
      })
      setIsGitHubConnected(false)
      setIsVerified(false)
      await checkAuthStatus()
    } catch (err) {
      console.error('Error disconnecting GitHub:', err)
    }
  }

  const linkWallet = async () => {
    try {
      await axios.post('http://localhost:5000/api/link-wallet', {
        walletAddress,
      })
      await checkAuthStatus()
    } catch (err) {
      console.error('Error linking wallet:', err)
    }
  }

  const value = {
    user,
    githubUser: user,
    isGitHubConnected,
    isVerified,
    isLoading,
    connectGitHub,
    disconnectGitHub,
    linkWallet,
    checkAuthStatus,
    fetchUserData,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
