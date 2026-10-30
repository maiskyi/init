# Tasks

## 1. Types and constants

- [x] 1.1 Create `packages/uikit/src/components/Text/Text.types.ts` exporting
      `TextTag` (`'p' | 'span' | 'div' | 'label' | 'strong' | 'em'`), `TextSize`
      (`'medium' | 'regular' | 'small' | 'mini' | 'micro'`), `TextWeight`
      (`'regular' | 'semibold' | 'bold' | 'extrabold'`) as string-literal
      unions, not TS enums; verify
      `pnpm --filter @rockethash/uikit exec tsc -b` reports no error for the file.
- [x] 1.2 Create `packages/uikit/src/components/Text/Text.const.ts` exporting
      `TEXT_TAGS`, `TEXT_SIZES` and `TEXT_WEIGHTS` arrays typed by those unions, ordered largest-to-smallest for sizes and lightest-to-heaviest
      for weights; verify each array's declared element type matches its union so a
      typo in a member is a compile error.

## 2. Component

- [x] 2.1 Create `packages/uikit/src/components/Text/Text.tsx` with a
      `TextComponent` call-signature interface generic over
      `<C extends TextTag = 'p'>` and a `TextProps<C>` built on
      `PolymorphicProps` from `../../types/polymorphic.types`, per design.md's
      first decision; verify `<Text as="label" htmlFor="x" />` type-checks while
      `<Text as="p" htmlFor="x" />` and `<Text as="span" href="/x" />` both fail,
      which `FC<TextProps>` over the union would not.
- [x] 2.2 Implement the render: destructure `as: Component = 'p'`,
      `size = 'regular'`, `weight = 'regular'`, `transform`, `className` and
      `children` in the signature with defaults inline, compose classes with
      `cn(styles.text, styles[`text_${size}`], styles[`text_${weight}`], transform && styles[`text_${transform}`], className)`
      with `className` last, and spread remaining props onto `Component`; verify
      a rendered `<Text>` is a `p` carrying the base, size and weight classes and
      that a consumer `className` appears after them.

## 3. Styling

- [x] 3.1 Create `packages/uikit/src/components/Text/Text.module.scss` following
      `Heading.module.scss`'s shape — `@each $theme, $config in vars.$themes` wrapping
      `[data-theme="#{$theme}"]` with `[data-theme]` as the leading selector part so
      the `themeCssSplit` build does not fail — defining `.text` with
      `margin: 0`, `padding: 0`, `color: var(--text-primary)` and
      `font-family: var(--fonts-family-main), sans-serif`; verify the built
      `dist/themes/duckdice.css` contains the `.text` rule after
      `pnpm --filter @rockethash/uikit exec vite build`.
- [x] 3.2 Add the five size modifiers to `Text.module.scss` — `&_size_medium`
      15px/20px, `&_size_regular` 14px/20px, `&_size_small` 13px/18px,
      `&_size_mini` 12px/16px, `&_size_micro` 10px/12px — with no `mx.breakpoint-up` block anywhere, since no Paragraph
      style is responsive; verify each rendered size reports the font-size and
      line-height pair the spec's "Paragraph size scale" requirement lists, and that
      `medium` is unchanged between a 375px and a 1280px viewport.
- [x] 3.3 Add the four weight modifiers (`&_weight_regular` 400,
      `&_weight_semibold` 600, `&_weight_bold` 700, `&_weight_extrabold` 800) and
      `&_uppercase` emitting only `text-transform: uppercase`; verify
      `size="mini" uppercase` still computes 12px/16px, confirming the design.md reading that the Figma file's
      12px line-height on those samples is a slip rather than caps leading.

## 4. Stories

- [x] 4.1 Create `packages/uikit/src/components/Text/Text.stories.tsx` titled
      `Typography/Text` with a `Default` story and `argTypes` driving `as`, `size` and
      `weight` from the `Text.const.ts` arrays plus a boolean `uppercase` control; verify the story
      appears under Typography beside Heading in `pnpm --filter @rockethash/uikit storybook`
      and every control is populated.
- [x] 4.2 Add a `Specimen` story with `controls: { disable: true }` rendering the
      full 5 x 4 size/weight matrix in labelled columns, mirroring `Heading`'s
      `Specimen`, plus the uppercase samples at `small` and `mini`; verify all twenty
      pairs render — including `micro` + `regular`, which Figma declares no style for
      — and that the result reads as the Paragraph half of the Figma specimen.

## 5. Exports

- [x] 5.1 Create `packages/uikit/src/components/Text/index.ts` re-exporting `Text`
      and `TextProps` from `./Text` and `TextTag`, `TextSize` and `TextWeight`
      from `./Text.types`, keeping `export type { ... }` and
      `export { ... }` as separate statements per AGENTS.md §5; verify the barrel is
      non-empty and exports every name, unlike the empty barrels AGENTS.md §9 flags.
- [x] 5.2 Add the `Text` entry to `packages/uikit/src/index.ts` in its existing
      alphabetical position between `Select` and `ThemeProvider`, exporting the
      component and all three public types; verify
      `import { Text, type TextProps, type TextTag, type TextSize, type TextWeight } from '@rockethash/uikit'`
      type-checks, satisfying the spec's "Public export" requirement.

## 6. Verification

- [x] 6.1 Run `pnpm biome check --write` on the new files and confirm it leaves
      them unchanged on a second pass, so the import grouping and alphabetical
      attribute/key/interface-member ordering the assists enforce are already
      settled rather than rewritten at commit time by the Husky `pre-commit` hook.
- [x] 6.2 Run `pnpm --filter @rockethash/uikit exec tsc -b` and `vite build` and
      confirm both succeed with no new diagnostics; separately confirm
      `apps/wallet`'s build still fails only with its pre-existing ~171 TS2307
      `*.svg?react` errors and one TS6133, with nothing new attributable to `Text`.
