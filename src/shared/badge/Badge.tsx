type BadgeProps = {
  children: React.ReactNode;
};

export const Badge = ({ children }: BadgeProps) => (
  <div className="py-1 px-2 rounded-md text-xs bg-[#2D2D50] ">{children}</div>
);
