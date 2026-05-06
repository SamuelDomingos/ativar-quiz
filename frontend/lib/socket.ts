import { io, Socket } from "socket.io-client"
import { getSession } from "next-auth/react"

let socket: Socket | null = null

export const getSocket = async (): Promise<Socket> => {
  if (socket && socket.connected) return socket

  const session = await getSession()

  const authPayload = session?.accessToken
    ? { token: session.accessToken }
    : undefined

  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
    transports: ["websocket"],
    auth: authPayload,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  })

  socket.on("connect", () => console.log("[socket] conectado"))
  socket.on("disconnect", (reason) =>
    console.log("[socket] desconectado:", reason)
  )
  socket.on("connect_error", (err) =>
    console.error("[socket] erro de conexão:", err)
  )

  await new Promise<void>((resolve, reject) => {
    if (!socket) return reject(new Error("Socket não inicializado"))
    socket.once("connect", () => resolve())
    socket.once("connect_error", (err) => reject(err))
  })

  return socket
}

export const on = (event: string, handler: (...args: any[]) => void) => {
  getSocket().then((s) => s.on(event, handler))
}

export const emit = (event: string, payload?: any) => {
  getSocket().then((s) => s.emit(event, payload))
}

export const off = (event: string, handler?: (...args: any[]) => void) => {
  getSocket().then((s) => s.off(event, handler))
}

export const closeSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
