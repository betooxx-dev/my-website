export function createLlmsTxt(siteUrl: string): string {
  const base = siteUrl.replace(/\/+$/, "");

  return `# Alberto Avendaño

> Personal portfolio of Alberto Avendaño, a software engineer focused on product engineering, digital experiences, and operational improvement.

The portfolio is available in Spanish and English. It presents Alberto's professional profile, selected work, verified certifications, and public contact channels.

## Portfolio

- [Portfolio in Spanish](${base}/es): Spanish-language landing page and primary presentation.
- [Portfolio in English](${base}/en): English-language version of the portfolio.
- [Verified certifications](${base}/es#certifications): AWS Academy and Cisco credentials with links to their Credly records.
- [Professional experience](${base}/es#experience): Organizations Alberto has collaborated with.

## Profiles

- [LinkedIn](https://www.linkedin.com/in/alberto-avenda%C3%B1o): Professional profile and work history.
- [X](https://x.com/betooxx_dev): Public posts and direct contact channel.

## Optional

- [Contact](${base}/es#contact): Email and social contact options.
`;
}
