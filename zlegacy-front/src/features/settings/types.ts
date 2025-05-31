// Types pour les paramètres utilisateur et les préférences
export interface UserSettings {
  email: string;
  language: "english" | "french";
  notificationsEnabled: boolean;
  twoFactorEnabled: boolean;
  autoLogout: number; // minutes
}

export interface WalletSettings {
  defaultNetwork: string;
  confirmationsRequired: number;
  gasPreference: "low" | "medium" | "high";
  publicKey: string;
}

export interface AppearanceSettings {
  theme: "dark" | "light" | "system";
  fontSize: "small" | "medium" | "large";
  animationsEnabled: boolean;
  reducedMotion: boolean;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  will: boolean;
  security: boolean;
  blockchain: boolean;
}

export interface PrivacySettings {
  shareData: boolean;
  anonymizeTelemetry: boolean;
  storageLocation: "local" | "cloud";
  dataDeletionPeriod: number; // days
}

export interface Settings {
  user: UserSettings;
  wallet: WalletSettings;
  appearance: AppearanceSettings;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export type SettingsSection =
  | "account"
  | "wallet"
  | "appearance"
  | "notifications"
  | "privacy"
  | "security";
