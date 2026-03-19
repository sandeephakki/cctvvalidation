export default function HakkiEyeLogo({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <ellipse cx="22" cy="24" rx="8" ry="11" fill="#1877C8" transform="rotate(-15 22 24)" />
      <path d="M16 32 Q12 40 10 38 Q14 35 16 32Z" fill="#0C447C" />
      <line x1="22" y1="20" x2="6" y2="10" stroke="#1877C8" strokeWidth="2.5" strokeLinecap="round" opacity="0.9"/>
      <line x1="22" y1="21" x2="5" y2="16" stroke="#1877C8" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
      <line x1="22" y1="22" x2="7" y2="23" stroke="#1877C8" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <rect x="4" y="7" width="4" height="4" rx="1" fill="#5DCAA5" opacity="0.9"/>
      <rect x="1" y="14" width="3" height="3" rx="0.8" fill="#5DCAA5" opacity="0.7"/>
      <rect x="9" y="4" width="3" height="3" rx="0.8" fill="#7F77DD" opacity="0.85"/>
      <rect x="2" y="21" width="3" height="3" rx="0.8" fill="#7F77DD" opacity="0.6"/>
      <circle cx="27" cy="14" r="6" fill="#1877C8"/>
      <circle cx="29" cy="13" r="2" fill="#0C447C"/>
      <circle cx="29.8" cy="12.3" r="0.7" fill="white"/>
      <path d="M32 13 L37 11 L33 15Z" fill="#0C447C"/>
    </svg>
  )
}
