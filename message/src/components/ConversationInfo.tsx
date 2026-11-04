import { useRef, type ReactNode } from "react";
import type {
  ConversationDTO,
  MessageUserDTO,
  SharedFileDTO,
  SharedLinkDTO,
} from "../types/message";
import { useStuckScroll } from "../hooks/useStuckScroll";
import style from "../styles/components/ConversationInfo.module.css";

interface ConversationInfoProps {
  conversation: ConversationDTO;
  participants: MessageUserDTO[];
  sharedFiles: SharedFileDTO[];
  sharedLinks: SharedLinkDTO[];
  directParticipant?: MessageUserDTO;
  muted?: boolean;
  onToggleMute?: () => void;
  onLeave?: () => void;
  onClose?: () => void;
  overlay?: boolean;
}

function joinMeta(parts: string[]): string {
  return parts
    .filter((part: string): boolean => part.length > 0)
    .join(", ");
}

export default function ConversationInfo(
  props: ConversationInfoProps,
): ReactNode {
  const isChannel: boolean = props.conversation.type === "channel";
  const rootRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const stuck: boolean = useStuckScroll(rootRef, headerRef);
  const muted: boolean = props.muted ?? false;
  const directBio: string = props.directParticipant?.bio ?? "";
  const bioText: string = isChannel
    ? props.conversation.subtitle
    : directBio.length > 0
      ? directBio
      : props.conversation.subtitle;
  const subtitleText: string = isChannel
    ? joinMeta([
        props.conversation.communityName,
        `${props.conversation.memberCount} members`,
      ])
    : joinMeta([
        props.directParticipant === undefined
          ? ""
          : `@${props.directParticipant.handle}`,
        props.directParticipant?.headline ?? "",
      ]);

  return (
    <aside
      id={style.information}
      ref={rootRef}
      role={props.overlay === true ? "dialog" : undefined}
      aria-label={props.overlay === true ? "Conversation details" : undefined}
    >
      <section
        id={style.profileCard}
        ref={headerRef}
        className={stuck ? style.stuck : undefined}
      >
        {props.onClose ? (
          <button
            type="button"
            id={style.closeInfoButton}
            onClick={props.onClose}
            aria-label="Close details"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        ) : null}
        <img
          id={style.profileAvatar}
          src={props.directParticipant?.avatar ?? props.conversation.avatar}
          alt={props.directParticipant?.name ?? props.conversation.title}
        />
        <h3 id={style.profileName}>
          {props.directParticipant?.name ?? props.conversation.title}
        </h3>
        <span id={style.profileSubtitle}>{subtitleText}</span>
        {bioText.length > 0 ? (
          <p id={style.profileBio}>{bioText}</p>
        ) : null}

        <nav id={style.quickActions}>
          <button
            type="button"
            className={style.quickActionButton}
            onClick={props.onToggleMute}
            aria-pressed={muted}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {muted ? "Unmute" : "Mute"}
          </button>
          <button
            type="button"
            className={style.quickActionButton}
            aria-label="Search files"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            Search
          </button>
          <button
            type="button"
            className={style.quickActionButton}
            aria-label="Export conversation"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </button>
        </nav>
      </section>

      <div id={style.infoScrollContent}>
        <section id={style.participantsSection}>
          <h4 id={style.sectionTitle}>
            {isChannel ? "Channel members" : "Participants"}
          </h4>
          <ul id={style.participantsList}>
            {props.participants.map((p: MessageUserDTO): ReactNode => {
              return (
                <li key={p.id} id={style.participantItem}>
                  <div id={style.participantDetails}>
                    <img
                      id={style.participantAvatar}
                      src={p.avatar}
                      alt={p.name}
                    />
                    <div id={style.participantMeta}>
                      <span id={style.participantName}>{p.name}</span>
                      <span id={style.participantHandle}>@{p.handle}</span>
                    </div>
                  </div>
                  {p.headline.length > 0 ? (
                    <span id={style.roleBadge}>{p.headline}</span>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        <section id={style.sharedFilesSection}>
          <h4 id={style.sectionTitle}>Shared files</h4>
          <ul id={style.sharedFilesList}>
            {props.sharedFiles.map((file: SharedFileDTO): ReactNode => {
              return (
                <li key={file.id} id={style.sharedFileItem}>
                  <div id={style.fileInfo}>
                    <span id={style.fileExtBadge}>{file.extension}</span>
                    <div id={style.fileMeta}>
                      <span id={style.fileName}>{file.name}</span>
                      <span id={style.fileSubtext}>
                        {file.size}, {file.timestamp}
                      </span>
                    </div>
                  </div>
                  <a
                    id={style.downloadButton}
                    href={file.url}
                    download={file.name}
                    aria-label={`Download ${file.name}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>

        <section id={style.sharedLinksSection}>
          <h4 id={style.sectionTitle}>Shared links</h4>
          <ul id={style.sharedLinksList}>
            {props.sharedLinks.map((link: SharedLinkDTO): ReactNode => {
              return (
                <li key={link.id} id={style.sharedLinkItem}>
                  <a
                    id={style.sharedLink}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span id={style.linkIconBadge}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                      </svg>
                    </span>
                    <div id={style.linkMeta}>
                      <span id={style.linkTitle}>{link.title}</span>
                      <span id={style.linkDomain}>{link.domain}</span>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>

        <section id={style.settingsSection}>
          <div id={style.encryptionNotice}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span id={style.encryptionText}>End-to-end encrypted</span>
          </div>

          <button
            type="button"
            id={style.dangerActionButton}
            onClick={props.onLeave}
            aria-label={isChannel ? "Leave channel" : "Block contact"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            </svg>
            {isChannel ? "Leave channel" : "Block contact"}
          </button>
        </section>
      </div>
    </aside>
  );
}
