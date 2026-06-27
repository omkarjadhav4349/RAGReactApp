# RAG React App - Client

React + Vite frontend for a PDF-based RAG chat application. Users can upload a PDF, ask questions, and receive answers powered by Gemini and document retrieval.

## Features

- PDF upload
- Chat interface
- Markdown rendering
- Auto-scroll to latest response
- Loading and error states
- Responsive layout

## Tech Stack

- React 19
- Vite
- Axios
- React Markdown

## Setup

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the build:

```bash
npm run preview
```

## Environment

Create a `client/.env` file only if you want to override the backend URL:

```env
VITE_API_BASE_URL=http://127.0.0.1:5050
```

If this variable is not set, the client uses `http://127.0.0.1:5050` by default.

## How It Works

1. Upload a PDF from the UI.
2. The frontend sends the file to `POST /upload`.
3. The backend parses the PDF, chunks the text, creates embeddings, and stores them.
4. Ask a question in the chat input.
5. The frontend sends the question to `POST /chat`.
6. The backend retrieves relevant context and asks Gemini to generate the answer.

## Project Structure

```text
client/
  src/
    api/
    components/
    hooks/
    pages/
    styles/
```

## Notes

- The frontend expects the backend to be running first.
- If you change the backend port, update `VITE_API_BASE_URL`.
- Markdown is rendered inside chat responses, so formatted answers display nicely.

