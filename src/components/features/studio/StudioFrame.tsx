"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { studioCopy } from "@/lib/studio-content";
import { StudioIcon, type StudioIconName } from "./StudioIcon";

const SIDEBAR_PREFERENCE_KEY = "studio.sidebar.v1";

type StudioFrameProps = {
  active: "dashboard" | "blog";
  children?: React.ReactNode;
};

type StudioNavItem = {
  href: string;
  icon: StudioIconName;
  id: StudioFrameProps["active"];
  label: string;
};

export function StudioFrame({ active, children }: StudioFrameProps) {
  const { shell } = studioCopy;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const primaryItems: StudioNavItem[] = [
    {
      href: "/studio",
      icon: "dashboard",
      id: "dashboard",
      label: shell.dashboard,
    },
    {
      href: "/studio/blog",
      icon: "writing",
      id: "blog",
      label: shell.writing,
    },
  ];

  useEffect(function restoreSidebarPreference() {
    setIsCollapsed(
      window.localStorage.getItem(SIDEBAR_PREFERENCE_KEY) === "collapsed",
    );
  }, []);

  function toggleSidebar() {
    const nextCollapsedState = !isCollapsed;
    setIsCollapsed(nextCollapsedState);
    window.localStorage.setItem(
      SIDEBAR_PREFERENCE_KEY,
      nextCollapsedState ? "collapsed" : "expanded",
    );
  }

  return (
    <div className="studio-shell relative min-h-screen bg-muted/45 text-foreground">
      <a
        className="sr-only z-[100] rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground shadow-lg focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        href="#studio-main"
      >
        {shell.skipToContent}
      </a>

      <div
        className={`relative mx-auto grid min-h-screen max-w-[118rem] gap-3 p-2.5 transition-[grid-template-columns] duration-200 ease-out motion-reduce:transition-none sm:p-4 lg:gap-4 lg:p-5 ${
          isCollapsed
            ? "lg:grid-cols-[8rem_minmax(0,1fr)]"
            : "lg:grid-cols-[16.5rem_minmax(0,1fr)]"
        }`}
      >
        <aside className="overflow-hidden rounded-[1.6rem] border border-border/80 bg-card shadow-[0_20px_60px_-48px_color-mix(in_oklch,var(--foreground)_32%,transparent)] lg:sticky lg:top-5 lg:flex lg:h-[calc(100dvh-2.5rem)] lg:flex-col">
          <div
            className={`flex items-start justify-between gap-2 px-5 pt-5 sm:px-6 sm:pt-6 ${
              isCollapsed
                ? "lg:flex-row lg:items-center lg:justify-center lg:px-3"
                : ""
            }`}
          >
            <Link
              aria-label={shell.dashboardLabel}
              className={`group inline-flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-card ${
                isCollapsed ? "lg:justify-center lg:gap-0" : ""
              }`}
              href="/studio"
            >
              <span
                className="grid size-11 shrink-0 place-items-center rounded-[0.9rem] bg-primary text-primary-foreground shadow-[0_12px_28px_-18px_color-mix(in_oklch,var(--primary)_75%,transparent)] transition-transform duration-200 group-hover:-rotate-2 motion-reduce:transition-none"
                data-testid="studio-brand-mark"
              >
                <StudioIcon className="size-6" name="studio" />
              </span>
              <span className={isCollapsed ? "lg:hidden" : ""}>
                <span className="block font-heading text-2xl font-bold leading-none tracking-tight">
                  {shell.brand}
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {shell.owner}
                </span>
              </span>
            </Link>

            <button
              aria-controls="studio-sidebar-navigation"
              aria-expanded={!isCollapsed}
              aria-label={
                isCollapsed ? shell.expandSidebar : shell.collapseSidebar
              }
              className="hidden size-11 shrink-0 cursor-pointer place-items-center rounded-xl border border-border bg-background text-muted-foreground transition-[border-color,color,transform] duration-200 hover:border-primary/35 hover:text-primary active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transition-none lg:grid"
              onClick={toggleSidebar}
              title={isCollapsed ? shell.expandSidebar : shell.collapseSidebar}
              type="button"
            >
              <StudioIcon
                className={`size-[1.1rem] transition-transform duration-200 motion-reduce:transition-none ${
                  isCollapsed ? "rotate-180" : ""
                }`}
                name="sidebar"
              />
            </button>
          </div>

          <nav
            aria-label={shell.navigationLabel}
            className={`hide-scrollbar mt-5 flex gap-2 overflow-x-auto px-4 pb-3 sm:px-5 lg:mt-8 lg:grid lg:overflow-visible lg:pb-0 ${
              isCollapsed ? "lg:px-3" : ""
            }`}
            id="studio-sidebar-navigation"
          >
            {primaryItems.map((item) => (
              <Link
                aria-current={item.id === active ? "page" : undefined}
                aria-label={item.label}
                className={`relative inline-flex min-h-12 shrink-0 items-center gap-3 rounded-xl px-4 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transition-none ${
                  isCollapsed ? "lg:justify-center lg:gap-0 lg:px-0" : ""
                } ${
                  item.id === active
                    ? "bg-muted text-foreground before:absolute before:inset-y-3 before:left-0 before:w-1 before:rounded-full before:bg-primary"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                }`}
                href={item.href}
                key={item.id}
              >
                <StudioIcon className="size-[1.15rem]" name={item.icon} />
                <span className={isCollapsed ? "lg:hidden" : ""}>
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          <div
            className={`flex items-center justify-between gap-2 border-border/80 border-t px-5 py-4 sm:px-6 lg:mt-auto lg:py-5 ${
              isCollapsed ? "lg:flex-col lg:px-3" : "lg:block"
            }`}
          >
            <Link
              aria-label={shell.publicSite}
              className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transition-none lg:px-3 ${
                isCollapsed ? "lg:w-11 lg:justify-center lg:gap-0 lg:px-0" : ""
              }`}
              href="/es"
            >
              <StudioIcon className="size-4" name="external" />
              <span className={isCollapsed ? "lg:hidden" : ""}>
                {shell.publicSite}
              </span>
            </Link>

            <form
              action="/api/studio/logout"
              className={isCollapsed ? "" : "lg:mt-2"}
              method="post"
            >
              <button
                aria-label={shell.logout}
                className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/7 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transition-none ${
                  isCollapsed
                    ? "lg:w-11 lg:justify-center lg:gap-0 lg:px-0"
                    : ""
                }`}
                type="submit"
              >
                <StudioIcon className="size-4" name="logout" />
                <span className={isCollapsed ? "lg:hidden" : ""}>
                  {shell.logout}
                </span>
              </button>
            </form>
          </div>
        </aside>

        <main className="min-w-0 pb-8" id="studio-main">
          {children}
        </main>
      </div>
    </div>
  );
}
