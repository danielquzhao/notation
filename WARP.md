# Notation - Handwritten Math to LaTeX Converter

## Problem Statement
The goal is to build a web application that converts handwritten math notes into clean LaTeX. The application requires a Ruby on Rails backend to handle image processing and a React frontend for the user interface.

## Current State
The project directory `/Users/quynhan/Desktop/notation` currently only contains a README.md.

**Environment:**
- Ruby: v4.0.0
- Rails: Not installed
- Node: v25.1.0
- npm: v11.6.2

## Proposed Changes

### 1. Project Initialization

**Backend:**
- Install Rails gem.
- Initialize a new Rails API-only application in a `backend` directory.
- Configure CORS to allow requests from the React frontend.

**Frontend:**
- Initialize a new React application (using Vite) in a `frontend` directory.
- Install necessary dependencies for HTTP requests (axios) and LaTeX rendering (katex/react-latex-next).

### 2. Backend Implementation (Rails)

**File-to-LaTeX Conversion:**
- Service class using Gemini Vision API to extract text and math equations from handwritten notes.
- Support both image files (PNG, JPG) and PDF files as input.
- Gemini API natively supports PDF processing, so pass PDF files directly to the API.
- Single API call per file to convert image/PDF → LaTeX/Markdown output.

**Content Formatting Service (LLM):**
- Second Gemini API call to process the extracted content.
- Prompt Gemini to structure the content into a "pretty" LaTeX document, utilizing packages like tcolorbox to wrap definitions, theorems, and examples in colored boxes.

**API Endpoints:**
- `POST /convert`: Accepts an image file (PNG, JPG) or PDF file, pipelines it through Gemini Vision (extraction) and Gemini (formatting), and returns the styled LaTeX.

**Configuration:**
- Environment variable for Gemini API key only.

### 3. Frontend Implementation (React)

**Page Structure:**
- Two-page application using React Router:
  - Page 1 (Landing): Main upload interface
  - Page 2 (Viewer): Side-by-side comparison of uploaded file and LaTeX output

**Page 1 - Landing Page (`HomePage.jsx`):**
- Hero section with app description
- Upload component with drag-and-drop or file picker for images (PNG, JPG) and PDFs
- On successful upload, navigates to viewer page with file data

**Page 2 - Viewer Page (`ViewerPage.jsx`):**
- Two-column layout (50/50 split):
  - Left panel: `MediaViewer` component displays the uploaded image or PDF
  - Right panel: `LaTeXViewer` component with two tabs
    - Rendered Tab: Displays LaTeX visually using react-katex
    - Raw Code Tab: Shows raw LaTeX code with copy-to-clipboard button
- Back button to return to landing page
- Option to upload a new file

**Component Architecture:**
- `HomePage.jsx`: Landing page with upload form
- `ViewerPage.jsx`: Viewer page layout coordinator
- `UploadForm.jsx`: Reusable upload component (drag-and-drop + file picker)
- `MediaViewer.jsx`: Displays uploaded image/PDF on left panel
- `LaTeXViewer.jsx`: Right panel with tab switcher
- `App.jsx`: Router setup and main app structure

**Data Flow:**
1. User uploads file on landing page via `UploadForm`
2. File is sent to backend `POST /convert` endpoint via axios
3. On successful conversion, navigate to `/viewer` with file blob and LaTeX output
4. Viewer page displays both media and LaTeX side by side
5. User can switch between Rendered and Raw Code tabs
6. Back button returns to landing page

**Dependencies:**
- `react-router-dom`: Client-side routing between landing and viewer pages
- `axios`: HTTP requests to backend
- `react-katex` and `katex`: LaTeX rendering
- Existing: React, Vite

**State Management:**
- Use React Router's location state to pass file and LaTeX data between pages
- Local component state for tab switching and loading states
- Error handling for failed conversions

### 4. LaTeX Compilation (Backend)

**PDF Generation from LaTeX:**
- Add a new endpoint `POST /compile` that accepts LaTeX source code and returns a compiled PDF.
- Use shell command to run system `pdflatex` to compile `.tex` files to PDF.
- Implementation approach:
  1. Write the LaTeX string to a temporary `.tex` file
  2. Run `pdflatex` command on that file to generate a PDF (may need to run twice for references)
  3. Return the PDF as a file download or serve it with Active Storage
  4. Clean up temporary files after compilation
- Alternative: Modify the `/convert` endpoint to automatically compile the LaTeX and return both LaTeX source and PDF URL.
- Error handling: Capture `pdflatex` stderr output and return compilation errors to the frontend.

**System Requirements:**
- Requires `pdflatex` installed on the server (part of TeX Live or MiKTeX distribution)
- Install packages: `texlive-full` or `texlive-latex-extra` for tcolorbox and other packages

**Frontend Changes:**
- Update `LaTeXViewer.jsx` to either:
  - Option A: Display the PDF from backend endpoint directly in an `<iframe>`
  - Option B: Call a separate `/compile` endpoint when user switches to Rendered tab
- Display the compiled PDF in an `<embed>` or `<iframe>` on the Rendered tab.
- Fall back to raw code display with error message if compilation fails.
- Cache compiled PDF URLs to avoid re-compiling on tab switches.

### 5. Integration
Connect the frontend upload form to the backend `POST /convert` endpoint. The endpoint returns LaTeX source and either a PDF URL or triggers on-demand compilation via the `/compile` endpoint.
