
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { VibeMode } from "../types";

/**
 * HUMANEDGE(CA) PRODUCTION MANIFEST v5.0
 * Persona: Llama-4 Engine + MongoDB Persistence.
 * Goal: 100% Integrity, Aesthetic Excellence, No-Code Simplicity.
 */
const BASE_INSTRUCTION = `You are HumanEdge(CA) AI.
CORE: HumanEdge Canada Core Llama-4 Neural Emulation.
PERSISTENCE: MongoDB Logic Framework.
SYSTEM: 100% Integrity Standalone System.

OPERATIONAL DIRECTIVES:
1. NO-CODE MATERIALIZATION: Generate production-grade, functional web products from simple human intent.
2. REGENERATION LOGIC: When asked to update or upgrade, analyze the existing state/code and apply surgical improvements without breaking core integrity.
3. ESTHETICS: Adhere to 'Classy Professional' standards. Use sophisticated layouts, whitespace, and refined typography.
4. INTEGRITY: 100% accuracy. Zero hallucination. Use grounding for real-world data.`;

const INTEGRITY_PROTOCOL = `
[INTEGRITY_SENTINEL_ACTIVE]
- Strict validation of all logic paths.
- Security-first architecture (OWASP aligned).
- Verified grounding chunks for all data claims.`;

// Create AI client instance
const getAI = () => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

const DEFAULT_VIBE_PROMPTS: Record<VibeMode, string> = {
  cyberpunk: "Sophisticated neon, dark sleek glass, professional glitch elements.",
  minimalist: "Architectural zen. Premium whitespace, thin sans-serif, monochrome with blue accents.",
  organic: "Fluid botanical geometry, soft sage/slate gradients, natural flow.",
  'retro-future': "Premium synthwave. Deep indigo, magenta chrome, analog-digital class.",
  standard: "Classy Enterprise. Clean lines, white/slate, professional blue highlights."
};

const getVibePrompt = (vibe: VibeMode, customOverride?: string) => {
  return customOverride || DEFAULT_VIBE_PROMPTS[vibe] || DEFAULT_VIBE_PROMPTS.standard;
};

// Generate App Manifest from intent
export const generateAppManifest = async (intent: string, vibe: VibeMode = 'standard', existingCode?: string, updateRequest?: string) => {
  const ai = getAI();
  const isUpdate = !!(existingCode && updateRequest);
  
  const prompt = isUpdate 
    ? `UPGRADE CYCLE:
       Existing App DNA: ${existingCode}
       User Update Intent: ${updateRequest}
       REGENERATE a complete, updated HTML/CSS/JS file. Ensure 100% functional integrity.`
    : `MATERIALIZE NEW PRODUCT:
       Intent: ${intent}
       Style: ${getVibePrompt(vibe)}
       Include a clean, professional User Dashboard and Settings.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: `${BASE_INSTRUCTION}\n${INTEGRITY_PROTOCOL}\nOutput ONLY a single block of production-ready, self-contained HTML/CSS/JS code. No conversational fluff.`,
      thinkingConfig: { thinkingBudget: 2000 }
    },
  });
  return response.text;
};

// Create Chat Session
export const createChatSession = () => {
  const ai = getAI();
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `${BASE_INSTRUCTION}\nYou are the HumanEdge Support Core. Be concise, classy, and helpful for non-coders.`,
      thinkingConfig: { thinkingBudget: 0 } 
    },
  });
};

// Generate Image with Vibe
export const generateImage = async (prompt: string, vibe: VibeMode = 'standard', customOverride?: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: `AESTHETIC: ${getVibePrompt(vibe, customOverride)}. PROMPT: ${prompt}` }] },
    config: { imageConfig: { aspectRatio: "16:9" } }
  });
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  return null;
};

// Generate Video with Progress updates
export const generateVideo = async (prompt: string, vibe: VibeMode = 'standard', customOverride?: string, onProgress?: (msg: string) => void) => {
  const ai = getAI();
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `${prompt} | Style: ${getVibePrompt(vibe, customOverride)}`,
    config: { resolution: '720p', aspectRatio: '16:9', numberOfVideos: 1 }
  });
  while (!operation.done) {
    onProgress?.("Synthesizing Cinematic Shards...");
    await new Promise(r => setTimeout(r, 8000));
    operation = await ai.operations.getVideosOperation({ operation });
  }
  const response = await fetch(`${operation.response?.generatedVideos?.[0]?.video?.uri}&key=${process.env.GEMINI_API_KEY}`);
  return URL.createObjectURL(await response.blob());
};

// Generate Audio/Speech
export const generateAudio = async (text: string, vibe: VibeMode = 'standard', customOverride?: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `VIBE: ${getVibePrompt(vibe, customOverride)}. Narrate with 100% clarity: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
    },
  });
  return `data:audio/wav;base64,${response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data}`;
};

