import { ValueTransformer } from 'typeorm';
import { crypt, decrypt } from '../util/crypto';

export class EncryptionTransformer implements ValueTransformer {
  to(value: string | null): string | null {
    if (value === null) return null;
    return crypt(value);
  }

  from(value: string | null): string | null {
    if (value === null) return null;
    return decrypt(value);
  }
}
