# dvibd social — Feature Plan

## MVP (build first)

### 0. Shell & UI Foundation

| #  | Feature                         | Description                                                                 | Progress      |
|----|---------------------------------|-----------------------------------------------------------------------------|---------------|
| 1  | Social layout shell            | 3-column CSS grid (nav, feed, right panel); sticky sidebar and panel       | completed     |
| 2  | Navigation sidebar              | Icon links: home, explore, communities, notifications, bookmarks, profile  | completed     |
| 3  | Right panel                     | Trending topics, suggested people, suggested communities, search bar, legal | completed     |
| 4  | Glass design system             | Glassmorphism cards with backdrop-filter blur, semi-transparent backgrounds | completed     |
| 5  | Feed header                     | Sticky tabs bar (Discover/Following) with corner-radius removal when stuck | completed     |
| 6  | Hero section                    | Welcome CTA for logged-out users (create account / sign in)                 | completed     |
| 7  | Auth conditional UI             | Nav hidden when logged out; hero shown when logged out; tabs when logged in | completed     |
| 8  | Favicon management              | Dynamic favicon swap to social.ico on /social routes                        | completed     |
| 9  | SVG icon library                | Custom 24×24 stroke icons for all social actions and navigation             | completed     |
| 10 | Fallback data                   | Mock statuses and notifications for UI development and testing              | completed     |

### I. User Profiles

| #  | Feature        | Description                                   | Progress     |
|----|----------------|-----------------------------------------------|--------------|
| 11 | Profile page   | `@username` route, avatar, display name, bio | not started  |
| 12 | Edit profile   | Change avatar, cover photo, bio, display name | not started  |
| 13 | Post history   | All posts authored by the user, paginated    | not started  |

### II. Posts & Feed

| #  | Feature         | Description                              | Progress     |
|----|-----------------|------------------------------------------|--------------|
| 14 | Home feed       | Chronological posts, sticky tabs, glass cards | completed    |
| 15 | Create post     | Text content                             | not started  |
| 16 | Delete post     | Author can delete their own post        | not started  |
| 17 | Post permalink  | `/social/post/:id` for sharing         | not started  |
| 18 | Feed refresh    | Manual refresh button                   | not started  |

### III. Likes

| #  | Feature        | Description              | Progress     |
|----|----------------|--------------------------|--------------|
| 19 | Like a post    | Toggle heart on/off      | in progress  |
| 20 | Unlike a post  | Remove like              | in progress  |
| 21 | Like count     | Display count on each post | completed    |

### IV. Follow System

| #  | Feature          | Description                         | Progress     |
|----|------------------|-------------------------------------|--------------|
| 22 | Follow user      | Button on profile / post card       | in progress  |
| 23 | Unfollow user    | Toggle off, with confirmation       | not started  |
| 24 | Follower count   | Show on profile                     | not started  |
| 25 | Following count  | Show on profile                     | not started  |

### V. Discovery

| #  | Feature        | Description                     | Progress     |
|----|----------------|---------------------------------|--------------|
| 26 | Explore page   | Trending / popular public posts | in progress  |
| 27 | Search users   | By username                     | in progress  |

---

## Phase 2

### VI. Comments

| #  | Feature           | Description                          | Progress     |
|----|-------------------|--------------------------------------|--------------|
| 28 | Comment on post   | Beneath post detail                  | not started  |
| 29 | Reply to comment  | Threaded replies (single level)      | not started  |
| 30 | Like a comment    | Toggle heart on comment             | not started  |
| 31 | Delete comment    | Author or post owner can delete     | not started  |
| 32 | Comment count     | Display count on post card in feed   | completed    |

### VII. Reposts

| #  | Feature          | Description                               | Progress     |
|----|------------------|-------------------------------------------|--------------|
| 33 | Repost           | Share another user's post to own followers | in progress  |
| 34 | Undo repost      | Remove repost                             | not started  |
| 35 | Repost count     | Display count on post card                | completed    |
| 36 | Quote repost     | Repost with added commentary              | not started  |

### VIII. Communities

