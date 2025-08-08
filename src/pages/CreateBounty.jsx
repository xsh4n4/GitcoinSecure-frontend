

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { 
  ArrowLeft, 
  Plus, 
  Calendar, 
  DollarSign, 
  Shield, 
  Building, 
  FileText, 
  AlertTriangle, 
  Github, 
  Globe, 
  Mail, 
  Code, 
  List,
  CheckCircle
} from 'lucide-react';
import ProtectedRoute from '../components/ProtectedRoute';
import AnimatedCard from '../components/AnimatedCard';
import { useBounties } from '../hooks/useBounties';

const CreateBounty = () => {
  const navigate = useNavigate();
  const { address } = useAccount();
  const { addBounty, refreshBounties } = useBounties(address);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reward: '',
    category: 'smart-contract',
    severity: 'medium',
    deadline: '',
    company: '',
    scope: '',
    rules: '',
    github: '',
    website: '',
    email: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear success message when user modifies form
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    const requiredFields = ['title', 'description', 'reward', 'deadline', 'company'];
    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = 'This field is required';
      }
    });
    
    if (formData.reward && (isNaN(parseFloat(formData.reward)) || parseFloat(formData.reward) <= 0)) {
      newErrors.reward = 'Reward must be a valid positive number';
    }
    
    if (formData.deadline) {
      const selectedDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate <= today) {
        newErrors.deadline = 'Deadline must be in the future';
      }
    }
    
    if (formData.github && !isValidUrl(formData.github)) {
      newErrors.github = 'Please enter a valid URL';
    }
    
    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Please enter a valid URL';
    }
    
    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const generateBountyId = () => {
    // Generate a unique ID for the bounty
    return `bounty_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const bountyId = generateBountyId();
      const currentTimestamp = new Date().toISOString();
      
      const newBounty = {
        id: bountyId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        reward: `${parseFloat(formData.reward).toFixed(1)} ETH`,
        category: formData.category,
        severity: formData.severity,
        deadline: formData.deadline,
        company: formData.company.trim(),
        scope: formData.scope.trim(),
        rules: formData.rules.trim(),
        github: formData.github.trim(),
        website: formData.website.trim(),
        email: formData.email.trim(),
        createdBy: address,
        createdAt: currentTimestamp,
        updatedAt: currentTimestamp,
        status: 'active',
        submissions: 0,
        isActive: true
      };
      
      console.log('Creating bounty:', newBounty);
      
      // Add the bounty
      const result = await addBounty(newBounty);
      console.log('Add bounty result:', result);
      
      // Refresh the bounties list to ensure the new bounty is included
      await refreshBounties();
      console.log('Bounties refreshed');
      
      // Show success message
      setSuccessMessage('Bounty created successfully! Redirecting to dashboard...');
      
      // Wait a moment to show success message, then navigate
      setTimeout(() => {
        navigate('/dashboard', { 
          state: { 
            message: 'Bounty created successfully!',
            newBounty: true,
            bountyId: bountyId
          }
        });
      }, 1500);
      
    } catch (error) {
      console.error('Error creating bounty:', error);
      setErrors({ 
        submit: `Failed to create bounty: ${error.message || 'Please try again.'}` 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'high': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'low': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <ProtectedRoute requireGitHub={true}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-12">
        {/* Header */}
        <AnimatedCard delay={100}>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="group bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
            </button>
            
            <div>
              <h1 className="text-3xl font-bold text-white">Create New Bounty</h1>
              <p className="text-gray-300 mb-6">Set up a new bug bounty program for your project</p>
            </div>
          </div>
        </AnimatedCard>

         <div className=' text-green-400'>
      {address ? (
        <p>Your wallet address is: {address}</p>
      ) : (
        <p >No wallet connected</p>
      )}
    </div>

        {/* Success Message */}
        {successMessage && (
          <AnimatedCard delay={150}>
            <div className="bg-green-400/10 border border-green-400/20 rounded-lg p-4 mb-6">
              <p className="text-green-400 flex items-center text-sm">
                <CheckCircle className="h-5 w-5 mr-2" />
                {successMessage}
              </p>
            </div>
          </AnimatedCard>
        )}

        {/* Form */}
        <AnimatedCard delay={200}>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 mt-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white border-b border-white/10 pb-2">Basic Information</h2>
                
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                    Bounty Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Smart Contract Security Audit"
                    className={`w-full px-3 py-2 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.title ? 'border-red-400' : 'border-white/20'
                    }`}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-400 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Describe what you're looking for security researchers to find..."
                    className={`w-full px-3 py-2 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                      errors.description ? 'border-red-400' : 'border-white/20'
                    }`}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-400 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Company */}
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">
                    Company/Project Name *
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="e.g., DeFi Protocol Inc."
                    className={`w-full px-3 py-2 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.company ? 'border-red-400' : 'border-white/20'
                    }`}
                  />
                  {errors.company && (
                    <p className="mt-1 text-sm text-red-400 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {errors.company}
                    </p>
                  )}
                </div>
              </div>

              {/* Reward and Deadline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Reward */}
                <div>
                  <label htmlFor="reward" className="block text-sm font-medium text-gray-300 mb-1">
                    Reward Amount (ETH) *
                  </label>
                  <input
                    type="number"
                    id="reward"
                    name="reward"
                    value={formData.reward}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    placeholder="e.g., 5.0"
                    className={`w-full px-3 py-2 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.reward ? 'border-red-400' : 'border-white/20'
                    }`}
                  />
                  {errors.reward && (
                    <p className="mt-1 text-sm text-red-400 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {errors.reward}
                    </p>
                  )}
                </div>

                {/* Deadline */}
                <div>
                  <label htmlFor="deadline" className="block text-sm font-medium text-gray-300 mb-1">
                    Deadline *
                  </label>
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-3 py-2 bg-white/10 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.deadline ? 'border-red-400' : 'border-white/20'
                    }`}
                  />
                  {errors.deadline && (
                    <p className="mt-1 text-sm text-red-400 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {errors.deadline}
                    </p>
                  )}
                </div>
              </div>

              {/* Category and Severity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="smart-contract">Smart Contract</option>
                    <option value="web-application">Web Application</option>
                    <option value="mobile-app">Mobile App</option>
                    <option value="infrastructure">Infrastructure</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="severity" className="block text-sm font-medium text-gray-300 mb-1">
                    Severity Level
                  </label>
                  <select
                    id="severity"
                    name="severity"
                    value={formData.severity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              {/* Scope and Rules */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Scope & Rules</h2>
                
                <div>
                  <label htmlFor="scope" className="block text-sm font-medium text-gray-300 mb-1">
                    Scope (What's included)
                  </label>
                  <textarea
                    id="scope"
                    name="scope"
                    value={formData.scope}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Define what systems, contracts, or applications are in scope for this bounty..."
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label htmlFor="rules" className="block text-sm font-medium text-gray-300 mb-1">
                    Rules & Guidelines
                  </label>
                  <textarea
                    id="rules"
                    name="rules"
                    value={formData.rules}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Specify any rules, guidelines, or restrictions for security researchers..."
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Contact Information</h2>
                
                <div>
                  <label htmlFor="github" className="block text-sm font-medium text-gray-300 mb-1">
                    GitHub Repository URL
                  </label>
                  <input
                    type="url"
                    id="github"
                    name="github"
                    value={formData.github}
                    onChange={handleInputChange}
                    placeholder="https://github.com/yourorg/yourrepo"
                    className={`w-full px-3 py-2 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.github ? 'border-red-400' : 'border-white/20'
                    }`}
                  />
                  {errors.github && (
                    <p className="mt-1 text-sm text-red-400 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {errors.github}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-1">
                    Project Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://yourproject.com"
                    className={`w-full px-3 py-2 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.website ? 'border-red-400' : 'border-white/20'
                    }`}
                  />
                  {errors.website && (
                    <p className="mt-1 text-sm text-red-400 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {errors.website}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="security@yourproject.com"
                    className={`w-full px-3 py-2 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-400' : 'border-white/20'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>Create Bounty</span>
                    </>
                  )}
                </button>
              </div>

              {errors.submit && (
                <div className="bg-red-400/10 border border-red-400/20 rounded-lg p-3">
                  <p className="text-red-400 flex items-center text-sm">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    {errors.submit}
                  </p>
                </div>
              )}
            </form>
          </div>
        </AnimatedCard>
      </div>
    </ProtectedRoute>
  );
};

export default CreateBounty;

