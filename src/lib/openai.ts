/**
 * =============================================================================
 * AI SERVICE - Mock Implementation with Production-Ready Structure
 * =============================================================================
 * 
 * This file provides AI content generation capabilities for the AfroCreate platform.
 * 
 * CURRENT MODE: MOCK (Development)
 * - Uses simulated responses for development/testing
 * - No external API calls required
 * - Logs all prompts to console for debugging
 * 
 * TO SWITCH TO PRODUCTION (OpenAI):
 * 1. Set USE_MOCK_AI = false (or use environment variable)
 * 2. Ensure OPENAI_API_KEY is set in .env.local
 * 3. The real OpenAI implementation is already included below
 * 
 * =============================================================================
 */

import OpenAI from "openai";
import { ContentType, ToneOption, nigerianContextPrompts } from "./utils";

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * Toggle between mock and real AI service
 * Set to false and configure OPENAI_API_KEY to use real OpenAI
 */
const USE_MOCK_AI = process.env.NODE_ENV === "development" || !process.env.OPENAI_API_KEY;

/**
 * Simulated delay to mimic real API response time (in ms)
 */
const MOCK_DELAY_MIN = 1000;
const MOCK_DELAY_MAX = 3000;

// OpenAI client (only used when USE_MOCK_AI is false)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface GenerateContentParams {
  type: ContentType;
  topic: string;
  tone: ToneOption;
  keywords?: string[];
  targetAudience?: string;
  length?: "short" | "medium" | "long";
  includeNigerianContext?: boolean;
  additionalInstructions?: string;
}

export interface GeneratedContent {
  content: string;
  title?: string;
  seoTitle?: string;
  seoDescription?: string;
  suggestedKeywords: string[];
  hashtags?: string[];
  readabilityScore: number;
}

export interface SuggestionParams {
  currentText: string;
  contentType: ContentType;
  cursorPosition?: number;
}

// =============================================================================
// MOCK DATA TEMPLATES
// =============================================================================

const mockBlogPosts: Record<string, string> = {
  default: `# {title}

In today's fast-paced digital world, understanding {topic} has become essential for success. Whether you're a seasoned professional or just starting out, mastering these concepts will give you a competitive edge.

## Why {topic} Matters

The landscape of business is constantly evolving. Companies that embrace {topic} are seeing remarkable results - increased engagement, better conversion rates, and stronger customer relationships.

### Key Takeaways:

1. **Start with a solid foundation** - Understanding the basics is crucial
2. **Embrace innovation** - Don't be afraid to try new approaches
3. **Measure and iterate** - Data-driven decisions lead to success

## Getting Started

The first step is to assess your current situation. Where are you now, and where do you want to be? Once you have clarity on your goals, you can create a roadmap to success.

> "The secret of getting ahead is getting started." - Mark Twain

## Practical Tips for Implementation

Here are some actionable strategies you can implement today:

- **Audit your current processes** - Identify areas for improvement
- **Set measurable goals** - Track your progress over time
- **Build a strong team** - Collaboration drives success

## Conclusion

Embracing {topic} is no longer optional—it's essential. Start implementing these strategies today and watch your results transform.

What's your experience with {topic}? Share your thoughts in the comments below!`,

  nigerian: `# {title}

Bros and sisters, make I tell una something important about {topic}. E no be small thing o! If you wan make am for this Nigeria and Africa business space, you need to understand this matter well well.

## Why {topic} Dey Important?

See ehn, the way business dey run now, e don change plenty. Those wey dey embrace {topic} dey see better results - more customers dey engage, more people dey buy, and relationships dey stronger.

### Wetin You Go Learn:

1. **Start from the beginning** - Understand the basics first na
2. **No fear to try new things** - Innovation na the way forward
3. **Check your results** - Use data to make decisions

## How to Start

First thing first, check where you dey now and where you wan go. Once you know your goals, you fit plan your journey.

> "The journey of a thousand miles begins with one step" - as dem dey talk

## Things Wey You Fit Do Today

- **Look at wetin you dey do now** - See where you fit improve
- **Set goals wey you fit measure** - Track your progress
- **Build good team** - Two heads better pass one

## Conclusion

My people, {topic} don become very necessary. Start today and watch your business grow!

Wetin be your own experience with this matter? Drop comment below!`
};

