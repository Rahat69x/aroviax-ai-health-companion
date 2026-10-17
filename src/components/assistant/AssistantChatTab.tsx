"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  RotateCcw,
  Bot,
  User,
  ShieldAlert,
  HelpCircle,
  Copy,
  Check,
  AlertTriangle,
  Loader2,
  Eye,
  Mic,
  MicOff,
  Volume2,
  Lock,
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { ChatMessage, ChatResponse } from "@/types/chat";
import { checkSafetySignal } from "@/lib/safetySignals";
import { inspectPrivacy } from "@/lib/privacyInspector";
import { useAccessibility } from "@/context/AccessibilityContext";
import { PrivacyInspectorModal } from "./PrivacyInspectorModal";

interface AssistantChatTabProps {
  localOnlyMode: boolean;
  onToggleLocalOnly: (enabled: boolean) => void;
  isCaregiverMode: boolean;
}

let counter = 0;
function nextId(prefix: string) {
  counter += 1;
  return `${prefix}_${counter}`;
}

function getTimeString() {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

export function AssistantChatTab({
  localOnlyMode,
  onToggleLocalOnly,
  isCaregiverMode,
}: AssistantChatTabProps) {
  const { speakText, isSpeaking, stopSpeaking } = useAccessibility();

  const starterQuestions = [
    "Help me prepare questions for my doctor.",
    "Explain this medical term in simple language.",
    "Help me organize the symptoms I want to discuss.",
    "What information should I bring to my appointment?",
  ];

  const initialMessages: ChatMessage[] = [
    {
      id: "init-assistant",
      role: "assistant",
      content: isCaregiverMode
        ? "Hello! I am Aroviax in Caregiver Mode. I'm here to help you organize observations and questions on behalf of a family member or loved one."
        : "Hello! I am Aroviax, your AI Health Companion. I'm here to help you understand general health information, organize your symptoms, and prepare clear questions for your healthcare professional.",
      timestamp: "Just now",
      generalInformation:
        "Health information can be overwhelming. Aroviax structures what you share into organized points for your appointment.",
      whatImUnsureAbout:
        "AI cannot view medical charts, interpret physiological tests, or confirm a diagnosis. Always verify with a clinician.",
      whenToSeekCare:
        "Seek emergency services immediately for acute chest discomfort, sudden numbness, or severe breathing difficulties.",
      suggestedDoctorQuestions: [
        "What questions should I prioritize during my consultation?",
        "How can I summarize my concerns clearly for my healthcare team?",
      ],
      safetyNotice: "Informational Assistant: Not a doctor. Cannot establish diagnoses.",
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastFailedText, setLastFailedText] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Privacy Inspector & Safety Signals State
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Live on-device safety check
  const safetySignal = checkSafetySignal(inputValue);
  const privacyCheck = inspectPrivacy(inputValue);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend ?? inputValue).trim();
    if (!text || isLoading) return;

    setErrorMessage(null);
    setLastFailedText(null);

    const userMsg: ChatMessage = {
      id: nextId("usr"),
      role: "user",
      content: text,
      timestamp: getTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    // If local-only mode is active, handle purely on-device
    if (localOnlyMode) {
      setTimeout(() => {
        const signal = checkSafetySignal(text);
        const assistantMsg: ChatMessage = {
          id: nextId("local"),
          role: "assistant",
          content: `[On-Device Local Mode] Guidance for: "${text.substring(0, 80)}${text.length > 80 ? "..." : ""}"`,
          timestamp: getTimeString(),
          generalInformation: "Processed 100% on your device without network calls.",
          whatImUnsureAbout: "Offline mode cannot access updated medical terminology or cloud services.",
          whenToSeekCare: "Seek professional medical care for persistent or severe symptoms.",
          suggestedDoctorQuestions: [
            "What could be contributing to what I am experiencing?",
            "What should I track before our next follow-up?",
          ],
          isEmergencyAlert: signal.hasEmergencySignal,
          safetyNotice: "Local On-Device Mode: No network data transmitted.",
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsLoading(false);
      }, 500);
      return;
    }

    // Online Mode: Send to Next.js API (which connects to Python FastAPI or AI Provider)
    try {
      const historyPayload = messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, mode: "chat", history: historyPayload }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data: ChatResponse = await response.json();

      const assistantMsg: ChatMessage = {
        id: data.requestId || nextId("ast"),
        role: "assistant",
        content: data.reply,
        timestamp: data.timestamp || getTimeString(),
        isEmergencyAlert: data.isEmergencyAlert,
        generalInformation: data.generalInformation,
        whatImUnsureAbout: data.whatImUnsureAbout,
        whenToSeekCare: data.whenToSeekCare,
        suggestedDoctorQuestions: data.suggestedDoctorQuestions,
        organizedItems: data.organizedItems,
        safetyNotice: data.safetyNotice,
        provider: data.provider || "deterministic-fallback",
        modelUsed: data.modelUsed || "deterministic-ruleset-v1",
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.warn("API call failed, providing on-device fallback:", err);
      setLastFailedText(text);

      const fallbackMsg: ChatMessage = {
        id: nextId("fallback"),
        role: "assistant",
        content: `I've organized details for your question: "${text.substring(0, 80)}${text.length > 80 ? "..." : ""}". Here are key points to review:`,
        timestamp: getTimeString(),
        generalInformation: "Turn your symptom descriptions into a chronological outline before your appointment.",
        whatImUnsureAbout: "AI cannot view your laboratory results or medical history.",
        whenToSeekCare: "Contact a qualified clinician if symptoms change suddenly or fail to improve.",
        suggestedDoctorQuestions: [
          "What is the most likely cause for my symptoms?",
          "Are there specific warning signs that should prompt me to call your clinic immediately?",
        ],
        safetyNotice: "Educational Demonstration: Aroviax is an informational tool.",
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      setErrorMessage("Note: Connection issue encountered. Showing local structured guidance.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages(initialMessages);
    setInputValue("");
    setErrorMessage(null);
    setLastFailedText(null);
  };

  const handleCopySummary = (msg: ChatMessage, index: number) => {
    let text = `Aroviax Question Summary\n`;
    text += `==============================\n\n`;
    text += `${msg.content}\n\n`;

    if (msg.generalInformation) {
      text += `General Information:\n${msg.generalInformation}\n\n`;
    }
    if (msg.whatImUnsureAbout) {
      text += `What AI Cannot Know:\n${msg.whatImUnsureAbout}\n\n`;
    }
    if (msg.whenToSeekCare) {
      text += `When to Seek Care:\n${msg.whenToSeekCare}\n\n`;
    }
    if (msg.suggestedDoctorQuestions && msg.suggestedDoctorQuestions.length > 0) {
      text += `Questions for Doctor:\n`;
      msg.suggestedDoctorQuestions.forEach((q) => {
        text += `- ${q}\n`;
      });
      text += `\n`;
    }

    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  // Web Speech Recognition for Voice Input
  const toggleVoiceInput = () => {
    if (typeof window === "undefined") return;

    interface SpeechRecognitionEvent {
      results: { [index: number]: { [index: number]: { transcript: string } } };
    }
    interface SpeechRecognitionInstance {
      continuous: boolean;
      interimResults: boolean;
      lang: string;
      onstart: () => void;
      onend: () => void;
      onerror: () => void;
      onresult: (event: SpeechRecognitionEvent) => void;
      start: () => void;
    }
    type WindowWithSpeech = {
      SpeechRecognition?: new () => SpeechRecognitionInstance;
      webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
    };

    const win = window as unknown as WindowWithSpeech;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. You can type in the box below.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0]?.[0]?.transcript;
        if (transcript) {
          setInputValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.start();
    } catch (e) {
      console.warn("Could not start speech recognition:", e);
      setIsListening(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner with Badges & Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm sm:text-base text-[#172554]">
                Assistant Chat Workspace
              </h2>
              <StatusBadge status={localOnlyMode ? "On your device" : "Live"} />
            </div>
            <p className="text-xs text-slate-500">
              {localOnlyMode
                ? "Running locally on device (0 network requests)"
                : "Connected to Aroviax backend"}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPrivacyModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            title="Inspect what will be sent over the wire"
          >
            <Eye className="w-3.5 h-3.5 text-teal-700" />
            <span>Privacy Inspector</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start Over</span>
          </button>
        </div>
      </div>

      {/* Safety Signal Layer: Deterministic Emergency Banner (If detected in input) */}
      {safetySignal.hasEmergencySignal && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 space-y-2 animate-in fade-in"
        >
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-amber-900">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
            <span>Safety Signal Escalation Triggered</span>
          </div>
          <p className="text-xs font-semibold text-amber-900">
            {safetySignal.escalationNotice}
          </p>
          <ul className="text-xs list-disc pl-5 space-y-0.5 text-amber-800">
            {safetySignal.guidanceSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>
          <p className="text-[11px] text-amber-700 italic pt-1">
            Deterministic safety notice: This rule-based check only escalates; it never reassures. Absence of a notice does not mean a situation is safe.
          </p>
        </div>
      )}

      {/* Privacy Nudge: Identifier Warning */}
      {privacyCheck.hasIdentifiers && (
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between gap-3 text-xs text-blue-950">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-700 shrink-0" />
            <span>
              Your draft includes personal details ({privacyCheck.identifiers.map((i) => i.type).join(", ")}).
            </span>
          </div>
          <button
            type="button"
            onClick={() => setInputValue(privacyCheck.redactedText)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shrink-0"
          >
            Redact Details
          </button>
        </div>
      )}

      {/* Chat Messages Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-[650px] max-h-[75vh]">
        {/* Messages List */}
        <div
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/40"
          role="log"
          aria-live="polite"
        >
          {messages.map((msg, index) => {
            const isAssistant = msg.role === "assistant";
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${
                  isAssistant ? "justify-start" : "justify-end"
                }`}
              >
                {isAssistant && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[88%] sm:max-w-[82%] space-y-3 ${isAssistant ? "text-left" : "text-right"}`}>
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      isAssistant
                        ? "bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-xs"
                        : "bg-blue-600 text-white rounded-tr-xs shadow-sm font-medium"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.content}</p>
                  </div>

                  {/* Fixed Structured Sections for Assistant Output */}
                  {isAssistant && msg.generalInformation && (
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-2.5 text-xs">
                      <div>
                        <span className="font-bold uppercase tracking-wider text-slate-700 block text-[11px] mb-0.5">
                          General Information:
                        </span>
                        <p className="text-slate-600">{msg.generalInformation}</p>
                      </div>

                      {msg.whatImUnsureAbout && (
                        <div className="pt-2 border-t border-slate-100">
                          <span className="font-bold uppercase tracking-wider text-amber-800 block text-[11px] mb-0.5">
                            What I&apos;m Unsure About (Limits):
                          </span>
                          <p className="text-slate-600">{msg.whatImUnsureAbout}</p>
                        </div>
                      )}

                      {msg.whenToSeekCare && (
                        <div className="pt-2 border-t border-slate-100">
                          <span className="font-bold uppercase tracking-wider text-blue-900 block text-[11px] mb-0.5">
                            When to Seek Professional Care:
                          </span>
                          <p className="text-slate-600">{msg.whenToSeekCare}</p>
                        </div>
                      )}

                      {msg.suggestedDoctorQuestions && msg.suggestedDoctorQuestions.length > 0 && (
                        <div className="pt-2 border-t border-slate-100">
                          <span className="font-bold uppercase tracking-wider text-teal-800 block text-[11px] mb-1">
                            Questions to Ask a Professional:
                          </span>
                          <ul className="space-y-1">
                            {msg.suggestedDoctorQuestions.map((q, qIdx) => (
                              <li key={qIdx} className="flex items-start gap-1.5 text-slate-700 font-medium">
                                <span className="text-blue-600 font-bold">&bull;</span>
                                <span>{q}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Assistant Footer: Read Aloud + Copy Summary + Timestamp */}
                  {isAssistant && (
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-400">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopySummary(msg, index)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium transition-colors"
                        >
                          {copiedIndex === index ? (
                            <>
                              <Check className="w-3 h-3 text-teal-700" />
                              <span className="text-teal-700">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Summary</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (isSpeaking) stopSpeaking();
                            else speakText(msg.content);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium transition-colors"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>{isSpeaking ? "Stop" : "Read Aloud"}</span>
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        {msg.provider === "live-ai" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Live AI ({msg.modelUsed || "LLM"})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                            Deterministic Safety Heuristic
                          </span>
                        )}
                        <span>{msg.timestamp}</span>
                      </div>
                    </div>
                  )}
                </div>

                {!isAssistant && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 text-xs mt-1">
                    <User className="w-4 h-4 text-slate-600" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-start gap-3 justify-start animate-in fade-in">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-xs shadow-xs text-xs text-slate-500 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                <span>Structuring informational health guidance...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Starter Topic Buttons */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200">
          <p className="text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-blue-600" />
            <span>Suggested starter topics:</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {starterQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isLoading}
                onClick={() => handleSendMessage(q)}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition-colors disabled:opacity-50 text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input & Form Area */}
        <div className="p-4 bg-white border-t border-slate-200">
          {errorMessage && (
            <div className="mb-3 text-xs text-amber-800 bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl flex items-center justify-between gap-2 animate-in fade-in">
              <span>{errorMessage}</span>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="font-bold text-amber-900 px-1 hover:text-amber-950"
                aria-label="Dismiss message"
              >
                &times;
              </button>
            </div>
          )}

          {/* Explicit Failure and Retry State */}
          {lastFailedText && (
            <div
              role="alert"
              className="mb-3 text-xs text-red-800 bg-red-50 border border-red-200 px-4 py-2.5 rounded-xl flex items-center justify-between gap-3 animate-in fade-in"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>Connection failed. Retry: &ldquo;{lastFailedText.substring(0, 40)}...&rdquo;?</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const text = lastFailedText;
                  setLastFailedText(null);
                  handleSendMessage(text);
                }}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-xs"
              >
                Retry
              </button>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Describe a concern in plain words or ask for doctor questions..."
                disabled={isLoading}
                maxLength={2000}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm outline-none"
              />
            </div>

            {/* Voice Input Mic Button */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              title={isListening ? "Listening... click to stop" : "Speak your question (Voice Input)"}
              className={`p-3 rounded-xl border transition-colors ${
                isListening
                  ? "bg-red-500 text-white border-red-600 animate-pulse"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="px-5 py-3 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 flex items-center gap-2 shrink-0 transition-colors"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Privacy Inspector Modal */}
      <PrivacyInspectorModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        pendingPayload={{
          message: inputValue || "(Empty draft)",
          mode: "chat",
          localOnly: localOnlyMode,
        }}
        inspectionResult={privacyCheck}
        onApplyRedaction={(redacted) => setInputValue(redacted)}
        localOnlyMode={localOnlyMode}
        onToggleLocalOnly={onToggleLocalOnly}
      />
    </div>
  );
}
