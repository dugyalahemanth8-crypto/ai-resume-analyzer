import React, { useState } from 'react'
import axios from 'axios'
import ScoreRing from './ScoreRing'

const getScoreColor = (score) => {
  if (score >= 7) return 'var(--score-high)'
  if (score >= 5) return 'var(--score-mid)'
  return 'var(--score-low)'
}

const HistoryItem = ({ item, onDelete }) => {
  const [expanded, setExpanded] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (!window.confirm('Delete this analysis?')) return
    setDeleting(true)
    try {
      await axios.delete(`/analysis/${item.id}`)
      onDelete(item.id)
    } catch (err) {
      alert('Failed to delete. Please try again.')
      setDeleting(false)
    }
  }

  return (
    <div
      className={`history-item ${expanded ? 'expanded' : ''}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div>
        <p className="history-preview">{item.resume_preview}</p>
        <p className="history-date">{new Date(item.created_at).toLocaleString()}</p>
      </div>
      <div className="history-meta">
        <div className="history-score" style={{ color: getScoreColor(item.score) }}>
          {item.score}<span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 400 }}>/10</span>
        </div>
      </div>

      {expanded && (
        <div className="history-expanded-content" onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="result-card">
              <div className="result-card-header">
                <div className="result-card-icon icon-success">✓</div>
                <span className="result-card-title">Strengths</span>
              </div>
              <p className="result-text">{item.strengths}</p>
            </div>
            <div className="result-card">
              <div className="result-card-header">
                <div className="result-card-icon icon-warning">⚠</div>
                <span className="result-card-title">Weaknesses</span>
              </div>
              <p className="result-text">{item.weaknesses}</p>
            </div>
          </div>

          {item.missing_keywords?.length > 0 && (
            <div className="result-card" style={{ marginTop: 12 }}>
              <div className="result-card-header">
                <div className="result-card-icon icon-danger">◎</div>
                <span className="result-card-title">Missing Keywords</span>
              </div>
              <div className="tags-list">
                {item.missing_keywords.map((kw, i) => (
                  <span key={i} className="tag tag-keyword">{kw}</span>
                ))}
              </div>
            </div>
          )}

          <button className="delete-btn" onClick={handleDelete} disabled={deleting}>
            {deleting ? '⏳ Deleting...' : '🗑 Delete Analysis'}
          </button>
        </div>
      )}
    </div>
  )
}

const History = ({ analyses, loading, onRefresh, onDelete }) => {
  return (
    <div className="history-section">
      <div className="history-header">
        <h2 className="history-title">Past Analyses</h2>
        <button className="refresh-btn" onClick={onRefresh} disabled={loading}>
          {loading ? '⟳ Loading...' : '⟳ Refresh'}
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: 80 }} />
          ))}
        </div>
      ) : analyses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📄</div>
          <p className="empty-state-text">No analyses yet. Submit a resume to get started.</p>
        </div>
      ) : (
        <div className="history-list">
          {analyses.map((item) => (
            <HistoryItem key={item.id} item={item} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  )
}

export default History