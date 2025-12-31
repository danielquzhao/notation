import { useState, useEffect } from 'react'
import './LaTeXViewer.css'

export default function LaTeXViewer({ latex }) {
  const [activeTab, setActiveTab] = useState('rendered')
  const [copySuccess, setCopySuccess] = useState(false)
  const [pdfUrl, setPdfUrl] = useState(null)
  const [isCompiling, setIsCompiling] = useState(false)
  const [compileError, setCompileError] = useState(null)

  useEffect(() => {
    compileLaTeX()
  }, [latex])

  const compileLaTeX = async () => {
    setIsCompiling(true)
    setCompileError(null)
    
    try {
      // Strip markdown code block if present
      let cleanLatex = latex.trim()
      if (cleanLatex.startsWith('```latex')) {
        cleanLatex = cleanLatex.replace(/^```latex\n?/, '').replace(/\n?```$/, '')
      } else if (cleanLatex.startsWith('```')) {
        cleanLatex = cleanLatex.replace(/^```\n?/, '').replace(/\n?```$/, '')
      }
      
      const response = await fetch('https://latex.codecogs.com/pdf.latex', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `latex=${encodeURIComponent(cleanLatex)}`,
      })

      if (!response.ok) {
        throw new Error('Failed to compile LaTeX')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setPdfUrl(url)
    } catch (err) {
      console.error('LaTeX compilation error:', err)
      setCompileError('Failed to compile LaTeX. Check the raw code for syntax errors.')
    } finally {
      setIsCompiling(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(latex)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="latex-viewer">
      <div className="latex-header">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'rendered' ? 'active' : ''}`}
            onClick={() => setActiveTab('rendered')}
          >
            Rendered
          </button>
          <button
            className={`tab ${activeTab === 'raw' ? 'active' : ''}`}
            onClick={() => setActiveTab('raw')}
          >
            Raw Code
          </button>
        </div>
      </div>

      <div className="latex-content">
        {activeTab === 'rendered' ? (
          <div className="rendered-view">
            {isCompiling && <p className="loading">Compiling LaTeX...</p>}
            {compileError && <p className="error">{compileError}</p>}
            {pdfUrl && (
              <iframe
                src={pdfUrl}
                type="application/pdf"
                width="100%"
                height="100%"
                style={{ border: 'none', borderRadius: '4px' }}
              />
            )}
          </div>
        ) : (
          <div className="raw-view">
            <button className="copy-button" onClick={handleCopy}>
              {copySuccess ? '✓ Copied!' : 'Copy'}
            </button>
            <pre className="latex-code">
              <code>{latex}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
