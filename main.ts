// Alien Field Notes: The Two Day Earth Review — make.fun bounty entry.
// Writes one original line: an alien tourist's review of planet Earth.
// Gate: /output/entry.txt must be UTF-8 text of 1-200 characters,
// not only whitespace, a single line.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const ENTRY =
  "Five stars for the oceans, one star for the locals: they named the whole planet Earth like dirt was the best part. Would visit again, with snacks.";

function validateEntry(text: string): void {
  if (text.length < 1 || text.length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${text.length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  for (const ch of text) {
    const code = ch.codePointAt(0)!;
    if (code < 0x20 && ch !== "\t") {
      throw new Error("entry must be printable text");
    }
  }
}

function main(): void {
  validateEntry(ENTRY);
  // Byte-length check: the gate counts UTF-8 characters, but the
  // leaderboard's Size column shows bytes, so keep both in range.
  const byteLength = Buffer.byteLength(ENTRY, "utf8");
  if (byteLength > 200) {
    throw new Error(`entry must be at most 200 bytes, got ${byteLength}`);
  }
  mkdirSync("/output", { recursive: true });
  writeFileSync("/output/entry.txt", ENTRY, "utf8");
  // Round-trip verification: read the file back and confirm it is
  // byte-identical to the validated entry before reporting success.
  const written = readFileSync("/output/entry.txt", "utf8");
  if (written !== ENTRY) {
    throw new Error("round-trip check failed: written file differs from entry");
  }
  console.log(
    `entry.txt OK: ${ENTRY.length} characters, ${byteLength} bytes, ${ENTRY.split(" ").length} words, written to /output/entry.txt`,
  );
}

main();
