interface TeraIconProps {
  className?: string;
}

export const TeraIcon = ({ className }: TeraIconProps) => (
  <svg viewBox='0 0 32 32' className={className}>
    <defs>
      <linearGradient id='teraGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
        <stop offset='0%' style={{ stopColor: '#667eea' }} />
        <stop offset='100%' style={{ stopColor: '#764ba2' }} />
      </linearGradient>
    </defs>
    <polygon points='16,2 28,12 24,28 8,28 4,12' fill='url(#teraGradient)' />
    <polygon points='16,6 22,12 20,22 12,22 10,12' fill='rgba(255,255,255,0.2)' />
    <polygon points='16,6 10,12 12,22 16,24' fill='rgba(0,0,0,0.1)' />
    <polygon points='16,2 22,10 16,8 10,10' fill='rgba(255,255,255,0.3)' />
  </svg>
);
