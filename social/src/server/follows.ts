import { action, json, type CustomResponse } from "@solidjs/router";
import type { FollowResult } from "../types/social";
import { prisma } from "./db";
import { readSessionUser } from "./session";
import type { SafeUser } from "./user";

export const setFollow = action(
  async (payload: URLSearchParams): Promise<CustomResponse<FollowResult>> => {
    "use server";
    const viewer: SafeUser | null = await readSessionUser();
    if (viewer === null) {
      return json<FollowResult>(
        { ok: false, error: "You need to be signed in to follow people." },
        {},
      );
    }
    const handle: string = (payload.get("handle") ?? "")
      .trim()
      .replace(/^@/, "");
    if (handle === "") {
      return json<FollowResult>(
        { ok: false, error: "A profile handle is required." },
        {},
      );
    }
    const intent: string = payload.get("intent") ?? "";
    if (intent !== "follow" && intent !== "unfollow") {
      return json<FollowResult>(
        { ok: false, error: "That follow action is not supported." },
        {},
      );
    }
    const target: { id: string } | null = await prisma.user.findFirst({
      where: { username: { equals: handle, mode: "insensitive" } },
      select: { id: true },
    });
    if (target === null) {
      return json<FollowResult>(
        { ok: false, error: "That account could not be found." },
        {},
      );
    }
    if (target.id === viewer.id) {
      return json<FollowResult>(
        { ok: false, error: "You cannot follow yourself." },
        {},
      );
    }
    if (intent === "follow") {
      await prisma.follow.createMany({
        data: [{ followerId: viewer.id, followeeId: target.id }],
        skipDuplicates: true,
      });
    } else {
      await prisma.follow.deleteMany({
        where: { followerId: viewer.id, followeeId: target.id },
      });
    }
    return json<FollowResult>(
      { ok: true, following: intent === "follow" },
      {
        revalidate: [
          "socialProfilePage",
          "socialFeed",
          "socialSuggestedProfiles",
        ],
      },
    );
  },
  "socialSetFollow",
);
