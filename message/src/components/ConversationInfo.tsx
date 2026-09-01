import type { ReactNode } from "react";
import type { Conversation, Participant, SharedFile, SharedLink } from "../data/fallback";
import style from "../styles/components/ConversationInfo.module.css";

interface ConversationInfoProps {
  conversation: Conversation;
  participants: Participant[];
  sharedFiles: SharedFile[];
  sharedLinks: SharedLink[];
  onClose?: () => void;
}

export default function ConversationInfo(props: ConversationInfoProps): ReactNode {
  const isChannel: boolean = props.conversation.type === "channel";
  const bioText: string = isChannel
    ? props.conversation.subtitle
    : "Product Designer on the dvibd design system. Available weekdays for UI/UX reviews and discussions.";

  return (
    <aside id={style.conversationInfo}>
      <header id={style.infoHeader}>
        <h2 id={style.infoTitle}>Details</h2>
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
      </header>

      <div id={style.infoScrollContent}>
        <div id={style.profileCard}>
          <img
            id={style.profileAvatar}
            src={props.conversation.avatar}
            alt={props.conversation.title}
          />
          <h3 id={style.profileName}>{props.conversation.title}</h3>
          <span id={style.profileSubtitle}>
            {isChannel
              ? `${props.conversation.communityName} • ${props.conversation.memberCount} members`
              : `@${props.conversation.title.toLowerCase().replace(/\s+/g, "")} • ${props.conversation.subtitle}`}
          </span>
          <p id={style.profileBio}>{bioText}</p>

          <div id={style.quickActions}>
            <button
              type="button"
              className={style.quickActionButton}
              aria-label="Mute notifications"
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
              Mute
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
          </div>
        </div>

        <section id={style.participantsSection}>
          <h4 id={style.sectionTitle}>
            {isChannel ? "Channel Members" : "Participants"}
          </h4>
          <ul id={style.participantsList}>
            {props.participants.map((p: Participant): ReactNode => {
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
                  <span id={style.roleBadge}>{p.role}</span>
                </li>
              );
            })}
          </ul>
        </section>

        <section id={style.sharedFilesSection}>
          <h4 id={style.sectionTitle}>Shared Files</h4>
          <ul id={style.sharedFilesList}>
            {props.sharedFiles.map((file: SharedFile): ReactNode => {
              return (
                <li key={file.id} id={style.sharedFileItem}>
                  <div id={style.fileInfo}>
                    <span id={style.fileExtBadge}>{file.extension}</span>
                    <div id={style.fileMeta}>
                      <span id={style.fileName}>{file.name}</span>
                      <span id={style.fileSubtext}>
                        {file.size} • {file.timestamp}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    id={style.downloadButton}
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
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section id={style.sharedLinksSection}>
          <h4 id={style.sectionTitle}>Shared Links</h4>
          <ul id={style.sharedLinksList}>
            {props.sharedLinks.map((link: SharedLink): ReactNode => {
              return (
                <li key={link.id} id={style.sharedLinkItem}>
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
            {isChannel ? "Leave Channel" : "Block Contact"}
          </button>
        </section>
      </div>
    </aside>
  );
}
