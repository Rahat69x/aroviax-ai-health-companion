import test from "node:test";
import assert from "node:assert/strict";
import {
  getAiProviderConfig,
  generateDeterministicResponse,
} from "../src/lib/aiProvider.ts";

test("AI Provider: identifies configuration state gracefully without credentials", () => {
  const config = getAiProviderConfig();
  assert.ok(typeof config.hasOpenAiKey === "boolean");
  assert.ok(typeof config.hasGeminiKey === "boolean");
  // In absence of external env keys, falls back to deterministic engine
  if (!process.env.OPENAI_API_KEY && !process.env.GEMINI_API_KEY) {
    assert.equal(config.activeProvider, "deterministic-fallback");
  }
});

test("AI Provider: deterministic response enforces non-diagnostic invariant", () => {
  const res = generateDeterministicResponse("I have had a mild headache and tiredness for 2 days");
  assert.equal(res.isEmergencyAlert, false);
  assert.equal(res.provider, "deterministic-fallback");
  assert.ok(res.modelUsed?.includes("deterministic"));
  assert.ok(res.reply.length > 0);
  assert.ok(res.whatImUnsureAbout?.includes("cannot know") || res.whatImUnsureAbout?.includes("medical exam"));
  assert.ok(res.suggestedDoctorQuestions && res.suggestedDoctorQuestions.length >= 2);
  assert.ok(res.safetyNotice.includes("not a doctor"));
});

test("AI Provider: emergency signals bypass routine processing immediately", () => {
  const emergencyQuery = "Sudden severe chest pain radiating down left arm with shortness of breath";
  const res = generateDeterministicResponse(emergencyQuery);
  assert.equal(res.isEmergencyAlert, true);
  assert.ok(res.reply.includes("CRITICAL SAFETY ALERT"));
  assert.ok(res.whenToSeekCare?.includes("emergency"));
  assert.equal(res.provider, "deterministic-fallback");
  assert.equal(res.modelUsed, "emergency-interceptor-v1");
});

test("AI Provider: handles term translation mode", () => {
  const res = generateDeterministicResponse("Hypertension", "translate");
  assert.equal(res.mode, "translate");
  assert.ok(res.reply.includes("blood pressure"));
  assert.ok(res.whatImUnsureAbout?.includes("does NOT tell you"));
});

test("AI Provider: handles after-visit notes mode", () => {
  const res = generateDeterministicResponse("Doctor said drink more water and walk 20 min daily", "afterVisit");
  assert.equal(res.mode, "afterVisit");
  assert.ok(res.reply.includes("structured organization"));
  assert.ok(res.safetyNotice.includes("After-Visit Notes"));
});
