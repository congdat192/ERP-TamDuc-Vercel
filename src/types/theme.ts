
export type ThemeMode = 'light' | 'dark';

export type ThemePreset = 'preset1' | 'preset2';

export interface ThemeConfig {
  mode: ThemeMode;
  preset: ThemePreset;
  userId?: string; // For future backend sync
}

export interface PresetColor {
  id: ThemePreset;
  name: string;
  primary: string;
  secondary: string;
  gradient: string;
}

export const THEME_PRESETS: PresetColor[] = [
  {
    id: 'preset1',
    name: 'Purple Blue',
    primary: '#A389F4',
    secondary: '#70D8FF',
    gradient: 'linear-gradient(135deg, #A389F4, #70D8FF)'
  },
  {
    id: 'preset2',
    name: 'Teal Green',
    primary: '#4BCB9A',
    secondary: '#455A64',
    gradient: 'linear-gradient(135deg, #4BCB9A, #455A64)'
  }
];
