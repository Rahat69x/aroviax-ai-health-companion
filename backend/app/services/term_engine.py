"""
Aroviax — Medical Term Explanation Engine

Provides plain-language translations, analogies, clinical reasoning,
and questions to ask doctors for clinical terminology in English and Bangla.
"""

from __future__ import annotations

MEDICAL_GLOSSARY: dict[str, dict[str, dict[str, str | list[str]]]] = {
    "hypertension": {
        "en": {
            "term": "Hypertension",
            "simple_explanation": "Consistently high blood pressure exerting excess force against your artery walls.",
            "everyday_analogy": "Like garden hose water turned on with excessive pressure, wearing down the hose interior over time.",
            "why_doctors_use_it": "It describes a measurable clinical state where blood vessels experience chronic strain.",
            "questions_to_ask_clinician": [
                "What is my target blood pressure number?",
                "What dietary or lifestyle adjustments are most effective for my numbers?",
                "How often should I log blood pressure readings at home?",
            ],
        },
        "bn": {
            "term": "উচ্চ রক্তচাপ (Hypertension)",
            "simple_explanation": "উচ্চ রক্তচাপ হলো রক্তনালীর দেয়ালের ওপর রক্তের অতিরিক্ত চাপ ক্রমাগত বজায় থাকা।",
            "everyday_analogy": "পানির পাইপের ভেতর অতিরিক্ত পানির চাপের মতো, যা সময়ের সাথে সাথে পাইপকে ক্ষতিগ্রস্ত করতে পারে।",
            "why_doctors_use_it": "এটি একটি নির্দিষ্ট পরিমাপযোগ্য ক্লিনিকাল অবস্থা বোঝাতে ব্যবহৃত হয়।",
            "questions_to_ask_clinician": [
                "আমার রক্তচাপের স্বাভাবিক লক্ষ্যমাত্রা কত হওয়া উচিত?",
                "খাবার ও জীবনযাত্রায় কী কী পরিবর্তন আনা দরকার?",
                "বাসায় কতদিন পর পর রক্তচাপ মাপা উচিত?",
            ],
        },
    },
    "edema": {
        "en": {
            "term": "Edema",
            "simple_explanation": "Swelling caused by excess fluid trapped in your body's tissues, commonly in legs, ankles, or feet.",
            "everyday_analogy": "Like a sponge that has absorbed too much water and holds onto it in gravity-dependent areas.",
            "why_doctors_use_it": "It pinpoints extracellular fluid retention rather than muscle swelling or fat tissue.",
            "questions_to_ask_clinician": [
                "Could this fluid retention be related to my heart, kidneys, or medications?",
                "Would elevating my legs or compression wear be appropriate for me?",
                "What symptoms should prompt an urgent call to the clinic?",
            ],
        },
        "bn": {
            "term": "শোথ বা ফোলা (Edema)",
            "simple_explanation": "শরীরের টিস্যুতে অতিরিক্ত তরল জমা হয়ে ফুলে যাওয়া, সাধারণত পা বা গোড়ালিতে বেশি দেখা যায়।",
            "everyday_analogy": "অতিরিক্ত পানি শুষে রাখা ভেজা স্পঞ্জের মতো।",
            "why_doctors_use_it": "এটি তরল জমার সঠিক ক্লিনিকাল পরিভাষা।",
            "questions_to_ask_clinician": [
                "এই ফোলা ভাব কি আমার হৃদপিণ্ড, কিডনি বা কোনো ওষুধের কারণে হতে পারে?",
                "পা উঁচুতে রাখা বা কোনো বিশেষ মোজা পরা কি নিরাপদ?",
            ],
        },
    },
    "dyspnea": {
        "en": {
            "term": "Dyspnea",
            "simple_explanation": "Shortness of breath or an uncomfortable awareness that breathing is difficult.",
            "everyday_analogy": "Trying to inhale deeply through a narrow straw after climbing a steep staircase.",
            "why_doctors_use_it": "It captures the subjective sensation of respiratory discomfort across pulmonary and cardiac causes.",
            "questions_to_ask_clinician": [
                "Does my shortness of breath occur primarily with exertion or while resting/lying flat?",
                "Are lung function tests or an echocardiogram indicated?",
                "What warning signs require immediate emergency care?",
            ],
        },
        "bn": {
            "term": "শ্বাসকষ্ট (Dyspnea)",
            "simple_explanation": "শ্বাস নিতে কষ্ট হওয়া বা পর্যাপ্ত বাতাস না পাওয়ার অস্বস্তিকর অনুভূতি।",
            "everyday_analogy": "সরু স্ট্র দিয়ে জোরে শ্বাস টানার চেষ্টার মতো।",
            "why_doctors_use_it": "শ্বাসপ্রশ্বাসের জটিলতা স্পষ্টভাবে লিপিবদ্ধ করতে চিকিৎসকরা এটি ব্যবহার করেন।",
            "questions_to_ask_clinician": [
                "বিশ্রামের সময় নাকি কাজ করার সময় শ্বাসকষ্ট বাড়ে?",
                "জরুরি চিকিৎসার লক্ষণগুলো কী কী?",
            ],
        },
    },
    "tachycardia": {
        "en": {
            "term": "Tachycardia",
            "simple_explanation": "A resting heart rate faster than normal (typically over 100 beats per minute for adults).",
            "everyday_analogy": "A car engine idling at high RPMs even when the car is parked.",
            "why_doctors_use_it": "It categorizes cardiac rhythm speed to guide diagnostic evaluation of rhythm versus physiological response.",
            "questions_to_ask_clinician": [
                "Is this rapid rate episodic or persistent?",
                "Could dehydration, caffeine, stress, or thyroid hormones be contributing?",
                "Should we obtain an electrocardiogram (ECG/EKG)?",
            ],
        },
        "bn": {
            "term": "দ্রুত হৃদস্পন্দন (Tachycardia)",
            "simple_explanation": "বিশ্রামরত অবস্থায় স্বাভাবিকের চেয়ে দ্রুত হৃদস্পন্দন (সাধারণত প্রতি মিনিটে ১০০-এর বেশি)।",
            "everyday_analogy": "গাড়ি থামানো থাকলেও ইঞ্জিনের দ্রুত চলার মতো।",
            "why_doctors_use_it": "হৃদস্পন্দনের গতি সঠিক ক্লিনিকাল পরিভাষায় প্রকাশ করতে এটি ব্যবহৃত হয়।",
            "questions_to_ask_clinician": [
                "আমার একটি ইসিজি (ECG) করা কি প্রয়োজন?",
                "ক্যাফেইন বা উদ্বেগের কারণে এটি হচ্ছে কিনা?",
            ],
        },
    },
    "neuropathy": {
        "en": {
            "term": "Neuropathy",
            "simple_explanation": "Nerve damage or irritation causing tingling, numbness, burning pain, or weakness, usually in hands or feet.",
            "everyday_analogy": "A phone charging cable whose internal wires are frayed, causing intermittent or glitchy signals.",
            "why_doctors_use_it": "It identifies pathology of peripheral nerves to differentiate from vascular or musculoskeletal issues.",
            "questions_to_ask_clinician": [
                "What is the underlying cause (e.g. blood sugar, vitamin deficiency, nerve entrapment)?",
                "What strategies protect my feet and prevent injuries if sensation is reduced?",
                "Are there medications to help manage nerve pain symptoms?",
            ],
        },
        "bn": {
            "term": "স্নায়বিক দুর্বলতা বা ক্ষত (Neuropathy)",
            "simple_explanation": "হাত বা পায়ে স্নায়ুর ক্ষতির কারণে ঝিঁঝিঁ ধরা, অবশ লাগা বা জ্বালাপোড়া অনুভূতি।",
            "everyday_analogy": "ভেতরে তার ছিঁড়ে যাওয়া চার্জারের মতো, যা সঠিক সংকেত পৌঁছাতে পারে না।",
            "why_doctors_use_it": "পেরিফেরাল স্নায়ুর সমস্যা আলাদাভাবে চিহ্নিত করতে চিকিৎসকরা এটি ব্যবহার করেন।",
            "questions_to_ask_clinician": [
                "এর পেছনের মূল কারণ কী (ডায়াবেটিস, ভিটামিনের অভাব, ইত্যাদি)?",
                "পায়ের যত্ন ও সুরক্ষা কীভাবে নিশ্চিত করব?",
            ],
        },
    },
}


