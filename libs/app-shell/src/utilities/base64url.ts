export const base64url = {
  fromString: (data: string) => {
    return btoa(data)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  },
  fromBytes: (data: Uint8Array) => {
    return base64url.fromString(String.fromCharCode(...data));
  },
  fromBuffer: (buffer: ArrayBuffer) => {
    return base64url.fromBytes(new Uint8Array(buffer));
  },
  toString: (encoded: string) => {
    return atob(encoded
      .replace(/-/g, '+')
      .replace(/_/g, '/'));
  }
} as const;