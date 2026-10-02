import * as http from 'node:http'
import { createRequestListener } from '@remix-run/node-fetch-server'
import { createAppRouter } from './app/router.ts'

let router = createAppRouter()

let server = http.createServer(
  createRequestListener(async (request) => {
    try {
      return await router.fetch(request)
    } catch (error) {
      console.error(error)
      return new Response('Internal Server Error', { status: 500 })
    }
  })
)

let port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000

server.listen(port, () => {
  console.log(`freerecipe.club running at http://localhost:${port}`)
})

function shutdown() {
  server.close(() => process.exit(0))
  server.closeAllConnections()
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
