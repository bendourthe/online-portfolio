# Main-Page Readability Audit

## Scope and Coverage

- Scope: the current local main page, its seven Skills tabs, `index.html`, `css/style_modern.css`, `css/site_theme_tokens.css`, and `js/script.js`.
- Mode: full, cap 20 headline findings. Five findings are reported.
- Mutating: the audit is read-only. The separately requested Portfolio subtitle correction changes colored domain emphasis to bold text inheriting the surrounding color. No broader typography, contrast, or motion fixes were applied.
- Source baseline: `9af48f5`, plus the approved Portfolio emphasis correction.
- Browser: installed Chromium, CSS viewport widths 320, 390, 768, 1440, 2560, and 3840, in light and dark themes. Seven active Skills tabs produce 84 inspected states.

| Domain | Delegate | Coverage |
| --- | --- | --- |
| Accessibility | accessibility-engineering | Visible text, contrast requirements, 320 px reflow, reduced motion, sampled text alternatives and heading structure |
| Layout | layout-and-spacing | Phone stacking, text and control overflow, spacing, and large-monitor content width |
| Copy | interface-copy | Names and consistency in navigation, project filters, product cards, and section introductions |
| Typography | web-typography | Computed sizes, weight, tracking, body hierarchy, font loading, and line measure |
| Color | color-systems | Computed foreground/background and opacity composition on flat surfaces; image/gradient-backed pairs excluded from the general inventory |
| Polish | hallmark-design | Actual phone and wide-screen screenshots; existing palette, typefaces, and component roles retained |

## Findings

| ID | Severity | Domain | Location | Current | Required or Recommended |
| --- | --- | --- | --- | --- | --- |
| R1 | major | Typography | `css/style_modern.css`: `body`, `.card-text`, `.skills-tab small`, `.skills-step-button small`, `.skills-workflow-outcome` | Body defaults to 14 px with 1 px letter spacing. Portfolio descriptions resolve to 13 px. Skills descriptors are 11 px and navigation/workflow captions reach 10 px. The same small sizes persist on wide monitors. | Introduce shared type roles. Recommend 16-18 px for reading copy, about 14 px for secondary descriptions and meaningful controls, and 12-14 px for nonessential metadata. Use normal tracking for body paragraphs. Preserve the intentional 24 px lead and 20 px Nexus introduction roles. Owner: web-typography. |
| R2 | blocker | Color | `css/style_modern.css`: `.stats-subtext`, `.statsSection.section .col-md-12.text-center > h2 + p`, `.skills-tab small`, `.skills-step-button small`, `.nexus-lede` | Several normal-sized light-theme text pairs fall below 4.5:1 because of translucent text and, in Career cards, the card surface. See measured pairs below. | Restore sufficient foreground contrast on the actual surface. Full opacity alone is not sufficient for the Career card descriptions; their surface or foreground also needs adjustment. Owners: color-systems and accessibility-engineering. |
| R3 | major | Accessibility | `js/script.js`: Typed/Superslides initialization and the constellation `loop()` | The background canvas keeps changing when reduced motion is requested; no pause control is exposed. Hero typing and slideshow source initialization also lack a reduced-motion branch. | Respect reduced-motion preferences and give users control over retained automatic movement or changing text. Owner: accessibility-engineering. |
| R4 | major | Accessibility | `index.html`: `.slides-navigation a` and `.aboutImage` | The accessibility snapshot exposes two unnamed hero links. The portrait has no `alt` attribute. | Name the slide controls and provide an intentional text alternative for the portrait, such as the person's name, or an empty alternative if it is deliberately decorative. Owner: accessibility-engineering. |
| R5 | advisory | Accessibility | `index.html`: `.titleMessage .main` and `#about .section-title` | The page has no `h1`, and About is an `h4` while the other top-level sections use `h2`. Visual sizes hide the inconsistent outline. | Use a coherent heading outline while preserving the intended visual sizes in CSS. Owner: accessibility-engineering. |

## Font Measurements

| Role | Current Rendered Size |
| --- | --- |
| Skills Previous/Next captions and workflow outcomes | 10 px |
| Skills tab descriptions and navigation label | 11 px |
| Skills counters | 12 px |
| Portfolio card descriptions | 13 px |
| About paragraphs and Nexus feature-list descriptions | 14 px |
| Career card descriptions | 15 px |
| Nexus lead paragraphs | 17 px |
| Nexus two-column introduction | 20 px |
| Nexus lead sentence | 24 px |

