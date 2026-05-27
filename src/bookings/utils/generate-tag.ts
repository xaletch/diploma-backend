import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 8);

export function generateBookingTag(): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `B-${day}${month}-${nanoid()}`;
}
