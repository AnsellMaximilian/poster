import {
  getErrorApiResponse,
  getErrorMessage,
  getSuccessApiResponse,
  isSameUTCDate,
} from "@/lib/utils";
import { config } from "@/config/appwrite";
import { databases, users } from "@/config/appwriteNode";
import { Permission, Query, Role } from "node-appwrite";
import { NextRequest, NextResponse } from "next/server";
import { Postcard, PostcardResponse } from "@/types/postcard";
import { UserProfile } from "@/types/user";
import { MAX_ATTEMPTS } from "@/const/common";
import { generatePostcardReplyHtml } from "@/lib/ai";
import { sendPostmarkEmail } from "@/lib/postmark";

const POST = async (req: NextRequest) => {
  try {
    const { postcardId, currentUserId } = await req.json();

    if (!postcardId || !currentUserId) {
      return NextResponse.json(getErrorApiResponse("Missing parameters!"));
    }

    // Verify user exists
    try {
      await users.get(String(currentUserId));
    } catch {
      return NextResponse.json(getErrorApiResponse("User does not exist!"));
    }

    // Load or create profile
    let profile: null | UserProfile = null;

    try {
      profile = (await databases.getDocument(
        config.dbId,
        config.userProfileCollectionId,
        currentUserId
      )) as UserProfile;
    } catch {
      profile = (await databases.createDocument(
        config.dbId,
        config.userProfileCollectionId,
        currentUserId,
        {
          numberOfAttempts: 0,
          latestAttemptDateTime: null,
        },
        [
          Permission.read(Role.user(currentUserId)),
          Permission.update(Role.user(currentUserId)),
          Permission.delete(Role.user(currentUserId)),
        ]
      )) as UserProfile;
    }

    const now = new Date();
    const lastAttempt = profile.latestAttemptDateTime
      ? new Date(profile.latestAttemptDateTime)
      : null;

    let updatedAttempts = profile.numberOfAttempts;

    if (!lastAttempt || !isSameUTCDate(lastAttempt, now)) {
      updatedAttempts = 1;
    } else {
      if (updatedAttempts >= MAX_ATTEMPTS) {
        return NextResponse.json(
          getErrorApiResponse("Daily attempt limit reached!")
        );
      }
      updatedAttempts += 1;
    }

    // Update attempt count
    await databases.updateDocument(
      config.dbId,
      config.userProfileCollectionId,
      currentUserId,
      {
        numberOfAttempts: updatedAttempts,
        latestAttemptDateTime: now,
      }
    );

    // Fetch postcard
    const postcard = (await databases.getDocument(
      config.dbId,
      config.postcardCollectionId,
      postcardId
    )) as Postcard;

    if (!postcard.messageId)
      return NextResponse.json(
        getErrorApiResponse(
          "Postcard does not have an associated inbound email!"
        )
      );

    if (postcard.finalReplyHtml)
      return NextResponse.json(
        getErrorApiResponse(
          "You've already generated an email for this postcard!"
        )
      );

    // Fetch responses
    const responses = (
      await databases.listDocuments(
        config.dbId,
        config.postcardResponseCollectionId,
        [Query.equal("postcardId", postcardId)]
      )
    ).documents as PostcardResponse[];

    if (responses.length !== postcard.ccs.length)
      return NextResponse.json(
        getErrorApiResponse("Not all CCs have replied!")
      );

    // Generate reply
    const reply = await generatePostcardReplyHtml(postcard, responses);

    // Send email
    await sendPostmarkEmail({
      from: process.env.SENDER_EMAIL!,
      to: `${postcard.fromEmail!}, ${postcard.ccs.map((cc) => cc).join(", ")}`,
      subject: `Re: ${postcard.emailSubject}`,
      htmlBody: reply,
      headers: [
        {
          Name: "In-Reply-To",
          Value: postcard.headerMessageId!,
        },
        {
          Name: "References",
          Value: postcard.headerMessageId!,
        },
      ],
    });

    // Update postcard with final reply
    const updatedPostcard = await databases.updateDocument(
      config.dbId,
      config.postcardCollectionId,
      postcardId,
      {
        finalReplyHtml: reply,
      }
    );

    return NextResponse.json(
      getSuccessApiResponse(updatedPostcard, "Email sent!")
    );
  } catch (e) {
    console.log({ e });
    return NextResponse.json(getErrorApiResponse(getErrorMessage(e)));
  }
};

export { POST };
