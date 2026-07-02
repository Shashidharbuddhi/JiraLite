export const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;

export const isGmailAddress = (email = '') => GMAIL_REGEX.test(String(email).trim());
