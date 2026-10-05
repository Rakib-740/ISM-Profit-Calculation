/**
 * Parses raw text containing bulk investor entries.
 *
 * Accepted line formats (separator can be ":" or "-", spacing is flexible):
 *   ISM-096: 2 Lacs
 *   ISM-096 - 13 Lacs
 *   ISM-096:2 Lacs
 *   ISM-096 -2 Lacs
 *   ISM-096 : 2 Lacs
 *   (also accepts "Lac" and decimal amounts like 2.5 Lacs)
 *
 * @param {string} text - Raw input text from textarea
 * @returns {{ parsed: Array<{id: string, amount: number}>, invalid: Array<string> }}
 */
export function parseInvestorInput(text) {
  if (!text || typeof text !== 'string') {
    return { parsed: [], invalid: [] };
  }

  // Split by CRLF or LF to handle Windows and Unix line endings
  const lines = text.split(/\r?\n/);

  const parsed = [];
  const invalid = [];

  // Case-insensitive regex matching:
  // 1. ISM ID       — e.g. ISM-096, ISM-008
  // 2. Separator    — ":" or "-", with optional whitespace on either side
  // 3. Amount       — integer or decimal (e.g. 13, 2.5)
  // 4. Unit keyword — "Lac" or "Lacs" (case-insensitive)
  const regex = /^\s*(ISM-\d{3})\s*[:-]\s*(\d+(?:\.\d+)?)\s*Lacs?\b/i;

  lines.forEach((line) => {
    const trimmedLine = line.trim();

    // Ignore empty lines
    if (!trimmedLine) return;

    const match = trimmedLine.match(regex);

    if (!match) {
      invalid.push(trimmedLine);
      return;
    }

    parsed.push({
      id: match[1],
      amount: Number(match[2])
    });
  });

  return {
    parsed,
    invalid
  };
}
