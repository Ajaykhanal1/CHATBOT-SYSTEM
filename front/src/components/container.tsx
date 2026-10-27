interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function Container({ children, className = "", as: Component = "div" }: ContainerProps) {
  return (
    <Component
      className={`mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 ${className}`.trim()}
    >
      {children}
    </Component>
  );
}

export default Container;