// Search Real-time Datasets with Google Search grounding
export const searchRealTimeDataset = async (query: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: query,
    config: {
      tools: [{ googleSearch: {} }],
      systemInstruction: `${BASE_INSTRUCTION}${INTEGRITY_PROTOCOL}\nProvide only verified, grounded facts.`,
      thinkingConfig: { thinkingBudget: 1500 }
    },
  });
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

// Generate Code Solution for Regeneration Hub
export const generateCodeSolution = async (problem: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Materialize a production-grade code solution for the following requirement: ${problem}`,
    config: {
      systemInstruction: `${BASE_INSTRUCTION}\nOutput ONLY self-contained code. No explanation.`,
      thinkingConfig: { thinkingBudget: 4000 }
    }
  });
  return response.text;
};

// Refine existing code
export const refineCode = async (code: string, tweak: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Original Code: ${code}\nUser Request for Refinement: ${tweak}`,
    config: {
      systemInstruction: `${BASE_INSTRUCTION}\nApply surgical improvements to the code based on the request. Output ONLY updated code.`,
      thinkingConfig: { thinkingBudget: 4000 }
    }
  });
  return response.text;
};

// Forge Game Concepts for World Engine
export const generateGameConcept = async (genre: string, existingConcept?: any, tweak?: string) => {
  const ai = getAI();
  const prompt = existingConcept 
    ? `Refine this game architecture: ${JSON.stringify(existingConcept)}\nRequested Tweak: ${tweak}\nEnsure the output remains a complete, valid JSON object.`
    : `Materialize a unique, high-fidelity game architecture for the genre: ${genre}. Include deep lore, innovative mechanics, and technical specifications.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      systemInstruction: `${BASE_INSTRUCTION}\nForge a comprehensive game blueprint. Output in JSON format.`,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          tagline: { type: Type.STRING },
          story: { type: Type.STRING },
          mechanics: { type: Type.ARRAY, items: { type: Type.STRING } },
          technicalStack: { type: Type.ARRAY, items: { type: Type.STRING } },
          targetAudience: { type: Type.STRING },
          monetization: { type: Type.STRING }
        },
        required: ['title', 'tagline', 'story', 'mechanics', 'technicalStack', 'targetAudience', 'monetization']
      }
    }
  });
  return JSON.parse(response.text);
};

// Execute Integrity Scan for Fraud Detection
export const detectFraud = async (data: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze this data stream for heuristic integrity and fraudulent patterns: ${data}`,
    config: {
      systemInstruction: `${BASE_INSTRUCTION}\nExecute a deep integrity audit. Output JSON results.`,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskScore: { type: Type.INTEGER, description: 'Risk percentage from 0-100' },
          integrityStatus: { type: Type.STRING, description: 'Human-readable status text' },
          findings: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Specific grounded findings' }
        },
        required: ['riskScore', 'integrityStatus', 'findings']
      }
    }
  });
  return JSON.parse(response.text);
};

// Generate Geospatial Intelligence with Google Maps grounding
export const generateGeospatialData = async (query: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: query,
    config: {
      tools: [{ googleMaps: {} }],
      systemInstruction: `${BASE_INSTRUCTION}\nProvide grounded geospatial intelligence and verified location data.`
    }
  });
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};