The recommended sizes are product readability targets. WCAG's measurable requirements here concern contrast, enlargement, and reflow. Current 10-13 px text can be technically visible while still being an uncomfortable reading target on a compact phone or a monitor viewed from farther away.

At 2560 and 3840 CSS pixels, Bootstrap's main content container remains 1140 px wide. A bounded reading width is useful; simply stretching paragraphs across the monitor would make line tracking worse. Increase the reading scale before widening text columns. Physical monitor size, operating-system scaling, viewing distance, and other browser engines were not tested.

## Light-Theme Contrast Measurements

Normal-sized text requires at least 4.5:1. Large text has a 3:1 exception. These are rendered CSS color/opacity calculations rather than anti-aliased screenshot-pixel samples. See the [W3C contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

| Text | Current Ratio | Full Text Opacity Probe |
| --- | --- | --- |
| Career card descriptions, 15 px | 3.48:1 | 4.35:1, still below 4.5:1 |
| Career section introduction, 20 px regular | 4.20:1 | 5.06:1 |
| Skills tab descriptions, 11 px | About 3.93-4.19:1 depending on state/surface | 11.35:1 in the focused probe |
| Enabled Skills Previous caption, 10 px | 3.76:1 | 11.35:1 |
| Nexus lead paragraphs, 17 px | 4.09:1 | 4.52:1 |

The opacity probes were temporary browser changes, restored immediately. No corresponding source fixes were applied. Disabled Previous/Next states have intentionally lower contrast and were not counted as contrast failures.

## Considered but Rejected

| Candidate | Reason |
| --- | --- |
| Different fonts for headings and body | The existing Roboto/Open Sans pairing is deliberate and limited to two families. A shared size scale is more useful than replacing the typefaces. |
| Blue/cyan selected filter buttons | They express interaction state, and the existing filter checks measured at least 5.06:1 text contrast. They do not need to match plain bold prose. |
| Centered section titles and the two-product layout | These fit the existing portfolio and comparison structure. No reading task was blocked by their alignment. |
| Fixed 1140 px desktop container alone | It limits reading measure and is not a reflow failure. The more important issue is the small text inside it. |
| Low contrast on disabled Skills navigation | Inactive controls are exempt from the normal text contrast requirement. Enabled captions were tested separately. |
| Screen-reader-only clipped labels | Their 1 px boxes are intentional accessible text, not clipped visible body copy. |
| Universal color changes | The measured misses are specific opacity/surface combinations. The existing palette can be retained. |

## Verification

- The requested Portfolio emphasis correction passed at 390 and 1440 px in both themes: all six domains remain bold and inherit the subtitle color.
- The static build resolves all local references.
- All 84 viewport/theme/Skills-tab states had no document-level horizontal overflow.
- Computed font sizes, line height, tracking, visible text, and flat-surface contrast were inventoried across the page.
- The reduced-motion probe confirmed the media preference was active while the constellation canvas continued changing.
- An accessibility snapshot confirmed that the hero's two slide links have no accessible names; source inspection confirmed the missing portrait alternative and heading outline.
- Existing Portfolio filter keyboard, hit-area, contrast, and category checks remain evidence for the unchanged filter implementation.
- Native 200% browser zoom is not verified: headless Ctrl+Equal did not change device-pixel-ratio or viewport metrics and was not accepted as zoom evidence. [W3C resize-text guidance](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) requires usable enlargement to 200%; the [reflow guidance](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) specifies 320 CSS pixels for vertically scrolling content.
- Text baked into overview images, image-backed hero contrast, physical phones/monitors, other browser engines, and a full screen-reader walkthrough were not verified.
- No Stylelint task is configured in this buildless repository. No new linter dependency or pipeline was introduced for this read-only review.

## Verdict

The current page reflows well and the corrected Portfolio emphasis is consistent, but it does not yet meet a consistently comfortable reading target across compact phones and large screens. Prioritize the small reading scale and confirmed light-theme contrast misses, then reduced-motion and semantic accessibility fixes. Keep the existing palette and overall layout. A final qualification pass should include real browser zoom and representative physical devices after the approved changes are implemented.