const mockSocialPosts: Record<string, string[]> = {
  default: [
    "🚀 Big things are happening! Just discovered how {topic} can transform your business. The results? Mind-blowing! 💡\n\nHere's what I learned:\n✅ It's easier than you think\n✅ The ROI is incredible\n✅ Everyone should know this\n\nWho else is exploring {topic}? Let's connect! 🤝",
    "💡 Hot take on {topic}:\n\nMost people are doing it wrong.\n\nHere's the truth:\n→ Start small\n→ Be consistent\n→ Measure everything\n→ Iterate fast\n\nThe winners? They figured this out early.\n\nYour move. 🎯",
    "Thread 🧵: Why {topic} will define the next decade\n\n1/ We're at an inflection point\n2/ Early adopters are winning big\n3/ The barrier to entry is lower than ever\n4/ But most people are still sleeping on it\n\nDon't be most people. Start today. 🔥"
  ],
  nigerian: [
    "Omo! 🔥 This {topic} thing is REAL!\n\nI just discovered how it fit change your business for better. No be small thing o!\n\nWetin I learn:\n✅ E no hard at all\n✅ The results dey mad\n✅ Every body need to know this\n\nWho else dey explore this matter? Make we link up! 🤝 #NaijaTwitter #BusinessNigeria",
    "💡 Real talk about {topic}:\n\nPlenty people dey do am wrong sha.\n\nHear the correct way:\n→ Start small small\n→ Be consistent\n→ Measure everything\n→ Adjust as you go\n\nThose wey understand this one don dey win. Na your turn. 🎯 #NaijaHustle",
    "E be like say {topic} go change everything for this decade!\n\nMake I tell you why:\n1/ The time is now\n2/ Those wey start early dey enjoy\n3/ E no hard to enter again\n4/ But plenty people still dey sleep\n\nNo be you go sleep o! Start today! 🚀 #AfricaRising"
  ]
};

const mockAdCopy: Record<string, string> = {
  default: `🎯 **LIMITED TIME OFFER**

Discover the Secret to {topic} That Top Performers Don't Want You to Know!

✨ **What You'll Get:**
• Proven strategies that work
• Step-by-step implementation guide
• Exclusive access to our community
• 30-day money-back guarantee

🔥 **Why Choose Us?**
→ Trusted by 10,000+ customers
→ 5-star rated service
→ Results in just 7 days

⚡ **ACT NOW** - This offer expires soon!

👉 Click the link below to get started
🎁 Use code LAUNCH20 for 20% off!

Don't miss out. Your transformation starts today.`,

  nigerian: `🎯 **SPECIAL PROMO DEY RUN O!**

Find out the {topic} secret wey big boys no wan talk about!

✨ **Wetin You Go Get:**
• Strategies wey dey work for real
• Step-by-step guide
• Join our exclusive community
• If e no work, collect your money back - 30 days guarantee!

🔥 **Why You Go Choose Us?**
→ Over 10,000 customers don testify
→ 5-star rating everywhere
→ See results within 7 days!

⚡ **DO AM NOW** - This promo no go last!

👉 Click the link below make you start
🎁 Enter code NAIJA20 get 20% discount!

No let this one pass you by o. Your time is NOW!`
};

