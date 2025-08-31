"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"

import { MessageCircle, Send, Bot, User, Mic, MicOff, Play, Pause, Volume, AudioLines, Upload } from "lucide-react"
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

interface AIChatWidgetProps {
  onFormStateChange?: (formState: FormState) => void;
}

export function AIChatWidget({ onFormStateChange }: AIChatWidgetProps) {
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
  // const scrollAreaRef = useRef<HTMLDivElement>(null)
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
        content: `Sorry, I encountered an error while transcribing your audio. Please try again.`,
        sender: "ai",
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
    upazila: "Upazila (Sub-district) of the farmer's address",
    zilla: "Zilla (District) of the farmer's address",
    union: "Union (Local administrative unit) of the farmer's address",
    village: "Village name of the farmer's address"
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
                      className={`max-w-[70%] p-2 rounded-lg text-sm relative ${
                        message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {message.content}
                      {message.sender === "ai" && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 ml-2 absolute bottom-1 right-1"
                          onClick={() => togglePlayback(message.id, message.content)}
                        >
                          {playingMessageId === message.id && isPlaying ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                    {message.sender === "user" && <User className="h-6 w-6 text-muted-foreground mt-1 flex-shrink-0" />}
                  </div>
                ))}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder={isListening ? "Listening..." : isLoading ? "AI is typing..." : "Type your message..."}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                  disabled={isListening || isLoading || isRecording}
                />
                {/* {speechSupported && (
                  <Button
                    size="sm"
                    variant={isListening ? "destructive" : "outline"}
                    onClick={toggleVoiceInput}
                    className="px-2"
                    disabled={isRecording || isLoading}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                )} */}
                <Button
                  size="sm"
                  variant={isRecording ? "destructive" : "outline"}
                  onClick={isRecording ? stopRecording : startRecording}
                  className="px-2"
                  disabled={isListening || isLoading}
                >
                  {isRecording ? <AudioLines className="h-4 w-4" /> : <AudioLines className="h-4 w-4" />}
                </Button>
                {/* <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2"
                  disabled={isListening || isRecording || isLoading}
                >
                  <Upload className="h-4 w-4" />
                </Button> */}
                <Button size="sm" onClick={handleSendMessage} disabled={isListening || isRecording || isLoading}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="audio/*"
                className="hidden"
              />
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
