"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/component/ui/input"
import { Card } from "@/component/ui/card"
import { X, Mic, MicOff, Send, Bot, User, Play, Pause, AudioLines, Upload } from "lucide-react"

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
  type: "user" | "ai"
  content: string
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

interface AIInterfaceProps {
  onClose: () => void
  onFormStateChange?: (formState: FormState) => void;
}

export function AIInterface({ onClose, onFormStateChange }: AIInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [formState, setFormState] = useState<FormState>({})
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [autoPlayedMessages, setAutoPlayedMessages] = useState<Set<string>>(new Set())
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      // Stop media recorder if active
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
        // Stop all tracks
        mediaRecorderRef.current.stream?.getTracks().forEach(track => track.stop());
      }
    };
  }, [isRecording]);

  const playStreamingTTS = async (text: string) => {
    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    try {
      const response = await fetch("http://localhost:8000/api/v1/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          voice: "nova",
        }),
      });

      if (!response.ok || !response.body) {
        console.error("Failed to fetch audio");
        setIsPlaying(false);
        setPlayingMessageId(null);
        return;
      }

      // Check if browser supports MediaSource
      if (!('MediaSource' in window)) {
        console.error("MediaSource API is not supported");
        setIsPlaying(false);
        setPlayingMessageId(null);
        return;
      }

      // Convert ReadableStream to MediaSource for progressive playback
      const mediaSource = new MediaSource();
      const audio = new Audio();
      audioRef.current = audio;
      audio.src = URL.createObjectURL(mediaSource);

      mediaSource.addEventListener("sourceopen", async () => {
        const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
        const reader = response.body!.getReader();

        audio.play().catch(error => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
          setPlayingMessageId(null);
        });

        async function pump() {
          const { done, value } = await reader.read();
          if (done) {
            mediaSource.endOfStream();
            return;
          }
          
          // Wait for the source buffer to be ready
          if (sourceBuffer.updating) {
            await new Promise(r => sourceBuffer.onupdateend = r);
          }
          
          sourceBuffer.appendBuffer(value);
          
          // Continue pumping data
          pump();
        }

        pump();
      });

      // Handle audio ended event
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setPlayingMessageId(null);
      });

      // Handle audio pause event
      audio.addEventListener('pause', () => {
        setIsPlaying(false);
        setPlayingMessageId(null);
      });

    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
      setPlayingMessageId(null);
    }
  };

  const togglePlayback = (messageId: string, text: string) => {
    // If we're already playing this message, pause it
    if (playingMessageId === messageId && isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
      setPlayingMessageId(null);
    }
    // If we're playing a different message, stop it and play the new one
    else {
      setPlayingMessageId(messageId);
      setIsPlaying(true);
      playStreamingTTS(text);
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      // Clear any active recording timers
      if (mediaRecorderRef.current && (mediaRecorderRef.current as any).timer) {
        clearInterval((mediaRecorderRef.current as any).timer);
      }
    };
  }, []);

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

  // Start audio recording
  const startRecording = async () => {
    if (isRecording) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Check supported MIME types for audio recording
      const supportedMimeTypes = [
        'audio/webm',
        'audio/webm;codecs=opus',
        'audio/ogg;codecs=opus',
        'audio/mp4',
        'audio/mp4;codecs=aac',
      ];
      
      let mimeType = '';
      for (const type of supportedMimeTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          break;
        }
      }
      
      console.log('Using MIME type:', mimeType || 'default');
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        // Create blob with the correct MIME type
        const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        await sendAudioForTranscription(audioBlob);
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start recording timer
      const startTime = Date.now();
      const timer = setInterval(() => {
        setRecordingTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      // Store timer reference on the media recorder for cleanup
      (mediaRecorderRef.current as any).timer = timer;
    } catch (error) {
      console.error("Error starting recording:", error);
      setIsRecording(false);
    }
  };

  // Stop audio recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Clear timer
      if ((mediaRecorderRef.current as any).timer) {
        clearInterval((mediaRecorderRef.current as any).timer);
      }
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      sendAudioForTranscription(file);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Send audio to transcription API
  const sendAudioForTranscription = async (audioBlob: Blob) => {
    console.log('Audio blob type:', audioBlob.type);
    console.log('Audio blob size:', audioBlob.size);
    
    // Save audio blob locally for testing
    const saveAudioForTesting = () => {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = url;
      
      // Determine file extension based on MIME type
      let extension = 'webm';
      if (audioBlob.type.includes('mp4')) extension = 'mp4';
      if (audioBlob.type.includes('ogg')) extension = 'ogg';
      if (audioBlob.type.includes('mp3')) extension = 'mp3';
      
      a.download = `recording-${new Date().toISOString().replace(/[:.]/g, '-')}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };
    
    // Uncomment the line below to automatically save recordings for testing
    // saveAudioForTesting();
    
    // Optional: Save to localStorage for debugging (limited size)
    // localStorage.setItem('lastRecording', JSON.stringify({
    //   timestamp: new Date().toISOString(),
    //   size: audioBlob.size,
    //   type: audioBlob.type
    // }));
    
    setIsLoading(true);
    try {
      // Determine file extension based on MIME type
      let extension = 'webm';
      if (audioBlob.type.includes('mp4')) extension = 'mp4';
      if (audioBlob.type.includes('ogg')) extension = 'ogg';
      if (audioBlob.type.includes('mp3')) extension = 'mp3';
      
      const filename = `output.${extension}`;
      
      const formData = new FormData();
      formData.append('file', audioBlob, filename);

      const response = await fetch('http://localhost:8000/api/v1/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Transcription API error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      const transcription = data.transcription;

      // Set the transcription as the input value
      setInputValue(transcription);
    } catch (error) {
      console.error("Error sending audio for transcription:", error);
      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: "ai",
        content: `Sorry, I encountered an error while transcribing your audio. Please try again.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false);
    }
  };

  // Define the form schema
  const formSchema: FormSchema = {
    first_name: "First name of the farmer",
    last_name: "Last name of the farmer",
    nid: "National ID number of the farmer",
    date_of_birth: "Date of birth in YYYY-MM-DD format",
    gender: "Gender of the farmer (Male/Female/Other)",
    tin: "Tax Identification Number of the farmer",
    thana: "Thana (Police Station) of the farmer's address",
    zilla: "Zilla (District) of the farmer's address",
    union: "Union (Local administrative unit) of the farmer's address",
    village: "Village name of the farmer's address"
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)
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
      const response = await fetch("http://localhost:8000/api/v1/chat", {
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
      if (onFormStateChange) {
        onFormStateChange(data.form_state);
      }
      playStreamingTTS(data.assistant_message);
      setConversationHistory(data.conversation_history);
      
      // Add AI response to chat
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: data.assistant_message,
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
        type: "ai",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl h-[600px] bg-popover/95 backdrop-blur-md border border-border/50 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50 bg-card/30">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            <h2 className="text-lg font-semibold text-foreground">AI Assistant</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex h-[calc(100%-80px)]">
          {/* Left Side - Voice/Input Controls */}
          <div className="w-1/3 p-6 bg-card/20 backdrop-blur-sm border-r border-border/30 flex flex-col justify-center items-center space-y-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Voice Input</h3>
              <p className="text-sm text-muted-foreground">Click to start voice recognition</p>
            </div>

            {/* Voice Button */}
            <Button
              onClick={toggleVoiceInput}
              className={`w-20 h-20 rounded-full transition-all duration-300 ${
                isListening ? "bg-destructive hover:bg-destructive/90 animate-pulse" : "bg-primary hover:bg-primary/90"
              }`}
              disabled={!speechSupported || isRecording || isLoading}
            >
              {isListening ? (
                <MicOff className="w-8 h-8 text-primary-foreground" />
              ) : (
                <Mic className="w-8 h-8 text-primary-foreground" />
              )}
            </Button>

            {isListening && (
              <div className="text-center">
                <div className="flex justify-center space-x-1 mb-2">
                  <div className="w-2 h-8 bg-primary rounded animate-pulse"></div>
                  <div className="w-2 h-6 bg-primary/70 rounded animate-pulse delay-75"></div>
                  <div className="w-2 h-10 bg-primary rounded animate-pulse delay-150"></div>
                  <div className="w-2 h-4 bg-primary/70 rounded animate-pulse delay-200"></div>
                </div>
                <p className="text-sm text-primary">Listening...</p>
              </div>
            )}

            {/* Recording Button */}
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-20 h-20 rounded-full transition-all duration-300 ${
                isRecording ? "bg-destructive hover:bg-destructive/90 animate-pulse" : "bg-secondary hover:bg-secondary/90"
              }`}
              disabled={isListening || isLoading}
            >
              {isRecording ? (
                <AudioLines className="w-8 h-8 text-primary-foreground" />
              ) : (
                <AudioLines className="w-8 h-8 text-primary-foreground" />
              )}
            </Button>

            {isRecording && (
              <div className="text-center">
                <div className="flex justify-center space-x-1 mb-2">
                  <div className="w-2 h-8 bg-red-500 rounded animate-pulse"></div>
                  <div className="w-2 h-6 bg-red-500/70 rounded animate-pulse delay-75"></div>
                  <div className="w-2 h-10 bg-red-500 rounded animate-pulse delay-150"></div>
                  <div className="w-2 h-4 bg-red-500/70 rounded animate-pulse delay-200"></div>
                </div>
                <p className="text-sm text-red-500">Recording... {recordingTime}s</p>
              </div>
            )}

            {/* File Upload */}
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
              variant="outline"
              disabled={isListening || isRecording || isLoading}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Audio
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="audio/*"
              className="hidden"
            />

            {/* Text Input */}
            <div className="w-full space-y-3">
              <div className="relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isListening ? "Listening..." : isLoading ? "AI is typing..." : "Type your message..."}
                  className="pr-12 bg-input/50 backdrop-blur-sm border-border/50 focus:border-primary/50"
                  disabled={isListening || isLoading || isRecording}
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  disabled={!inputValue.trim() || isListening || isLoading || isRecording}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Side - Chat Display */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {message.type === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div
                    className={`max-w-[70%] p-3 rounded-2xl backdrop-blur-sm relative ${
                      message.type === "user"
                        ? "bg-primary text-primary-foreground ml-auto"
                        : "bg-secondary/50 text-secondary-foreground"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    {message.type === "ai" && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 ml-2 absolute bottom-1 right-1"
                        onClick={() => togglePlayback(message.id, message.content)}
                        disabled={isLoading}
                      >
                        {playingMessageId === message.id && isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-secondary/50 text-secondary-foreground p-3 rounded-2xl backdrop-blur-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}