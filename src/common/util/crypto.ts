import * as CryptoJS from 'crypto-js';
import { ConfigService } from '@nestjs/config';

// Create an instance of ConfigService
const configService = new ConfigService();

// Retrieve the key and IV from environment variables
const key = CryptoJS.enc.Base64.parse(configService.get<string>('KEY') || '');
const iv = CryptoJS.enc.Base64.parse(configService.get<string>('IV') || '');

export const crypt = (str: string): string => {
  const ciphertext = CryptoJS.AES.encrypt(str.toString(), key, { iv: iv });
  return ciphertext.toString();
};

export const decrypt = (str: string): string => {
  const bytes = CryptoJS.AES.decrypt(str.toString(), key, { iv: iv });
  return bytes.toString(CryptoJS.enc.Utf8);
};
