import './MediaViewer.css'

interface MediaViewerProps {
  fileUrl: string
  fileName: string
  file: File
}

export default function MediaViewer({ fileUrl, fileName, file }: MediaViewerProps) {
  const isPDF = file?.type === 'application/pdf' || fileName?.toLowerCase().endsWith('.pdf')

  return (
    <div className="media-viewer">
      <div className="media-header">
        <h3>{fileName}</h3>
      </div>
      <div className="media-content">
        {isPDF ? (
          <embed
            src={fileUrl}
            type="application/pdf"
            width="100%"
            height="100%"
          />
        ) : (
          <img
            src={fileUrl}
            alt={fileName}
            className="uploaded-image"
          />
        )}
      </div>
    </div>
  )
}
