export type StudioIconName =
  | "arrow"
  | "chevron"
  | "dashboard"
  | "external"
  | "image"
  | "lock"
  | "logout"
  | "people"
  | "settings"
  | "sidebar"
  | "spark"
  | "studio"
  | "tasks"
  | "user"
  | "writing";

type StudioIconProps = {
  className?: string;
  name: StudioIconName;
};

const iconPaths: { [key in StudioIconName]: string[] } = {
  arrow: ["M5 12h14", "m14 7 5 5-5 5"],
  chevron: ["m8 10 4 4 4-4"],
  dashboard: [
    "M4.5 3h4A1.5 1.5 0 0 1 10 4.5v4A1.5 1.5 0 0 1 8.5 10h-4A1.5 1.5 0 0 1 3 8.5v-4A1.5 1.5 0 0 1 4.5 3Z",
    "M15.5 3h4A1.5 1.5 0 0 1 21 4.5v4a1.5 1.5 0 0 1-1.5 1.5h-4A1.5 1.5 0 0 1 14 8.5v-4A1.5 1.5 0 0 1 15.5 3Z",
    "M4.5 14h4a1.5 1.5 0 0 1 1.5 1.5v4A1.5 1.5 0 0 1 8.5 21h-4A1.5 1.5 0 0 1 3 19.5v-4A1.5 1.5 0 0 1 4.5 14Z",
    "M15.5 14h4a1.5 1.5 0 0 1 1.5 1.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a1.5 1.5 0 0 1-1.5-1.5v-4a1.5 1.5 0 0 1 1.5-1.5Z",
  ],
  external: [
    "M15 4h5v5",
    "m10 14 10-10",
    "M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6",
  ],
  image: [
    "M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z",
    "M10 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z",
    "m21 15-4.5-4.5L6 20",
  ],
  lock: [
    "M7 11h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z",
    "M8 11V8a4 4 0 0 1 8 0v3",
  ],
  logout: [
    "M10 17l5-5-5-5",
    "M15 12H3",
    "M15 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4",
  ],
  people: [
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
    "M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
    "M22 21v-2a4 4 0 0 0-3-3.87",
    "M16 3.13a4 4 0 0 1 0 7.75",
  ],
  settings: [
    "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
    "M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.55V21h-4v-.08a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3v-4h.08a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3h4v.08a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.55 1H21v4h-.08a1.7 1.7 0 0 0-1.52 1Z",
  ],
  sidebar: ["M4 5h16v14H4z", "M9 5v14", "m15 9-3 3 3 3"],
  spark: [
    "m12 3-1.4 3.6L7 8l3.6 1.4L12 13l1.4-3.6L17 8l-3.6-1.4L12 3Z",
    "m5 14-.8 2.2L2 17l2.2.8L5 20l.8-2.2L8 17l-2.2-.8L5 14Z",
    "m18 14-.8 2.2L15 17l2.2.8L18 20l.8-2.2L21 17l-2.2-.8L18 14Z",
  ],
  studio: [
    "M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z",
    "M20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5a2.5 2.5 0 0 1 2.5 2V5.5Z",
    "m16.5 6-.55 1.45L14.5 8l1.45.55L16.5 10l.55-1.45L18.5 8l-1.45-.55L16.5 6Z",
  ],
  tasks: ["m9 11 2 2 4-4", "M21 12a9 9 0 1 1-4.2-7.6"],
  user: ["M20 21a8 8 0 0 0-16 0", "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"],
  writing: ["M12 20h9", "M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z"],
};

export function StudioIcon({ className = "size-5", name }: StudioIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      {iconPaths[name].map((path) => (
        <path d={path} key={path} />
      ))}
    </svg>
  );
}
