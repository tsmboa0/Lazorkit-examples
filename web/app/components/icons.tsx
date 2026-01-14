export const FingerprintIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 6" />
        <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" />
        <path d="M8.65 22c.21-.66.45-1.32.57-2" />
        <path d="M9 6.8a6 6 0 0 1 5.77 8" />
        <path d="M12.8 10.7a2 2 0 0 1 .1 3.2" />
        <path d="M10.8 14.7c1.3 1.3 3.5 1.3 4.8 0" />
        <path d="M16 19.6a4 4 0 0 0 .5-6.6" />
        <path d="M15 8.4a8 8 0 0 1 3.9 12" />
        <path d="M19.4 15a10 10 0 0 0 .6-3" />
    </svg>
);

export const LockIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

export const PasskeyIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="12" cy="10" r="4" />
        <path d="M12 14v4" />
        <path d="M10 18h4" />
        <path d="M6 21v-2a6 6 0 0 1 12 0v2" />
    </svg>
);

export const LogOutIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
);

export const SwapIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M7 10L12 15L17 10" />
        <path d="M17 14L12 9L7 14" className="rotate-180 origin-center translate-y-[2px]" />
        {/* Simple up down arrows */}
        <path d="M7 20V4" />
        <path d="M17 4V20" />
        <path d="M21 16L17 20L13 16" />
        <path d="M3 8L7 4L11 8" />
    </svg>
);

export const ChevronDownIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M6 9l6 6 6-6" />
    </svg>
);
