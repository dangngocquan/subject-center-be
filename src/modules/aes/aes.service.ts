import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as CryptoJS from 'crypto-js';
import { AESConfig } from './aes.config';

Injectable();
export class AESService {
  @Inject(ConfigService)
  private readonly configService: ConfigService;

  async encode(data: string) {
    const aesConfig = await this.configService.get<AESConfig>('aes', {
      infer: true,
    });
    const key = CryptoJS.enc.Hex.parse(aesConfig.key);
    const iv = CryptoJS.enc.Hex.parse(aesConfig.iv);

    const encrypted = CryptoJS.AES.encrypt(data, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return encrypted.toString();
  }

  async decode(hashString: string) {
    const aesConfig = await this.configService.get<AESConfig>('aes', {
      infer: true,
    });
    const key = CryptoJS.enc.Hex.parse(aesConfig.key);
    const iv = CryptoJS.enc.Hex.parse(aesConfig.iv);

    const decrypted = CryptoJS.AES.decrypt(hashString, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