| #  | Feature              | Description                         | Progress     |
|----|----------------------|-------------------------------------|--------------|
| 37 | Create community     | Name, description, rules, avatar    | not started  |
| 38 | Join community       | Become a member                     | not started  |
| 39 | Leave community      | Remove membership                   | not started  |
| 40 | Community feed       | Posts from community members        | not started  |
| 41 | Post to community    | Cross-post or community-only post   | not started  |
| 42 | Community roles      | Owner, moderator, member            | not started  |
| 43 | Pin community posts  | Moderators can pin posts            | not started  |
| 44 | Community member list | Members page with role badges      | not started  |

### IX. Hashtags

| #  | Feature            | Description                                  | Progress     |
|----|--------------------|----------------------------------------------|--------------|
| 45 | Create hashtag     | Implicit — `#word` in post becomes tag      | not started  |
| 46 | Hashtag page       | `/social/tag/:tag` — all posts with that tag | not started  |
| 47 | Trending hashtags  | Most-used tags in last 24h / 7d             | not started  |

---

## Phase 3

### X. Notifications

| #  | Feature              | Description                                     | Progress     |
|----|----------------------|-------------------------------------------------|--------------|
| 48 | Like notification    | Notify when someone likes your post             | in progress  |
| 49 | Follow notification  | Notify when someone follows you                 | in progress  |
| 50 | Comment notification | Notify on comment or reply                      | in progress  |
| 51 | Repost notification  | Notify when reposted                            | in progress  |
| 52 | Notification bell    | Nav icon with unread count                      | in progress  |
| 53 | Notification page    | Chronological list with All / Mentions tabs, settings link, sticky header | completed    |
| 54 | Mark as read         | Individual or bulk                              | not started  |

### XI. Privacy & Moderation

| #  | Feature        | Description                                    | Progress     |
|----|----------------|------------------------------------------------|--------------|
| 55 | Block user     | Prevent them from seeing / interacting with you | not started  |
| 56 | Unblock user   | Reverse block                                   | not started  |
| 57 | Mute user      | Hide their posts without unfollowing            | not started  |
| 58 | Report post    | Flag inappropriate content                      | not started  |
| 59 | Report user    | Flag inappropriate behavior                     | not started  |

### XII. Bookmarks

| #  | Feature          | Description                         | Progress     |
|----|------------------|-------------------------------------|--------------|
| 60 | Bookmark post    | Save for later, private to user     | not started  |
| 61 | Remove bookmark  | Unsave                              | not started  |
| 62 | Bookmarks page   | Chronological list of saved posts   | not started  |

### XIII. Rich Content

| #  | Feature         | Description                                      | Progress     |
|----|-----------------|--------------------------------------------------|--------------|
| 63 | Image uploads   | Attach images to posts                           | not started  |
| 64 | Link previews   | Auto-unfurl URLs in post content                 | not started  |
| 65 | Mentions        | `@username` in post content, creates notification | not started  |
| 66 | Polls           | Create poll posts with options and duration      | not started  |

### XIV. Explore

| #  | Feature                | Description                                     | Progress     |
|----|------------------------|-------------------------------------------------|--------------|
| 67 | Explore page           | `/social/explore` — trending & popular content   | in progress  |
| 68 | Explore layout          | Masonry/grid of popular posts, trending sidebar  | in progress  |
| 69 | Explore tabs            | For You / Trending / Topics switching            | not started  |
| 70 | "For You" feed          | Personalized post recommendations based on interests | not started  |
| 71 | Trending posts          | Most-liked and most-reposted posts in 24h        | not started  |
| 72 | Topic browsing          | Browse posts by topic / category                 | not started  |
| 73 | Suggested users         | "Who to follow" based on network and interests   | not started  |
| 74 | Suggested communities   | Communities you might like to join               | not started  |
| 75 | Media explore           | Grid of image and rich-media posts               | not started  |
| 76 | Search posts            | Full-text search on post content                 | not started  |
| 77 | Search users            | By username, display name, or bio                | not started  |
| 78 | Search communities      | By community name or description                 | not started  |
| 79 | Search filters          | Filter by date, media, popularity                | not started  |

---

## Progress Summary

| Status       | Count |
|--------------|-------|
| completed    | 16    |
| in progress  | 14    |
| not started  | 49    |
| **Total**    | **79** |
