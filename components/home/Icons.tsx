export type IconName =
  | "search"
  | "audit"
  | "execute"
  | "consult"
  | "quality"
  | "security"
  | "compliance"
  | "communication";

export function Arrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Check() {
  return (
    <svg aria-hidden="true" viewBox="0 0 18 18" fill="none">
      <path d="m4.5 9.4 2.7 2.7 6.3-6.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    search: <><circle cx="10.5" cy="10.5" r="5.5" /><path d="m15 15 4 4M4 4h5M4 7h3" /></>,
    audit: <><path d="M8 4h8l3 3v13H8z" /><path d="M16 4v4h4M11 12l2 2 4-4M4 8v12" /></>,
    execute: <><path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5z" /><path d="m4 7.5 8 4.5 8-4.5M12 12v9" /></>,
    consult: <><circle cx="9" cy="8" r="4" /><path d="M3 20c.5-4 2.5-6 6-6s5.5 2 6 6M17 8h4M19 6v4" /></>,
    quality: <><path d="M12 3 5 6v5c0 4.6 2.8 8 7 10 4.2-2 7-5.4 7-10V6z" /><path d="m8.5 12 2.2 2.2 4.8-5" /></>,
    security: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></>,
    compliance: <><path d="M7 3h10l3 3v15H7z" /><path d="M17 3v4h4M10 12h7M10 16h7" /></>,
    communication: <><path d="M4 5h16v11H9l-5 4z" /><path d="M8 9h8M8 12h5" /></>,
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}
