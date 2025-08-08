import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, Github, Coins, Users, ArrowRight, CheckCircle, Zap, Lock, Award } from 'lucide-react'
import AnimatedCounter from '../components/AnimatedCounter'
import AnimatedCard from '../components/AnimatedCard'

const Home = () => {
  const features = [
    {
      icon: Shield,
      title: 'Secure Bug Reporting',
      description: 'Report vulnerabilities securely with IPFS storage and privacy protection',
      color: 'text-blue-400'
    },
    {
      icon: Github,
      title: 'GitHub Verification',
      description: 'Verify your identity through GitHub OAuth for trusted submissions',
      color: 'text-green-400'
    },
    {
      icon: Coins,
      title: 'Smart Contract Bounties',
      description: 'Automated payouts through Ethereum smart contracts',
      color: 'text-yellow-400'
    },
    {
      icon: Users,
      title: 'Developer Community',
      description: 'Join a community of verified developers and security researchers',
      color: 'text-purple-400'
    }
  ]

  const stats = [
    { label: 'Total Bounties', value: '1234', prefix: '', suffix: '' },
    { label: 'Bugs Fixed', value: '856', prefix: '', suffix: '' },
    { label: 'Rewards Paid', value: '2.4', prefix: '$', suffix: 'M' },
    { label: 'Active Hunters', value: '5678', prefix: '', suffix: '' }
  ]

  const benefits = [
    {
      icon: Zap,
      title: 'Lightning Fast Payouts',
      description: 'Get paid instantly through smart contracts when your submission is accepted'
    },
    {
      icon: Lock,
      title: 'Secure & Private',
      description: 'Your reports are encrypted and stored securely until disclosure'
    },
    {
      icon: Award,
      title: 'Build Reputation',
      description: 'Earn reputation points and climb the leaderboard as a top researcher'
    }
  ]

  const steps = [
    {
      number: '1',
      title: 'Connect & Verify',
      description: 'Connect your wallet and verify your GitHub account to get started'
    },
    {
      number: '2',
      title: 'Find & Report',
      description: 'Discover bounties and submit detailed vulnerability reports'
    },
    {
      number: '3',
      title: 'Get Rewarded',
      description: 'Receive automatic payments through smart contracts'
    }
  ]

  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <section className="w-full px-4 py-16 text-center space-y-8 relative">
        {/* Clean animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/5 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-purple-500/5 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-500/5 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <AnimatedCard delay={200} className="space-y-4 relative z-10 max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white">
            GitCoin <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Secure</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            A Web3 bug bounty platform connecting verified GitHub developers with secure vulnerability reporting
          </p>
        </AnimatedCard>
        
        <AnimatedCard delay={600} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard"
           className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white hover:text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-300"

          >
            <span>Get Started</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          <Link
            to="/create-bounty"
            className="group border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300"
          >
            Create Bounty
          </Link>
        </AnimatedCard>
      </section>

      {/* Animated Stats Section */}
      <section className="w-full px-4 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <AnimatedCard key={index} delay={800 + index * 200} hover={false}>
              <div className="text-center space-y-2 p-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                  <AnimatedCounter 
                    end={stat.value} 
                    prefix={stat.prefix} 
                    suffix={stat.suffix}
                    decimals={stat.value.includes('.') ? 1 : 0}
                    duration={2500}
                  />
                </div>
                <div className="text-gray-300 font-medium">{stat.label}</div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full px-4 py-16">
        <div className="max-w-6xl mx-auto space-y-12">
          <AnimatedCard delay={1600} className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Why Choose GitCoin Secure?</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Built for developers, by developers. Our platform combines the best of Web3 technology with proven security practices.
            </p>
          </AnimatedCard>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <AnimatedCard key={index} delay={2000 + index * 200} className="group">
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 transition-all duration-300 h-full">
                  <div className={`${feature.color} mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-12 w-12" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full px-4 py-16">
        <div className="max-w-6xl mx-auto space-y-12">
          <AnimatedCard delay={3200} className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">How It Works</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Simple, secure, and transparent bug bounty process powered by blockchain technology.
            </p>
          </AnimatedCard>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((item, index) => (
              <AnimatedCard key={index} delay={3600 + index * 300} className="text-center space-y-4 group">
                <div className="relative">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <span className="text-2xl font-bold text-white">{item.number}</span>
                  </div>
                  {index < 2 && index === 0 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-400/50 to-transparent"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-300">{item.description}</p>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full px-4 py-16">
        <div className="max-w-6xl mx-auto space-y-12">
          <AnimatedCard delay={4500} className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Why Researchers Choose Us</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Join thousands of security researchers earning rewards while making the web more secure.
            </p>
          </AnimatedCard>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <AnimatedCard key={index} delay={4900 + index * 200} className="group">
                <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10 transition-all duration-300">
                  <benefit.icon className="h-10 w-10 text-blue-400 mb-4 transform group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-300">{benefit.description}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <AnimatedCard delay={5700} className="relative overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center space-y-6 relative">
              {/* Clean animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'%3E%3C/circle%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
              </div>
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to Start Bug Hunting?</h2>
                <p className="text-blue-100 max-w-2xl mx-auto mt-4">
                  Join thousands of developers earning rewards for making the web more secure.
                </p>
                <Link
                  to="/dashboard"
                  className="group inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-xl mt-5"
                >
                  <span>Start Now</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </section>
    </div>
  )
}

export default Home