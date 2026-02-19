import React, { useState, useEffect } from 'react'
import axios from 'axios'
import AnalysisResult from './components/AnalysisResult'
import History from './components/History'

const MAX_CHARS = 15000

function App() {
  const [activeTab, setActiveTab] = useState('analyze')
  const [resumeText, setResumeText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [analyses, setAnalyses] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)

  const fetchHistory = async () => {
    setHistoryLoading(true)
    try {
      const res = await axios.get('/analyses')
      setAnalyses(res.data)
    } catch (err) {
      console.error('Failed to fetch history:', err)
    } finally {
      setHistoryLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError('Please paste your resume text before analyzing.')
      return
    }
    setError(null)
    setResult(null)
    setLoading(true)

    try {
      const res = await axios.post('/analyze', { content: resumeText })
      setResult(res.data)
      fetchHistory()
    } catch (err) {
      const msg = err.response?.data?.error || 'Something went wrong. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAnalysis = (deletedId) => {
    setAnalyses((prev) => prev.filter((a) => a.id !== deletedId))
  }

  const charCount = resumeText.length
  const nearLimit = charCount > MAX_CHARS * 0.85

  return (
    <div className="app-wrapper">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="logo-group">
            <span className="logo-badge">AI-Powered</span>
            <h1 className="app-title">
              Resume <span>Analyzer</span>
            </h1>
            <p className="app-subtitle">
              Paste your resume and get instant AI-powered feedback — strengths, gaps, keywords, and a score.
            </p>
          </div>
          <div className="header-meta">
            <p className="powered-by">Powered by <strong>Claude AI</strong></p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'analyze' ? 'active' : ''}`}
          onClick={() => setActiveTab('analyze')}
        >
          Analyze Resume
        </button>
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => { setActiveTab('history'); fetchHistory() }}
        >
          History {analyses.length > 0 && `(${analyses.length})`}
        </button>
      </div>

      {/* Analyze Tab */}
      {activeTab === 'analyze' && (
        <div className="form-section">
          <label className="form-label" htmlFor="resume-input">
            Paste Resume Text
          </label>
          <textarea
            id="resume-input"
            className="resume-textarea"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value.slice(0, MAX_CHARS))}
            placeholder={`Paste your full resume here...\n\nExample:\nJohn Doe\nSoftware Engineer | john@example.com\n\nExperience:\n- Senior Developer at Acme Corp (2021–Present)\n  Built scalable APIs using Python and Django...`}
          />

          <div className={`char-count ${nearLimit ? 'near-limit' : ''}`}>
            {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters
          </div>

          {error && (
            <div className="error-banner">
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          <button
            className="analyze-btn"
            onClick={handleAnalyze}
            disabled={loading || !resumeText.trim()}
          >
            {loading ? (
              <>
                <span className="btn-spinner" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <span>→</span>
                Analyze Resume
              </>
            )}
          </button>

          {/* Result */}
          {result && <AnalysisResult result={result} />}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <History
          analyses={analyses}
          loading={historyLoading}
          onRefresh={fetchHistory}
          onDelete={handleDeleteAnalysis}
        />
      )}
    </div>
  )
}

export default App