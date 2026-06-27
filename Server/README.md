# RAG React App - Server

Express backend for a PDF RAG application. It handles PDF upload, text extraction, chunking, embeddings, vector storage, and Gemini-based question answering.

## Features

- PDF upload via `multer`
- PDF parsing with `pdf-parse`
- Section-aware chunking
- Gemini embeddings
- Pinecone support
- In-memory fallback for local development
- RAG chat endpoint

## Tech Stack

- Node.js
- Express 5
- Gemini API via `@google/genai`
- Pinecone SDK
- Multer
- pdf-parse

## Setup

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

Development mode:

```bash
npm run dev
```

## Environment

Create `Server/.env`:

```env
PORT=5050
GEMINI_API_KEY=your_gemini_api_key
PINECONE_API_KEY=
PINECONE_INDEX=
```

Notes:

- `GEMINI_API_KEY` is required.
- `PINECONE_API_KEY` and `PINECONE_INDEX` are optional for local fallback mode.
- If Pinecone is not configured, the app uses in-memory retrieval for the current server session.

## API Routes

### `GET /`

Health check.

### `POST /upload`

Upload a PDF file using the form field name `pdf`.

Response includes:

- extracted text
- page count
- chunk count
- indexing mode

### `POST /chat`

Body:

```json
{
  "question": "What does the document say?"
}
```

Response includes:

- `answer`
- optional `sources`

## RAG Pipeline

1. The PDF is uploaded through `multer`.
2. The file is parsed into text.
3. Text is chunked into section-aware chunks.
4. Each chunk is embedded with Gemini.
5. Chunks are stored in Pinecone or memory.
6. A user question is embedded.
7. Relevant chunks are retrieved.
8. Context is assembled.
9. Gemini 2.5 Flash generates the final answer.

## Project Structure

```text
Server/
  src/
    config/
    controllers/
    middleware/
    routes/
    services/
    utils/
```

## Notes

- Restart the server after changing `.env`.
- Re-upload the PDF after restarting if you use the in-memory fallback.
- The server is currently configured to run on port `5050`.


