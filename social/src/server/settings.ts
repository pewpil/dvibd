import { action, json, query, type CustomResponse } from "@solidjs/router";
import { z } from "zod";
import {
  MAX_BIO_LENGTH,
  MAX_DISPLAY_NAME_LENGTH,
  MAX_IMAGE_URL_LENGTH,
  MAX_WEBSITE_LENGTH,
  type NotificationPreferences,
  type SettingsProfile,
  type UpdateNotificationPreferencesResult,
  type UpdateProfileResult,
} from "../types/social";
import { prisma } from "./db";
import { readNotificationPreferences } from "./notificationPreferences";
import { readSessionUser } from "./session";
import type { SafeUser } from "./user";

const JOINED_FORMAT: Intl.DateTimeFormat = new Intl.DateTimeFormat("en", {
  month: "long",
  year: "numeric",
});

const WEB_PROTOCOLS: string[] = ["http:", "https:"];

function isWebUrl(value: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return false;
  }
  return WEB_PROTOCOLS.includes(parsed.protocol);
}

function isImageSource(value: string): boolean {
  if (value.startsWith("/")) {
    return !value.startsWith("//");
  }
  return isWebUrl(value);
}

function normalizeWebsite(value: string): string {
  if (value === "") {
    return "";
  }
  if (/^https?:\/\//i.test(value)) {
    return value;
  }
  return `https://${value}`;
}

function hasNonWebScheme(value: string): boolean {
  const match: RegExpExecArray | null = /^([a-z][a-z0-9+.-]*):/i.exec(value);
  if (match === null) {
    return false;
  }
  const rest: string = value.slice(match[0].length);
  if (/^\d+(\/|$|\?|#)/.test(rest)) {
    return false;
  }
  const scheme: string = match[0].slice(0, -1).toLowerCase();
  return scheme !== "http" && scheme !== "https";
}

function isWebsiteUrl(value: string): boolean {
  if (value === "") {
    return true;
  }
  if (value.startsWith("/") || hasNonWebScheme(value)) {
    return false;
  }
  let parsed: URL;
  try {
    parsed = new URL(normalizeWebsite(value));
  } catch {
    return false;
  }
  return (
    WEB_PROTOCOLS.includes(parsed.protocol) &&
    parsed.hostname !== "" &&
    parsed.username === "" &&
    parsed.password === ""
  );
}

function emptyToNull(value: string): string | null {
  return value === "" ? null : value;
}

function readCheckbox(payload: URLSearchParams, name: string): boolean {
  return payload.get(name) === "on";
}

const updateProfileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, "Display name is required.")
    .max(
      MAX_DISPLAY_NAME_LENGTH,
      `Display name must be at most ${MAX_DISPLAY_NAME_LENGTH} characters.`,
    ),
  bio: z
    .string()
    .trim()
    .max(MAX_BIO_LENGTH, `Bio must be at most ${MAX_BIO_LENGTH} characters.`),
  website: z
    .string()
    .trim()
    .max(
      MAX_WEBSITE_LENGTH,
      `Website must be at most ${MAX_WEBSITE_LENGTH} characters.`,
    )
    .refine(
      (value: string): boolean => isWebsiteUrl(value),
      { error: "Website must be an http or https URL." },
    ),
  avatarUrl: z
    .string()
    .trim()
    .max(
      MAX_IMAGE_URL_LENGTH,
      `Avatar URL must be at most ${MAX_IMAGE_URL_LENGTH} characters.`,
    )
    .refine(
      (value: string): boolean => value === "" || isImageSource(value),
      { error: "Avatar URL must be an http or https URL or a path starting with /." },
    ),
  coverUrl: z
    .string()
    .trim()
    .max(
      MAX_IMAGE_URL_LENGTH,
      `Cover URL must be at most ${MAX_IMAGE_URL_LENGTH} characters.`,
    )
    .refine(
      (value: string): boolean => value === "" || isImageSource(value),
      { error: "Cover URL must be an http or https URL or a path starting with /." },
    ),
});

