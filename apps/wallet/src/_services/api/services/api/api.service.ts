import { type StrapiInitOptions } from './api.types';

export class Api {
  public static get baseUrl() {
    return this._baseUrl;
  }

  private static _baseUrl: string = '';

  public static init({ baseUrl }: StrapiInitOptions) {
    this._baseUrl = baseUrl;
  }
}
