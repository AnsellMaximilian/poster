import { config } from "@/config/appwrite";
import { databases } from "@/config/appwriteNode";
import { MAX_BODY_LENGTH } from "@/const/common";
import { PostmarkInboundEmail } from "@/types/postmark";
import { NextRequest, NextResponse } from "next/server";
import { AppwriteException } from "node-appwrite";

const POST = async (req: NextRequest) => {
  const inboundEmail: PostmarkInboundEmail = await req.json();

  console.log({ inboundEmail: JSON.stringify(inboundEmail) });

  const subject = inboundEmail.Subject;
  const headers = inboundEmail.Headers;

  const headerMap = Object.fromEntries(
    headers.map((h) => [h.Name.toLowerCase(), h.Value])
  );

  const inReplyTo = headerMap["in-reply-to"];
  const messageId = inboundEmail.MessageID;
  const headerMessageId = headerMap["message-id"];

  if (inReplyTo) {
    // reply handler logic here
    // you can link the message to the existing postcard/conversation by In-Reply-To
    return NextResponse.json({
      message: "Reply email detected — handling not yet implemented.",
    });
  }

  // extract ID from subject in format: [ID]: actual subject
  const match = subject.match(/^\[([^\]]+)\]:/);
  if (!match) {
    return NextResponse.json(
      { error: "Invalid subject format. Must begin with [id]: ..." },
      { status: 400 }
    );
  }

  const extractedId = match[1];

  // check if postcard exists
  try {
    await databases.getDocument(
      config.dbId,
      config.postcardCollectionId,
      extractedId
    );
  } catch (err) {
    if (err instanceof AppwriteException && err.code === 404) {
      return NextResponse.json(
        { error: "Postcard not found. Email must correspond to a valid ID." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to validate postcard ID." },
      { status: 500 }
    );
  }

  try {
    const ccs = inboundEmail.CcFull?.map((entry) => entry.Email) ?? [];

    if (ccs.length < 2)
      return NextResponse.json(
        { error: "At least 2 CCs are required to create a postcard." },
        { status: 400 }
      );

    const rawBody =
      inboundEmail.TextBody?.trim() || inboundEmail.HtmlBody?.trim() || "";

    const emailBody =
      rawBody.length > MAX_BODY_LENGTH - "\n\n[...truncated]".length
        ? rawBody.slice(0, MAX_BODY_LENGTH) + "\n\n[...truncated]"
        : rawBody;

    // Update the existing postcard
    const updatedPostcard = await databases.updateDocument(
      config.dbId,
      config.postcardCollectionId,
      extractedId,
      {
        fromName: inboundEmail.FromName,
        fromEmail: inboundEmail.From,
        emailBody: emailBody,
        emailSubject: subject,
        messageId,
        headerMessageId,
        ccs,
      }
    );

    return NextResponse.json({
      message: "Postcard updated",
      postcard: updatedPostcard,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update postcard with initial email." },
      { status: 500 }
    );
  }
};

export { POST };
