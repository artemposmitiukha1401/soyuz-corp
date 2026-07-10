"use client";

import { usePathname } from "next/navigation";
import PageTitleGenerator from "@/src/components/PageTitleGenerator";
import { routeConfig, type RouteConfig } from "@/src/config/routes";

const PageHero = () => {
  const pathname: string = usePathname();
  const pageConfig: RouteConfig | undefined = routeConfig[pathname];

  if (!pageConfig) {
    return null;
  }

  return (
    <PageTitleGenerator
      imageUrl={pageConfig.imageUrl}
      text={pageConfig.title}
    />
  );
};

export default PageHero;
