type BadgeProps = {
  children: React.ReactNode;
};

export const Badge = ({ children }: BadgeProps) => (
  <div className="3xl bg-surface-1 px-3 py-1.5 text-xs font-medium text-text-base">{children}</div>
);
