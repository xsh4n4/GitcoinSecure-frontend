

import React from 'react'

const AnimatedCard = ({ children, className = '', delay = 0 }) => {
  const baseClasses = `
    transform transition-all duration-300 ease-out
    ${delay > 0 ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}
  `

  React.useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        const element = document.querySelector(`[data-delay="${delay}"]`)
        if (element) {
          element.classList.remove('opacity-0', 'translate-y-4')
          element.classList.add('opacity-100', 'translate-y-0')
        }
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [delay])

  return (
    <div
      className={`${baseClasses} ${className}`}
      data-delay={delay}
    >
      {children}
    </div>
  )
}

export default AnimatedCard

