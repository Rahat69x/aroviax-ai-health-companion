import { NextResponse } from "next/server";
import { ChatResponse, ChatMode } from "@/types/chat";
import { EMERGENCY_PHRASE_LIST } from "@/lib/safetySignals";
import { lookupTerm } from "@/lib/termTranslator";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = body?.message;
    const mode: ChatMode = body?.mode || "chat";

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "A non-empty message string is required." },
        { status: 400 }
      );
    }

    const trimmed = message.trim();
    if (trimmed.length > 2000) {
      return NextResponse.json(
        { error: "Message exceeds maximum allowed length of 2000 characters." },
        { status: 400 }
      );
    }

    const lower = trimmed.toLowerCase();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // 1. Conservative Emergency Keyword Check
    const detectedEmergency = EMERGENCY_PHRASE_LIST.some((phrase) => lower.includes(phrase));

    if (detectedEmergency) {
      const emergencyResponse: ChatResponse = {
        requestId,
        timestamp,
        mode,
        isEmergencyAlert: true,
        reply:
          "CRITICAL SAFETY ALERT: The symptoms or words you entered may represent an acute medical emergency. AI assistants cannot evaluate or triage emergencies.",
        generalInformation:
          "High-acuity medical conditions require immediate clinical evaluation by emergency healthcare professionals.",
        whatImUnsureAbout:
          "An AI model cannot examine physical signs, measure vital signs, or safely gauge physiological stability.",
        whenToSeekCare:
          "Seek emergency medical services (e.g. call 911 or your local emergency number) or go to the nearest emergency department immediately.",
        suggestedDoctorQuestions: [
          "What immediate tests or stabilization are required right now?",
          "What caused this acute episode?",
        ],
        organizedItems: [
          "Do not delay seeking care to type or read online messages",
          "If you are alone and can safely do so, unlock the door or inform someone nearby",
          "Do not drive yourself if experiencing chest pain, dizziness, or confusion",
        ],
        safetyNotice:
          "EMERGENCY WARNING: Call local emergency services immediately. Do not rely on AI for acute medical situations.",
        confidenceNote: "Emergency override active. Diagnostic speculation strictly withheld.",
      };

      return NextResponse.json(emergencyResponse);
    }

    // 2. Mode: Term Translation ("translate")
    if (mode === "translate") {
      const foundTerm = lookupTerm(trimmed);
      let reply = "";
      let generalInfo = "";
      let whatUnsure = "";
      const whenToSeek = "Discuss this term with your ordering physician to understand how it applies to your overall health.";
      let questions: string[] = [
        "What does this result mean in the context of my other tests?",
        "Does this finding require treatment or just routine monitoring?",
      ];

      if (foundTerm) {
        reply = `Plain-Language Explanation for "${foundTerm.term}":\n\n• Simple: ${foundTerm.simple}\n• Standard: ${foundTerm.standard}\n• Detailed: ${foundTerm.detailed}`;
        generalInfo = foundTerm.standard;
        whatUnsure = foundTerm.whatItDoesNotTellYou;
      } else {
        reply = `Educational Breakdown for "${trimmed}": In medical literacy, this term represents a clinical concept or measurement.`;
        generalInfo = "Medical terminology is often composed of Greek and Latin roots (e.g., 'itis' indicating inflammation, 'algia' referring to pain).";
        whatUnsure = "What this does NOT tell you: A medical term alone never indicates overall prognosis, personal severity, or necessary medication without clinical context.";
        questions = [
          "Could you explain what this term or test result means for me specifically?",
          "What should I watch for while we monitor this?",
        ];
      }

      const response: ChatResponse = {
        requestId,
        timestamp,
        mode,
        isEmergencyAlert: false,
        reply,
        generalInformation: generalInfo,
        whatImUnsureAbout: whatUnsure,
        whenToSeekCare: whenToSeek,
        suggestedDoctorQuestions: questions,
        safetyNotice: "Educational Term Translation: Does not substitute for clinical test interpretation.",
      };
      return NextResponse.json(response);
    }

    // 3. Mode: After-Visit Notes Organizer ("afterVisit")
    if (mode === "afterVisit") {
      const response: ChatResponse = {
        requestId,
        timestamp,
        mode,
        isEmergencyAlert: false,
        reply: "Here is a structured organization of what you reported from your visit:",
        generalInformation:
          "What was discussed: You noted points from your doctor regarding your condition and current care plan.",
        whatImUnsureAbout:
          "What remains unverified: MediSupport AI does not invent or assume medication dosages, test scheduling, or clinical orders that you did not explicitly write.",
        whenToSeekCare:
          "Contact your doctor's office immediately if your symptoms worsen, or if new warning signs emerge that your clinician instructed you to call about.",
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
      };
      return NextResponse.json(response);
    }

    // 4. Default Mode: Chat & Question Preparation ("chat")
    let generalInfo = "General health literacy guidance to help organize questions for your healthcare team.";
    let whatUnsure = "AI cannot examine your physical state, view medical history, or establish a clinical diagnosis.";
    let whenToSeek = "Consult a licensed healthcare provider for any persistent, worsening, or distressing health concerns.";
    let questions: string[] = [
      "What do you believe is the most likely cause of my symptoms?",
      "Are there warning signs that should prompt me to call your clinic?",
      "What lifestyle adjustments or self-care steps do you recommend while monitoring this?",
    ];
    let organizedItems: string[] = [
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

    const responsePayload: ChatResponse = {
      requestId,
      timestamp,
      mode: "chat",
      isEmergencyAlert: false,
      reply: `Thank you for sharing your concern: "${trimmed.substring(0, 90)}${trimmed.length > 90 ? "..." : ""}". Here is an organized guide to prepare for your conversation with a healthcare professional:`,
      generalInformation: generalInfo,
      whatImUnsureAbout: whatUnsure,
      whenToSeekCare: whenToSeek,
      suggestedDoctorQuestions: questions,
      organizedItems,
      safetyNotice: "Informational Support Only: MediSupport AI is not a doctor. Consult a licensed clinician for medical decisions.",
      confidenceNote: "Structured according to responsible health communication principles.",
    };

    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error("Chat API route error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your request. Please try again." },
      { status: 500 }
    );
  }
}
