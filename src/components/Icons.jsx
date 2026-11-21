export function WhatsAppIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" fill="currentColor">
      <path d="M16.04 3C9.4 3 4 8.4 4 15.03c0 2.12.55 4.19 1.6 6.01L4 29l8.17-1.57a12.03 12.03 0 0 0 3.87.63h.01C22.7 28.06 28 22.66 28 16.03 28 9.4 22.68 3 16.04 3Zm0 22.03h-.01c-1.2 0-2.38-.32-3.4-.93l-.25-.15-4.85.93.97-4.72-.16-.26a9.98 9.98 0 0 1-1.54-5.3c0-5.5 4.5-9.97 10.04-9.97 5.54 0 9.96 4.47 9.96 9.97 0 5.5-4.46 10.43-10.76 10.43Zm5.5-7.5c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.17.2-.35.23-.65.08-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.65-.93-2.25-.25-.6-.5-.5-.68-.5h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5 0 1.48 1.08 2.9 1.23 3.1.15.2 2.12 3.23 5.13 4.53.72.3 1.28.5 1.72.64.72.23 1.37.2 1.88.12.57-.08 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35Z" />
    </svg>
  )
}

export function InstagramIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** Logo: „BIZI” colorat + forme geometrice, pe fundal negru */
export function Logo({ height = 40 }) {
  return (
    <svg height={height} viewBox="0 0 190 64" role="img" aria-label="BiziJoc" className="logo">
      <rect width="190" height="64" rx="14" fill="#111" />
      <circle cx="170" cy="14" r="6" fill="#FFC93C" />
      <path d="M160 52 L172 52 L166 40Z" fill="#2A9DF4" />
      <rect x="176" y="30" width="8" height="8" rx="2" fill="#E63946" />
      <text x="16" y="47" fontFamily='"Fredoka Variable", system-ui, sans-serif' fontWeight="700" fontSize="42" letterSpacing="1">
        <tspan fill="#E63946">B</tspan>
        <tspan fill="#2A9DF4">I</tspan>
        <tspan fill="#FFC93C">Z</tspan>
        <tspan fill="#E63946">I</tspan>
      </text>
    </svg>
  )
}

export const icons = {
  gift: (
    <svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="18" width="36" height="8" rx="2" /><path d="M10 26v16h28V26M24 18v24" /><path d="M24 18c-6 0-10-2-10-6a4 4 0 0 1 7-2l3 8Zm0 0c6 0 10-2 10-6a4 4 0 0 0-7-2l-3 8Z" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="25" r="17" /><path d="M24 14v11l7 5M18 4h12" />
    </svg>
  ),
  truck: (
    <svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12h26v22H4zM30 20h9l5 7v7H30z" /><circle cx="14" cy="36" r="4" fill="var(--cream)" /><circle cx="37" cy="36" r="4" fill="var(--cream)" />
    </svg>
  ),
  chat: (
    <svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 10h36v24H20l-9 8v-8H6z" /><path d="M14 19h20M14 26h12" />
    </svg>
  ),
}
