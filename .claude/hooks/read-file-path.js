// Reads a Claude Code hook payload on stdin, prints the target file path.
let s = "";
process.stdin.on("data", d => (s += d)).on("end", () => {
  try {
    const j = JSON.parse(s);
    const p = (j.tool_input && (j.tool_input.file_path || j.tool_input.filePath)) ||
              (j.tool_response && j.tool_response.filePath) || "";
    process.stdout.write(String(p));
  } catch (e) { /* malformed payload: print nothing, caller no-ops */ }
});
