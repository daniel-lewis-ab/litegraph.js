type BadgeProps = {
  children: React.ReactNode;
};

export const Badge = ({ children }: BadgeProps) => (
  <div className="rounded-md bg-[#2D2D50] px-2 py-1 text-xs ">{children}</div>
);
