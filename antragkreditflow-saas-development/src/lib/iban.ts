export function normalizeIBAN(iban: string): string {
  return iban.replace(/\s+/g, "").toUpperCase();
}

export function formatIBANInput(iban: string): string {
  return normalizeIBAN(iban)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

export function validateIBAN(iban: string): boolean {
  const cleaned = normalizeIBAN(iban);
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(cleaned)) return false;
  if (cleaned.length < 15 || cleaned.length > 34) return false;
  const rearranged = cleaned.slice(4) + cleaned.slice(0, 4);
  const numeric = rearranged.replace(/[A-Z]/g, (ch) => String(ch.charCodeAt(0) - 55));
  let remainder = 0;
  for (let i = 0; i < numeric.length; i += 1) {
    remainder = (remainder * 10 + Number(numeric[i])) % 97;
  }
  return remainder === 1;
}

export function validatePhoneDACH(phone: string): boolean {
  const cleaned = phone.replace(/[\s()-]/g, "");
  return /^\+?(49|43|41|352|423|32)\d{6,13}$/.test(cleaned);
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function detectBICFromIBAN(iban: string): string {
  const cleaned = normalizeIBAN(iban);
  const bankCode = cleaned.slice(4, 12);
  const known: Record<string, string> = {
    "37040044": "COBADEFFXXX",
    "10040000": "COBADEFFXXX",
    "20070024": "DEUTDEDBHAM",
    "50010517": "INGDDEFFXXX",
    "12030000": "BYLADEM1001",
  };
  return known[bankCode] ?? "";
}
