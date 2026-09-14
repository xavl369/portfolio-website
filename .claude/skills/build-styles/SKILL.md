---
name: build-styles
description: Compile scss/style.scss to compressed css/style.css and verify the result. Use when SCSS has changed, when css/style.css may be stale, or before committing style changes.
---

# build-styles

`css/style.css` is what the site actually serves; `scss/style.scss` is the only source.
There is no build step in CI, so if the two drift the live site silently keeps the old
styles. This skill compiles and verifies them.

## Compile

```bash
npx -y sass --style=compressed scss/style.scss css/style.css
```

(`.claude/hooks/compile-scss.sh` runs this same command automatically on every
SCSS edit, but it is driven by a hook payload on stdin — invoke it directly only
when testing the hook itself.)

Use `sass` directly if it is on PATH; it is not, on this machine, so `npx -y sass`
is the working invocation (~3s, already cached). Do **not** pass `--no-source-map`:
`css/style.css.map` is tracked and referenced by the trailing `sourceMappingURL`
comment, so dropping it leaves a dangling reference.

`--style=compressed` reproduces the committed file byte-for-byte. If a compile
produces a diff beyond your own SCSS edits, something else changed the file —
investigate before committing rather than accepting the churn.

## Verify

After compiling, confirm the output is sane:

```bash
wc -c < css/style.css          # expect ~40KB; anything under 20KB means a broken compile
git diff --stat css/style.css  # the diff should correspond to your SCSS edit
```

A useful stronger check — the selector sets of source and output should match:

```bash
npx -y sass --style=compressed --no-source-map scss/style.scss /tmp/check.css
# then compare selector counts between /tmp/check.css and css/style.css
```

## Known state

- `scss/style.scss` hand-writes its vendor prefixes (~41 `-webkit-` declarations).
  There is no autoprefixer in the pipeline; do not add one, and do not strip the
  hand-written prefixes.
- Dart Sass emits deprecation warnings for `lighten()` (used around line 2250).
  They are warnings, not errors, and the output is still correct. Migrating to
  `color.adjust()` / `color.scale()` is optional cleanup, not a build fix.
- `core.autocrlf=true` with no `.gitattributes`, so the compiled file's line
  endings normalize on commit. A one-byte size difference between `wc -c` and
  `git cat-file -s` is that, not a content change.

## Never hand-edit the output

Edits to `css/style.css` are wiped by the next compile. The `PreToolUse` hook in
`.claude/settings.json` blocks them; change `scss/style.scss` instead.
