---
applyTo: "**/*.{ts,tsx,js,jsx,css,md}"
description: "Use when optimizing or creating responsive mobile experiences. Focuses on mobile usability while preserving validated desktop behavior unless desktop changes are explicitly requested."
---

# Mobile Responsive Optimization

## Purpose

Use this instruction when optimizing or creating responsive mobile experiences.

Focus on mobile usability while preserving validated desktop behavior unless desktop changes are explicitly requested.

Optimize mobile deliberately, not by simply shrinking desktop.

---

## Required analysis before modifying a component

Before changing a component, inspect:

- width constraints
- spacing
- borders
- shadows
- nested surfaces
- typography
- touch targets
- overflow
- tables
- forms
- navigation
- fixed/sticky elements

Do not assume the desktop layout is already mobile-safe.

---

## Mobile rules

- Avoid unnecessary horizontal scrolling.
- Prevent clipped content.
- Ensure controls are comfortably tappable.
- Keep important actions reachable.
- Reduce excessive padding and margins when they waste screen space.
- Adapt dense tables into an appropriate mobile representation when necessary.
- Keep forms easy to complete with one hand.
- Use mobile navigation patterns appropriate to the application.

Do not blindly duplicate desktop layouts on mobile.

---

## Visual density rules

If a component uses border + shadow + rounded surface + background simultaneously without responsive justification, simplify the mobile treatment according to the project's design system.

Avoid nested bordered cards.

Prioritize clean mobile surfaces and readable spacing without stacking visual separators unnecessarily.

---

## Desktop protection

When the task is explicitly mobile-only:

- do not alter desktop widths
- do not alter desktop behavior
- do not change desktop components unnecessarily
- verify that desktop remains unchanged

Desktop must remain validated unless the user explicitly requests desktop changes.

---

## Mobile menu rules

- minimum comfortable touch target
- Escape closes where keyboard interaction exists
- click outside may close where appropriate
- preserve access to page content
- use proper focus management
- do not trap the user

The menu must remain usable, understandable, and accessible on mobile.

---

## Responsive coverage

Always consider:

- 375px-class phones
- larger phones
- tablets
- desktop

Do not claim responsive compatibility without checking the affected layouts.

---

## Operating principles

1. Prefer mobile-first usability over desktop fidelity when the task is mobile-focused.
2. Preserve known-good desktop behavior unless the user explicitly requests otherwise.
3. Treat layout issues as functional issues when they create clipping, overflow, or unusable interaction.
4. Validate the changed surface across the relevant viewports before claiming success.
5. If the mobile design is not clearly justified by the project design system, simplify it rather than stacking visual treatments.

---

## Example prompts

- Optimize this screen for mobile without changing the desktop layout.
- Improve the mobile experience for this form and ensure no desktop regression.
- Simplify this card layout on narrow screens and keep the desktop version unchanged.
- Review the mobile navigation behavior and fix touch, focus, and dismissal issues.
