#!/usr/bin/env bash
# PreToolUse: css/style.css and its sourcemap are build output - a hand edit is wiped
# by the next compile. Redirect the edit to scss/style.scss instead.
set -uo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
fp="$(node "$here/read-file-path.js")"
[ -n "$fp" ] || exit 0

case "$fp" in
  *style.css|*style.css.map) ;;
  *) exit 0 ;;
esac

node -e 'process.stdout.write(JSON.stringify({hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"deny",permissionDecisionReason:"css/style.css is generated from scss/style.scss by the build-styles hook. Edit scss/style.scss instead; it recompiles automatically on save."}}))'
exit 0
