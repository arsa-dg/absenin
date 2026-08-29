import type { CSSProperties, HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  borderColor?: string;
}

export function Card({
  children,
  className = "",
  borderColor = "#1e293b",
  style,
  ...props
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-md border-2 shadow-[4px_4px_0px_0px_var(--card-border)] hover:shadow-[2px_2px_0px_0px_var(--card-border)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-200 ${className}`}
      style={{
        borderColor: borderColor,
        "--card-border": borderColor,
        ...style,
      } as CSSProperties}
      {...props}
    >
      {children}
    </div>
  );
}