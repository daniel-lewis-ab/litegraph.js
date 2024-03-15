export const RadioIcon = ({ className, filled }: { className?: string; filled?: boolean }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="7.5" stroke="currentColor" />
    {filled && <circle cx="8" cy="8" r="5" fill="currentColor" />}
  </svg>
);
