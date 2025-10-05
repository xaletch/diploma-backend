import * as crypto from "crypto";

export function generateInviteToken() {
  return crypto.randomBytes(48).toString("hex");
}
