"use client";

import { useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useStuckScroll } from "../hooks/useStuckScroll";
import { currentUser } from "../data/fallback";
import style from "../styles/components/AccountPanel.module.css";

type AccountIconName =
  | "settings"
  | "terms"
  | "privacy"
  | "cookies"
  | "about"
  | "help"
  | "report"
  | "logout";

interface AccountActionItem {
  label: string;
  icon: AccountIconName;
  danger: boolean;
}

interface AccountActionSection {
  items: AccountActionItem[];
}

const ACCOUNT_SECTIONS: AccountActionSection[] = [
  { items: [{ label: "Settings", icon: "settings", danger: false }] },
  {
    items: [
      { label: "Terms", icon: "terms", danger: false },
      { label: "Privacy", icon: "privacy", danger: false },
      { label: "Cookies", icon: "cookies", danger: false },
      { label: "About", icon: "about", danger: false },
    ],
  },
  {
    items: [
      { label: "Help", icon: "help", danger: false },
      { label: "Report Problem", icon: "report", danger: false },
    ],
  },
  { items: [{ label: "Log out", icon: "logout", danger: true }] },
];

function AccountIcon(props: { name: AccountIconName }): ReactNode {
  if (props.name === "settings") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    );
  }

  if (props.name === "terms") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
      </svg>
    );
  }

  if (props.name === "privacy") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    );
  }

  if (props.name === "cookies") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <circle cx="9.5" cy="9.5" r="1" />
        <circle cx="14.5" cy="13.5" r="1" />
        <circle cx="9" cy="14.5" r="1" />
      </svg>
    );
  }

  if (props.name === "about") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    );
  }

  if (props.name === "help") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
      </svg>
    );
  }

  if (props.name === "report") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5M21 12H9" />
    </svg>
  );
}

export default function AccountPanel(): ReactNode {
  const rootRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const stuck: boolean = useStuckScroll(rootRef, headerRef);
  const { user, logout } = useAuth();
  const router = useRouter();

  const displayName: string =
    user?.displayName ?? user?.username ?? currentUser.name;
  const handle: string = user?.username ?? currentUser.handle;
  const email: string = user?.email ?? currentUser.email;

  const handleLogout = async (): Promise<void> => {
    await logout();
    router.replace("/login");
    router.refresh();
  };

  return (
    <section id={style.accountPanel} ref={rootRef}>
      <header
        id={style.panelHeader}
        ref={headerRef}
        className={stuck ? style.stuck : undefined}
      >
        <img id={style.panelAvatar} src={currentUser.avatar} alt={displayName} />
        <p id={style.panelDisplayName}>{displayName}</p>
        <p id={style.panelHandle}>@{handle}</p>
        <p id={style.panelBio}>{currentUser.bio}</p>
        <a
          id={style.panelWebsite}
          href={`https://${currentUser.website}`}
          target="_blank"
          rel="noreferrer"
        >
          {currentUser.website}
        </a>
        <p id={style.panelEmail}>{email}</p>
      </header>

      <div id={style.panelSections}>
        {ACCOUNT_SECTIONS.map((section: AccountActionSection): ReactNode => (
          <div key={section.items[0].label} id={style.panelSection}>
            {section.items.map((item: AccountActionItem): ReactNode => (
              <button
                key={item.label}
                type="button"
                id={style.panelAction}
                className={item.danger ? style.panelActionDanger : undefined}
                onClick={(): void => {
                  if (item.icon === "logout") {
                    void handleLogout();
                  }
                }}
              >
                <AccountIcon name={item.icon} />
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}