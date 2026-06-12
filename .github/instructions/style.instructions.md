---
description: "Use when creating or changing Angular templates with Tailwind CSS and DaisyUI. Enforces consistent class usage, responsive layout patterns, semantic structure, and maintainable utility composition in template HTML files."
applyTo: "src/app/**/*.html"
---
# Angular Template Conventions for Tailwind CSS and DaisyUI

These rules apply to Angular template files in `src/app`.

## Component-First Styling

- Prefer DaisyUI component classes first (for example button, card, input, modal, alert) and then add Tailwind utilities only for layout and spacing adjustments.
- Do not rebuild an existing DaisyUI component purely with utility classes if an equivalent DaisyUI pattern already exists.
- Keep variant selection explicit and stable. Pick one DaisyUI variant and avoid stacking multiple conflicting variants on the same element.

## Utility Class Composition

- Keep class lists readable and predictable. Group classes in this order:
  1. Layout and positioning
  2. Sizing and spacing
  3. Typography
  4. Visual styles (color, border, shadow, background)
  5. State and interaction modifiers
- Prefer reusable wrapper elements over extremely long class strings on a single node.
- Avoid unnecessary arbitrary values unless there is no token or utility that can express the requirement.

## Responsive Behavior

- Build mobile-first and scale up with breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`).
- Do not use breakpoint classes that only optimize desktop while breaking mobile readability or interaction.
- For responsive grids and flex layouts, ensure each breakpoint has a clear reason and avoid contradictory combinations.

## Angular Template Practices

- Keep templates declarative. Put complex decision logic in the component class, not in long inline expressions.
- Prefer modern Angular template control flow syntax when updating existing template logic.
- Use class binding for conditional styling when state changes are meaningful; avoid duplicated markup blocks that only differ by class names.

## Semantic HTML Guardrails

- Use semantic elements first (`button`, `nav`, `main`, `section`, `form`, `label`) before adding role attributes.
- Use links for navigation and buttons for actions. Do not mix behavior semantics.
- Preserve heading hierarchy and form-label relationships when applying Tailwind and DaisyUI classes.

## Review Checklist

- DaisyUI component usage is intentional and not duplicated by raw utility-only patterns.
- Tailwind utility classes are grouped and readable.
- Mobile and tablet behavior is verified at minimum (`base`, `md`, `lg`).
- Conditional classes and Angular bindings remain maintainable.
- Semantics remain correct after styling changes.