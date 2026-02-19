import React from 'react'
import ScoreRing from './ScoreRing'

const AnalysisResult = ({ result }) => {
  if (!result) return null

  return (
    <div className="result-section">
      <div className="result-header">
        <div>
          <h2 className="result-title">Analysis Complete</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            {new Date(result.created_at).toLocaleString()}
          </p>
        </div>
        <div className="score-badge">
          <ScoreRing score={result.score} />
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
              Resume Score
            </div>
            <p className="score-rationale">{result.score_rationale}</p>
          </div>
        </div>
      </div>

      <div className="result-grid">
        {/* Strengths */}
        <div className="result-card">
          <div className="result-card-header">
            <div className="result-card-icon icon-success">✓</div>
            <span className="result-card-title">Strengths</span>
          </div>
          <p className="result-text">{result.strengths}</p>
        </div>

        {/* Weaknesses */}
        <div className="result-card">
          <div className="result-card-header">
            <div className="result-card-icon icon-warning">⚠</div>
            <span className="result-card-title">Weaknesses</span>
          </div>
          <p className="result-text">{result.weaknesses}</p>
        </div>

        {/* Missing Keywords */}
        <div className="result-card">
          <div className="result-card-header">
            <div className="result-card-icon icon-danger">◎</div>
            <span className="result-card-title">Missing Keywords</span>
          </div>
          {result.missing_keywords && result.missing_keywords.length > 0 ? (
            <div className="tags-list">
              {result.missing_keywords.map((kw, i) => (
                <span key={i} className="tag tag-keyword">{kw}</span>
              ))}
            </div>
          ) : (
            <p className="result-text" style={{ color: 'var(--text-muted)' }}>No critical keywords missing.</p>
          )}
        </div>

        {/* Suggestions */}
        <div className="result-card">
          <div className="result-card-header">
            <div className="result-card-icon icon-accent">→</div>
            <span className="result-card-title">Suggestions</span>
          </div>
          {result.suggestions && result.suggestions.length > 0 ? (
            <ul className="suggestions-list">
              {result.suggestions.map((s, i) => (
                <li key={i} className="suggestion-item">
                  <span className="suggestion-number">{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="result-text" style={{ color: 'var(--text-muted)' }}>No additional suggestions.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AnalysisResult