def explain_medical_term(raw_query: str, locale: str = "en") -> dict[str, str | list[str]]:
    """
    Looks up a medical term or returns structured educational guidance.
    """
    clean = raw_query.strip().lower()
    selected_locale = "bn" if locale == "bn" else "en"

    # Exact or substring match in glossary
    for key, data in MEDICAL_GLOSSARY.items():
        if key in clean or clean in key:
            entry = data.get(selected_locale, data["en"])
            return {
                "term": str(entry["term"]),
                "simple_explanation": str(entry["simple_explanation"]),
                "everyday_analogy": str(entry["everyday_analogy"]),
                "why_doctors_use_it": str(entry["why_doctors_use_it"]),
                "questions_to_ask_clinician": list(entry["questions_to_ask_clinician"]),
                "locale": selected_locale,
            }

    # Generic structured explanation for terms not in pre-indexed dictionary
    if selected_locale == "bn":
        return {
            "term": raw_query.strip(),
            "simple_explanation": f"'{raw_query.strip()}' একটি ক্লিনিকাল পরিভাষা। চিকিৎসকরা রোগীর অবস্থা স্পষ্টভাবে বর্ণনার জন্য সুনির্দিষ্ট পরিভাষা ব্যবহার করেন।",
            "everyday_analogy": "বিশেষজ্ঞ প্রকৌশলীদের নিজস্ব প্রযুক্তির নামের মতো, যা নির্ভুল অর্থ প্রকাশ করে।",
            "why_doctors_use_it": "মেডিকেল নথিপত্রে স্বচ্ছতা ও সঠিক তথ্য বজায় রাখতে।",
            "questions_to_ask_clinician": [
                f"ডাক্তার সাহেব, '{raw_query.strip()}' কথাটির সহজ অর্থ আমার ক্ষেত্রে কী?",
                "এই রিপোর্টের ফলাফল আমার সামগ্রিক চিকিৎসায় কী প্রভাব ফেলে?",
                "আমার কি এই বিষয়ে পরবর্তী কোনো পরীক্ষা বা চিকিৎসা প্রয়োজন?",
            ],
            "locale": "bn",
        }

    return {
        "term": raw_query.strip(),
        "simple_explanation": f"'{raw_query.strip()}' is a clinical medical term used by healthcare professionals for precise documentation.",
        "everyday_analogy": "Like specialized architectural blueprints that use exact technical words to avoid misunderstandings.",
        "why_doctors_use_it": "Clinical terms provide standardized definitions across doctors, laboratories, and health systems.",
        "questions_to_ask_clinician": [
            f"What does '{raw_query.strip()}' mean specifically in the context of my visit or lab report?",
            "Is this an expected finding or something requiring treatment/follow-up?",
            "Are there symptoms related to this that I should monitor at home?",
        ],
        "locale": "en",
    }
