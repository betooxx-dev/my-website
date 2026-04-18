import { getTranslations } from "next-intl/server";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const t = await getTranslations("navbar");

  const labels = {
    home: t("home"),
    blog: t("blog"),
    now: t("now"),
    contact: t("contact"),
  };

  return <NavbarClient labels={labels} />;
}
