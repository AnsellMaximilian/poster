import { config } from "@/config/appwrite";
import { databases } from "@/config/appwriteNode";
import { MAX_BODY_LENGTH } from "@/const/common";
import { Postcard } from "@/types/postcard";
import { PostmarkInboundEmail } from "@/types/postmark";
import { NextRequest, NextResponse } from "next/server";
import { AppwriteException, ID, Permission, Query, Role } from "node-appwrite";

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
    const subject = inboundEmail.Subject;

    const match = subject.match(/^\s*Re:\s*\[([^\]]+)\]:/i);
    if (!match) {
      return NextResponse.json(
        { error: "Invalid reply subject format. Must be 'Re: [id]: ...'" },
        { status: 400 }
      );
    }

    const extractedId = match[1];

    // check postcard exists
    let postcard: Postcard;
    try {
      postcard = await databases.getDocument(
        config.dbId,
        config.postcardCollectionId,
        extractedId
      );
    } catch {
      return NextResponse.json(
        { error: "Postcard not found for reply." },
        { status: 400 }
      );
    }

    // check for existing response from this email
    const fromEmail = inboundEmail.From;
    try {
      const existingResponses = await databases.listDocuments(
        config.dbId,
        config.postcardResponseCollectionId,
        [
          // Adjust these filters to your DB query language
          Query.equal("postcardId", extractedId),
          Query.equal("fromEmail", fromEmail),
        ]
      );

      if (existingResponses.total > 0) {
        return NextResponse.json(
          { error: "This sender has already responded to the postcard." },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: "Failed to check for existing responses." },
        { status: 500 }
      );
    }

    const rawBody =
      inboundEmail.TextBody?.trim() || inboundEmail.HtmlBody?.trim() || "";

    const emailBody =
      rawBody.length > MAX_BODY_LENGTH - "\n\n[...truncated]".length
        ? rawBody.slice(0, MAX_BODY_LENGTH) + "\n\n[...truncated]"
        : rawBody;

    try {
      const newResponse = await databases.createDocument(
        config.dbId,
        config.postcardResponseCollectionId,
        ID.unique(),
        {
          postcardId: extractedId,
          fromEmail,
          fromName: inboundEmail.FromName,
          messageId: inboundEmail.MessageID,
          headerMessageId: headerMessageId,
          emailBody,
          emailSubject: subject,
          replyHeaderMessageId: inReplyTo,
        },

        [
          Permission.read(Role.user(postcard.userId)),
          Permission.update(Role.user(postcard.userId)),
          Permission.delete(Role.user(postcard.userId)),
        ]
      );

      return NextResponse.json({
        message: "Postcard response recorded.",
        response: newResponse,
      });
    } catch {
      return NextResponse.json(
        { error: "Failed to create postcard response." },
        { status: 500 }
      );
    }
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
    const existingPostcard: Postcard = await databases.getDocument(
      config.dbId,
      config.postcardCollectionId,
      extractedId
    );

    if (existingPostcard.messageId)
      return NextResponse.json(
        { error: "Postcard already has an email associated with it." },
        { status: 400 }
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