export const getSettingsPage = query(
  async (): Promise<SettingsProfile | null> => {
    "use server";
    const user: SafeUser | null = await readSessionUser();
    if (user === null) {
      return null;
    }
    return {
      name: user.displayName ?? "",
      handle: user.username,
      email: user.email,
      bio: user.bio ?? "",
      website: user.website ?? "",
      avatarUrl: user.avatarUrl ?? "",
      coverUrl: user.coverUrl ?? "",
      joined: `Joined ${JOINED_FORMAT.format(user.createdAt)}`,
    };
  },
  "socialSettingsPage",
);

export const updateProfile = action(
  async (
    payload: URLSearchParams,
  ): Promise<CustomResponse<UpdateProfileResult>> => {
    "use server";
    const user: SafeUser | null = await readSessionUser();
    if (user === null) {
      return json<UpdateProfileResult>(
        { ok: false, error: "You need to be signed in to update your profile." },
        {},
      );
    }
    const parsed = updateProfileSchema.safeParse({
      displayName: payload.get("displayName") ?? "",
      bio: payload.get("bio") ?? "",
      website: payload.get("website") ?? "",
      avatarUrl: payload.get("avatarUrl") ?? "",
      coverUrl: payload.get("coverUrl") ?? "",
    });
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return json<UpdateProfileResult>(
        {
          ok: false,
          error: issue?.message ?? "Those profile details are not valid.",
        },
        {},
      );
    }
    const fields = parsed.data;
    await prisma.user.update({
      where: { id: user.id },
      data: {
        displayName: fields.displayName,
        bio: emptyToNull(fields.bio),
        website: emptyToNull(normalizeWebsite(fields.website)),
        avatarUrl: emptyToNull(fields.avatarUrl),
        coverUrl: emptyToNull(fields.coverUrl),
      },
    });
    return json<UpdateProfileResult>(
      { ok: true },
      {
        revalidate: [
          "socialSettingsPage",
          "socialProfilePage",
          "socialFeed",
          "socialBookmarks",
          "socialNotifications",
          "socialSuggestedProfiles",
        ],
      },
    );
  },
  "socialUpdateProfile",
);

export const getNotificationPreferences = query(
  async (): Promise<NotificationPreferences | null> => {
    "use server";
    const user: SafeUser | null = await readSessionUser();
    if (user === null) {
      return null;
    }
    return await readNotificationPreferences(user.id);
  },
  "socialNotificationPreferences",
);

export const updateNotificationPreferences = action(
  async (
    payload: URLSearchParams,
  ): Promise<CustomResponse<UpdateNotificationPreferencesResult>> => {
    "use server";
    const user: SafeUser | null = await readSessionUser();
    if (user === null) {
      return json<UpdateNotificationPreferencesResult>(
        {
          ok: false,
          error: "You need to be signed in to update notification settings.",
        },
        {},
      );
    }
    const preferences: NotificationPreferences = {
      likes: readCheckbox(payload, "likes"),
      replies: readCheckbox(payload, "replies"),
      follows: readCheckbox(payload, "follows"),
      reposts: readCheckbox(payload, "reposts"),
      mentions: readCheckbox(payload, "mentions"),
    };
    await prisma.notificationPreference.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        likes: preferences.likes,
        replies: preferences.replies,
        follows: preferences.follows,
        reposts: preferences.reposts,
        mentions: preferences.mentions,
      },
      update: {
        likes: preferences.likes,
        replies: preferences.replies,
        follows: preferences.follows,
        reposts: preferences.reposts,
        mentions: preferences.mentions,
      },
    });
    return json<UpdateNotificationPreferencesResult>(
      { ok: true },
      {
        revalidate: ["socialNotificationPreferences", "socialNotifications"],
      },
    );
  },
  "socialUpdateNotificationPreferences",
);
