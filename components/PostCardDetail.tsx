import { Button } from "@/components/ui/button";
import { Postcard } from "@/types/postcard";
import { MailIcon } from "lucide-react";

const TYPE_CC_MAP: Record<string, string[]> = {
  DECISION: ["leadership@company.com", "comms@company.com"],
  TRIBUTE: ["team@company.com", "hr@company.com"],
  RECAP: ["ops@company.com", "records@company.com"],
};

export default function PostcardDetail({ postcard }: { postcard: Postcard }) {
  const {
    $id,
    type,
    mood,
    themeColor,
    formatStyle,
    senderVoice,
    notes,
    userId,
    fromEmail,
    fromName,
    emailBody,
  } = postcard;

  const hasInbound = Boolean(emailBody);
  const toEmail = process.env.NEXT_PUBLIC_INBOUND_ADDRESS;
  const ccList = TYPE_CC_MAP[type] ?? [];
  const subject = `[${$id}]: <DO NOT DELETE ID> Your ${type.toLowerCase()} postcard`;
  const bodyExample = `Dear team,\n\nHere’s a message for the ${type.toLowerCase()} postcard.\n\nThanks,\n${
    fromName ?? "Your Name"
  }`;

  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${toEmail}&su=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(bodyExample)}&cc=${encodeURIComponent(
    ccList.join(",")
  )}`;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white border border-gray-200 rounded-md shadow-sm space-y-6">
      <h2 className="text-2xl border-b pb-2 flex items-center gap-2">
        <MailIcon />
        <span className="font-semibold">Postcard Details</span>
        <span className="hover:underline cursor-pointer font-bold ml-auto">
          [{$id}]
        </span>
      </h2>

      <div className="space-y-2 text-sm leading-relaxed">
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
        <p>
          <strong>Notes:</strong> {notes ?? "—"}
        </p>
        <p>
          <strong>User ID:</strong> {userId}
        </p>
        <p>
          <strong>From Name:</strong> {fromName ?? "—"}
        </p>
        <p>
          <strong>From Email:</strong> {fromEmail ?? "—"}
        </p>
      </div>

      {hasInbound ? (
        <div className="bg-green-50 border border-green-200 rounded p-4 text-sm whitespace-pre-line">
          <h3 className="font-semibold mb-1">✉️ Inbound Email Received</h3>
          <p>{emailBody}</p>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-sm space-y-2">
          <h3 className="font-semibold">🕊️ No Inbound Email Yet</h3>
          <p>
            To send your message manually, compose an email to:{" "}
            <code className="bg-white px-1 rounded border">{toEmail}</code>
          </p>
          <p>
            Subject must begin with:{" "}
            <code className="bg-white px-1 rounded border">
              [{$id}]: &lt;Your subject&gt;
            </code>
          </p>
          <p>Include at least two CCs when composing your email</p>
          <p className="text-gray-600 italic">
            Example body:
            <br />
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
