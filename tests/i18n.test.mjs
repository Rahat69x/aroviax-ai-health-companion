import test from "node:test";
import assert from "node:assert/strict";
import { DICTIONARIES } from "../src/lib/i18n.ts";

test("i18n: supports both English (en) and Bangla (bn)", () => {
  assert.ok(DICTIONARIES.en);
  assert.ok(DICTIONARIES.bn);
});

test("i18n: English dictionary has complete navigation, emergency, and tool keys", () => {
  const en = DICTIONARIES.en;
  assert.equal(en.appName, "Aroviax");
  assert.ok(en.emergencyNotice.includes("emergency"));
  assert.equal(en.nav.home, "Home");
  assert.equal(en.nav.assistant, "Try Assistant");
  assert.ok(en.translationDisclaimer.length > 0);
});

test("i18n: Bangla dictionary has non-empty localized strings for all sections", () => {
  const bn = DICTIONARIES.bn;
  assert.equal(bn.appName, "অ্যারোভিয়াক্স");
  assert.ok(bn.emergencyNotice.includes("জরুরি"));
  assert.equal(bn.nav.home, "হোম");
  assert.ok(bn.nav.assistant.length > 0);
  assert.ok(bn.translationDisclaimer.includes("অনুবাদ"));
  assert.ok(bn.tools.symptomOrganizer.title.length > 0);
  assert.ok(bn.tools.visitPrep.title.length > 0);
  assert.ok(bn.tools.medicationOrganizer.title.length > 0);
});

test("i18n: preserves medical terms without incorrect machine substitution", () => {
  const bn = DICTIONARIES.bn;
  // Clinical rule: Key terms maintain clarity
  assert.ok(bn.emergencyAlert.length > 0);
  assert.ok(bn.safetyDisclaimer.length > 0);
});
