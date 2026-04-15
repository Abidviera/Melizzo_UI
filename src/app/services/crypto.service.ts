import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CryptoService {
  private readonly ALGORITHM = 'AES-GCM';
  private key: CryptoKey | null = null;

  async initializeKey(keyMaterial: string): Promise<void> {
    const encoder = new TextEncoder();
    const keyData = await crypto.subtle.digest('SHA-256', encoder.encode(keyMaterial));
    this.key = await crypto.subtle.importKey(
      'raw',
      keyData,
      this.ALGORITHM,
      false,
      ['encrypt', 'decrypt']
    );
  }

  private async getKey(): Promise<CryptoKey> {
    if (!this.key) {
      throw new Error('CryptoService not initialized. Call initializeKey() first.');
    }
    return this.key;
  }

  async encrypt(plaintext: string): Promise<string> {
    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = encoder.encode(plaintext);

    const ciphertext = await crypto.subtle.encrypt(
      { name: this.ALGORITHM, iv },
      await this.getKey(),
      encoded
    );

    // Combine IV + ciphertext and base64 encode
    const combined = new Uint8Array(iv.byteLength + ciphertext.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(ciphertext), iv.byteLength);

    return btoa(String.fromCharCode(...combined));
  }

  async decrypt(base64Data: string): Promise<string> {
    const combined = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      { name: this.ALGORITHM, iv },
      await this.getKey(),
      ciphertext
    );

    return new TextDecoder().decode(decrypted);
  }

  // Safe localStorage wrapper — encrypts before writing, decrypts on read
  async setSecureItem(key: string, value: unknown): Promise<void> {
    const json = JSON.stringify(value);
    const encrypted = await this.encrypt(json);
    localStorage.setItem(key, encrypted);
  }

  async getSecureItem<T>(key: string): Promise<T | null> {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;

    try {
      const decrypted = await this.decrypt(encrypted);
      return JSON.parse(decrypted) as T;
    } catch {
      return null;
    }
  }

  removeSecureItem(key: string): void {
    localStorage.removeItem(key);
  }
}
