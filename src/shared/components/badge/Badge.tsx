type BadgeProps = {
  children: React.ReactNode;
};

export const Badge = ({ children }: BadgeProps) => (
  <div className="bg-surface-200 rounded-3xl px-3 py-1.5 text-xs font-medium text-foreground">{children}</div>
);
