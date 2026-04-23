import { getTranslations } from "next-intl/server";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const t = await getTranslations("navbar");
  return <NavbarClient contact={t("contact")} />;
}
