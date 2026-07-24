# dvibd social — Feature Plan

## MVP (build first)

### I. User Profiles

| # | Feature | Description |
|---|---------|-------------|
| 1 | Profile page | `@username` route, avatar, display name, bio |
| 2 | Edit profile | Change avatar, cover photo, bio, display name |
| 3 | Post history | All posts authored by the user, paginated |

### II. Posts & Feed

| # | Feature | Description |
|---|---------|-------------|
| 4 | Home feed | Chronological posts from followed users |
| 5 | Create post | Text content |
| 6 | Delete post | Author can delete their own post |
| 7 | Post permalink | `/social/post/:id` for sharing |
| 8 | Feed refresh | Manual refresh button |

### III. Likes

| # | Feature | Description |
|---|---------|-------------|
| 9 | Like a post | Toggle heart on/off |
| 10 | Unlike a post | Remove like |
| 11 | Like count | Display count on each post |

### IV. Follow System

| # | Feature | Description |
|---|---------|-------------|
| 12 | Follow user | Button on profile/post card |
| 13 | Unfollow user | Toggle off, with confirmation |
| 14 | Follower count | Show on profile |
| 15 | Following count | Show on profile |

### V. Discovery

| # | Feature | Description |
|---|---------|-------------|
| 16 | Explore page | Trending/popular public posts |
| 17 | Search users | By username |

---

## Phase 2

### VI. Comments

| # | Feature | Description |
|---|---------|-------------|
| 18 | Comment on post | Beneath post detail |
| 19 | Reply to comment | Threaded replies (single level) |
| 20 | Like a comment | Toggle heart on comment |
| 21 | Delete comment | Author or post owner can delete |
| 22 | Comment count | Display count on post card in feed |

### VII. Reposts

| # | Feature | Description |
|---|---------|-------------|
| 23 | Repost | Share another user's post to own followers |
| 24 | Undo repost | Remove repost |
| 25 | Repost count | Display count on post card |
| 26 | Quote repost | Repost with added commentary |

### VIII. Communities

| # | Feature | Description |
|---|---------|-------------|
| 27 | Create community | Name, description, rules, avatar |
| 28 | Join community | Become a member |
| 29 | Leave community | Remove membership |
| 30 | Community feed | Posts from community members |
| 31 | Post to community | Cross-post or community-only post |
| 32 | Community roles | Owner, moderator, member |
| 33 | Pin community posts | Moderators can pin posts |
| 34 | Community member list | Members page with role badges |

### IX. Hashtags

| # | Feature | Description |
|---|---------|-------------|
| 35 | Create hashtag | Implicit — `#word` in post becomes tag |
| 36 | Hashtag page | `/social/tag/:tag` — all posts with that tag |
| 37 | Trending hashtags | Most-used tags in last 24h/7d |

---

## Phase 3

### X. Notifications

| # | Feature | Description |
|---|---------|-------------|
| 38 | Like notification | Notify when someone likes your post |
| 39 | Follow notification | Notify when someone follows you |
| 40 | Comment notification | Notify on comment or reply |
| 41 | Repost notification | Notify when reposted |
| 42 | Notification bell | NavBar icon with unread count |
| 43 | Notification page | Chronological list with read/unread state |
| 44 | Mark as read | Individual or bulk |

### XI. Privacy & Moderation

| # | Feature | Description |
|---|---------|-------------|
| 45 | Block user | Prevent them from seeing/interacting with you |
| 46 | Unblock user | Reverse block |
| 47 | Mute user | Hide their posts without unfollowing |
| 48 | Report post | Flag inappropriate content |
| 49 | Report user | Flag inappropriate behavior |

### XII. Bookmarks

| # | Feature | Description |
|---|---------|-------------|
| 50 | Bookmark post | Save for later, private to user |
| 51 | Remove bookmark | Unsave |
| 52 | Bookmarks page | Chronological list of saved posts |

### XIII. Rich Content

| # | Feature | Description |
|---|---------|-------------|
| 53 | Image uploads | Attach images to posts |
| 54 | Link previews | Auto-unfurl URLs in post content |
| 55 | Mentions | `@username` in post content, creates notification |
| 56 | Polls | Create poll posts with options and duration |

### XIV. Discover More

| # | Feature | Description |
|---|---------|-------------|
| 57 | Search posts | Full-text search on post content |
| 58 | Suggested users | "Who to follow" based on network |
