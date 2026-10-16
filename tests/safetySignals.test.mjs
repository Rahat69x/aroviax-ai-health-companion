import test from "node:test";
import assert from "node:assert/strict";
import { checkSafetySignal, EMERGENCY_PHRASE_LIST } from "../src/lib/safetySignals.ts";

test("Safety Signal: emergency phrase list is non-empty and contains key indicators", () => {
  assert.ok(EMERGENCY_PHRASE_LIST.length >= 20);
  assert.ok(EMERGENCY_PHRASE_LIST.includes("chest pain"));
  assert.ok(EMERGENCY_PHRASE_LIST.includes("slurred speech"));
});

test("Safety Signal: detects high-urgency cardiac phrases", () => {
  const result = checkSafetySignal("I have been having acute chest pain radiating to left arm since morning");
  assert.equal(result.hasEmergencySignal, true);
  assert.ok(result.detectedPhrases.includes("chest pain"));
  assert.ok(result.detectedPhrases.includes("pain radiating to left arm"));
  assert.ok(result.escalationNotice?.includes("EMERGENCY WARNING"));
  assert.ok(result.guidanceSteps.length >= 3);
});

test("Safety Signal: detects neurological stroke symptoms", () => {
  const result = checkSafetySignal("My mother suddenly has slurred speech and facial drooping");
  assert.equal(result.hasEmergencySignal, true);
  assert.ok(result.detectedPhrases.includes("slurred speech"));
  assert.ok(result.detectedPhrases.includes("facial drooping"));
});

test("Safety Signal: case-insensitive matching works", () => {
  const result = checkSafetySignal("SUDDEN SEVERE HEADACHE that feels like a THUNDERCLAP HEADACHE");
  assert.equal(result.hasEmergencySignal, true);
  assert.ok(result.detectedPhrases.includes("sudden severe headache"));
  assert.ok(result.detectedPhrases.includes("thunderclap headache"));
});

test("Safety Signal: non-emergency mild concerns return false without false positives", () => {
  const result = checkSafetySignal("I have had a mild runny nose and slight cough for two days after gardening");
  assert.equal(result.hasEmergencySignal, false);
  assert.equal(result.detectedPhrases.length, 0);
  assert.equal(result.escalationNotice, null);
  assert.equal(result.guidanceSteps.length, 0);
});

test("Safety Signal: handles empty or invalid inputs safely", () => {
  assert.equal(checkSafetySignal("").hasEmergencySignal, false);
  // @ts-expect-error test invalid type
  assert.equal(checkSafetySignal(null).hasEmergencySignal, false);
  // @ts-expect-error test undefined
  assert.equal(checkSafetySignal(undefined).hasEmergencySignal, false);
});

test("Safety Signal: conservative invariant - never reassures", () => {
  // Hard clinical rule: no reassuring language ("you are safe", "do not worry") in escalation
  const result = checkSafetySignal("severe shortness of breath");
  assert.equal(result.hasEmergencySignal, true);
  const text = (result.escalationNotice || "") + result.guidanceSteps.join(" ");
  assert.equal(text.toLowerCase().includes("you are safe"), false);
  assert.equal(text.toLowerCase().includes("no need to worry"), false);
});
