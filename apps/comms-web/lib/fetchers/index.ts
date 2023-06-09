import { useAuthStore } from "@/state/auth.state"
import { useOrgState } from "@/state/org.state"
import axios, { AxiosError, AxiosRequestConfig } from "axios"

import { toast } from "@/components/ui/use-toast"

const API = process.env.NEXT_PUBLIC_API_URL

if (!API) {
  throw new Error("Api Url is not defined")
}

// Common

const postMutate = (url: string, data: any, config?: AxiosRequestConfig) => {
  return axios.post(url, data, {
    ...config,
    headers: { aid: useAuthStore.getState().authToken },
  })
}

const query = (url: string, config?: AxiosRequestConfig) => {
  return axios.get(url, {
    ...config,
    headers: { aid: useAuthStore.getState().authToken },
  })
}

const deleteMutation = (url: string, config?: AxiosRequestConfig) => {
  return axios.delete(url, {
    ...config,
    headers: { aid: useAuthStore.getState().authToken },
  })
}

// Auth

export const getStarted = (user: any) => {
  return axios.post(API + "users", user)
}

export const login = (data: any) => {
  return axios.post(API + "auth/login", data)
}

export const getOrgs = () => {
  return query(API + "orgs")
}

// Org

export const createOrg = (data: any) => {
  return postMutate(API + "orgs", data)
}

// Chatbots
export const getChatbots = () => {
  return query(API + "chatbots/org/" + useOrgState.getState().org?.id)
}

export const createChatbot = (data: any) => {
  return postMutate(API + "chatbots", data)
}

export const deleteChatbot = (chatbotId: number) => {
  return deleteMutation(API + "chatbots", { params: { chatbotId } })
}

// Chatrooms

export const getNewChatrooms = () => {
  return query(API + "chatrooms/", {
    params: { orgId: useOrgState.getState().org?.id },
  })
}

export const joinChatroom = (chatroomId: number) => {
  return postMutate(API + "chatrooms/join", {}, { params: { chatroomId } })
}

export const getMyChatrooms = async () => {
  return query(API + "chatrooms")
}

export const closeChatroom = (chatroomId: number) => {
  return postMutate(API + "chatrooms/close", { chatroomId })
}

// Messages
export const getMessages = (chatroomId: number) => {
  return query(API + "chatrooms/messages", {
    params: {
      chatroomId,
    },
  })
}

export const errorParser = (error: AxiosError) => {
  if (error.response) {
    const { data } = error.response as any
    if (data?.message) {
      if (typeof data?.message === "string") {
        return toast({
          variant: "destructive",
          title: data.error,
          description: data.message,
        })
      }
      for (const message in data.message) {
        toast({
          variant: "destructive",
          title: data.error,
          description: data.message[message],
        })
      }
    }
  } else {
    toast({
      variant: "destructive",
      title: "An Error Occured",
      description: error.message,
    })
  }
}
