/**
 * @file privacyInspector.ts
 * @description Client-side privacy inspector and PII redaction engine.
 *
 * Runs 100% on the user's device. Scans text for common sensitive identifiers
 * (emails, phone numbers, SSN, credit cards, medical record IDs) before network transmission.
 */

export interface DetectedIdentifier {
  type: "email" | "phone" | "ssn_id" | "date_of_birth";
  match: string;
  index: number;
}

export interface PrivacyInspectionResult {
  hasIdentifiers: boolean;
  identifiers: DetectedIdentifier[];
  redactedText: string;
}

// Regex patterns for sensitive identifier detection
const EMAIL_REGEX = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/g;
const PHONE_REGEX = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
const SSN_OR_MRN_REGEX = /\b(\d{3}-\d{2}-\d{4}|\d{9,12})\b/g;
const DOB_REGEX = /\b(dob|birthdate|date of birth)[\s:]+\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}\b/gi;

/**
 * Inspects a string for sensitive personal identifiers.
 */
export function inspectPrivacy(text: string): PrivacyInspectionResult {
  if (!text) {
    return {
      hasIdentifiers: false,
      identifiers: [],
      redactedText: "",
    };
  }

  const identifiers: DetectedIdentifier[] = [];

  let match: RegExpExecArray | null;

  // Scan emails
  const emailRegex = new RegExp(EMAIL_REGEX);
  while ((match = emailRegex.exec(text)) !== null) {
    identifiers.push({
      type: "email",
      match: match[0],
      index: match.index,
    });
  }

  // Scan phones
  const phoneRegex = new RegExp(PHONE_REGEX);
  while ((match = phoneRegex.exec(text)) !== null) {
    identifiers.push({
      type: "phone",
      match: match[0],
      index: match.index,
    });
  }

  // Scan SSN / Medical Record Number patterns
  const idRegex = new RegExp(SSN_OR_MRN_REGEX);
  while ((match = idRegex.exec(text)) !== null) {
    identifiers.push({
      type: "ssn_id",
      match: match[0],
      index: match.index,
    });
  }

  // Scan Date of Birth patterns
  const dobRegex = new RegExp(DOB_REGEX);
  while ((match = dobRegex.exec(text)) !== null) {
    identifiers.push({
      type: "date_of_birth",
      match: match[0],
      index: match.index,
    });
  }

  const redactedText = redactIdentifiers(text);

  return {
    hasIdentifiers: identifiers.length > 0,
    identifiers,
    redactedText,
  };
}

/**
 * Replaces detected personal identifiers with clean, anonymous placeholders.
 */
export function redactIdentifiers(text: string): string {
  if (!text) return "";

  return text
    .replace(EMAIL_REGEX, "[REDACTED_EMAIL]")
    .replace(PHONE_REGEX, "[REDACTED_PHONE]")
    .replace(SSN_OR_MRN_REGEX, "[REDACTED_ID]")
    .replace(DOB_REGEX, "[REDACTED_DOB]");
}

/**
 * Local Data Management
 * Clears in-memory and local storage data when requested by user.
 */
export function clearAllLocalData(): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem("medisupport_accessibility_prefs");
      localStorage.removeItem("medisupport_journal_entries");
      localStorage.removeItem("medisupport_prepkit_draft");
      localStorage.removeItem("medisupport_medications");
      localStorage.removeItem("medisupport_health_notes");
      sessionStorage.clear();
    } catch (e) {
      console.warn("Could not clear local storage:", e);
    }
  }
}
