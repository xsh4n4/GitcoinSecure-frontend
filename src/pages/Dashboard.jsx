
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { Search, Filter, Plus, Eye, Clock, Award, TrendingUp, RefreshCw, Activity, CheckCircle, XCircle } from 'lucide-react'
import ProtectedRoute from '../components/ProtectedRoute'
import AnimatedCounter from '../components/AnimatedCounter'
import AnimatedCard from '../components/AnimatedCard'
import { useBounties } from '../hooks/useBounties'
import { useUserSubmissions } from '../hooks/useSubmissions'

const Dashboard = () => {
  const { address } = useAccount()
  const { bounties, isLoading, error, refreshBounties, deleteBounty } = useBounties(address)
  const { submissions, stats, isLoading: submissionsLoading, refreshSubmissions } = useUserSubmissions(address)
  const [filteredBounties, setFilteredBounties] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSeverity, setSelectedSeverity] = useState('all')
  const [showUserOnly, setShowUserOnly] = useState(false)

  useEffect(() => {
    applyFilters()
  }, [bounties, searchTerm, selectedCategory, selectedSeverity, showUserOnly])

  const filterBounties = (filters) => {
    return bounties.filter(b => {
      const matchesSearch =
        filters.search === '' || b.title.toLowerCase().includes(filters.search.toLowerCase())

      const matchesCategory =
        filters.category === 'all' || b.category === filters.category

      const matchesSeverity =
        filters.severity === 'all' || b.severity === filters.severity

      const matchesUserOnly =
        !filters.userOnly || b.createdBy === address

      return matchesSearch && matchesCategory && matchesSeverity && matchesUserOnly
    })
  }

  const applyFilters = () => {
    const filters = {
      search: searchTerm,
      category: selectedCategory,
      severity: selectedSeverity,
      userOnly: showUserOnly
    }
    
    const filtered = filterBounties(filters)
    setFilteredBounties(filtered)
  }

  const handleDelete = async (bountyId) => {
    if (window.confirm('Are you sure you want to delete this bounty?')) {
      try {
        await deleteBounty(bountyId)
        refreshBounties() // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting bounty:', error)
      }
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10'
      case 'completed': return 'text-blue-400 bg-blue-400/10'
      case 'expired': return 'text-red-400 bg-red-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  const handleRefresh = () => {
    refreshBounties()
    refreshSubmissions()
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSelectedSeverity('all')
    setShowUserOnly(false)
  }

  const dashboardStats = [
    {
      label: 'Active Bounties',
      value: bounties.filter(b => b.status === 'active').length,
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
    {
      label: 'Total Rewards',
      value: bounties.reduce((sum, b) => sum + parseFloat(b.reward.replace(' ETH', '')), 0).toFixed(1),
      suffix: ' ETH',
      icon: Award,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      label: 'Your Bounties',
      value: bounties.filter(b => b.createdBy === address).length,
      icon: Award,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10'
    }
  ]

  return (
    <ProtectedRoute requireGitHub={true}>
      <div className="space-y-8 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Clean animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-32 h-32 bg-blue-500/3 rounded-full animate-pulse"></div>
          <div className="absolute bottom-40 left-10 w-24 h-24 bg-purple-500/3 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Header */}
        <AnimatedCard delay={100} className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-300">Discover and participate in bug bounty programs</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                className="group bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 transform hover:scale-105"
                title="Refresh bounties and submissions"
              >
                <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                <span>Refresh</span>
              </button>
              
              <Link
                to="/create-bounty"
                className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white hover:text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                <span>Create Bounty</span>
              </Link>
            </div>
          </div>
        </AnimatedCard>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardStats.map((stat, index) => (
            <AnimatedCard key={index} delay={300 + index * 100} className="group">
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>
                      <AnimatedCounter 
                        end={stat.value} 
                        suffix={stat.suffix || ''} 
                        duration={2000}
                        decimals={stat.value.toString().includes('.') ? 1 : 0}
                      />
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor} transform group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>

        {/* Search and Filters */}
        <AnimatedCard delay={800}>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-300" />
                <input
                  type="text"
                  placeholder="Search bounties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              >
                <option value="all">All Categories</option>
                <option value="smart-contract">Smart Contract</option>
                <option value="web-application">Web Application</option>
                <option value="mobile-app">Mobile App</option>
                <option value="infrastructure">Infrastructure</option>
              </select>

              {/* Severity Filter */}
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              {/* My Bounties Toggle */}
              <label className="flex items-center space-x-2 cursor-pointer px-4 py-2 bg-white/10 border border-white/20 rounded-lg">
                <input
                  type="checkbox"
                  checked={showUserOnly}
                  onChange={(e) => setShowUserOnly(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-gray-300 text-sm whitespace-nowrap">My Bounties</span>
              </label>

              {/* Clear Filters Button */}
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center space-x-2 transition-all duration-300 transform hover:scale-105"
              >
                <Filter className="h-4 w-4" />
                <span>Clear</span>
              </button>
            </div>

            {/* Filter Summary */}
            {(searchTerm || selectedCategory !== 'all' || selectedSeverity !== 'all' || showUserOnly) && (
              <div className="flex items-center justify-between text-sm text-gray-400 pt-4 mt-4 border-t border-white/10">
                <span>
                  Showing {filteredBounties.length} of {bounties.length} bounties
                  {showUserOnly && ' (your bounties only)'}
                </span>
                <span className="text-blue-400">
                  {searchTerm && `"${searchTerm}"`}
                  {selectedCategory !== 'all' && ` • ${selectedCategory}`}
                  {selectedSeverity !== 'all' && ` • ${selectedSeverity}`}
                </span>
              </div>
            )}
          </div>
        </AnimatedCard>

        {/* Bounties List */}
        <div className="space-y-6">
          {isLoading ? (
            <AnimatedCard delay={1000}>
              <div className="text-center py-12">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-blue-400/20 animate-pulse"></div>
                </div>
                <p className="text-gray-300 mt-4">Loading bounties...</p>
              </div>
            </AnimatedCard>
          ) : filteredBounties.length === 0 ? (
            <AnimatedCard delay={1000}>
              <div className="text-center py-12">
                <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-white text-lg font-medium mb-2">No bounties found</h3>
                <p className="text-gray-300 mb-4">
                  {searchTerm || selectedCategory !== 'all' || selectedSeverity !== 'all' || showUserOnly
                    ? 'Try adjusting your search criteria or filters.'
                    : 'No bounties are currently available.'}
                </p>
                {(searchTerm || selectedCategory !== 'all' || selectedSeverity !== 'all' || showUserOnly) && (
                  <button
                    onClick={clearFilters}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </AnimatedCard>
          ) : (
            filteredBounties.map((bounty, index) => (
              <AnimatedCard key={bounty.id} delay={1000 + index * 100} className="group">
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 transition-all duration-300">
                  <div className="flex flex-col lg:flex-row justify-between items-start space-y-4 lg:space-y-0">
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">
                          {bounty.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(bounty.severity)}`}>
                          {bounty.severity}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bounty.status)}`}>
                          {bounty.status}
                        </span>
                        {address && bounty.createdBy === address && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-400/10 text-purple-400">
                            Your Bounty
                          </span>
                        )}
                      </div>

                      <p className="text-gray-300 line-clamp-2">{bounty.description}</p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                        <span>Company: {bounty.company}</span>
                        <span>•</span>
                        <span>Deadline: {bounty.deadline}</span>
                        <span>•</span>
                        <span>{bounty.submissions} submissions</span>
                      </div>
                    </div>

                    <div className="flex flex-col lg:items-end space-y-3">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                          {bounty.reward}
                        </div>
                        <div className="text-gray-400 text-sm">Reward</div>
                      </div>

                      <div className="flex space-x-2">
                        {address && bounty.createdBy === address && (
                          <button
                            onClick={() => handleDelete(bounty.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                          >
                            Delete
                          </button>
                        )}
                        <Link
                          to={`/bounty/${bounty.id}`}
                          className="group bg-blue-600 hover:bg-blue-700 text-white hover:text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 transform hover:scale-105"
                        >
                          <Eye className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                          <span>View Details</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            ))
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default Dashboard