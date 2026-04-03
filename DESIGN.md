# Design System: High-End Editorial Fintech

## 1. Overview & Creative North Star

### The Creative North Star: "The Financial Architect"
Most fintech apps feel like calculators—utilitarian and rigid. This design system treats personal finance as an editorial experience. We aim for the "Financial Architect" aesthetic: a space that feels authoritative yet breathable, structured yet fluid. 

We move beyond the "template" look by leveraging **intentional asymmetry** and **tonal depth**. Instead of boxing everything into a grid, we use expansive whitespace and high-contrast typography to guide the eye. This isn't just about managing money; it's about providing a premium, curated view of one’s financial life.

---

## 2. Colors & Surface Philosophy

Our palette is anchored by a deep, authoritative blue and supported by a sophisticated range of architectural grays.

### The "No-Line" Rule
**Designers are prohibited from using 1px solid borders for sectioning.** 
Traditional borders create visual clutter. Boundaries must be defined solely through:
1.  **Background Color Shifts:** A `surface-container-low` section sitting on a `surface` background.
2.  **Tonal Transitions:** Using subtle variations in gray to imply a change in context.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the `surface-container` tiers (Lowest to Highest) to create depth:
*   **Background (`#f7f9fb`):** The canvas.
*   **Surface-Container-Low (`#f2f4f6`):** Secondary grouped content.
*   **Surface-Container-Lowest (`#ffffff`):** High-priority cards or interactive elements. Placing a Lowest-tier card on a Low-tier background creates a natural, soft lift without a drop shadow.

### The "Glass & Signature Texture" Rule
To elevate the experience:
*   **Glassmorphism:** Use for floating navigation or overlay modals. Combine `surface` colors at 80% opacity with a `20px` backdrop-blur.
*   **Signature Gradients:** For primary CTAs and hero data visualizations, use a subtle linear gradient from `primary` (#0050cb) to `primary_container` (#0066ff). This adds a "soul" to the UI that flat hex codes lack.

---

## 3. Typography: Editorial Authority

We use **Inter** for its neutral, high-legibility architecture. The hierarchy is designed to feel like a high-end financial broadsheet.

*   **Display (Display-LG to SM):** Massive, confident values. Used for total account balances. Negative letter spacing (-2%) adds a custom, premium feel.
*   **Headlines (Headline-LG to SM):** Used for section titles. These should have generous top margins to enforce the "breathing room" philosophy.
*   **Body (Body-LG to MD):** Reserved for transaction details and descriptions.
*   **Labels (Label-MD to SM):** All-caps with increased letter spacing (+5%) for metadata and overline text to distinguish from body copy.

The contrast between a `display-lg` balance and a `label-sm` timestamp creates the "high-end editorial" tension required for a signature brand.

---

## 4. Elevation & Depth

### The Layering Principle
Depth is achieved through "Tonal Layering." By stacking `surface-container-lowest` on `surface-container-high`, we create hierarchy through value rather than structure.

### Ambient Shadows
Shadows must be "atmospheric." 
*   **Values:** Use large blur radii (24px - 40px) with low opacity (4%-8%).
*   **Tinting:** Never use pure black. Tint shadows with the `on-surface` color (`#191c1e`) to mimic natural light dispersion.

### The "Ghost Border" Fallback
If a container requires a boundary for accessibility (e.g., in a high-density data table), use a **Ghost Border**: the `outline-variant` token at **15% opacity**. 100% opaque borders are strictly forbidden.

---

## 5. Components

### Buttons
*   **Primary:** `primary` background with `on-primary` text. No border. Radius: `md` (0.75rem).
*   **Secondary:** `surface-container-highest` background. Soft and tactile.
*   **Tertiary:** No background. Text-only with `primary` color. Use for low-emphasis actions.

### Cards & Lists
*   **The Divider Ban:** Do not use line dividers between list items. Use vertical whitespace (16px - 24px) or a 1-step shift in `surface-container` tokens to separate entries.
*   **Nesting:** High-priority cards (like a "Budget Remaining" card) should use `surface-container-lowest` (#ffffff) with an atmospheric shadow.

### Input Fields
*   **Styling:** Use `surface-container-low` for the input track. On focus, transition the background to `surface-container-lowest` and apply a `primary` Ghost Border.
*   **Rounding:** Strictly `DEFAULT` (0.5rem) to maintain a professional, architectural feel.

### Specialized Fintech Components
*   **Balance Indicators:** Use `tertiary` (#006645) for positive growth and `error` (#ba1a1a) for over-budget alerts. These should be paired with subtle "micro-containers" (low-opacity backgrounds of the same color) to highlight the status.
*   **Trend Sparklines:** Minimalist lines without axes, using `primary` for neutral and `tertiary` for positive trends.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use extreme whitespace. If a layout feels "finished," add 20% more padding.
*   **Do** use asymmetrical layouts (e.g., a left-aligned headline with right-aligned data metrics) to break the "Bootstrap" feel.
*   **Do** prioritize typography scale over color for hierarchy.
*   **Do** use `surface-tint` sparingly to highlight active states.

### Don’t
*   **Don't** use 1px solid dividers or high-contrast borders.
*   **Don't** use standard "drop shadows" (e.g., 0px 2px 4px black).
*   **Don't** crowd components. Each financial metric needs its own "gallery space."
*   **Don't** use generic iconography. Use thin-stroke (1.5px) custom icons that match the Inter typeface weight.

---

## 7. Token Summary

| Category | Token | Value | Application |
| :--- | :--- | :--- | :--- |
| **Primary** | `primary` | `#0050cb` | Main CTAs, active states |
| **Surface** | `surface` | `#f7f9fb` | Main app background |
| **Nesting** | `surface-container-lowest` | `#ffffff` | High-priority card background |
| **Alert** | `error` | `#ba1a1a` | Over-budget alerts |
| **Success** | `tertiary` | `#006645` | Positive balances |
| **Rounding** | `md` | `0.75rem` | Standard component radius |
| **Type** | `display-lg` | `3.5rem` | Hero balance figures |