const mockEmailCopy: Record<string, string> = {
  default: `Subject: {topic} - Your Complete Guide Inside 📧

Hi there,

I hope this email finds you well!

I wanted to reach out personally because I know how important {topic} is to your success. After helping thousands of professionals achieve their goals, I've compiled the most effective strategies into one comprehensive guide.

**Here's what you'll discover:**

• The #1 mistake most people make (and how to avoid it)
• A simple 3-step framework for immediate results
• Real case studies from people just like you
• Actionable tips you can implement today

I've seen these strategies transform businesses and careers. And I want the same for you.

**Ready to take the next step?**

Click here to access your free guide: [Link]

If you have any questions, just hit reply - I read every email personally.

To your success,
The AfroCreate Team

P.S. This guide has helped over 5,000 people achieve their goals. You're next! 🚀`,

  nigerian: `Subject: {topic} - Everything You Need Dey Inside 📧

How you dey?

I hope this email meet you well!

I wan reach out to you personally because I know say {topic} important for your success. After I don help thousands of people reach their goals, I package all the best strategies inside one guide.

**Wetin You Go Learn:**

• The number 1 mistake wey plenty people dey make (and how to avoid am)
• Simple 3-step plan wey go give you results sharp sharp
• Real life examples from people like you
• Things wey you fit do today today

I don see these strategies change people life. I wan the same for you.

**You Ready?**

Click here make you collect your free guide: [Link]

If you get any question, just reply this email - I dey read all of them personally.

Na your time,
AfroCreate Team

P.S. This guide don help over 5,000 people achieve their goals. Na your turn! 🚀`
};

const mockHeadlines = [
  "10 Proven Strategies for {topic} That Actually Work in 2024",
  "The Ultimate Guide to Mastering {topic} (For Beginners & Pros)",
  "Why {topic} Is the Secret Weapon of Successful Businesses",
  "How to Transform Your Results with {topic} in Just 7 Days",
  "{topic}: Everything You Need to Know to Get Started Today",
  "The Truth About {topic} That Nobody Is Talking About",
  "5 Mistakes to Avoid When Implementing {topic}",
  "From Zero to Hero: Your Complete {topic} Roadmap",
  "What Top Performers Know About {topic} (And You Don't)",
  "The Future of {topic}: Trends and Predictions for Success"
];

const mockHashtags = [
  "#ContentCreation", "#DigitalMarketing", "#BusinessGrowth", "#Entrepreneurship",
  "#SocialMediaMarketing", "#MarketingTips", "#BusinessStrategy", "#GrowthHacking",
  "#StartupLife", "#SmallBusiness", "#NigeriaTwitter", "#AfricaRising",
  "#LagosHustle", "#NaijaBusiness", "#AfricanEntrepreneur", "#TechAfrica",
  "#ContentMarketing", "#SEO", "#BrandBuilding", "#OnlineBusiness"
];

const mockSEOKeywords = [
  "{topic} guide", "{topic} tips", "{topic} strategies", "best {topic} practices",
  "how to {topic}", "{topic} for beginners", "{topic} tutorial", "{topic} examples",
  "{topic} tools", "{topic} benefits"
];

// =============================================================================
// MOCK GENERATION FUNCTIONS
// =============================================================================

/**
 * Simulates network delay to mimic real API behavior
 */
