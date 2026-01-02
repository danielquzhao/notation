import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import MediaViewer from '../components/MediaViewer'
import LaTeXViewer from '../components/LaTeXViewer'
import { UploadData } from '../types'
import './ViewerPage.css'

export default function ViewerPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const data = location.state as UploadData | null

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
      <header className="viewer-header">
        <button className="back-button" onClick={handleBack}>
          ← Back
        </button>
      </header>

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
