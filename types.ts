
export enum SubscriptionTier {
  FREE = 'free',
  PRO = 'pro',
  ELITE = 'elite'
}

export enum AppView {
  DASHBOARD = 'dashboard',
  CREATIVE_STUDIO = 'creative_studio',
  CODE_REPAIR = 'code_repair',
  GAME_ENGINE = 'game_engine',
  FRAUD_DETECTION = 'fraud_detection',
  DATA_CORE = 'data_core',
  ADMIN = 'admin',
  USER_PORTAL = 'user_portal',
  APP_BUILDER = 'app_builder',
  SETTINGS = 'settings',
  LEGAL = 'legal',
  SYSTEM_LOCKED = 'system_locked'
}

export type VibeMode = 'cyberpunk' | 'minimalist' | 'organic' | 'retro-future' | 'standard';

export interface GenerationResult {
  type: 'text' | 'image' | 'video' | 'audio';
  content: string;
  metadata?: any;
}

export interface MetricData {
  name: string;
  value: number;
}

export interface ProjectAsset {
  id: string;
  name: string;
  type: 'Photo' | 'Video' | 'Audio' | 'Code' | 'Game' | 'Data' | 'FullApp';
  module: AppView;
  timestamp: number;
  tags?: string[];
}
