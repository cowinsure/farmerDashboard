"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"

import { MessageCircle, Send, Bot, User, Mic, MicOff } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { ScrollArea } from "./scroll-area"
import { Input } from "./input"

// Type definitions for SpeechRecognition API
interface SpeechRecognitionEvent extends Event {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string
        confidence: number
      }
    }
  }
  resultIndex: number
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  onresult: (event: SpeechRecognitionEvent) => void
  onerror: (event: Event) => void
  onend: () => void
}

// Type for the SpeechRecognition constructor
type SpeechRecognitionConstructor = new () => SpeechRecognition

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

// Types for API request and response
interface FormSchema {
  [key: string]: string;
}

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

interface FormState {
  [key: string]: string;
}

interface ApiRequest {
  user_message: string;
  form_state: FormState;
  conversation_history: ConversationMessage[];
  form_schema: FormSchema;
}

interface ApiResponse {
  form_state: FormState;
  assistant_message: string;
  conversation_history: ConversationMessage[];
  conversation_done: boolean;
}

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI insurance assistant. How can I help you today? You can type or use voice input.",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [formState, setFormState] = useState<FormState>({})
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      // Define type for SpeechRecognition
      const SpeechRecognitionConstructor = (window as unknown as { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor }).SpeechRecognition ||
        (window as unknown as { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor }).webkitSpeechRecognition
      if (SpeechRecognitionConstructor) {
        recognitionRef.current = new SpeechRecognitionConstructor()
        setSpeechSupported(true)
      }

      if (recognitionRef.current) {
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript
          setInputValue(transcript)
          setIsListening(false)
        }

        recognitionRef.current.onerror = () => {
          setIsListening(false)
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      }
    }
  }, [])

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  // Define the form schema
  const formSchema: FormSchema = {
    user: "The full name of the user.",
    date_of_birth: "The desired check-in date in YYYY-MM-DD format.",
    address: "address.",
    phone_number: "valid phone number preferbly with country extension.",
    customer_type: "Types of customer (vip, normal)."
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      // Add user message to conversation history
      const updatedConversationHistory = [...conversationHistory, { role: "user" as const, content: inputValue }];
      
      // Prepare API request
      const apiRequest: ApiRequest = {
        user_message: inputValue,
        form_state: formState,
        conversation_history: updatedConversationHistory,
        form_schema: formSchema
      };

      // Make API call
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiRequest),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      
      // Update state with API response
      setFormState(data.form_state);
      setConversationHistory(data.conversation_history);
      
      // Add AI response to chat
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.assistant_message,
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      
      // Handle conversation done flag
      if (data.conversation_done) {
        // Conversation is done, you can handle this as needed
        console.log("Conversation is done");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: "Sorry, I encountered an error. Please try again.",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed bottom-12 right-4 z-50">
      {isOpen ? (
        <Card className="w-80 h-96 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary" />
                AI Assistant
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-6 w-6 p-0">
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex flex-col h-full">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.sender === "ai" && <Bot className="h-6 w-6 text-primary mt-1 flex-shrink-0" />}
                    <div
                      className={`max-w-[70%] p-2 rounded-lg text-sm ${
                        message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {message.content}
                    </div>
                    {message.sender === "user" && <User className="h-6 w-6 text-muted-foreground mt-1 flex-shrink-0" />}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder={isListening ? "Listening..." : isLoading ? "AI is typing..." : "Type your message..."}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                  disabled={isListening || isLoading}
                />
                {speechSupported && (
                  <Button
                    size="sm"
                    variant={isListening ? "destructive" : "outline"}
                    onClick={toggleVoiceInput}
                    className="px-2"
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                )}
                <Button size="sm" onClick={handleSendMessage} disabled={isListening}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setIsOpen(true)} className="rounded-full h-12 w-12 shadow-lg">
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  )
}
