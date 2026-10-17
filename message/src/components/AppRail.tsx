"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import type { Community } from "../data/fallback";
import style from "../styles/components/AppRail.module.css";

interface AppRailProps {
  communities: Community[];
  activeCommunityId: string | null;
  onSelectCommunity: (id: string) => void;
  directActive: boolean;
  onSelectDirect: () => void;
}

export default function AppRail(props: AppRailProps): ReactNode {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const rootRef = useRef<HTMLElement | null>(null);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect((): (() => void) => {
    const element: HTMLElement | null = rootRef.current;
    if (element === null) {
      return (): void => {};
    }

    const handlePointerDown = (event: PointerEvent): void => {
      if (!element.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return (): void => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLogout = async (): Promise<void> => {
    setMenuOpen(false);
    await logout();
    router.replace("/login");
    router.refresh();
  };

  return (
    <nav id={style.appRail} ref={rootRef}>
      <div id={style.railTop}>
        <div id={style.avatarWrap}>
          <button
            type="button"
            id={style.profileButton}
            onClick={(): void => setMenuOpen((prev: boolean): boolean => !prev)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            aria-label="Account menu"
          >
            <img
              id={style.profileAvatar}
              src="/profile-picture.svg"
              alt={user?.displayName ?? user?.username ?? "Your profile"}
            />
          </button>

          {menuOpen ? (
            <div id={style.accountMenu} role="menu">
              <p id={style.accountName}>
                {user?.username ?? "Signed out"}
              </p>
              <button
                type="button"
                id={style.accountAction}
                role="menuitem"
                onClick={(): void => setMenuOpen(false)}
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
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                Settings
              </button>
              <button
                type="button"
                id={style.accountAction}
                role="menuitem"
                onClick={(): void => setMenuOpen(false)}
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
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M19 8v6M22 11h-6" />
                </svg>
                Switch account
              </button>
              <button
                type="button"
                id={style.logoutAction}
                role="menuitem"
                onClick={(): void => {
                  void handleLogout();
                }}
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
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <path d="m16 17 5-5-5-5M21 12H9" />
                </svg>
                Log out
              </button>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          id={style.listToggle}
          className={props.directActive ? style.railButtonActive : undefined}
          onClick={props.onSelectDirect}
          aria-pressed={props.directActive}
          aria-label="Direct conversations"
          title="Direct conversations"
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
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>

      <ul id={style.communityList}>
        {props.communities.map((community: Community): ReactNode => {
          const isActive: boolean = props.activeCommunityId === community.id;
          return (
            <li key={community.id} id={style.communityItem}>
              <button
                type="button"
                id={style.communityButton}
                className={isActive ? style.communityActive : undefined}
                onClick={(): void => props.onSelectCommunity(community.id)}
                aria-pressed={isActive}
                aria-label={community.name}
                title={community.name}
              >
                <img
                  id={style.communityAvatar}
                  src={community.avatar}
                  alt={community.name}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
