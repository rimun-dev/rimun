import { readFile } from "fs/promises";
import { PDFDocument, PDFFont } from "pdf-lib";

export function convertPointToPixel(pt: number) {
  return Math.ceil(pt * 1.33) * 5;
}

export async function mergeDocs(documents: PDFDocument[]) {
  const docs = await Promise.all(
    documents.map(async (d) => (await d.save()).buffer)
  );

  const mergedPdf = await PDFDocument.create();
  const actions = docs.map(async (pdfBuffer) => {
    const pdf = await PDFDocument.load(pdfBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => {
      mergedPdf.addPage(page);
    });
  });

  await Promise.all(actions);

  return Buffer.from(await mergedPdf.save());
}

export function fixNonWinAnsiString(s: string, font: PDFFont) {
  function renderSimilarChar(char: string) {
    switch (char) {
      case "Ș":
        return "S";
      case "ć":
        return "c";
      case "ğ":
        return "g";
      case "ı":
        return "i";
      case "ş":
      case "ș":
        return "s";
      case "İ":
        return "I";
      default:
        // NOTE: this may be useful for mapping new characters to
        // lookalikes during development.
        console.debug(`Invalid WinAnsi character: '${char}'`);
        return "?";
    }
  }

  let out: string[] = [];
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    if (!font.getCharacterSet().includes(char.charCodeAt(0)))
      out[i] = renderSimilarChar(char);
    else out[i] = char;
  }
  return out.join("");
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Start(NOTE)
// The following code comes from:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules/PluralRules

const suffixes = new Map([
  ["one", "st"],
  ["two", "nd"],
  ["few", "rd"],
  ["other", "th"],
]);

const pr = new Intl.PluralRules("en-US", { type: "ordinal" });

export function formatOrdinal(n: number) {
  const rule = pr.select(n);
  const suffix = suffixes.get(rule);
  return `${n}${suffix}`;
}

const fileCache: Map<string, Uint8Array> = new Map();

export async function getFileBytes(path: string) {
  if (!fileCache.has(path)) {
    const data = await readFile(path);
    fileCache.set(path, new Uint8Array(data));
  }
  return fileCache.get(path)!;
}
