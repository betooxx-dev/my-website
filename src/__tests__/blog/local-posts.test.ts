import { readLocalPosts } from "@/services/blog.service";

describe("Git-backed blog posts", () => {
  it("hides demo articles when the flag is off", async () => {
    expect(await readLocalPosts("es", false)).toEqual([]);
    expect(await readLocalPosts("en", false)).toEqual([]);
  });

  it("shows three localized articles when the demo flag is enabled", async () => {
    const spanish = await readLocalPosts("es", true);
    const english = await readLocalPosts("en", true);
    expect(spanish).toHaveLength(3);
    expect(english).toHaveLength(3);
    expect(spanish[0]?.cover).toBe("/blog/calm-software.png");
    expect(
      english.find((post) => post.slug === "designing-calm-software"),
    ).toMatchObject({ title: "Designing calm software" });
  });
});
