type BadgeProps = {
  children: React.ReactNode;
};

export const Badge = ({ children }: BadgeProps) => (
  <div className="rounded-3xl bg-surface-200 px-3 py-1.5 text-xs font-medium text-foreground">{children}</div>
);
