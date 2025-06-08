"server only";

import { Postcard, PostcardResponse } from "@/types/postcard";
import axios, { isAxiosError } from "axios";

/**
 * Generates a valid HTML email body reply using AI
 * @param apiKey - AI provider API key
 * @param postcard - The main postcard document
 * @param responses - Array of related responses
 * @returns HTML string for use in email body
 */
export async function generatePostcardReplyHtml(
  postcard: Postcard,
  responses: PostcardResponse[]
): Promise<string> {
  const basePrompt = `
You're a creative assistant tasked with writing a visually engaging HTML email reply in the style of a poster or banner. You will be given a message (the "postcard") and several follow-up replies to it.

Your job is to analyze the content and generate a single block of **valid HTML only**. The output should look more like a designed poster or announcement — not a regular email message. Do not write it like a letter or conversation. Instead, emphasize layout, typography, and design.

✅ Requirements:
- The length of the HTML must not exceed 4,750 characters (including tags and content)
- Make it bold, clear, and expressive — like a celebration banner, tribute wall, decision board, or summary card.
- Use layout sections (e.g. header, body, highlights, footer) to structure content visually.
- Use background colors, large fonts, icons or emojis, and section dividers.
- All styles must be inline (no external CSS).
- Stick to email-safe HTML and styles (tables, divs, spans, inline styles).

🎨 Style Guide (based on metadata):
- Type: ${postcard.type}
- Mood: ${postcard.mood}
- Theme Color: ${postcard.themeColor}
- Format Style: ${postcard.formatStyle}
- Sender Voice: ${postcard.senderVoice}
- Notes: ${postcard.notes ?? "None"}
- Original Email Body: ${postcard.emailBody}

📨 Here are the replies (summarized for you to analyze):
${responses
  .map(
    (r, i) => `Reply ${i + 1}:
From: ${r.fromName} <${r.fromEmail}>
Subject: ${r.emailSubject}
Body:
${r.emailBody}
`
  )
  .join("\n")}

🧠 Based on the type:
- If "DECISION": Determine what decision was reached based on the replies. Highlight consensus and reasoning. End with a bold, clear final verdict.
- If "TRIBUTE": Create a heartfelt tribute using the replies’ sentiments. Include a couple of light or fun “fun facts” if found.
- If "RECAP": Summarize the conversation with highlights, takeaways, emotional/funny moments, and what’s next.

🛑 Output Rules:
- Return only valid, complete HTML.
- No markdown.
- No backticks.
- No comments.
`.trim();

  try {
    const response = await axios.post(
      "https://api.perplexity.ai/chat/completions", // Or OpenAI-compatible endpoint
      {
        model: "sonar-pro",
        max_tokens: 1500,
        messages: [
          {
            role: "system",
            content:
              "You are an email copywriter. Return valid HTML and nothing else.",
          },
          {
            role: "user",
            content: basePrompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PERPLEXITY_API_TOKEN!}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    const html = response.data.choices?.[0]?.message?.content;
    if (!html || !html.trim().startsWith("<")) {
      throw new Error("AI did not return valid HTML.");
    }

    return html.trim();
  } catch (error) {
    if (isAxiosError(error)) {
      const message = error.response?.data?.message || "Unknown error.";
      throw new Error(`AI API error: ${message}`);
    } else {
      throw new Error(
        error instanceof Error ? error.message : "Unknown error."
      );
    }
  }
}
