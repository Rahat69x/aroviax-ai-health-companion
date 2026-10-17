export type ChatMode = "chat" | "translate" | "afterVisit";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isEmergencyAlert?: boolean;
  organizedItems?: string[];
  suggestedDoctorQuestions?: string[];
  safetyNotice?: string;
  confidenceNote?: string;
  generalInformation?: string;
  whatImUnsureAbout?: string;
  whenToSeekCare?: string;
  provider?: "live-ai" | "deterministic-fallback" | "fastapi-backend";
  modelUsed?: string;
}

export interface ChatRequest {
  message: string;
  mode?: ChatMode;
  conversationId?: string;
}

export interface ChatResponse {
  reply: string;
  mode: ChatMode;
  generalInformation?: string;
  whatImUnsureAbout?: string;
  whenToSeekCare?: string;
  suggestedDoctorQuestions?: string[];
  organizedItems?: string[];
  safetyNotice: string;
  isEmergencyAlert: boolean;
  confidenceNote?: string;
  requestId: string;
  timestamp: string;
  provider?: "live-ai" | "deterministic-fallback" | "fastapi-backend";
  modelUsed?: string;
}
