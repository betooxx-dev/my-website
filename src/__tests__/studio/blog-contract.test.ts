import {
  studioBlogSuccessUrl,
  studioPostRecoveryKey,
} from "@/features/studio/publishing/feedback";
import { draftStudioPostInput } from "@/features/studio/publishing/post-form";

describe("studio blog contract", () => {
  it("maps the editor form into the backend draft payload without publication state", () => {
    const formData = new FormData();
    formData.set("title", "  Draft title ");
    formData.set("slug", "draft-title");
    formData.set("locale", "EN");
    formData.set("excerpt", " Short excerpt ");
    formData.set("contentMarkdown", "# Body\n\n![Diagram](/asset.png)");
    formData.set("category", " Engineering ");
    formData.set("coverAssetId", "beeea3b0-ce1f-4d2a-bc9c-88e832fbc5e1");
    formData.set("featured", "on");
    formData.set("tags", "ai, crm, ");

    expect(draftStudioPostInput(formData)).toEqual({
      category: "Engineering",
      contentMarkdown: "# Body\n\n![Diagram](/asset.png)",
      coverAssetId: "beeea3b0-ce1f-4d2a-bc9c-88e832fbc5e1",
      excerpt: "Short excerpt",
      featured: true,
      locale: "en",
      slug: "draft-title",
      tags: ["ai", "crm"],
      title: "Draft title",
    });
  });

  it("returns successful mutations with the recovery key to clear", () => {
    expect(studioBlogSuccessUrl("new-post")).toBe(
      "/studio/blog?saved=new-post",
    );
    expect(studioPostRecoveryKey("post/id with spaces")).toBe(
      "post-post/id with spaces",
    );
    expect(
      studioBlogSuccessUrl(studioPostRecoveryKey("post/id with spaces")),
    ).toBe("/studio/blog?saved=post-post%2Fid+with+spaces");
  });

  it("maps an empty cover selection to null so PATCH clears a draft cover", () => {
    const formData = new FormData();
    formData.set("coverAssetId", "");

    expect(draftStudioPostInput(formData).coverAssetId).toBeNull();
  });
});
