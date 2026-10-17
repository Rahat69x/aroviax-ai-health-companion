"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  RotateCcw,
  Bot,
  User,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Copy,
  Check,
  Printer,
  AlertTriangle,
  Loader2,
  Info,
} from "lucide-react";
import { ChatMessage, ChatResponse } from "@/types/chat";

let idCounter = 0;
function generateUniqueId(prefix: string): string {
  idCounter += 1;
  return `${prefix}_${idCounter}`;
}

function getFormattedTime(): string {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
}

export function InteractiveDemoSection() {
  const starterQuestions = [
    "Help me prepare questions for my doctor.",
    "Explain this medical term in simple language.",
    "Help me organize the symptoms I want to discuss.",
    "What information should I bring to my appointment?",
  ];

  const initialMessages: ChatMessage[] = [
    {
      id: "init-1",
      role: "assistant",
      content:
        "Hello! I am Aroviax, your AI Health Companion. I'm here to help you understand general health information, organize your symptoms, and prepare clear questions for your healthcare professional.",
      timestamp: "Just now",
      safetyNotice:
        "Reminder: I am an informational AI assistant, not a doctor. I cannot provide a medical diagnosis or treatment plan.",
      organizedItems: [
        "Pick a starter question below or type your concern in plain language.",
        "You can organize symptoms, prepare doctor questions, or unpack confusing health terms.",
        "If you are experiencing acute or severe symptoms, seek emergency medical care immediately.",
      ],
      suggestedDoctorQuestions: [
        "What questions should I prioritize during my consultation?",
        "How can I summarize my symptoms clearly for my doctor?",
      ],
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastFailedText, setLastFailedText] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend ?? inputValue).trim();
    if (!text || isLoading) return;

    setErrorMessage(null);
    const userMsgId = generateUniqueId("user");
    const userTimestamp = getFormattedTime();

    const newUserMessage: ChatMessage = {
      id: userMsgId,
      role: "user",
      content: text,
      timestamp: userTimestamp,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: Failed to get assistant response`);
      }

      const data: ChatResponse = await response.json();

      const assistantMsg: ChatMessage = {
        id: data.requestId || generateUniqueId("ast"),
        role: "assistant",
        content: data.reply,
        timestamp: data.timestamp || getFormattedTime(),
        isEmergencyAlert: data.isEmergencyAlert,
        organizedItems: data.organizedItems,
        suggestedDoctorQuestions: data.suggestedDoctorQuestions,
        safetyNotice: data.safetyNotice,
        confidenceNote: data.confidenceNote,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      console.warn("API request failed, providing local demo fallback:", err);
      setLastFailedText(text);
      // Safe fallback response to ensure user never gets blocked during offline testing
      const fallbackMsg: ChatMessage = {
        id: generateUniqueId("fallback"),
        role: "assistant",
        content: `Thank you for sharing your concern regarding "${text.substring(0, 80)}${text.length > 80 ? "..." : ""}". Here is an organized framework to help you prepare:`,
        timestamp: getFormattedTime(),
        organizedItems: [
          "Record when symptoms first began and note if they are constant or intermittent",
          "Track activities or factors that make the symptom feel better or worse",
          "Prepare a complete list of current prescription and over-the-counter medications",
        ],
        suggestedDoctorQuestions: [
          "What is the most likely cause for what I am experiencing?",
          "Are there specific warning signs that should prompt me to contact your office immediately?",
        ],
        safetyNotice:
          "Educational Demonstration: Aroviax is an informational tool. Consult a qualified clinician for personalized medical advice.",
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      setErrorMessage("Note: Operating in local demonstration mode. Responses are structured for illustrative appointment prep.");
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleReset = () => {
    setMessages(initialMessages);
    setInputValue("");
    setErrorMessage(null);
    setLastFailedText(null);
    inputRef.current?.focus();
  };

  const handleCopySummary = (msg: ChatMessage, index: number) => {
    let summaryText = `Aroviax Preparation Summary\n`;
    summaryText += `---------------------------------\n`;
    summaryText += `${msg.content}\n\n`;

    if (msg.organizedItems && msg.organizedItems.length > 0) {
      summaryText += `Key Details to Track:\n`;
      msg.organizedItems.forEach((item, i) => {
        summaryText += `${i + 1}. ${item}\n`;
      });
      summaryText += `\n`;
    }

    if (msg.suggestedDoctorQuestions && msg.suggestedDoctorQuestions.length > 0) {
      summaryText += `Questions for Your Doctor:\n`;
      msg.suggestedDoctorQuestions.forEach((q) => {
        summaryText += `- ${q}\n`;
      });
      summaryText += `\n`;
    }

    summaryText += `Disclaimer: ${msg.safetyNotice || "Informational tool only. Not medical advice."}`;

    navigator.clipboard.writeText(summaryText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section
      id="demo"
      aria-labelledby="demo-heading"
      className="py-16 md:py-24 bg-[#F8FAFC]"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E8F6F4] text-[#0D817C] border border-[#0D817C]/20 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#0D817C]" />
            <span>Interactive Demo Preview</span>
          </div>
          <h2
            id="demo-heading"
            className="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight mb-4"
          >
            Experience Aroviax in Action
          </h2>
          <p className="text-base text-[#334155] leading-relaxed">
            Test how the assistant helps organize questions, demystify medical terms, and structure
            talking points for your next doctor&apos;s visit.
          </p>
        </div>

        {/* Chat Card Container */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-xl overflow-hidden flex flex-col h-[740px] max-h-[85vh]">
          {/* Top Bar with Demo Label & Controls */}
          <div className="px-5 py-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0D817C] text-white flex items-center justify-center shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#172554]">
                    Aroviax Assistant
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E8F6F4] text-[#0D817C] border border-[#0D817C]/20">
                    Live Demo Mode
                  </span>
                </div>
                <p className="text-xs text-[#64748B]">
                  Health literacy & appointment question organizer
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                title="Print question checklist for your appointment"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#334155] bg-white hover:bg-[#E8F6F4] border border-[#E2E8F0] transition-colors focus-visible:ring-2 focus-visible:ring-[#0D817C]"
              >
                <Printer className="w-3.5 h-3.5 text-[#0D817C]" />
                <span className="hidden sm:inline">Print / Save</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                title="Reset conversation and start over"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#334155] bg-white hover:bg-[#E8F6F4] border border-[#E2E8F0] transition-colors focus-visible:ring-2 focus-visible:ring-[#0D817C]"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#64748B]" />
                <span>Start Over</span>
              </button>
            </div>
          </div>

          {/* Visible Safety Notice Banner */}
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-start gap-2.5 text-xs text-amber-900">
            <ShieldAlert className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong>Safety Notice:</strong> Aroviax is an educational demonstration tool.
              It does not diagnose conditions, prescribe medications, or replace human doctors.
              For medical emergencies, immediately call your local emergency service.
            </div>
          </div>

          {/* Chat Messages Scrollable Area */}
          <div
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#F8FAFC]/50"
            role="log"
            aria-live="polite"
          >
            {/* Explicit Empty State */}
            {messages.length === 0 && (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 text-[#64748B] space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#E8F6F4] text-[#0D817C] flex items-center justify-center border border-[#0D817C]/20">
                  <Bot className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-[#172554] text-base">Conversation Cleared</h4>
                <p className="text-xs text-[#64748B] max-w-sm">
                  Describe your health concern in simple language or choose one of the starter questions below to begin organizing your thoughts.
                </p>
                <button
                  type="button"
                  onClick={() => setMessages(initialMessages)}
                  className="text-xs font-semibold text-[#0D817C] hover:text-[#086B67] hover:underline"
                >
                  Restore starter example
                </button>
              </div>
            )}

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
                    <div className="w-8 h-8 rounded-full bg-[#0D817C] text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] sm:max-w-[80%] space-y-3 ${
                      isAssistant ? "text-left" : "text-right"
                    }`}
                  >
                    {/* Main Bubble */}
                    <div
                      className={`p-4 rounded-2xl text-sm leading-relaxed ${
                        isAssistant
                          ? "bg-white border border-[#E2E8F0] text-[#334155] rounded-tl-xs shadow-xs"
                          : "bg-[#0D817C] text-white rounded-tr-xs shadow-sm font-medium"
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.content}</p>
                    </div>

                    {/* Emergency Alert Box (if triggered) */}
                    {msg.isEmergencyAlert && (
                      <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 text-xs text-red-900 space-y-2">
                        <div className="flex items-center gap-2 font-bold text-red-800 text-sm">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span>Acute Emergency Red Flag Detected</span>
                        </div>
                        <p>
                          Your message mentions symptoms that require urgent medical attention. Do
                          not wait or rely on an AI conversational tool.
                        </p>
                        <p className="font-semibold text-red-700">
                          Please call 911 or your local emergency number immediately.
                        </p>
                      </div>
                    )}

                    {/* Organized Items Checklist (Assistant) */}
                    {isAssistant && msg.organizedItems && msg.organizedItems.length > 0 && (
                      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs text-left">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#172554] mb-2 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0D817C]" />
                          Key Details to Keep Track Of:
                        </h4>
                        <ul className="space-y-1.5 text-xs text-[#334155]">
                          {msg.organizedItems.map((item, itemIdx) => (
                            <li key={itemIdx} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0D817C] mt-1.5 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Suggested Doctor Questions Box (Assistant) */}
                    {isAssistant &&
                      msg.suggestedDoctorQuestions &&
                      msg.suggestedDoctorQuestions.length > 0 && (
                        <div className="bg-[#E8F6F4] border border-[#0D817C]/20 rounded-xl p-4 shadow-xs text-left">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[#172554] mb-2 flex items-center gap-1.5">
                            <HelpCircle className="w-3.5 h-3.5 text-[#0D817C]" />
                            Questions to Ask Your Doctor:
                          </h4>
                          <ul className="space-y-1.5 text-xs text-[#172554] font-medium">
                            {msg.suggestedDoctorQuestions.map((q, qIdx) => (
                              <li key={qIdx} className="flex items-start gap-2">
                                <span className="text-[#0D817C] font-bold">Q{qIdx + 1}:</span>
                                <span>“{q}”</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {/* Assistant Footer: Copy button + Safety Notice + Timestamp */}
                    {isAssistant && (
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-400">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopySummary(msg, index)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#E8F6F4] hover:bg-[#d5eee9] text-[#0D817C] font-medium transition-colors focus-visible:ring-1 focus-visible:ring-[#0D817C]"
                            title="Copy organized points for your appointment"
                          >
                            {copiedIndex === index ? (
                              <>
                                <Check className="w-3 h-3 text-[#0D817C]" />
                                <span className="text-[#0D817C]">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Summary</span>
                              </>
                            )}
                          </button>
                          <span>{msg.timestamp}</span>
                        </div>
                        {msg.safetyNotice && (
                          <span className="text-[10px] text-[#64748B] italic">
                            Non-diagnostic
                          </span>
                        )}
                      </div>
                    )}

                    {!isAssistant && (
                      <span className="text-[11px] text-slate-400 block pr-1">
                        {msg.timestamp}
                      </span>
                    )}
                  </div>

                  {!isAssistant && (
                    <div className="w-8 h-8 rounded-full bg-[#E2E8F0] text-[#334155] flex items-center justify-center shrink-0 text-xs mt-1">
                      <User className="w-4 h-4 text-[#64748B]" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start gap-3 justify-start animate-in fade-in duration-200">
                <div className="w-8 h-8 rounded-full bg-[#0D817C] text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-[#E2E8F0] p-4 rounded-2xl rounded-tl-xs shadow-xs text-xs text-[#334155] flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-[#0D817C] animate-spin" />
                  <span>Synthesizing health literacy points and organizing questions...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Starter Suggestions */}
          <div className="px-4 py-2 bg-[#F8FAFC] border-t border-[#E2E8F0]">
            <p className="text-[11px] font-semibold text-[#64748B] mb-1.5 flex items-center gap-1">
              <Info className="w-3 h-3 text-[#0D817C]" />
              Suggested starter topics (click to try):
            </p>
            <div className="flex flex-wrap gap-1.5">
              {starterQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSendMessage(q)}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-white hover:bg-[#E8F6F4] text-[#334155] hover:text-[#0D817C] border border-[#E2E8F0] hover:border-[#0D817C]/30 transition-colors disabled:opacity-50 text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input & Form Area */}
          <div className="p-4 bg-white border-t border-[#E2E8F0]">
            {errorMessage && (
              <div className="mb-2 text-xs text-[#B45309] bg-amber-50 px-3 py-1.5 rounded-lg flex items-center justify-between">
                <span>{errorMessage}</span>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="font-bold ml-2 text-amber-800"
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
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" aria-hidden="true" />
                  <span>
                    Failed to reach assistant service. Would you like to retry sending: &ldquo;{lastFailedText.substring(0, 40)}...&rdquo;?
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      const textToRetry = lastFailedText;
                      setLastFailedText(null);
                      handleSendMessage(textToRetry);
                    }}
                    className="px-3 py-1 bg-[#B91C1C] hover:bg-red-800 text-white font-semibold rounded-lg text-xs transition-colors focus-visible:ring-2 focus-visible:ring-red-600"
                  >
                    Retry
                  </button>
                  <button
                    type="button"
                    onClick={() => setLastFailedText(null)}
                    className="text-red-700 hover:text-red-900 font-bold px-1"
                    aria-label="Dismiss error"
                  >
                    &times;
                  </button>
                </div>
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
                  placeholder="Describe your health concern or ask for doctor questions..."
                  disabled={isLoading}
                  maxLength={1500}
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#0D817C] focus:ring-2 focus:ring-[#0D817C]/20 outline-none text-sm placeholder:text-[#64748B] disabled:bg-slate-50 disabled:text-slate-400 transition-all"
                  aria-label="Health concern or question description"
                />
                <span className="absolute right-3 bottom-1.5 text-[10px] text-[#64748B] hidden sm:inline">
                  {inputValue.length}/1500
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="px-5 py-3 rounded-xl font-semibold text-sm text-white bg-[#0D817C] hover:bg-[#086B67] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-all flex items-center gap-2 shrink-0 focus-visible:ring-2 focus-visible:ring-[#0D817C]"
                aria-label="Send message"
              >
                <span>Send</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-2 text-center text-[11px] text-[#64748B]">
              Aroviax does not replace your doctor. No personal identifiers or medical records are saved.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
