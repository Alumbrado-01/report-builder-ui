import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private token: string = '';

  constructor(@Inject(PLATFORM_ID)
              private readonly platformId: Object
  ) {}

  public getToken(): string {
    if (isPlatformBrowser(this.platformId)) {
      this.token = sessionStorage.getItem('encodedAccessToken') || '';
    }
    return this.token;
  }
}
