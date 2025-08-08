// import React from 'react'
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import { WagmiConfig } from 'wagmi'
// import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { config, chains } from './config/wagmi'
// import { AuthProvider } from './hooks/useAuth'
// import Navbar from './components/Navbar'
// import Home from './pages/Home'
// import Dashboard from './pages/Dashboard'
// import CreateBounty from './pages/CreateBounty'
// import BountyDetails from './pages/BountyDetails'
// import SubmitReport from './pages/SubmitReport'
// import Profile from './pages/Profile'
// import Payouts from './pages/Payouts'

// import '@rainbow-me/rainbowkit/styles.css'

// const queryClient = new QueryClient()

// function App() {
//   return (
//     <WagmiConfig config={config}>
//       <QueryClientProvider client={queryClient}>
//         <RainbowKitProvider chains={chains}>
//           <AuthProvider>
//             <Router>
//               <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
//                 <Navbar />
//                 <main className="container mx-auto px-4 py-8">
//                   <Routes>
//                     <Route path="/" element={<Home />} />
//                     <Route path="/dashboard" element={<Dashboard />} />
//                     <Route path="/create-bounty" element={<CreateBounty />} />
//                     <Route path="/bounty/:id" element={<BountyDetails />} />
//                     <Route path="/bounty/:id/submit" element={<SubmitReport />} />
//                     <Route path="/profile" element={<Profile />} />
//                     <Route path="/payouts" element={<Payouts />} />
//                   </Routes>
//                 </main>
//               </div>
//             </Router>
//           </AuthProvider>
//         </RainbowKitProvider>
//       </QueryClientProvider>
//     </WagmiConfig>
//   )
// }

// export default App

import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { WagmiConfig } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config, chains } from './config/wagmi'
import { AuthProvider } from './hooks/useAuth'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import CreateBounty from './pages/CreateBounty'
import BountyDetails from './pages/BountyDetails'
import SubmitReport from './pages/SubmitReport'
import Profile from './pages/Profile'
import Payouts from './pages/Payouts'
import Transactions from './pages/Transactions'

import '@rainbow-me/rainbowkit/styles.css'

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={chains}>
          <AuthProvider>
            <Router>
              <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
                <Navbar />
                <main className="w-full">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/create-bounty" element={<CreateBounty />} />
                    <Route path="/bounty/:id" element={<BountyDetails />} />
                    <Route path="/bounty/:id/submit" element={<SubmitReport />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/payouts" element={<Payouts />} />
                    <Route path="/transactions" element={<Transactions />} /> 
                  </Routes>
                </main>
              </div>
            </Router>
          </AuthProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  )
}

export default App

