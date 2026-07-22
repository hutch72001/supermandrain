# V15-Final-A1-05 UI Audit Report

## Scope
Homepage CTA visibility and the three areas marked in the supplied screenshots.

## Root cause
A global anchor reset used `a:visited { color: inherit !important; }` through a combined selector. Because the visited-state selector had greater specificity than the button class, already-visited CTA links inherited the surrounding section color.

This produced:
- white text on the white secondary CTA in the hero;
- dark text on the dark drain-service CTA;
- white text on the white equipment CTA.

The boxes were not empty placeholders. Their text was present in HTML but visually hidden by the CSS cascade.

## Fix
- Removed `!important` from the global anchor color and text-decoration reset.
- Added explicit colors for every link state of primary, secondary, split-card, and equipment CTA buttons.
- Updated CSS cache version from `v15-final-a1-04` to `v15-final-a1-05`.

## Structural Lock
No menu, URL, folder, page, layout, body copy, image, or video changes were made.

## Validation
- 167 HTML files parsed.
- CSS reference cache version updated on all pages that load `site-v71.css`.
- Hero secondary CTA text rule confirmed.
- Drain-service CTA text rule confirmed.
- Equipment CTA text rule confirmed.
