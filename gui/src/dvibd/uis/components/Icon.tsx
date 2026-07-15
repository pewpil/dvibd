import type { JSX } from 'solid-js';

export type IconName =
  | 'social'
  | 'message'
  | 'productivity'
  | 'arrow'
  | 'check'
  | 'mail'
  | 'globe';

type Props = { name: IconName; size?: number };

export function Icon(props: Props): JSX.Element {
  const s = props.size ?? 24;
  const common = {
    width: s,
    height: s,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': 2,
    'stroke-linecap': 'round' as const,
    'stroke-linejoin': 'round' as const,
  };

  switch (props.name) {
    case 'social':
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3 20c0-3 2.5-5 6-5s6 2 6 5" />
          <circle cx="17.5" cy="7" r="2.5" />
          <path d="M15.5 14.5c2 .6 4 2.5 4 5.5" />
        </svg>
      );
    case 'message':
      return (
        <svg {...common}>
          <path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12z" />
        </svg>
      );
    case 'productivity':
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="17" rx="2" />
          <path d="M8 2v4M16 2v4M3 10h18" />
        </svg>
      );
    case 'arrow':
      return (
        <svg {...common}>
          <path d="M5 12h13M12 6l6 6-6 6" />
        </svg>
      );
    case 'check':
      return (
        <svg {...common}>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      );
    case 'mail':
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      );
    case 'globe':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18" />
        </svg>
      );
  }
}
