import { useState, useEffect } from 'react'
import { CompileErrorResponse } from '../types'
import './LaTeXViewer.css'

interface LaTeXViewerProps {
  latex: string
}

type TabType = 'rendered' | 'raw'

export default function LaTeXViewer({ latex }: LaTeXViewerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('rendered')
  const [copySuccess, setCopySuccess] = useState<boolean>(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isCompiling, setIsCompiling] = useState<boolean>(false)
  const [compileError, setCompileError] = useState<string | null>(null)

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
      
      const response = await fetch('http://localhost:3000/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latex: cleanLatex }),
      })

      if (!response.ok) {
        const errorData = await response.json() as CompileErrorResponse
        throw new Error(errorData.error || 'Failed to compile LaTeX')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setPdfUrl(url)
    } catch (err) {
      console.error('LaTeX compilation error:', err)
      const error = err as Error
      setCompileError(error.message || 'Failed to compile LaTeX. Check the raw code for syntax errors.')
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
                width="100%"
                height="100%"
                style={{ border: 'none', borderRadius: '4px' }}
                title="LaTeX PDF Preview"
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
