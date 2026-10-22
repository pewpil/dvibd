import { currentUser, fallbackThreads } from "./fallback.ts";
import type {
  ComposeFields,
  Contact,
  EmailMessage,
  FolderId,
  Thread,
} from "./types.ts";

const PROFILE: string = currentUser.avatar;

function stamp(): string {
  return new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function snippetOf(body: string): string {
  const first: string = body.split("\n")[0]?.trim() ?? "";
  return first.length > 0 ? first : "(no content)";
}

function subjectOf(fields: ComposeFields): string {
  return fields.subject.trim().length > 0 ? fields.subject.trim() : "(no subject)";
}

function parseRecipients(value: string): Contact[] {
  return value
    .split(",")
    .map((part: string): string => part.trim())
    .filter((part: string): boolean => part.length > 0)
    .map((address: string): Contact => ({
      id: `contact-${address.toLowerCase()}`,
      name: address.split("@")[0] || address,
      email: address,
      avatar: PROFILE,
    }));
}

class MailStore {
  threads = $state<Thread[]>(fallbackThreads);

  list(): Thread[] {
    return this.threads;
  }

  thread(id: string): Thread | undefined {
    return this.threads.find((item: Thread): boolean => item.id === id);
  }

  markRead(id: string): void {
    const thread: Thread | undefined = this.thread(id);
    if (thread === undefined) {
      return;
    }
    for (const item of thread.messages) {
      item.isRead = true;
    }
  }

  toggleStar(id: string): void {
    const thread: Thread | undefined = this.thread(id);
    if (thread === undefined) {
      return;
    }
    thread.isStarred = !thread.isStarred;
  }

  setFolder(id: string, folder: FolderId): void {
    const thread: Thread | undefined = this.thread(id);
    if (thread === undefined) {
      return;
    }
    thread.folder = folder;
  }

  sendNew(fields: ComposeFields): void {
    const id: string = `t-${crypto.randomUUID()}`;
    const thread: Thread = {
      id,
      subject: subjectOf(fields),
      folder: "sent",
      labels: [],
      isStarred: false,
      snippet: snippetOf(fields.body),
      messages: [this.buildMessage(fields, id, false)],
    };
    this.threads.unshift(thread);
  }

  sendReply(threadId: string, fields: ComposeFields): void {
    const thread: Thread | undefined = this.thread(threadId);
    if (thread === undefined) {
      return;
    }
    thread.messages.push(this.buildMessage(fields, threadId, false));
    thread.snippet = snippetOf(fields.body);
  }

  deleteThread(id: string): void {
    const index: number = this.threads.findIndex(
      (item: Thread): boolean => item.id === id,
    );
    if (index >= 0) {
      this.threads.splice(index, 1);
    }
  }

  saveDraft(fields: ComposeFields, draftId: string | null): void {
    if (draftId !== null) {
      const thread: Thread | undefined = this.thread(draftId);
      if (thread === undefined) {
        return;
      }
      const draft: EmailMessage | undefined = thread.messages.find(
        (message: EmailMessage): boolean => message.isDraft,
      );
      if (draft === undefined) {
        return;
      }
      draft.to = parseRecipients(fields.to);
      draft.cc = parseRecipients(fields.cc);
      draft.body = fields.body.split("\n");
      draft.quoted = fields.quoted;
      draft.timestamp = stamp();
      thread.subject = subjectOf(fields);
      thread.snippet = snippetOf(fields.body);
      return;
    }
    const id: string = `t-${crypto.randomUUID()}`;
    const thread: Thread = {
      id,
      subject: subjectOf(fields),
      folder: "drafts",
      labels: [],
      isStarred: false,
      snippet: snippetOf(fields.body),
      messages: [this.buildMessage(fields, id, true)],
    };
    this.threads.unshift(thread);
  }

  private buildMessage(
    fields: ComposeFields,
    threadId: string,
    isDraft: boolean,
  ): EmailMessage {
    return {
      id: `m-${crypto.randomUUID()}`,
      threadId,
      sender: currentUser,
      to: parseRecipients(fields.to),
      cc: parseRecipients(fields.cc),
      timestamp: stamp(),
      body: fields.body.split("\n"),
      quoted: fields.quoted,
      attachments: [],
      isRead: true,
      isDraft,
      isOutgoing: true,
    };
  }
}

export const mail = new MailStore();
