export interface ColorsData {
  // Core backgrounds
  bg?: string;
  bgElev?: string;
  bgCard?: string;
  // Text
  fg?: string;
  fgMuted?: string;
  fgFaint?: string;
  // Borders
  line?: string;
  lineStrong?: string;
  // Accent / interactive
  accent?: string;
  accentSoft?: string;
  accentFg?: string;
}

/**
 * Maps every admin color field directly to its CSS variable.
 * Values can be any valid CSS color: oklch(), hex, hsl(), etc.
 */
export function buildColorVars(colors: ColorsData): string {
  const map: Record<string, string | undefined> = {
    '--bg':           colors.bg,
    '--bg-elev':      colors.bgElev,
    '--bg-card':      colors.bgCard,
    '--fg':           colors.fg,
    '--fg-muted':     colors.fgMuted,
    '--fg-faint':     colors.fgFaint,
    '--line':         colors.line,
    '--line-strong':  colors.lineStrong,
    '--accent':       colors.accent,
    '--accent-soft':  colors.accentSoft,
    '--accent-fg':    colors.accentFg,
  };

  const rules = Object.entries(map)
    .filter(([, v]) => v && v.trim() !== '' && v.trim() !== '#')
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');

  if (!rules) return '';

  // Only override dark theme so light theme uses original :root defaults from globals.css
  return `[data-theme="dark"] {\n${rules}\n}`;
}
