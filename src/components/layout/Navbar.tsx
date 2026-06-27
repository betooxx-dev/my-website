import { getTranslations } from "next-intl/server";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const t = await getTranslations("navbar");

  const links = [
    { href: "#experience", label: t("experience") },
    { href: "#projects", label: t("projects") },
    { href: "#certifications", label: t("certifications") },
    { href: "/blog", label: t("blog") },
  ];

  return (
    <NavbarClient
      closeMenuLabel={t("closeMenu")}
      contact={t("contact")}
      links={links}
      menuLabel={t("menu")}
    />
  );
}
