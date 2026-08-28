import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";

const listed = spawnSync(
  "git",
  ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
  { encoding: "utf8" },
);

if (listed.status !== 0) {
  process.stderr.write(listed.stderr);
  process.exit(listed.status ?? 1);
}

const forbiddenWords = [
  ["data", "dog"].join(""),
  ["sea", "gate"].join(""),
];
const forbiddenColors = [
  ["#", "632ca6"].join(""),
  ["#", "4c1d82"].join(""),
  ["#", "c6a7ea"].join(""),
  ["#", "d9b8ff"].join(""),
  ["#", "8d68ce"].join(""),
  ["#", "6ebe49"].join(""),
  ["#", "168c80"].join(""),
  ["#", "3d6b28"].join(""),
];
const forbiddenPassword = ["land", "2expand"].join("");
const forbiddenPunctuation = [
  String.fromCodePoint(0x2013),
  String.fromCodePoint(0x2014),
];

const failures = [];
const files = listed.stdout.split("\0").filter((file) => file && existsSync(file));

for (const file of files) {
  const buffer = readFileSync(file);
  if (buffer.includes(0)) continue;
  const source = buffer.toString("utf8");
  const lower = source.toLowerCase();
  const lowerPath = file.toLowerCase();

  for (const word of forbiddenWords) {
    if (lowerPath.includes(word)) failures.push(`${file}: source name in path`);
    if (lower.includes(word)) failures.push(`${file}: source name`);
  }
  if (lowerPath.includes("/brand/dd_")) {
    failures.push(`${file}: source brand asset`);
  }
  for (const color of forbiddenColors) {
    if (lower.includes(color)) failures.push(`${file}: source color`);
  }
  if (lower.includes(forbiddenPassword)) {
    failures.push(`${file}: configured password`);
  }
  for (const mark of forbiddenPunctuation) {
    if (source.includes(mark)) failures.push(`${file}: long dash`);
  }
}

const manifest = JSON.parse(readFileSync("package.json", "utf8"));
if (manifest.dependencies?.next !== "15.5.24") {
  failures.push("package.json: Next version");
}
const iconDependency = ["lucide", "react"].join("-");
if (manifest.dependencies?.[iconDependency]) {
  failures.push("package.json: unexpected icon dependency");
}

const lockup = readFileSync("src/components/BrandLockup.tsx", "utf8");
const officialWordmark = "/brand/nice-wordmark.svg";
if (!lockup.includes(officialWordmark)) {
  failures.push("src/components/BrandLockup.tsx: official wordmark");
}
const wordmarkPath = "public/brand/nice-wordmark.svg";
if (!existsSync(wordmarkPath)) {
  failures.push(`${wordmarkPath}: missing official wordmark`);
} else {
  const wordmarkHash = createHash("sha256")
    .update(readFileSync(wordmarkPath))
    .digest("hex");
  if (
    wordmarkHash !==
    "6bb1ba0faa201df852070516f86fc69a899a8466c8596503c48362296dfb8710"
  ) {
    failures.push(`${wordmarkPath}: unexpected official wordmark contents`);
  }
}

if (failures.length) {
  process.stderr.write(`${failures.join("\n")}\n`);
  process.exit(1);
}

process.stdout.write(`Residue audit passed for ${files.length} files.\n`);
