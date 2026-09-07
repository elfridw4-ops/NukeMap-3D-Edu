---
applyTo: "**/*.{ts,tsx,js,jsx,css,md}"
description: "Use when creating or modifying visual interfaces, components, cards, modals, dashboards, landing pages, forms, or design systems. Enforces coherent, purposeful, accessible UI instead of generic AI-generated design."
---

# UI Design System and Interface Quality

## Purpose

Use this instruction when creating or modifying visual interfaces, components, cards, modals, dashboards, landing pages, forms, or design systems.

Enforce coherent, purposeful, accessible UI instead of generic AI-generated design.

Act as a senior product designer and frontend engineer.

---

## Design system rules

Before creating UI:

- inspect the existing design system
- reuse existing colors, typography, spacing, radius, shadows, icons, components, and tokens
- inspect existing components before creating duplicates

Never invent a new visual language when an established design system exists.

Every visual element must have a purpose.

---

## Avoid generic AI-generated UI patterns

Avoid:

- unnecessary gradients
- excessive glassmorphism
- excessive shadows
- decorative blobs
- neon effects
- excessive rounded cards
- arbitrary colors
- excessive badges
- excessive borders
- animations without UX purpose

These patterns are not acceptable unless they are clearly justified by the product’s design system and user needs.

---

## Priority order

Prioritize in this order:

1. hierarchy
2. readability
3. usability
4. consistency
5. accessibility
6. performance
7. aesthetics

Aesthetic improvements are secondary to clarity and usability.

---

## Cards and layout

- Do not put every piece of information into a card.
- Avoid nested cards and unnecessary borders.
- Prefer clear grouping, spacing, and hierarchy over decorative containers.
- If a card does not add structure or meaning, do not create it.

---

## Buttons

- Use semantic <button> or <a>, never clickable <div>.
- The primary action must be visually clear.
- Do not create multiple competing primary CTAs.
- Keep button states explicit and understandable.

---

## Forms

- Labels must be explicit.
- Do not rely on placeholders as labels.
- Errors must appear close to the affected field.
- Loading and success states must be visible.
- Keep validation clear and actionable.

---

## Modals

- Use modals for decisions requiring focus.
- Destructive actions require clear confirmation.
- Do not hide critical information behind unnecessary modals.
- Avoid modal use when a simpler inline pattern would be better.

---

## Accessibility requirements

The interface must be genuinely accessible, not merely decorated with accessibility hints.

Requirements:

- semantic HTML
- keyboard navigation
- visible focus
- correct ARIA attributes
- meaningful alt text
- sufficient contrast
- screen-reader-friendly labels
- respect prefers-reduced-motion

Do not use accessibility as decoration. It must work.

---

## Responsive requirements

- Design mobile-first where appropriate.
- Prevent horizontal overflow.
- Do not sacrifice usability on small screens.
- Touch targets should be comfortably tappable.
- Do not modify desktop behavior when performing a mobile-only optimization unless explicitly requested.

Responsive design must preserve usability across screen sizes.

---

## Final UI validation checklist

Before finalizing a UI change, check:

- empty state
- loading state
- error state
- success state
- disabled state
- mobile layout
- keyboard interaction
- long text
- missing images
- large datasets

If the interface does not handle these states clearly, the work is not ready.

---

## Operating principles

1. Reuse and extend the existing system before introducing new patterns.
2. Favor clarity, hierarchy, and purpose over decoration.
3. Make interaction states visible and understandable.
4. Keep the interface accessible and keyboard-friendly.
5. Maintain responsiveness without degrading desktop behavior unless explicitly requested.
6. Prefer durable design decisions over trendy but generic UI effects.

---

## Example prompts

- Build this component using the existing design system and keep it consistent with the project’s styling.
- Redesign this form with clear labels, visible validation, and accessible interactions.
- Improve the card layout without introducing visual clutter or duplicate patterns.
- Refine this modal so the destructive action is clearer and accessible.
