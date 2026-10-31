function read(name: string, fallback = ""): string {
  return (process.env[name] ?? fallback).trim();
}

export const env = {
  databaseUrl: read("DATABASE_URL"),
  sessionSecret: read("SESSION_SECRET", "replace-me-with-a-64-char-random-string"),
  siteUrl: read("NEXT_PUBLIC_SITE_URL", "https://antragkreditflow.de"),
  partnerApiUrl: read("PARTNER_API_URL"),
  partnerApiKey: read("PARTNER_API_KEY"),
  resendApiKey: read("RESEND_API_KEY"),
  resendFrom: read("RESEND_FROM_EMAIL", "antragkreditflow <webmail.antrag.kredit.sofort@gmail.com>"),
  smsApiUrl: read("SMS_API_URL"),
  smsApiKey: read("SMS_API_KEY"),
};

export function isSecureCookie(): boolean {
  return process.env.NODE_ENV === "production";
}
