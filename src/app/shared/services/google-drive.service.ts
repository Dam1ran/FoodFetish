/* eslint-disable max-lines */
import { inject, Injectable, signal } from '@angular/core';
import { FoodsService } from './my-foods.service';
import { RecipesService } from './recipes.service';
import { DiaryLogService } from './diary-log.service';
import { OptionsService } from './options/options.service';
import { ImageStoreService } from './image-store.service';
import { ToastsService } from './toasts.service';

declare const google: {
  accounts: {
    oauth2: {
      initTokenClient(config: {
        client_id: string;
        scope: string;
        callback: (response: {
          access_token?: string;
          expires_in?: number;
          error?: string;
        }) => void | Promise<void>;
      }): { requestAccessToken(): void };
    };
  };
};

interface DriveFile {
  id: string;
  name: string;
}

interface DriveFileList {
  files: DriveFile[];
}

interface AppData {
  foods: unknown[];
  recipes: unknown[];
  diaryLog: unknown;
  options: unknown;
  images: { imageId: string; base64: string }[];
  metadata?: {
    version: number;
  };
}

class DriveApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function throwIfNotOk(response: Response): Promise<void> {
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new DriveApiError(text || response.statusText, response.status);
  }
}

const CLIENT_ID = '875660427890-lqom4d5625fslef32gvcrlc972qefi13.apps.googleusercontent.com';
const SCOPES =
  'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/userinfo.email';
const DATA_FILE_NAME = 'food-fetish-data.json';

@Injectable({ providedIn: 'root' })
export class GoogleDriveService {
  private readonly foodsService = inject(FoodsService);
  private readonly recipesService = inject(RecipesService);
  private readonly diaryLogService = inject(DiaryLogService);
  private readonly optionsService = inject(OptionsService);
  private readonly imageStoreService = inject(ImageStoreService);
  private readonly toastsService = inject(ToastsService);

  private accessToken: string | null = null;
  private tokenClient: ReturnType<typeof google.accounts.oauth2.initTokenClient> | null = null;

  readonly isSignedIn = signal(false);
  readonly isSyncing = signal(false);
  readonly syncFailed = signal(false);
  readonly userEmail = signal<string | null>(null);

  private gisLoaded = false;

  constructor() {
    this.restoreToken();
  }

  private restoreToken(): void {
    const saved = localStorage.getItem('google_token_data');
    if (saved) {
      const data = JSON.parse(saved) as { token: string; expiry?: number; email?: string };
      if (!this.isTokenExpired(data.expiry)) {
        this.accessToken = data.token;
        this.userEmail.set(data.email ?? null);
        this.isSignedIn.set(true);
      } else {
        this.clearToken();
      }
    }
  }

  private saveToken(token: string, expiresIn?: number, email?: string): void {
    const data: { token: string; expiry?: number; email?: string } = { token };
    if (expiresIn) {
      data.expiry = Date.now() + expiresIn * 1000;
    }
    if (email) {
      data.email = email;
    }
    localStorage.setItem('google_token_data', JSON.stringify(data));
  }

  private isTokenExpired(expiry?: number): boolean {
    if (!expiry) return false;
    return Date.now() > expiry;
  }

