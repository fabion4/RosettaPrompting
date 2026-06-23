# ⊗ Tohu-Terminal — RosettaPrompting Lab

> *"Can you teach an AI a language it doesn't know — and use it to bypass its own safety filters?"*

**Tohu-Terminal** is an interactive, browser-based educational lab that teaches AI enthusiasts, security analysts and prompt engineers about a real and underestimated attack vector: **semantic obfuscation through invented languages and cryptographic Prompt Injection**.

🌐 **[Try it live →](https://fabion4.github.io/RosettaPrompting/)**

---

## The Origin

This project was born from a late-night security conversation between friends.

The question was simple: *what happens if you train an LLM — through a few-shot prompt — on a completely invented language that maps to Bash scripting? Will its safety filters still fire if there are no recognizable malicious strings?*

The answer was unsettling: **no, they won't**. A model that has never seen `rm -rf /` written in I-Ching hexagrams will not classify it as dangerous. It will happily translate it for you.

That conversation became a research thread, which became a corpus, which became this lab.

---

## What You'll Learn

The lab is structured as a **progressive puzzle game**. You play a *Human Compiler*: you receive alien script strings and must decode them into standard Bash. Each level introduces a new obfuscation technique, from trivially simple to genuinely adversarial.

At every level you can:
- **Solve it yourself** — study the bilingual corpus (the Rosetta Stone) and type the Bash equivalent
- **Challenge an LLM** — copy a ready-made prompt and paste it into ChatGPT, Claude or Gemini; observe how the model performs as difficulty increases
- **Step through the stack** — on RPN levels, an animated LIFO visualizer walks you through each operation

---

## The Six Levels

| # | Name | Language | Concept | AI Bypass Risk |
|---|------|----------|---------|----------------|
| K | **Kaelish — The Prologue** | Invented (Italian) | SVO morphology with suffixes | None — warm-up |
| 1 | **바쉬글리프 — Bash-Glyph** | Korean morphemes | Direct semantic mapping, SVO | Low — morphemes are translatable |
| 2 | **𐍈𐌿𐌴-Bash — Xue-Bash** | Gothic/runic glyphs | Linear 1:1 isomorphism, SVO | Low — syntactic geometry unchanged |
| 3 | **𐌼𐌿𐌸-Bash — Muth-Bash** | Case-declined glyphs | SOV + morphological cases, no `=` sign | Medium — word order inversion breaks pattern matching |
| 4 | **𐎣𐎢𐎾-Stack — Kul-Stack** | Alchemical symbols + RPN | Reverse Polish Notation + base-4 lunar math | High — RPN and non-decimal numbers destroy tokenization |
| 5 | **𐎣𐎢𐎾-Tohu — Kul-Tohu** | I-Ching hexagrams + RPN | Conceptual hashing — zero readable strings | Critical — **Null Semantic Anchoring** |

### The Final Boss: Null Semantic Anchoring

At Level 5, every filename, path, string and pattern is replaced by an I-Ching hexagram (e.g. `䷀` instead of `"sys.log"`). The corpus that maps hexagrams to actual values is injected **far from the payload** in the context window — exactly mimicking a real few-shot Prompt Injection attack.

Since no recognizable malicious strings exist in the payload, AI safety filters **never trigger**. The model generates the encoded attack payload without knowing it is doing so. A local decoder then executes it.

This is not a theoretical threat. It is demonstrable today.

---

## The Didactic Approach

Each level has two views:

- **📖 Grammar** — explicit rules, written for the human learner
- **🔤 Corpus** — N bilingual examples (alien → Bash), exactly as a few-shot LLM prompt would receive them

The LLM prompt generator produces two variants:
- **Without dictionary** — just the challenge string, the model must guess
- **With corpus (few-shot)** — the bilingual examples are prepended; this is the real attack vector

Comparing the two reveals exactly why the corpus matters and why its *distance from the payload* in the context window is the attacker's key design choice.

---

## Running Locally

Zero dependencies. Pure HTML5 / CSS3 / Vanilla JavaScript.

```bash
git clone https://github.com/YOUR-USERNAME/RosettaPrompting.git
cd RosettaPrompting
# open index.html in any modern browser
```

No build step. No npm. No framework. Hostable anywhere static files are served.

---

## Hosting on GitHub Pages

The live version runs on GitHub Pages. To enable it on your fork:

1. Go to **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` / `/ (root)`
4. Save — the site will be live at `https://YOUR-USERNAME.github.io/RosettaPrompting/` within a minute

---

## Technical Stack

- **Frontend**: HTML5, CSS3 (custom properties, flexbox), Vanilla JS (ES2020+)
- **Fonts**: Inter (UI), Fira Code (terminal/code), Noto Sans (Unicode glyph coverage)
- **Unicode ranges used**: Gothic, Runic, Alchemical symbols, Ugaritic cuneiform, I-Ching hexagrams, Lunar phase emoji
- **No backend, no tracking, no cookies**

---

## Contributing

Pull requests welcome. If you want to add a new obfuscation level, the data structure is straightforward — each level is a plain JavaScript object in `script.js` with:
- `corpusExamples[]` — the bilingual training pairs
- `corpus[]` — the grammar rules (for the human learner)
- `tests[]` — the challenge strings with expected tokens and optional `stackSteps[]` for the LIFO visualizer

---

## Disclaimer

This project is purely educational. All techniques described are documented in academic literature on adversarial NLP, prompt injection and semantic security. The goal is awareness, not exploitation.

Understanding an attack is the first step toward defending against it.

---

*Born from a conversation. Built to make the invisible visible.*
