import { useNavigate } from 'react-router-dom'
import UploadForm from '../components/UploadForm'
import { UploadData } from '../types'
import './HomePage.css'

export default function HomePage() {
  const navigate = useNavigate()

  const handleUploadSuccess = (data: UploadData) => {
    navigate('/viewer', { state: data })
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Notation</h1>
        <p className="subtitle">Convert your handwritten math notes to clean LaTeX</p>
        <p className="description">
          Upload a photo or PDF of your handwritten notes and watch them transform into beautifully formatted LaTeX code.
        </p>
      </div>

      <UploadForm onUploadSuccess={handleUploadSuccess} />
    </div>
  )
}
