# Social App Notes

## Home page layout
The home page is composed of 3 vertical divisions:

- **Left division**: `nav#sideNav`, referred to as the side nav. A compact fit-content navigation sidebar containing only icons (plus the user's profile picture) that redirect the user when clicked.
- **Center division**: `main#feed`, referred to as the feed. Shows stat and article overviews:
  - Stat: a microblog of no more than 256 characters.
  - Article: longer writing with a title, headings and text.
- **Right division**: `aside#explore`, referred to as Explore. Contains a search bar and the sections trending, users, community and legal.

The divisions sit in `div#homeLayout`, laid out as a grid of fit-content, the feed, and the Explore rail.

## Left nav icon set
Icons (no messages, dvibd has a separate Message app): Home, Explore, Notifications, Bookmarks, Profile, Settings. The sidebar also contains the user's profile picture. Placeholder pages for each icon's route live under `routes/(pages)/(home)/`.
