import { Button } from "@/components/ui/button";
import { TYPE_INFO } from "@/const/postcard";
import { usePostcards } from "@/context/postcards/PostcardsContext";
import { useUser } from "@/context/user/UserContext";
import { copyToClipboardWithToaster, toastError } from "@/lib/ui";
import { getErrorMessage } from "@/lib/utils";
import { ApiResponse } from "@/types/common";
import { Postcard } from "@/types/postcard";
import axios from "axios";
import { MailIcon, Square, SquareCheckBig } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function PostcardDetail({ postcard }: { postcard: Postcard }) {
  const { selectedPostcardResponses } = usePostcards();
  const { currentUser } = useUser();

  const [isSending, setIsSending] = useState(false);

  const {
    $id,
    type,
    mood,
    themeColor,
    formatStyle,
    senderVoice,
    notes,
    emailBody,
  } = postcard;

  const hasInbound = Boolean(emailBody);
  const toEmail = process.env.NEXT_PUBLIC_INBOUND_ADDRESS;
  const subject = `[${$id}]: <Your subject here>`;
  const bodyExample = TYPE_INFO[type].example;

  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${toEmail}&su=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(bodyExample)}}`;

  const haveAllReplied = postcard.ccs.every((email) =>
    selectedPostcardResponses.some((response) => response.fromEmail === email)
  );

  const handleSendPostcardEmail = async () => {
    if (!currentUser) return;
    try {
      setIsSending(true);
      const axiosRes = await axios.post("/api/postmark/send", {
        postcardId: postcard.$id,
        currentUserId: currentUser.$id,
      });

      const res = axiosRes.data as ApiResponse<Postcard>;

      if (res.success) {
        toast(res.message || "Email sent!", {
          className: "font-playpen-sans",
        });
      } else {
        toastError(res.message || "Failed to send postcard email");
      }
    } catch (error) {
      console.log({ error });
      toastError(getErrorMessage(error));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white border border-gray-200 rounded-md shadow-sm space-y-6">
      <h2 className="text-2xl border-b pb-2 flex items-center gap-2">
        <MailIcon />
        <span className="font-semibold">Postcard Details</span>
        <span
          className="hover:underline cursor-pointer font-bold ml-auto"
          onClick={() => copyToClipboardWithToaster($id)}
        >
          [{$id}]
        </span>
      </h2>

      <div className="space-y-2 text-sm leading-relaxed">
        <div className="grid grid-cols-2 gap-2">
          <p>
            <strong>ID:</strong> {$id}
          </p>
          <p>
            <strong>Type:</strong> {type}
          </p>
          <p>
            <strong>Mood:</strong> {mood}
          </p>
          <p>
            <strong>Theme Color:</strong> {themeColor}
          </p>
          <p>
            <strong>Format Style:</strong> {formatStyle}
          </p>
          <p>
            <strong>Sender Voice:</strong> {senderVoice}
          </p>
        </div>
        <p>
          <strong>Notes:</strong> <br />
          {notes ?? "—"}
        </p>
      </div>

      {postcard.finalReplyHtml ? (
        // Final postcard HTML exists
        <div className="bg-blue-50 border border-blue-200 rounded p-4 space-y-4">
          <h3 className="font-semibold text-lg">🎉 Final Postcard Ready</h3>
          <p>
            This postcard has been finalized. You can preview or copy the
            generated HTML below.
          </p>

          <div className="overflow-auto border rounded bg-white p-4 max-h-[600px]">
            <div
              className="email-preview"
              dangerouslySetInnerHTML={{ __html: postcard.finalReplyHtml }}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="secondary"
              onClick={() => copyToClipboardWithToaster(postcard.html || "")}
            >
              Copy HTML
            </Button>
          </div>
        </div>
      ) : hasInbound ? (
        <div className="bg-green-50 border border-green-200 rounded p-4 text-sm whitespace-pre-line space-y-2">
          <h3 className="font-semibold mb-1">✉️ Inbound Email Received</h3>

          <p>
            This postcard has receivved an inbound emai. Now you need to wait
            until all CCs have replied to the email with their responses to
            generate the postcard email.
          </p>

          <hr className="my-4" />
          <p className="font-semibold">CCs:</p>
          <ul className="list-disc list-inside space-y-1">
            {postcard.ccs.map((email) => {
              const hasReplied = selectedPostcardResponses.some(
                (response) => response.fromEmail === email
              );
              return (
                <li key={email} className="flex items-center gap-2">
                  {!hasReplied ? <Square /> : <SquareCheckBig />}
                  <span>{email}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      hasReplied
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {hasReplied ? "Replied" : "Waiting"}
                  </span>
                </li>
              );
            })}
          </ul>

          <hr className="my-4" />
          <p>Inbound Body:</p>
          <p className="text-gray-600 italic whitespace-pre-line">
            {emailBody}
          </p>

          {haveAllReplied && (
            <div className="flex justify-end mt-8">
              <Button
                className="text-lg h-auto px-4 rotate-2 rounded-tl-none rounded-br-none"
                disabled={isSending}
                onClick={() => {
                  handleSendPostcardEmail();
                }}
              >
                Send Postcard Email
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-sm space-y-2">
          <h3 className="font-semibold">🕊️ No Inbound Email Yet</h3>

          <p>
            To finish a postcard, first send an email to the address below with
            the required subject and at least two CCs. Make sure to mention that
            they need to{" "}
            <span className="font-bold">&quot;Reply All&quot;</span> to the
            email so that their responses are included in the postcard.
          </p>

          <hr className="my-4" />
          <p>
            To send your message manually, compose an email to:{" "}
            <code className="bg-white px-1 rounded border">{toEmail}</code>
          </p>
          <p>
            Subject must begin with:{" "}
            <code className="bg-white px-1 rounded border">{subject}</code>
          </p>
          <p>Include at least two CCs when composing your email</p>
          <hr className="my-4" />
          <p>Example body:</p>
          <p className="text-gray-600 italic whitespace-pre-line">
            {bodyExample}
          </p>

          <hr className="my-4" />

          <p className="">
            Or... Click the button below to get started quickly.
          </p>
          <Button asChild className="mt-2">
            <a href={gmailLink} target="_blank" rel="noopener noreferrer">
              <MailIcon className="w-4 h-4 mr-2" /> Compose in Gmail
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}
