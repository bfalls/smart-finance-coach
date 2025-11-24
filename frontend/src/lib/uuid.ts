// use Web Crypto where possible (secure contexts).
// LAN IPs like http://192.168.x.x are NOT considered secure,
// so using this for compatibility. Also safe for commercial use.
// I wouldn't need this if I just used HTTPS for comms.
export function generateId() {
  if (crypto?.randomUUID) return crypto.randomUUID();

  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}
