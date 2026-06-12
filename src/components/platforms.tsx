// ============================================================
// Social Media Hub – Shared Platform Config
// Real icons from Font Awesome 6, single source of truth
// ============================================================

import React from 'react';
import { FaInstagram, FaTiktok, FaFacebook, FaWhatsapp } from 'react-icons/fa6';
import type { Platform } from '../types/types';

export interface PlatformConfig {
  key: Platform;
  label: string;
  color: string;
  gradient: string;
}

export const PLATFORMS: PlatformConfig[] = [
  { key: 'instagram', label: 'Instagram', color: '#E1306C', gradient: 'linear-gradient(135deg, #833ab4, #E1306C, #fcb045)' },
  { key: 'tiktok',    label: 'TikTok',    color: '#111827', gradient: 'linear-gradient(135deg, #111827, #374151)' },
  { key: 'facebook',  label: 'Facebook',  color: '#1877F2', gradient: 'linear-gradient(135deg, #1455B5, #1877F2)' },
  { key: 'whatsapp',  label: 'WhatsApp',  color: '#25D366', gradient: 'linear-gradient(135deg, #128C7E, #25D366)' },
];

export function getPlatform(key: Platform): PlatformConfig {
  return PLATFORMS.find((p) => p.key === key)!;
}

/** Returns just the icon element for a platform */
export function PlatformIcon({ platform, size = 16 }: { platform: Platform; size?: number }) {
  const Icons = {
    instagram: FaInstagram,
    tiktok: FaTiktok,
    facebook: FaFacebook,
    whatsapp: FaWhatsapp,
  };
  const Icon = Icons[platform];
  return React.createElement(Icon, { size });
}
