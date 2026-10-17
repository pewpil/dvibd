"use client";

import { type ReactNode } from "react";
import ThemeToggle from "./ThemeToggle";
import type { Community } from "../data/fallback";
import style from "../styles/components/AppRail.module.css";

interface AppRailProps {
  communities: Community[];
  activeSource: string;
  onSelectAccount: () => void;
  onSelectDirect: () => void;
  onSelectCommunity: (id: string) => void;
}

export default function AppRail(props: AppRailProps): ReactNode {
  return (
    <nav id={style.appRail}>
      <div id={style.railTop}>
        <div id={style.avatarWrap}>
          <button
            type="button"
            id={style.profileButton}
            className={props.activeSource === "account" ? style.railButtonActive : undefined}
            onClick={props.onSelectAccount}
            aria-pressed={props.activeSource === "account"}
            aria-label="Account"
            title="Account"
          >
            <img id={style.profileAvatar} src="/profile-picture.svg" alt="Your profile" />
          </button>
        </div>

        <button
          type="button"
          id={style.listToggle}
          className={props.activeSource === "direct" ? style.railButtonActive : undefined}
          onClick={props.onSelectDirect}
          aria-pressed={props.activeSource === "direct"}
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
          const isActive: boolean = props.activeSource === community.id;
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

      <div id={style.railBottom}>
        <ThemeToggle />
      </div>
    </nav>
  );
}