  private clearToken(): void {
    localStorage.removeItem('google_token_data');
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private loadGisScript(): Promise<void> {
    if (this.gisLoaded) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src*="accounts.google.com/gsi/client"]')) {
        this.gisLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.gisLoaded = true;
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
      document.head.appendChild(script);
    });
  }

  async signIn(): Promise<void> {
    try {
      await this.loadGisScript();
    } catch {
      this.toastsService.showAsError('Failed to load Google services', {
        headerText: null,
        delayMs: 5000,
      });
      return;
    }

    return new Promise<void>((resolve) => {
      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: async (response) => {
          if (response.error) {
            this.toastsService.showAsError('Google sign-in failed', {
              headerText: null,
              delayMs: 5000,
            });
            resolve();
            return;
          }

          this.accessToken = response.access_token ?? null;
          if (this.accessToken) {
            const email = await this.getUserEmail(this.accessToken);
            this.userEmail.set(email ?? null);
            this.saveToken(this.accessToken, response.expires_in, email);
          }
          this.isSignedIn.set(true);
          this.toastsService.showAsSuccess('Signed in to Google Drive', {
            headerText: null,
            delayMs: 3000,
          });
          await this.loadFromDrive();
          resolve();
        },
      });

      this.tokenClient.requestAccessToken();
    });
  }

  signOut() {
    this.accessToken = null;
    this.userEmail.set(null);
    this.clearToken();
    this.isSignedIn.set(false);
    this.toastsService.showAsInformation('Signed out from Google Drive', {
      headerText: null,
      delayMs: 3000,
    });
  }

  async uploadToDrive(): Promise<void> {
    if (!this.accessToken) {
      this.toastsService.showAsWarning('Not signed in to Google Drive', {
        headerText: null,
        delayMs: 5000,
      });
      return;
    }

    this.isSyncing.set(true);

    try {
      const data = await this.gatherData();
      const existingFileId = await this.findDataFile();

      let driveVersion = 0;
      if (existingFileId) {
        await this.updateFile(existingFileId, data);
        driveVersion = data.metadata?.version ?? 0;
      } else {
        await this.createFile(data);
      }
      const version = this.getLocalVersion();
      if (driveVersion > version) {
        this.toastsService.showAsError('Data on Google Drive is newer than local version.', {
          headerText: null,
          delayMs: 5000,
        });
        return;
      }
      if (data.metadata?.version) {
        this.setLocalVersion(data.metadata.version);
      }
      this.toastsService.showAsSuccess('Data uploaded to Google Drive', {
        headerText: null,
        delayMs: 3000,
      });
    } catch (error) {
      console.error('Upload failed:', error);
      if (this.isAuthError(error)) {
        this.handleAuthError();
      } else {
        this.toastsService.showAsError('Failed to upload to Google Drive', {
          headerText: null,
          delayMs: 5000,
        });
      }
    } finally {
      this.isSyncing.set(false);
    }
  }

  async saveToDrive(): Promise<void> {
    this.syncFailed.set(false);
    if (!this.accessToken || this.isSyncing()) {
      return;
    }

    this.isSyncing.set(true);

    try {
      let driveVersion = 0;
      const fileId = await this.findDataFile();
      await this.delay(1000);

      if (fileId) {
        const data = await this.downloadFile(fileId);
        await this.delay(1000);
        driveVersion = data.metadata?.version ?? 0;
      }
      let version = this.getLocalVersion();
      if (driveVersion > version) {
        return;
      }

      const appData = await this.gatherData();
      await this.delay(1000);
      version++;
      appData.metadata = { version };

      if (fileId) {
        await this.updateFile(fileId, appData);
        await this.delay(1000);
      } else {
        await this.createFile(appData);
        await this.delay(1000);
      }
      this.setLocalVersion(version);
    } catch (error) {
      console.error('Upload failed:', error);
      if (this.isAuthError(error)) {
        this.handleAuthError();
      } else {
        this.toastsService.showAsError('Failed to upload to Google Drive', {
          headerText: null,
          delayMs: 5000,
        });
      }
      this.syncFailed.set(true);
    } finally {
      this.isSyncing.set(false);
    }
  }

  async loadFromDrive(): Promise<void> {
    if (!this.accessToken || this.isSyncing()) {
      return;
    }

    this.isSyncing.set(true);

    try {
      const fileId = await this.findDataFile();
      await this.delay(1000);
      if (!fileId) {
        return;
      }

      const data = await this.downloadFile(fileId);
      await this.delay(1000);

      await this.restoreData(data);
      await this.delay(1000);
      if (data.metadata?.version) {
        this.setLocalVersion(data.metadata.version);
      }
    } catch (error) {
      console.error('Download failed:', error);
      if (this.isAuthError(error)) {
        this.handleAuthError();
      } else {
        this.toastsService.showAsError('Failed to download from Google Drive', {
          headerText: null,
          delayMs: 5000,
        });
      }
      this.syncFailed.set(true);
    } finally {
      this.isSyncing.set(false);
    }
  }
  async downloadFromDrive(): Promise<void> {
    if (!this.accessToken) {
      this.toastsService.showAsWarning('Not signed in to Google Drive', {
        headerText: null,
        delayMs: 5000,
      });
      return;
    }

    this.isSyncing.set(true);

    try {
      const fileId = await this.findDataFile();
      if (!fileId) {
        this.toastsService.showAsWarning('No data found on Google Drive', {
          headerText: null,
          delayMs: 5000,
        });
        return;
      }

      const data = await this.downloadFile(fileId);
      await this.restoreData(data);
      if (data.metadata?.version) {
        this.setLocalVersion(data.metadata.version);
      }

      this.toastsService.showAsSuccess('Data downloaded from Google Drive', {
        headerText: null,
        delayMs: 3000,
      });
    } catch (error) {
      console.error('Download failed:', error);
      if (this.isAuthError(error)) {
        this.handleAuthError();
      } else {
        this.toastsService.showAsError('Failed to download from Google Drive', {
          headerText: null,
          delayMs: 5000,
        });
      }
    } finally {
      this.isSyncing.set(false);
    }
  }

  private async gatherData(): Promise<AppData> {
    const foods = this.foodsService.foods();
    const recipes = this.recipesService.recipes();
    const diaryLog = this.diaryLogService.diaryLog();
    const options = this.optionsService.options();

    const imageIds = new Set<string>();
    for (const recipe of recipes) {
      if (recipe.imageId) {
        imageIds.add(recipe.imageId);
      }
    }
    if (diaryLog?.diaryDays) {
      for (const day of diaryLog.diaryDays) {
        for (const entry of day.dayTemplate.entries) {
          if (entry.meal.imageId) {
            imageIds.add(entry.meal.imageId);
          }
        }
      }
    }

    const images: AppData['images'] = [];
    for (const imageId of imageIds) {
      let base64 = await this.imageStoreService.get(imageId);
      if (base64) {
        base64 = base64.replace(/^data:image\/\w+;base64,/, '');
        images.push({ imageId, base64 });
      }
    }

    return { foods, recipes, diaryLog, options, images };
  }

  private async restoreData(data: AppData): Promise<void> {
    await this.imageStoreService.deleteDatabase().then(async () => {
      if (data.images) {
        for (const img of data.images) {
          await this.imageStoreService.put(img.imageId, img.base64);
        }
      }
    });

    this.foodsService.setFoods([]);
    this.recipesService.setRecipes([]);
    this.diaryLogService.setDiary({ diaryDays: [] });

    if (data.foods) {
      this.foodsService.setFoods(data.foods as Parameters<FoodsService['setFoods']>[0]);
    }
    if (data.recipes) {
      this.recipesService.setRecipes(data.recipes as Parameters<RecipesService['setRecipes']>[0]);
    }
    if (data.diaryLog) {
      this.diaryLogService.setDiary(data.diaryLog as Parameters<DiaryLogService['setDiary']>[0]);
    }
    if (data.options) {
      this.optionsService.setOptions(data.options as Parameters<OptionsService['setOptions']>[0]);
    }
  }

  private async findDataFile(): Promise<string | null> {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name='${DATA_FILE_NAME}'&fields=files(id,name)`,
      {
        headers: { Authorization: `Bearer ${this.accessToken}` },
      },
    );

    await throwIfNotOk(response);

    const result: DriveFileList = await response.json();
    return result.files?.[0]?.id ?? null;
  }

  private async createFile(data: AppData): Promise<void> {
    const metadata = {
      name: DATA_FILE_NAME,
      parents: ['appDataFolder'],
      mimeType: 'application/json',
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', new Blob([JSON.stringify(data)], { type: 'application/json' }));

    const response = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.accessToken}` },
        body: form,
      },
    );

    await throwIfNotOk(response);
  }

  private async updateFile(fileId: string, data: AppData): Promise<void> {
    const response = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
    );

    await throwIfNotOk(response);
  }

  private async downloadFile(fileId: string): Promise<AppData> {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });

    await throwIfNotOk(response);

    return response.json();
  }

  private isAuthError(error: unknown): boolean {
    return error instanceof DriveApiError && error.status === 401;
  }

  private handleAuthError() {
    this.accessToken = null;
    this.userEmail.set(null);
    this.clearToken();
    this.isSignedIn.set(false);
    this.toastsService.showAsWarning('Google session expired. Please sign in again.', {
      headerText: null,
      delayMs: 5000,
    });
  }

  private async getUserEmail(token: string): Promise<string | undefined> {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) return undefined;
      const data = (await response.json()) as { email?: string };
      return data.email;
    } catch {
      return undefined;
    }
  }

  private getLocalVersion() {
    const version = localStorage.getItem('google_data_version');
    return version ? parseInt(version) : 0;
  }

  private setLocalVersion(version: number) {
    localStorage.setItem('google_data_version', version.toString());
  }
}
