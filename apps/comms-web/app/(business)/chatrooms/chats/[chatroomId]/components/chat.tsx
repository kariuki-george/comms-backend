"use client"

import React, { MutableRefObject, useEffect, useRef, useState } from "react"
import { useAuthStore } from "@/state/auth.state"
import { useChatState } from "@/state/chat.state"
import { Socket, io } from "socket.io-client"
import { useStore } from "zustand"

import { IChatroom } from "@/types/chatroom"
import { IMessage } from "@/types/message"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ChatBubble from "@/components/chats/chatBubble"

interface Props {
  chatroomId: string
}

let socket: Socket | null = null

const Chat = ({ chatroomId }: Props) => {
  // Chatroom
  const { chatrooms, addMessage } = useStore(useChatState, (state) => state)

  const [chatroom, setChatroom] = useState<IChatroom>()
  const [messages, setMessages] = useState<IMessage[]>([])

  useEffect(() => {
    setChatroom(chatrooms[Number(chatroomId)].chatroom)
    setMessages(chatrooms[Number(chatroomId)].messages)
  }, [])

  const authToken = useAuthStore((state) => state.authToken)
  // Socket io

  const [message, setMessage] = useState<string>("")

  useEffect(() => {
    socketInitializer()
    return () => {
      socket?.disconnect()
      socket = null
    }
  }, [])

  const socketInitializer = async () => {
    socket = io(process.env.NEXT_PUBLIC_API_URL as string, {
      extraHeaders: { aid: authToken },
      reconnectionAttempts: 5,
    })

    socket.on("connect", () => {
      console.log("Connect")
    })

    socket.on("chats", (msg: IMessage) => {
      msg.createdAt = new Date()
      setMessages((prev) => [...prev, msg])
      addMessage(msg, Number(chatroomId))
    })

    socket.on("error", (error) => {
      console.log("ERROR", error)
    })
    socket.on("reconnect_failed", () => {
      window.location.reload()
    })
  }

  // Handle send message

  const handleSend = (e: any) => {
    e.preventDefault()

    socket?.emit("chats", { message, chatroomId: Number(chatroomId) })
    setMessage("")
  }

  // Auto scroll
  const bottomRef = useRef<HTMLDivElement>(
    null
  ) as MutableRefObject<HTMLDivElement>

  const scrollToBottom = () => {
    bottomRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="relative flex h-full w-full flex-col  justify-between overflow-hidden">
      {/* Header */}
      <div className="sticky bottom-0 flex items-center justify-between px-5 py-3 ">
        <span className="text-lg font-semibold">{chatroom?.userName}</span>
        <span>
          <Button variant={"outline"}>Close</Button>
        </span>
      </div>
      {/* Chat's space */}
      <ul className="flex h-full  flex-col  gap-2  overflow-y-auto border-y  p-2">
        {messages.map((message) => (
          <li className="w-full  p-2  " key={message.id}>
            <ChatBubble
              message={message.message}
              isSender={message.sender === "AGENT"}
              createdAt={message.createdAt}
            />
          </li>
        ))}
        <div ref={bottomRef}></div>
      </ul>

      {/* Input bar */}
      <div className="sticky  bottom-0 p-5 pb-10 ">
        <form className="flex justify-between  gap-2" onSubmit={handleSend}>
          <Input
            placeholder="Enter message"
            onChange={(e) => {
              setMessage(e.target.value)
            }}
            value={message}
          />
          <Button onClick={handleSend}>Send</Button>
        </form>
      </div>
    </div>
  )
}

export default Chat
