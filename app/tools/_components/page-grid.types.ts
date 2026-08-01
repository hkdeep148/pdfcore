import { ReactNode } from 'react';

export interface PageGridItem {
  id: string;
  preview?: string;  // ⭐ Changed from required to optional
  [key: string]: any;
}

export interface CardAction {
  icon: ReactNode;
  onClick: (e: React.MouseEvent) => void;
  label: string;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

export interface PageGridConfig {
  minCardSize?: number;
  gap?: number;
  aspectRatio?: string;
  showCheckbox?: boolean;
  showOrderBadge?: boolean;
  showRotationBadge?: boolean;
}