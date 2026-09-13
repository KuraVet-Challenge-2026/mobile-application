
const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';


function paraBytesUtf8(texto: string): number[] {
  const bytes: number[] = [];

  for (const caractere of texto) {
    const codePoint = caractere.codePointAt(0) ?? 0;

    if (codePoint < 0x80) {
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      bytes.push(0xc0 | (codePoint >> 6), 0x80 | (codePoint & 0x3f));
    } else if (codePoint < 0x10000) {
      bytes.push(
        0xe0 | (codePoint >> 12),
        0x80 | ((codePoint >> 6) & 0x3f),
        0x80 | (codePoint & 0x3f)
      );
    } else {
      bytes.push(
        0xf0 | (codePoint >> 18),
        0x80 | ((codePoint >> 12) & 0x3f),
        0x80 | ((codePoint >> 6) & 0x3f),
        0x80 | (codePoint & 0x3f)
      );
    }
  }

  return bytes;
}

export function base64Encode(texto: string): string {
  const bytes = paraBytesUtf8(texto);
  let resultado = '';
  let i = 0;

  while (i < bytes.length) {
    const b1 = bytes[i++];
    const b2 = i < bytes.length ? bytes[i++] : undefined;
    const b3 = i < bytes.length ? bytes[i++] : undefined;

    const triplete = (b1 << 16) | ((b2 ?? 0) << 8) | (b3 ?? 0);

    resultado += BASE64_CHARS[(triplete >> 18) & 0x3f];
    resultado += BASE64_CHARS[(triplete >> 12) & 0x3f];
    resultado += b2 === undefined ? '=' : BASE64_CHARS[(triplete >> 6) & 0x3f];
    resultado += b3 === undefined ? '=' : BASE64_CHARS[triplete & 0x3f];
  }

  return resultado;
}
