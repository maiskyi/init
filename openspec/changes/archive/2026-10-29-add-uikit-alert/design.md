# Design

## Context

- Figma source: Components file `cFBTCE662HYRChalLq4p3B`, frame "Info
  Section" (`3430:10040`), symbols `Type=Alert|Success|Error|Announcement|
  Information`. Each is a 470×64 frame: 12px padding, a 16×20 icon box
  (16px icon, top-aligned to the 20px first line), 10px gap, Open Sans
  14/20 text, radius 6. Only `Information` shows a trailing `Icons / arrow
  right` (16px, 8px after the text, vertically centered). Every variant
  also contains a hidden `Button` instance (see Non-Goals).
- All tokens the design binds already exist in
  `ThemeProvider.scss` under `[data-theme="duckdice"]`
  (`--surface-panels-panel-bg-*-10`, `--borders-border-*-20`,
  `--text-accent-*`, `--text-primary`, `--icon-*`,
  `--Details-Spacing-8/10/12`, `--Details-Radius-rounded-6`). Hover tokens
  `--surface-panels-panel-bg-*-20` also exist.
- `default` and `info` bind no border variable in Figma; `warning`,
  `success`, `error` bind a 1px `-20` border.
- The icon font currently has `safe, exchange, chevron-right, chevron-down,
  check-circle, arrow-up`. `uikit-icon-font` requires identical name sets
  in `svg/duckdice/` and `svg/tower/`, otherwise `pnpm gen:icons` fails.
- `vars.$themes` in `src/assets/scss/variables.scss` lists only
  `duckdice`; newer components (`Divider`) loop over it in their module
  SCSS.
- `IconName` is exported from `components/Icon/index.ts` but not from
  `src/index.ts`.

## Goals / Non-Goals

**Goals:**
- Match the Figma symbols pixel-for-pixel under `duckdice`.
- Keep `Alert` keyboard-accessible when clickable.
- Keep the icon font consistent across themes without blocking on tower
  artwork.

**Non-Goals:**
- The hidden inline action `Button`. A future optional `action?:
  ReactNode` slot can be added without breaking the API; when it is, it
  should be mutually exclusive with `onClick` so the chevron and button
  never share the right edge.
- Dismiss/close button, auto-hide, live-region announcements
  (`role="alert"`/`"status"`). Consumers can pass ARIA attributes if a
  given usage needs announcing; see Decisions.
- Tower-specific colors: no tower tokens exist yet; `Alert` styles only
  themes in `vars.$themes`.

## Decisions

**Variant names vs Figma names.** Public names are the requested
`warning | success | error | default | info`; Figma's
Alert/Success/Error/Announcement/Information map onto them in that order.
`default` is the default value because it is the neutral one.

**Icon names follow the Figma layer names**: `alert`, `cancel`, `face`,
`support` (from `Icons / alert|cancel|Face|Support`), lower-cased like the
existing font names. `success` reuses `check-circle` and the chevron
reuses `chevron-right` rather than adding near-duplicates. Alternative
considered: semantic names (`warning`, `error`, `info`) — rejected because
they tie generic glyphs to one component's meaning, and `icon` overrides
let other components reuse them.
The duckdice SVGs are copied into `svg/tower/` as placeholders (user
decision), so generation passes and tower art can be swapped in later.
Risk noted below for `check-circle`.

**Variant → default icon lives in `Alert.const.ts`** as a
`Record<AlertVariant, IconName>` (`ALERT_DEFAULT_ICONS`), matching the
`*.const.ts` convention. The rendered icon is `icon ?? ALERT_DEFAULT_ICONS[variant]`.

**Element: `<button type="button">` when `onClick` is set, `<div>`
otherwise.** Alternative considered: always `div` + `onClick` like
`Card`. Rejected because it is not focusable or keyboard-activatable and
Biome's a11y rules are off, so nothing would catch it. `type="button"`
prevents accidental form submit. The button resets native styles
(`font: inherit`, `text-align: left`, `width: 100%`, no native border) so
both elements render identically. Not polymorphic (`as`): there is no
current need, and a polymorphic button/div switch complicates typing.
`forwardRef` is not added: no existing need for a ref, and `Card`/`Divider`
don't forward refs either.

**No ARIA role by default.** `role="alert"` interrupts screen readers on
mount and would be wrong for static page notes. `Alert` accepts only its
documented props and does not spread the rest onto the root, because the
root is one of two element types with different prop sets. If announcing
becomes a need, a `role` prop can be added.

**Borders without size shift.** Bordered and borderless variants must have
the same box size. Use `box-shadow: 0 0 0 1px inset <token>` (same trick
as `Card.outline`) instead of `border`, so padding stays 12px for every
variant. Alternative: `border: 1px solid transparent` on all variants —
equivalent, but box-shadow matches existing uikit code.

**Chevron color.** Figma's Information chevron binds `--icon-primary`
while the leading icon is `--icon-blue-300`. Use `--icon-primary` for the
chevron on every variant. If design later specifies per-variant chevrons,
only SCSS changes.

**Hover/focus (not in Figma).** Clickable hover swaps background to the
matching `panel-bg-*-20` token, with `transition: background 0.3s` like
`Card`. `:focus-visible` gets a 2px outline in `--borders-border-light-8`
(the token `Card.outline` uses) for every variant; confirm with design in
review.

**Icon alignment.** The leading icon sits in a 20px-tall flex box
(`height: 20px; align-items: center`) so it centers on the first text
line regardless of wrap; the chevron uses `align-self: center`.

**Styling scope.** `Alert.module.scss` uses
`@each $theme, $config in vars.$themes { [data-theme="#{$theme}"] { ... } }`
like `Divider`, keeping `[data-theme]` leading so `themeCssSplit` works.
Variant classes (`.warning`, `.clickable`, ...) are applied with `cn(...)`.

**Exports.** `Alert/index.ts` exports `Alert`, `AlertProps` (from
`Alert.tsx`) and `AlertVariant` (from `Alert.types.ts`) as separate
`export type {}` / `export {}` statements. `src/index.ts` adds
`Alert, type AlertProps, type AlertVariant` and extends the Icon line to
`Icon, type IconName, type IconProps`.

## Risks / Trade-offs

- [Figma "ok" glyph may differ from existing `check-circle`] → During
  implementation, export `Icons / ok` and compare with
  `svg/duckdice/check-circle.svg`; if they differ, add `ok` as a fifth new
  icon and map `success` to it (spec text for the success default icon
  changes accordingly).
- [Tower shows duckdice artwork for the new icons] → Accepted placeholder;
  replacing the SVGs later needs only `pnpm gen:icons`.
- [Gray chevron on colored variants may look off] → Chevron color is one
  SCSS rule; adjust after visual review in Storybook.
- [`apps/wallet` build already fails on svgr types (AGENTS.md §9)] → This
  change adds no `*.svg?react` imports, so it does not worsen that; verify
  with `vite build`, not only `tsc -b`, in the wallet if checked.
- [No automated tests] → Verification is `tsc -b`, `pnpm biome check`, and
  manual Storybook review of every variant × clickable state under
  `duckdice`.
