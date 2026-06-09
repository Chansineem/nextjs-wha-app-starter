// Deterministic "channel avatar" colour from a seed string.
// Broadcast Red is reserved for primary actions, so it is intentionally excluded here.
const AVATAR_COLORS = ["#065fd4", "#2ba640", "#fb8c00", "#606060", "#0f0f0f"];

export function avatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
