"use client"

import { createContext, useContext, ReactNode, useEffect } from "react"
import { getSocket, closeSocket } from "@/lib/socket"

type SocketContextType = {
  socket: ReturnType<typeof getSocket> | null
}

const SocketContext = createContext<SocketContextType>({ socket: null })

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    getSocket().catch(console.error)
    return () => {
      closeSocket()
    }
  }, [])

  return (
    <SocketContext.Provider value={{ socket: null }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)
