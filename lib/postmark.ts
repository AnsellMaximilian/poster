"server only";

import axios from "axios";

interface SendEmailParams {
  from: string;
  to: string;
  subject: string;
  textBody?: string;
  htmlBody?: string;
  headers?: { Name: string; Value: string }[];
  messageStream?: string; // default: "outbound"
}

export async function sendPostmarkEmail({
  from,
  to,
  subject,
  textBody,
  htmlBody,
  headers = [],
  messageStream = "outbound",
}: SendEmailParams): Promise<void> {
  try {
    await axios.post(
      "https://api.postmarkapp.com/email",
      {
        From: from,
        To: to,
        Subject: subject,
        TextBody: textBody,
        HtmlBody: htmlBody,
        Headers: headers,
        MessageStream: messageStream,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Postmark-Server-Token": process.env.POSTMARK_SERVER_TOKEN!,
        },
      }
    );
  } catch (error) {
    console.error("Failed to send email via Postmark:", error);
    throw error;
  }
}
