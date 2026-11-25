import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const ENTRY_LINE: string =
  "Monday's alarm doesn't wake me — it invoices the dream for unauthorized weekend occupancy.";

const OUTPUT_DIR = "/output";
const OUTPUT_FILE = `${OUTPUT_DIR}/entry.txt`;

// Line separators built from code points so no raw control characters live in this source file.
const LINE_SEPARATOR = String.fromCharCode(0x2028);
const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029);

function validate(line: string): void {
  const length = [...line].length;
  if (length < 1 || length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${length}`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (
    line.includes("\r") ||
    line.includes("\n") ||
    line.includes(LINE_SEPARATOR) ||
    line.includes(PARAGRAPH_SEPARATOR)
  ) {
    throw new Error("entry must be exactly one line (no line breaks)");
  }
}

// Read the file back as raw bytes and require an exact match with what we meant to write.
function verifyWritten(expected: string): void {
  const actual = readFileSync(OUTPUT_FILE);
  const wanted = Buffer.from(expected, "utf8");
  if (!actual.equals(wanted)) {
    throw new Error(
      `read-back mismatch: wrote ${wanted.length} bytes, found ${actual.length} bytes in ${OUTPUT_FILE}`,
    );
  }
  const text = actual.toString("utf8");
  if (text !== ENTRY_LINE + "\n" || text.indexOf("\n") !== text.length - 1) {
    throw new Error("read-back content is not the entry line plus exactly one trailing newline");
  }
}

try {
  validate(ENTRY_LINE);
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const expected = ENTRY_LINE + "\n";
  writeFileSync(OUTPUT_FILE, expected, "utf8");
  verifyWritten(expected);
  console.log(ENTRY_LINE);
  console.log(
    `characters: ${[...ENTRY_LINE].length}, bytes: ${Buffer.byteLength(ENTRY_LINE, "utf8")}`,
  );
  console.log(
    `verified: ${OUTPUT_FILE} read back byte-identical (${Buffer.byteLength(expected, "utf8")} bytes incl. one trailing newline)`,
  );
} catch (err) {
  console.error(`FAILED: ${(err as Error).message}`);
  process.exit(1);
}
