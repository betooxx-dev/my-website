export const siteProfile = {
  email: "avendanoargueta.josealberto@gmail.com",
  firstName: "Alberto",
  image: "/banner-com-02.png",
  name: "Alberto Avendaño",
  whatsapp: {
    href: "https://wa.me/529631683016",
    phone: "+52 963 168 3016",
  },
  social: {
    facebook: {
      href: "https://www.facebook.com/alberto.avendano.205880",
      name: "Facebook",
    },
    instagram: {
      href: "https://www.instagram.com/avendanooxx",
      name: "Instagram",
    },
    linkedin: {
      href: "https://www.linkedin.com/in/alberto-avenda%C3%B1o",
      name: "LinkedIn",
    },
    tiktok: {
      href: "https://www.tiktok.com/@avendanooxx",
      name: "TikTok",
    },
    x: {
      href: "https://x.com/betooxx_dev",
      handle: "@betooxx_dev",
      name: "X",
    },
  },
} as const;

export const siteSocialUrls = Object.values(siteProfile.social).map(
  ({ href }) => href,
);
