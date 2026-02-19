import React, { useEffect, useState } from 'react'

const ScoreRing = ({ score }) => {
  const [animatedScore, setAnimatedScore] = useState(0)
  const radius = 30
  const circumference = 2 * Math.PI * radius
  const fraction = score / 10
  const dashOffset = circumference * (1 - fraction)

  const getColor = (s) => {
    if (s >= 7) return 'var(--score-high)'
    if (s >= 5) return 'var(--score-mid)'
    return 'var(--score-low)'
  }

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 50)
    return () => clearTimeout(timer)
  }, [score])

  return (
    <div className="score-ring">
      <svg viewBox="0 0 72 72" width="72" height="72">
        <circle className="score-ring-bg" cx="36" cy="36" r={radius} />
        <circle
          className="score-ring-fill"
          cx="36"
          cy="36"
          r={radius}
          style={{
            stroke: getColor(score),
            strokeDasharray: circumference,
            strokeDashoffset: animatedScore ? dashOffset : circumference,
          }}
        />
      </svg>
      <div className="score-number" style={{ color: getColor(score) }}>
        {score}
        <span className="score-label">/ 10</span>
      </div>
    </div>
  )
}

export default ScoreRing