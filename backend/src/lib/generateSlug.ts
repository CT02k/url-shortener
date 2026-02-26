import { randomBytes } from "crypto";

const SLUG_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";
const SLUG_LENGTH = 7;

export const generateSlug = () =>
  Array.from(randomBytes(SLUG_LENGTH), (byte) => {
    return SLUG_ALPHABET[byte % SLUG_ALPHABET.length];
  }).join("");
