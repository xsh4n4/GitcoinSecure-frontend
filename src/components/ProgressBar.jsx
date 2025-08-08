import React, { useState, useEffect } from 'react'

const ProgressBar = ({ 
  percentage, 
  height = 'h-3', 
  color = 'bg-gradient-to-r from-blue-400 to-purple-600',
  backgroundColor = 'bg-gray-700',
  animated = true,
  duration = 1500
}) => {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setWidth(percentage)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setWidth(percentage)
    }
  }, [percentage, animated])

  return (
    <div className={`w-full ${backgroundColor} rounded-full ${height} overflow-hidden`}>
      <div 
        className={`${height} ${color} rounded-full transition-all duration-${duration} ease-out`}
        style={{ width: `${width}%` }}
      >
        {animated && (
          <div className="w-full h-full bg-white/20 animate-pulse rounded-full"></div>
        )}
      </div>
    </div>
  )
}

export default ProgressBar

