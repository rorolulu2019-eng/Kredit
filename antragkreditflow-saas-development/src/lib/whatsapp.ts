import { WHATSAPP } from "@/lib/constants";

export const WHATSAPP_MESSAGES: Record<string, string> = {
  "/": "Guten Tag, ich interessiere mich für einen Kreditvergleich über antragkreditflow.",
  "/antrag": "Guten Tag, ich brauche Hilfe beim Ausfüllen meines Kreditantrags auf antragkreditflow.",
  "/dashboard": "Guten Tag, ich habe eine Frage zu meinem bestehenden Antrag bei antragkreditflow.",
  "/kundenstimmen": "Guten Tag, ich hätte gerne weitere Informationen zu antragkreditflow.",
  "/ueber-uns": "Guten Tag, ich möchte mehr über antragkreditflow erfahren.",
  "/anmelden": "Guten Tag, ich habe Probleme bei der Anmeldung auf antragkreditflow.",
  "/registrieren": "Guten Tag, ich benötige Hilfe bei der Registrierung auf antragkreditflow.",
  "/impressum": "Guten Tag, ich habe eine rechtliche Frage zu antragkreditflow.",
  "/datenschutz": "Guten Tag, ich habe eine Frage zum Datenschutz bei antragkreditflow.",
  "/agb": "Guten Tag, ich habe eine Frage zu den AGB von antragkreditflow.",
  "/widerruf": "Guten Tag, ich möchte meine Einwilligung widerrufen.",
  "/passwort-vergessen": "Guten Tag, ich habe mein Passwort vergessen und benötige Hilfe.",
};

export function getWhatsAppURL(route: string): string {
  const exact = WHATSAPP_MESSAGES[route];
  const prefix = Object.keys(WHATSAPP_MESSAGES)
    .filter((key) => key !== "/" && route.startsWith(key))
    .sort((a, b) => b.length - a.length)[0];
  const message = exact ?? (prefix ? WHATSAPP_MESSAGES[prefix] : WHATSAPP_MESSAGES["/"]);
  return `${WHATSAPP.baseURL}?text=${encodeURIComponent(message)}`;
}