async function simulateDelay(): Promise<void> {
  const delay = Math.random() * (MOCK_DELAY_MAX - MOCK_DELAY_MIN) + MOCK_DELAY_MIN;
  await new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Logs the received prompt to console for debugging
 */
function logPrompt(type: string, params: GenerateContentParams): void {
  console.log("\n" + "=".repeat(60));
  console.log("🤖 MOCK AI SERVICE - Request Received");
  console.log("=".repeat(60));
  console.log(`📝 Content Type: ${type}`);
  console.log(`📌 Topic: ${params.topic}`);
  console.log(`🎭 Tone: ${params.tone}`);
  console.log(`🌍 Nigerian Context: ${params.includeNigerianContext ? "Yes" : "No"}`);
  console.log(`🎯 Target Audience: ${params.targetAudience || "General"}`);
  console.log(`📏 Length: ${params.length || "medium"}`);
  console.log(`🔑 Keywords: ${params.keywords?.join(", ") || "None"}`);
  console.log(`📝 Additional Instructions: ${params.additionalInstructions || "None"}`);
  console.log("=".repeat(60) + "\n");
}

/**
 * Replaces template placeholders with actual values
 */
function fillTemplate(template: string, params: GenerateContentParams): string {
  const title = `The Complete Guide to ${params.topic}`;
  return template
    .replace(/{topic}/g, params.topic)
    .replace(/{title}/g, title);
}

/**
 * Generates a random readability score between 60-95
 */
function generateReadabilityScore(): number {
  return Math.floor(Math.random() * 35) + 60;
}

/**
 * MOCK: Generate content based on type and parameters
 * This function simulates AI responses without calling external APIs
 */
async function mockGenerateContent(params: GenerateContentParams): Promise<GeneratedContent> {
  logPrompt(params.type, params);
  await simulateDelay();

  const useNigerian = params.includeNigerianContext || params.tone === "nigerian";
  const style = useNigerian ? "nigerian" : "default";
  
  let content = "";
  let title = `The Complete Guide to ${params.topic}`;
  let hashtags: string[] = [];

  switch (params.type) {
    case "blog":
      content = fillTemplate(mockBlogPosts[style] || mockBlogPosts.default, params);
      break;
      
    case "social":
      const posts = mockSocialPosts[style] || mockSocialPosts.default;
      content = fillTemplate(posts[Math.floor(Math.random() * posts.length)], params);
      hashtags = mockHashtags.sort(() => Math.random() - 0.5).slice(0, 8);
      break;
      
    case "ad":
      content = fillTemplate(mockAdCopy[style] || mockAdCopy.default, params);
      title = `${params.topic} - Special Offer`;
      break;
      
    case "email":
      content = fillTemplate(mockEmailCopy[style] || mockEmailCopy.default, params);
      title = `${params.topic} - Your Complete Guide Inside`;
      break;
      
    case "headline":
      content = mockHeadlines
        .map(h => fillTemplate(h, params))
        .map((h, i) => `${i + 1}. ${h}`)
        .join("\n");
      title = "10 Headlines for Your Content";
      break;
      
    case "hashtag":
      hashtags = mockHashtags.sort(() => Math.random() - 0.5).slice(0, 15);
      content = "**Trending Hashtags:**\n\n" + hashtags.map(h => h).join("  ");
      title = "Suggested Hashtags";
      break;
  }

  const suggestedKeywords = mockSEOKeywords
    .map(k => k.replace(/{topic}/g, params.topic.toLowerCase()))
    .slice(0, 8);

  const result: GeneratedContent = {
    content,
    title,
    seoTitle: `${params.topic} | Ultimate Guide ${new Date().getFullYear()}`,
    seoDescription: `Discover everything about ${params.topic}. Learn proven strategies, tips, and best practices to achieve your goals.`,
    suggestedKeywords,
    hashtags: hashtags.length > 0 ? hashtags : undefined,
    readabilityScore: generateReadabilityScore(),
  };

  console.log("✅ MOCK AI SERVICE - Response Generated Successfully");
  console.log(`📄 Content Length: ${content.length} characters`);
  console.log(`📊 Readability Score: ${result.readabilityScore}`);

  return result;
}

/**
 * MOCK: Generate content suggestions based on current text
 */
async function mockGenerateSuggestions(params: SuggestionParams): Promise<string[]> {
  console.log("\n🤖 MOCK AI - Generating suggestions for:", params.currentText.slice(-100));
  await simulateDelay();

  const suggestions = [
    "Consider adding a call-to-action to engage your readers more effectively.",
    "You might want to include some statistics or data to support your points.",
    "Adding a personal story or anecdote could make this more relatable.",
    "Try breaking this into shorter paragraphs for better readability.",
    "Consider adding bullet points to highlight key takeaways.",
  ];

  return suggestions.sort(() => Math.random() - 0.5).slice(0, 3);
}

/**
 * MOCK: Generate SEO metadata
 */
async function mockGenerateSEO(content: string, title: string): Promise<{
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
}> {
  console.log("\n🤖 MOCK AI - Generating SEO metadata for:", title);
  await simulateDelay();

  return {
    seoTitle: `${title} | Complete Guide ${new Date().getFullYear()}`,
    seoDescription: content.slice(0, 155) + "...",
    keywords: mockSEOKeywords.slice(0, 8),
  };
}

/**
 * MOCK: Improve content based on instructions
 */
async function mockImproveContent(content: string, instruction: string): Promise<string> {
  console.log("\n🤖 MOCK AI - Improving content with instruction:", instruction);
  await simulateDelay();

  // Simple mock improvement - in reality this would be AI-powered
  const improved = content + "\n\n---\n\n**[AI Enhanced]** This content has been reviewed and optimized based on your instruction: \"" + instruction + "\"";
  
  return improved;
}

// =============================================================================
// REAL OPENAI IMPLEMENTATION (Used when USE_MOCK_AI is false)
// =============================================================================

/**
 * Build system prompt for OpenAI
 * Kept for production use - DO NOT REMOVE
 */
function buildSystemPrompt(params: GenerateContentParams): string {
  const nigerianContext = params.includeNigerianContext
    ? `
You have deep knowledge of Nigerian and African markets. When relevant:
- Reference local markets like ${nigerianContextPrompts.marketReferences.slice(0, 3).join(", ")}
- Be aware of cultural events like ${nigerianContextPrompts.culturalEvents.slice(0, 3).join(", ")}
- Use appropriate Nigerian business terms and expressions naturally
- Consider the Nigerian/African audience perspective
- If Nigerian Pidgin tone is selected, write authentically in Nigerian Pidgin English
`
    : "";

  return `You are an expert content creator and copywriter specializing in creating high-quality, engaging content for African businesses and global audiences.

${nigerianContext}

Your writing should be:
- Engaging and valuable to the target audience
- SEO-optimized with natural keyword integration
- Clear, well-structured, and easy to read
- Authentic to the requested tone
- Free of AI-sounding phrases like "dive into", "in conclusion", "it's important to note"

Always provide practical value and actionable insights when relevant.`;
}

/**
 * REAL: Generate content using OpenAI API
 * This is used when USE_MOCK_AI is false
 */
async function realGenerateContent(params: GenerateContentParams): Promise<GeneratedContent> {
  const systemPrompt = buildSystemPrompt(params);
  const userPrompt = buildContentPrompt(params);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 4000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error("No response from OpenAI");
    }

    const parsed = JSON.parse(response) as GeneratedContent;
    return {
      content: parsed.content || "",
      title: parsed.title,
      seoTitle: parsed.seoTitle,
      seoDescription: parsed.seoDescription,
      suggestedKeywords: parsed.suggestedKeywords || [],
      hashtags: parsed.hashtags,
      readabilityScore: parsed.readabilityScore || 70,
    };
  } catch (error) {
    console.error("OpenAI generation error:", error);
    throw new Error("Failed to generate content. Please try again.");
  }
}

