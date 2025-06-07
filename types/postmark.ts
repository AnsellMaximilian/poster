export interface PostmarkInboundEmail {
  FromName: string;
  MessageStream: string;
  From: string;
  FromFull: EmailAddress;
  To: string;
  ToFull: EmailAddress[];
  Cc: string;
  CcFull: EmailAddress[];
  Bcc: string;
  BccFull: EmailAddress[];
  OriginalRecipient: string;
  Subject: string;
  MessageID: string;
  ReplyTo: string;
  MailboxHash: string;
  Date: string;
  TextBody: string;
  HtmlBody: string;
  StrippedTextReply: string;
  Tag: string;
  Headers: EmailHeader[];
  Attachments: Attachment[];
}

export interface EmailAddress {
  Email: string;
  Name: string;
  MailboxHash: string;
}

export interface EmailHeader {
  Name: string;
  Value: string;
}

export interface Attachment {
  Name: string;
  Content: string;
  ContentType: string;
  ContentLength: number;
  ContentID?: string;
}
