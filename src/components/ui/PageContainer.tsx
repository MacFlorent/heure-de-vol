import { memo } from "react";

interface PageContainerProps {
  children: React.ReactNode;
}

export const PageContainer = memo(({ children }: PageContainerProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      {children}
    </div>
  );
});

PageContainer.displayName = "PageContainer";
