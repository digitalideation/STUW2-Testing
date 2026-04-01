// Tiny static file server — no external dependencies needed.
// Serves files from the current directory on http://localhost:3000

import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = 4321

const MIME = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'text/javascript',
  '.png':  'image/png',
  '.svg':  'image/svg+xml',
}

http.createServer((req, res) => {
  const urlPath = req.url === '/' ? '/signup.html' : req.url
  const filePath = path.join(__dirname, urlPath)

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('404 Not Found')
      return
    }
    const ext = path.extname(filePath)
    res.writeHead(200, { 'Content-Type': MIME[ext] ?? 'application/octet-stream' })
    res.end(data)
  })
}).listen(PORT, () => {
  console.log(`Signup app running at http://localhost:${PORT}`)
  // Signal to Playwright that the server is ready
  if (process.send) process.send('ready')
})
