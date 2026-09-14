#!/usr/bin/env bash
# PostToolUse: recompile scss/style.scss -> css/style.css (compressed) after the SCSS is edited.
# css/style.css is the file the site actually serves, so it must never drift from the source.
set -uo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
root="$(cd "$here/../.." && pwd)"

fp="$(node "$here/read-file-path.js")"
[ -n "$fp" ] || exit 0

# Suffix match so this works with Windows or POSIX separators.
case "$fp" in
  *style.scss) ;;
  *) exit 0 ;;
esac

if command -v sass >/dev/null 2>&1; then
  sassbin="sass"
elif command -v npx >/dev/null 2>&1; then
  sassbin="npx -y sass"
else
  node -e 'process.stdout.write(JSON.stringify({systemMessage:"SCSS NOT recompiled: neither sass nor npx is on PATH. css/style.css is now stale."}))'
  exit 0
fi

cd "$root" || exit 0
backup="$(mktemp)"; errfile="$(mktemp)"
cp css/style.css "$backup" 2>/dev/null

if $sassbin --style=compressed scss/style.scss css/style.css 2>"$errfile"; then
  size="$(wc -c < css/style.css | tr -d '[:space:]')"
  if [ "${size:-0}" -lt 20000 ]; then
    cp "$backup" css/style.css
    msg="SCSS compile produced only ${size}B (expected ~40KB) - reverted css/style.css, investigate before shipping."
  else
    msg="Recompiled css/style.css (${size}B) from scss/style.scss."
  fi
else
  [ -s "$backup" ] && cp "$backup" css/style.css
  err="$(grep -iv 'deprecat' "$errfile" | grep -v '^[[:space:]]*$' | head -4 | tr '\n' ' ')"
  msg="SCSS COMPILE FAILED - css/style.css left unchanged. ${err}"
fi

rm -f "$backup" "$errfile"
node -e 'process.stdout.write(JSON.stringify({systemMessage:process.argv[1]}))' "$msg"
exit 0
