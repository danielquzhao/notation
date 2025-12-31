import { useState } from 'react'
import axios from 'axios'
import './UploadForm.css'

export default function UploadForm({ onUploadSuccess }) {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
  const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'application/pdf']

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFileInput = (e) => {
    const files = e.target.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFile = (file) => {
    setError(null)

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Please upload a PNG, JPG image or PDF file.')
      return
    }

    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first.')
      return
    }

    setIsLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const response = await axios.post(`${BACKEND_URL}/convert`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      const fileBlob = selectedFile
      const fileUrl = URL.createObjectURL(fileBlob)

      onUploadSuccess({
        file: fileBlob,
        fileUrl: fileUrl,
        fileName: selectedFile.name,
        latex: response.data.latex
      })
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to convert file. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="upload-form-container">
      <div
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="upload-content">
          <div className="upload-icon">📄</div>
          <h2>Upload Your Handwritten Notes</h2>
          <p>Drag and drop your image or PDF here, or click to select</p>
          <input
            type="file"
            id="file-input"
            onChange={handleFileInput}
            accept=".png,.jpg,.jpeg,.pdf"
            style={{ display: 'none' }}
          />
          <label htmlFor="file-input" className="file-input-label">
            Choose File
          </label>
        </div>
      </div>

      {selectedFile && (
        <div className="file-info">
          <p>Selected: <strong>{selectedFile.name}</strong></p>
          <p>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <button
        className="upload-button"
        onClick={handleUpload}
        disabled={!selectedFile || isLoading}
      >
        {isLoading ? 'Converting...' : 'Convert to LaTeX'}
      </button>
    </div>
  )
}
