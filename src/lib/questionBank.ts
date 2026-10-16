/**
 * @file questionBank.ts
 * @description Curated, non-diagnostic questions categorized by clinical consultation type.
 *
 * Each question is carefully crafted to be neutral, empowering, and respectful of clinical scope.
 */

export interface QuestionCategory {
  id: string;
  title: string;
  description: string;
  questions: string[];
}

export const QUESTION_BANK: QuestionCategory[] = [
  {
    id: "first-visit",
    title: "First Visit / New Patient",
    description: "Questions to establish a baseline relationship with a new healthcare provider.",
    questions: [
      "What is your philosophy on preventive health and lifestyle changes?",
      "How does your clinic coordinate care if I need referrals or after-hours questions?",
      "Based on my family history, are there routine screenings we should schedule this year?",
    ],
  },
  {
    id: "follow-up",
    title: "Follow-up Appointment",
    description: "Checking progress on an ongoing issue or previous treatment plan.",
    questions: [
      "How do my current symptoms compare to what you expected at this stage?",
      "Are there changes in my daily activities or diet that could speed up recovery?",
      "If my symptoms stay the same over the next month, what is our next step?",
    ],
  },
  {
    id: "test-results",
    title: "Reviewing Test Results",
    description: "Clarifying lab work, imaging reports, or diagnostic screenings.",
    questions: [
      "Could you explain what these test results mean in plain English?",
      "Does this result confirm a clear answer, or do we need additional information?",
      "Are there any numbers in this report that we need to monitor over time?",
    ],
  },
  {
    id: "new-medication",
    title: "Starting a New Medication",
    description: "Understanding prescriptions, potential side effects, and monitoring.",
    questions: [
      "What is the main goal of this medication, and how soon should I expect results?",
      "What common side effects should I watch for, and which ones require calling your office?",
      "Does this medication interact with my existing vitamins, supplements, or meals?",
    ],
  },
  {
    id: "specialist-referral",
    title: "Specialist Referral",
    description: "Navigating next steps when seeing a cardiologist, neurologist, or other specialist.",
    questions: [
      "What specific question or evaluation are you hoping the specialist will answer?",
      "What medical records or test images should I bring to that consultation?",
      "Will you remain my primary point of contact while I see this specialist?",
    ],
  },
  {
    id: "caregiver-visit",
    title: "Caregiver Preparing for a Loved One",
    description: "Advocating for a family member or dependent while respecting their dignity and consent.",
    questions: [
      "What daily warning signs should family members watch for at home?",
      "Who should we contact first if their condition changes over the weekend?",
      "Are there community or home support resources available to assist our family?",
    ],
  },
  {
    id: "mental-health",
    title: "Mental Health & Wellbeing",
    description: "Discussing mood, chronic stress, anxiety, or sleep disruptions comfortably.",
    questions: [
      "Could my physical symptoms (fatigue, headaches) be related to chronic stress or sleep?",
      "What evidence-based options (such as counseling, lifestyle changes, or evaluation) do you recommend?",
      "Can we follow up in a few weeks to review how I am feeling?",
    ],
  },
];