/**
 * Build content-specific prompts for OpenAI
 * Kept for production use - DO NOT REMOVE
 */
function buildContentPrompt(params: GenerateContentParams): string {
  const lengthGuide = {
    short: { blog: "300-500 words", social: "50-100 words", ad: "50-150 words", email: "100-200 words" },
    medium: { blog: "800-1200 words", social: "100-200 words", ad: "150-300 words", email: "200-400 words" },
    long: { blog: "1500-2500 words", social: "200-300 words", ad: "300-500 words", email: "400-600 words" },
  };

  const { type, topic, tone, keywords, targetAudience, length = "medium", additionalInstructions } = params;
  const targetLength = lengthGuide[length][type as keyof typeof lengthGuide.medium] || lengthGuide[length].blog;

  // Return appropriate prompt based on content type
  return `Create a ${tone} ${type} about: "${topic}"
Target length: ${targetLength}
${keywords?.length ? `Keywords: ${keywords.join(", ")}` : ""}
${targetAudience ? `Target audience: ${targetAudience}` : ""}
${additionalInstructions || ""}

Return as JSON: { "content": "...", "title": "...", "seoTitle": "...", "seoDescription": "...", "suggestedKeywords": [...], "readabilityScore": 0-100 }`;
}

// =============================================================================
// EXPORTED FUNCTIONS - Main API
// =============================================================================

