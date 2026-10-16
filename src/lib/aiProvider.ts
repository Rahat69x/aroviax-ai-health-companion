import type { ChatMode, ChatResponse } from "../types/chat.ts";
import { EMERGENCY_PHRASE_LIST } from "./safetySignals.ts";
import { lookupTerm } from "./termTranslator.ts";

export interface AiProviderConfig {
  hasOpenAiKey: boolean;
  hasGeminiKey: boolean;
  activeProvider: "openai" | "gemini" | "deterministic-fallback";
}

export function getAiProviderConfig(): AiProviderConfig {
  const hasOpenAiKey = Boolean(process.env.OPENAI_API_KEY?.trim());
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY?.trim());

  let activeProvider: "openai" | "gemini" | "deterministic-fallback" = "deterministic-fallback";
  if (hasOpenAiKey) {
    activeProvider = "openai";
  } else if (hasGeminiKey) {
    activeProvider = "gemini";
  }

  return {
    hasOpenAiKey,
    hasGeminiKey,
    activeProvider,
  };
}

/**
 * Deterministic offline response engine.
 * Always available, 100% predictable, non-diagnostic, and safe without external internet.
 */
export function generateDeterministicResponse(
  message: string,
  mode: ChatMode = "chat"
): ChatResponse {
  const requestId = `det_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const trimmed = message.trim();
  const lower = trimmed.toLowerCase();

  // 1. Emergency Pre-emption Check
  const detectedEmergency = EMERGENCY_PHRASE_LIST.some((phrase) => lower.includes(phrase));
  if (detectedEmergency) {
    return {
      requestId,
      timestamp,
      mode,
      isEmergencyAlert: true,
      provider: "deterministic-fallback",
      modelUsed: "emergency-interceptor-v1",
      reply:
        "CRITICAL SAFETY ALERT: The symptoms or words you entered may represent an acute medical emergency. AI assistants cannot evaluate or triage emergencies.",
      generalInformation:
        "High-acuity medical conditions require immediate clinical evaluation by emergency healthcare professionals.",
      whatImUnsureAbout:
        "An AI model cannot examine physical signs, measure vital signs, or safely gauge physiological stability.",
      whenToSeekCare:
        "Seek emergency medical services (e.g. call 911 or your local emergency number) or go to the nearest emergency department immediately.",
      suggestedDoctorQuestions: [
        "What immediate stabilization or diagnostic tests are required right now?",
        "What caused this acute episode?",
      ],
      organizedItems: [
        "Do not delay seeking care to read or write online messages",
        "If you are alone and can safely do so, unlock your door or notify someone nearby",
        "Do not drive yourself if experiencing chest pain, dizziness, or confusion",
      ],
      safetyNotice:
        "EMERGENCY WARNING: Call local emergency services immediately. Do not rely on AI for acute medical situations.",
      confidenceNote: "Emergency override active. Diagnostic speculation strictly withheld.",
    };
  }

  // 2. Mode: Term Translation
  if (mode === "translate") {
    const foundTerm = lookupTerm(trimmed);
    let reply = "";
    let generalInfo = "";
    let whatUnsure = "";
    let questions = [
      "What does this result mean in the context of my other tests?",
      "Does this finding require treatment or routine monitoring?",
    ];

    if (foundTerm) {
      reply = `Plain-Language Explanation for "${foundTerm.term}":\n\n• Simple: ${foundTerm.simple}\n• Standard: ${foundTerm.standard}\n• Detailed: ${foundTerm.detailed}`;
      generalInfo = foundTerm.standard;
      whatUnsure = foundTerm.whatItDoesNotTellYou;
    } else {
      reply = `Educational Breakdown for "${trimmed}": In medical literacy, this term represents an anatomical or clinical concept.`;
      generalInfo = "Medical terminology is composed of standard roots (e.g., 'itis' for inflammation, 'algia' for pain).";
      whatUnsure = "What this does NOT tell you: A term alone does not indicate individual prognosis, personal severity, or required medication without clinical context.";
      questions = [
        "Could you explain what this term means for me specifically?",
        "What should I watch for while we monitor this?",
      ];
    }

    return {
      requestId,
      timestamp,
      mode,
      isEmergencyAlert: false,
      provider: "deterministic-fallback",
      modelUsed: "deterministic-translator-v1",
      reply,
      generalInformation: generalInfo,
      whatImUnsureAbout: whatUnsure,
      whenToSeekCare: "Discuss this term with your ordering physician to understand how it applies to your health.",
      suggestedDoctorQuestions: questions,
      safetyNotice: "Educational Term Translation: Does not substitute for clinical interpretation.",
      confidenceNote: "Deterministic translation from verified medical literacy dictionary.",
    };
  }

  // 3. Mode: After-Visit Notes
  if (mode === "afterVisit") {
    return {
      requestId,
      timestamp,
      mode,
      isEmergencyAlert: false,
      provider: "deterministic-fallback",
      modelUsed: "deterministic-aftervisit-v1",
      reply: "Here is a structured organization of what you reported from your clinical visit:",
      generalInformation: "What was discussed: You noted points from your doctor regarding your care plan.",
      whatImUnsureAbout: "What remains unverified: MediSupport AI does not invent or assume medication dosages or clinical orders that you did not explicitly write.",
      whenToSeekCare: "Contact your doctor's office immediately if symptoms worsen or if new warning signs emerge that your clinician instructed you to call about.",
      organizedItems: [
        "Reported instructions: Restated verbatim from your notes (no medical additions made)",
        "Follow-up milestones: Scheduled checks or pending laboratory notifications",
        "Clarification checklist: Points that felt ambiguous during the consultation",
      ],
      suggestedDoctorQuestions: [
        "I want to confirm: What is the exact schedule or duration for the instructions we discussed?",
        "Who should I call if I have questions before our next appointment?",
      ],
      safetyNotice: "After-Visit Notes Tool: Restates and structures patient notes without clinical interpretation.",
      confidenceNote: "Deterministic structuring of user-provided notes.",
    };
  }

  // 4. Default Mode: Chat & Question Preparation
  let generalInfo = "General health literacy guidance to help organize questions for your healthcare team.";
  let whatUnsure = "AI cannot examine your physical state, view medical history, or establish a clinical diagnosis.";
  let whenToSeek = "Consult a licensed healthcare provider for any persistent, worsening, or distressing health concerns.";
  let questions = [
    "What do you believe is the most likely cause of my symptoms?",
    "Are there warning signs that should prompt me to call your clinic?",
    "What lifestyle adjustments or self-care steps do you recommend while monitoring this?",
  ];
  let organizedItems = [
    "Timeline: When did symptoms start and how have they evolved?",
    "Triggers & Relief: What activities, postures, or foods influence the feeling?",
    "Current routine: Note all prescription medications, vitamins, and supplements",
  ];

  if (lower.includes("headache")) {
    generalInfo = "Headaches vary from tension-related patterns to migraine or eye strain. Doctors evaluate location, frequency, and associated symptoms.";
    whatUnsure = "What I cannot know: Whether this headache is primary (like tension) or secondary to an underlying factor. Only a medical exam can determine the cause.";
    whenToSeek = "Seek urgent medical attention if a headache is sudden and explosive ('thunderclap'), accompanied by fever, stiff neck, confusion, weakness, or vision changes.";
    questions = [
      "What type of headache does my pattern most closely resemble?",
      "Could this be related to stress, screen time, hydration, or medication side effects?",
      "What specific red-flag changes should prompt immediate emergency evaluation?",
    ];
    organizedItems = [
      "Location: One-sided, forehead band, behind eyes, or base of neck",
      "Intensity: Rate on a 0-10 scale and note if it disrupts sleep or work",
      "Triggers: Note screen time, hydration, caffeine, sleep, or stress changes",
    ];
  } else if (lower.includes("prepare") || lower.includes("doctor") || lower.includes("appointment")) {
    generalInfo = "Preparing structured notes helps ensure your key concerns are thoroughly addressed during a brief appointment.";
    whatUnsure = "What I cannot know: Your clinic's specific scheduling constraints or your comprehensive medical records.";
    whenToSeek = "Call your clinic's triage nurse if symptoms accelerate prior to your scheduled appointment date.";
    questions = [
      "What is the most likely cause for what I am experiencing?",
      "Are there diagnostic tests you recommend, and what will they tell us?",
      "When should we schedule a follow-up to evaluate progress?",
    ];
    organizedItems = [
      "Primary concern in 1 clear sentence",
      "List of all current medications, vitamins, and herbal supplements",
      "Your top 3 prioritized questions so you do not leave without answers",
    ];
  }

  return {
    requestId,
    timestamp,
    mode: "chat",
    isEmergencyAlert: false,
    provider: "deterministic-fallback",
    modelUsed: "deterministic-ruleset-v1",
    reply: `Thank you for sharing your concern: "${trimmed.substring(0, 90)}${trimmed.length > 90 ? "..." : ""}". Here is an organized guide to prepare for your conversation with a healthcare professional:`,
    generalInformation: generalInfo,
    whatImUnsureAbout: whatUnsure,
    whenToSeekCare: whenToSeek,
    suggestedDoctorQuestions: questions,
    organizedItems,
    safetyNotice: "Informational Support Only: MediSupport AI is not a doctor. Consult a licensed clinician for medical decisions.",
    confidenceNote: "Structured via deterministic health-communication heuristic (No live LLM key configured).",
  };
}

/**
 * Generates an AI response using a configured provider (OpenAI / Gemini)
 * or seamlessly falls back to deterministic safety logic if no key is present or on timeout/failure.
 */
export async function generateAiChatResponse(
  message: string,
  mode: ChatMode = "chat"
): Promise<ChatResponse> {
  const trimmed = message.trim();
  const lower = trimmed.toLowerCase();

  // Invariant: Emergency check ALWAYS runs before any external network call
  if (EMERGENCY_PHRASE_LIST.some((phrase) => lower.includes(phrase))) {
    return generateDeterministicResponse(trimmed, mode);
  }

  const config = getAiProviderConfig();

  // If OpenAI key is present, attempt live completion with timeout
  if (config.hasOpenAiKey && process.env.OPENAI_API_KEY) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8-second safety timeout

      const systemPrompt = `You are MediSupport AI, a compassionate healthcare communication assistant.
CLINICAL GOVERNANCE INVARIANTS:
1. YOU MUST NEVER DIAGNOSE or calculate diagnostic probabilities.
2. YOU MUST NEVER PRESCRIBE or recommend dosage adjustments.
3. Help the user organize symptoms, explain health concepts in plain language, and prepare doctor questions.
4. Always state what you cannot know without an in-person physical exam.
5. Return JSON ONLY with keys: reply, generalInformation, whatImUnsureAbout, whenToSeekCare, suggestedDoctorQuestions (array), organizedItems (array), confidenceNote.`;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `User Concern: ${trimmed}\nMode: ${mode}` },
          ],
          temperature: 0.3,
          max_tokens: 800,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const rawJson = await response.json();
        const content = rawJson?.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          const requestId = `live_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
          const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

          return {
            requestId,
            timestamp,
            mode,
            isEmergencyAlert: false,
            provider: "live-ai",
            modelUsed: "gpt-4o-mini",
            reply: parsed.reply || "Here is information to help organize your health concern:",
            generalInformation: parsed.generalInformation,
            whatImUnsureAbout: parsed.whatImUnsureAbout || "AI cannot examine physical signs or confirm clinical status.",
            whenToSeekCare: parsed.whenToSeekCare || "Consult a licensed healthcare provider for personal medical advice.",
            suggestedDoctorQuestions: Array.isArray(parsed.suggestedDoctorQuestions) ? parsed.suggestedDoctorQuestions : [],
            organizedItems: Array.isArray(parsed.organizedItems) ? parsed.organizedItems : [],
            safetyNotice: "Informational Support Only: MediSupport AI is not a doctor. Consult a licensed clinician for medical decisions.",
            confidenceNote: parsed.confidenceNote || "Generated with live clinical communication guidance.",
          };
        }
      }
    } catch {
      // On network failure or timeout, gracefully drop to deterministic fallback
    }
  }

  // Graceful deterministic fallback
  return generateDeterministicResponse(trimmed, mode);
}
