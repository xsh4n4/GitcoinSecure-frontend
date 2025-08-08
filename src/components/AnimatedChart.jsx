import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'

const AnimatedChart = ({ data, title, type = 'line', color = 'blue' }) => {
  const [animatedData, setAnimatedData] = useState([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById(`chart-${title}`)
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [title])

  useEffect(() => {
    if (!isVisible) return

    const animateData = () => {
      data.forEach((point, index) => {
        setTimeout(() => {
          setAnimatedData(prev => [...prev, point])
        }, index * 100)
      })
    }

    animateData()
  }, [isVisible, data])

  const maxValue = Math.max(...data.map(d => d.value))
  const minValue = Math.min(...data.map(d => d.value))
  const range = maxValue - minValue

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        line: 'stroke-blue-400',
        fill: 'fill-blue-400/20',
        dot: 'fill-blue-400',
        text: 'text-blue-400'
      },
      green: {
        line: 'stroke-green-400',
        fill: 'fill-green-400/20',
        dot: 'fill-green-400',
        text: 'text-green-400'
      },
      purple: {
        line: 'stroke-purple-400',
        fill: 'fill-purple-400/20',
        dot: 'fill-purple-400',
        text: 'text-purple-400'
      },
      orange: {
        line: 'stroke-orange-400',
        fill: 'fill-orange-400/20',
        dot: 'fill-orange-400',
        text: 'text-orange-400'
      }
    }
    return colors[color] || colors.blue
  }

  const colorClasses = getColorClasses(color)

  const createPath = () => {
    if (animatedData.length === 0) return ''

    const width = 300
    const height = 100
    const padding = 20

    const points = animatedData.map((point, index) => {
      const x = padding + (index * (width - 2 * padding)) / (data.length - 1)
      const y = height - padding - ((point.value - minValue) / range) * (height - 2 * padding)
      return `${x},${y}`
    })

    return `M ${points.join(' L ')}`
  }

  const createAreaPath = () => {
    if (animatedData.length === 0) return ''

    const width = 300
    const height = 100
    const padding = 20

    const points = animatedData.map((point, index) => {
      const x = padding + (index * (width - 2 * padding)) / (data.length - 1)
      const y = height - padding - ((point.value - minValue) / range) * (height - 2 * padding)
      return `${x},${y}`
    })

    const firstPoint = points[0]?.split(',')
    const lastPoint = points[points.length - 1]?.split(',')

    if (!firstPoint || !lastPoint) return ''

    return `M ${firstPoint[0]},${height - padding} L ${points.join(' L ')} L ${lastPoint[0]},${height - padding} Z`
  }

  const trend = data.length > 1 ? data[data.length - 1].value - data[0].value : 0
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Activity

  return (
    <div id={`chart-${title}`} className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className={`flex items-center space-x-1 ${colorClasses.text}`}>
          <TrendIcon className="h-4 w-4" />
          <span className="text-sm font-medium">
            {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="relative">
        <svg width="300" height="100" className="w-full h-24">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="30" height="20" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 20" fill="none" stroke="rgb(75 85 99)" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Area fill */}
          {type === 'area' && (
            <path
              d={createAreaPath()}
              className={`${colorClasses.fill} transition-all duration-1000 ease-out`}
            />
          )}

          {/* Line */}
          <path
            d={createPath()}
            fill="none"
            className={`${colorClasses.line} transition-all duration-1000 ease-out`}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {animatedData.map((point, index) => {
            const width = 300
            const height = 100
            const padding = 20
            const x = padding + (index * (width - 2 * padding)) / (data.length - 1)
            const y = height - padding - ((point.value - minValue) / range) * (height - 2 * padding)

            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                className={`${colorClasses.dot} transition-all duration-300 ease-out`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInScale 0.5s ease-out forwards'
                }}
              />
            )
          })}
        </svg>

        {/* Value labels */}
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          {data.map((point, index) => (
            <span key={index} className="opacity-0 animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
              {point.label}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default AnimatedChart

