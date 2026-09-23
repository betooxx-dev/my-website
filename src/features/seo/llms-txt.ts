import { siteProfile } from "@/config/site-profile";

export function createLlmsTxt(siteUrl: string): string {
  const base = siteUrl.replace(/\/+$/, "");

  return `# ${siteProfile.name}

> Personal website of ${siteProfile.name}, a software engineer focused on product engineering, digital experiences, and operational improvement.

The website is available in Spanish and English. It presents Alberto's professional profile, selected work, verified certifications, and public contact channels.

## Website

- [Website in Spanish](${base}/es): Spanish-language homepage and primary presentation.
- [Website in English](${base}/en): English-language version of the website.
- [Verified certifications](${base}/es#certifications): AWS Academy and Cisco credentials with links to their Credly records.
- [Professional experience](${base}/es#experience): Organizations Alberto has collaborated with.

## Profiles

- [LinkedIn](${siteProfile.social.linkedin.href}): Professional profile and work history.
- [X](${siteProfile.social.x.href}): Public posts and direct contact channel.

## Optional

- [Contact](${base}/es#contact): WhatsApp and social contact options.
`;
}
