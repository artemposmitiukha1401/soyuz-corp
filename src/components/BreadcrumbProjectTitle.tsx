"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type BreadcrumbProjectTitleContextValue = {
  projectTitle: string | null;
  setProjectTitle: (title: string | null) => void;
};

type BreadcrumbProjectTitleProviderProps = {
  children: ReactNode;
};

type ProjectBreadcrumbTitleProps = {
  title: string;
};

const BreadcrumbProjectTitleContext = createContext<BreadcrumbProjectTitleContextValue | null>(null);

const useBreadcrumbProjectTitle = (): BreadcrumbProjectTitleContextValue => {
  const context: BreadcrumbProjectTitleContextValue | null = useContext(BreadcrumbProjectTitleContext);

  if (context === null) {
    throw new Error("Project breadcrumb title must be used inside its provider.");
  }

  return context;
};

export const BreadcrumbProjectTitleProvider = ({
  children,
}: BreadcrumbProjectTitleProviderProps): ReactNode => {
  const [projectTitle, setProjectTitle] = useState<string | null>(null);

  return (
    <BreadcrumbProjectTitleContext.Provider value={{ projectTitle, setProjectTitle }}>
      {children}
    </BreadcrumbProjectTitleContext.Provider>
  );
};

export const ProjectBreadcrumbTitle = ({ title }: ProjectBreadcrumbTitleProps): null => {
  const { setProjectTitle } = useBreadcrumbProjectTitle();

  useEffect(() => {
    setProjectTitle(title);

    return () => {
      setProjectTitle(null);
    };
  }, [setProjectTitle, title]);

  return null;
};

export const useProjectBreadcrumbTitle = (): string | null => {
  const { projectTitle } = useBreadcrumbProjectTitle();
  return projectTitle;
};
