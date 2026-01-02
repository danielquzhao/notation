import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Home, HelpCircle, Github, Download, Share2, Settings } from 'lucide-react'
import MediaViewer from '../components/MediaViewer'
import LaTeXViewer from '../components/LaTeXViewer'
import { UploadData } from '../types'
import './ViewerPage.css'

export default function ViewerPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const data = location.state as UploadData | null
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  useEffect(() => {
    // Redirect to home if no data is available
    if (!data || !data.fileUrl || !data.latex) {
      navigate('/')
    }

    // Cleanup: revoke blob URL when component unmounts
    return () => {
      if (data?.fileUrl) {
        URL.revokeObjectURL(data.fileUrl)
      }
    }
  }, [data, navigate])

  if (!data) {
    return null
  }

  const handleBack = () => {
    navigate('/')
  }

  return (
    <div className="viewer-page">
      <nav 
        className="viewer-nav-bar"
        onMouseLeave={() => setHoveredItem(null)}
      >
        <button 
          className={`nav-item ${hoveredItem === 'home' ? 'expanded' : ''}`}
          onMouseEnter={() => setHoveredItem('home')}
          onClick={() => navigate('/')}
        >
          <Home size={20} />
          <span className="nav-text">Home</span>
        </button>
        <button 
          className={`nav-item ${hoveredItem === 'faq' ? 'expanded' : ''}`}
          onMouseEnter={() => setHoveredItem('faq')}
        >
          <HelpCircle size={20} />
          <span className="nav-text">FAQ</span>
        </button>
        <button 
          className={`nav-item ${hoveredItem === 'download' ? 'expanded' : ''}`}
          onMouseEnter={() => setHoveredItem('download')}
        >
          <Download size={20} />
          <span className="nav-text">Download</span>
        </button>
        <button 
          className={`nav-item ${hoveredItem === 'share' ? 'expanded' : ''}`}
          onMouseEnter={() => setHoveredItem('share')}
        >
          <Share2 size={20} />
          <span className="nav-text">Share</span>
        </button>
        <button 
          className={`nav-item ${hoveredItem === 'settings' ? 'expanded' : ''}`}
          onMouseEnter={() => setHoveredItem('settings')}
        >
          <Settings size={20} />
          <span className="nav-text">Settings</span>
        </button>
        <a 
          href="https://github.com/danielquzhao/notation" 
          target="_blank" 
          rel="noopener noreferrer"
          className={`nav-item ${hoveredItem === 'github' ? 'expanded' : ''}`}
          onMouseEnter={() => setHoveredItem('github')}
        >
          <Github size={20} />
          <span className="nav-text">GitHub</span>
        </a>
      </nav>

      <div className="viewer-content">
        <div className="viewer-panel left-panel">
          <MediaViewer 
            fileUrl={data.fileUrl} 
            fileName={data.fileName} 
            file={data.file} 
          />
        </div>
        <div className="viewer-panel right-panel">
          <LaTeXViewer latex={data.latex} />
        </div>
      </div>
    </div>
  )
}
