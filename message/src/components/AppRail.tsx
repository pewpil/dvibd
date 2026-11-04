"use client";

import { type ReactNode } from "react";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../contexts/AuthContext";
import type { CommunityDTO } from "../types/message";
import style from "../styles/components/AppRail.module.css";

interface AppRailProps {
  communities: CommunityDTO[];
  activeSource: string;
  panelExpanded: boolean;
  panelId: string;
  onSelectAccount: () => void;
  onSelectDirect: () => void;
  onSelectCommunity: (id: string) => void;
  onRegisterTrigger: (source: string, element: HTMLButtonElement | null) => void;
}

export default function AppRail(props: AppRailProps): ReactNode {
  const { user } = useAuth();
  const profileAvatar: string = user?.avatarUrl ?? "/profile-picture.svg";
  const profileLabel: string =
    user?.displayName ?? user?.username ?? "Your account";
  const accountActive: boolean = props.activeSource === "account";
  const directActive: boolean = props.activeSource === "direct";

  return (
    <nav id={style.appRail}>
      <div id={style.railTop}>
        <div id={style.avatarWrap}>
          <button
            type="button"
            id={style.profileButton}
            ref={(element: HTMLButtonElement | null): void => {
              props.onRegisterTrigger("account", element);
            }}
            className={accountActive ? style.railButtonActive : undefined}
            onClick={props.onSelectAccount}
            aria-pressed={accountActive}
            aria-expanded={accountActive && props.panelExpanded}
            aria-controls={props.panelId}
            aria-label="Account"
            title="Account"
          >
            <img
              id={style.profileAvatar}
              src={profileAvatar}
              alt={profileLabel}
            />
          </button>
        </div>

        <button
          type="button"
          id={style.listToggle}
          ref={(element: HTMLButtonElement | null): void => {
            props.onRegisterTrigger("direct", element);
          }}
          className={directActive ? style.railButtonActive : undefined}
          onClick={props.onSelectDirect}
          aria-pressed={directActive}
          aria-expanded={directActive && props.panelExpanded}
          aria-controls={props.panelId}
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
        {props.communities.map((community: CommunityDTO): ReactNode => {
          const isActive: boolean = props.activeSource === community.id;
          return (
            <li key={community.id} id={style.communityItem}>
              <button
                type="button"
                id={style.communityButton}
                ref={(element: HTMLButtonElement | null): void => {
                  props.onRegisterTrigger(community.id, element);
                }}
                className={isActive ? style.communityActive : undefined}
                onClick={(): void => props.onSelectCommunity(community.id)}
                aria-pressed={isActive}
                aria-expanded={isActive && props.panelExpanded}
                aria-controls={props.panelId}
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

      <div id={style.railBottom}>
        <ThemeToggle />
      </div>
    </nav>
  );
}
