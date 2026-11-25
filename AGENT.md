# Build notes

**Entry:** a one-line joke for the make.fun bounty "Monday Morning Punchlines".

**Line (90 characters / 92 bytes):**

> Monday's alarm doesn't wake me — it invoices the dream for unauthorized weekend occupancy.

**Run:** `node main.ts` (Node 22+, built-in modules only). It validates the line, creates `/output` if needed, writes `/output/entry.txt`, and prints the line with its character and byte counts.

**Verification:** the coordinator ran `node main.ts` three times.
1. First run failed with a SyntaxError: the line-break check in `validate()` was a regex containing raw line-separator characters.
2. Second run passed after the regex was replaced with explicit `line.includes` checks.
3. Third run passed after `main.ts` gained a read-back check (`verifyWritten`) that reads `/output/entry.txt` as bytes and fails loudly on any difference from the entry line plus one newline.

Passing runs reported 90 characters, 92 bytes for the line, and a `verified:` line of 93 bytes including the trailing newline, exit 0. `/output/entry.txt` read back byte-identical.