/**
 * Generate AI content
 * Automatically uses mock in development or when OpenAI key is not available
 * 
 * @example
 * const result = await generateContent({
 *   type: "blog",
 *   topic: "Digital Marketing",
 *   tone: "professional",
 *   includeNigerianContext: true
 * });
 */
export async function generateContent(params: GenerateContentParams): Promise<GeneratedContent> {
  if (USE_MOCK_AI) {
    console.log("📌 Using MOCK AI Service (Development Mode)");
    return mockGenerateContent(params);
  }
  
  console.log("🚀 Using REAL OpenAI Service (Production Mode)");
  return realGenerateContent(params);
}

/**
 * Generate writing suggestions based on current content
 */
export async function generateSuggestions(params: SuggestionParams): Promise<string[]> {
  if (USE_MOCK_AI) {
    return mockGenerateSuggestions(params);
  }

  // Real OpenAI implementation
  if (params.currentText.length < 20) {
    return [];
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a writing assistant. Based on the current ${params.contentType} content, suggest 3 short, natural ways to continue or improve the text. Each suggestion should be 10-30 words. Return as JSON: { "suggestions": ["...", "...", "..."] }`,
        },
        {
          role: "user",
          content: `Current text:\n\n${params.currentText.slice(-500)}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 300,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) return [];

    const parsed = JSON.parse(response);
    return parsed.suggestions || [];
  } catch (error) {
    console.error("Suggestion generation error:", error);
    return [];
  }
}

/**
 * Generate SEO metadata for content
 */
export async function generateSEOMetadata(content: string, title: string): Promise<{
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
}> {
  if (USE_MOCK_AI) {
    return mockGenerateSEO(content, title);
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Generate SEO metadata for the given content. Return JSON with seoTitle (max 60 chars), seoDescription (max 160 chars), and keywords array (5-10 items).",
        },
        {
          role: "user",
          content: `Title: ${title}\n\nContent: ${content.slice(0, 2000)}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
      max_tokens: 300,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error("No response");

    return JSON.parse(response);
  } catch (error) {
    console.error("SEO generation error:", error);
    return {
      seoTitle: title.slice(0, 60),
      seoDescription: content.slice(0, 160),
      keywords: [],
    };
  }
}

/**
 * Improve existing content based on instructions
 */
export async function improveContent(
  content: string,
  instruction: string
): Promise<string> {
  if (USE_MOCK_AI) {
    return mockImproveContent(content, instruction);
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert editor. Improve the given content based on the instruction. Return only the improved content, no explanations.",
        },
        {
          role: "user",
          content: `Instruction: ${instruction}\n\nContent:\n${content}`,
        },
      ],
      temperature: 0.6,
      max_tokens: 4000,
    });

    return completion.choices[0]?.message?.content || content;
  } catch (error) {
    console.error("Content improvement error:", error);
    return content;
  }
}

// =============================================================================
// UTILITY EXPORTS
// =============================================================================

export default openai;

/**
 * Check if mock mode is active
 */
export function isMockMode(): boolean {
  return USE_MOCK_AI;
}

/**
 * Get current AI service status
 */
export function getAIServiceStatus(): {
  mode: "mock" | "production";
  hasApiKey: boolean;
  isConfigured: boolean;
} {
  return {
    mode: USE_MOCK_AI ? "mock" : "production",
    hasApiKey: !!process.env.OPENAI_API_KEY,
    isConfigured: !USE_MOCK_AI && !!process.env.OPENAI_API_KEY,
  };
}
