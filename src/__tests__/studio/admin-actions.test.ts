import { revalidatePath, updateTag } from "next/cache";
import { deleteAssetAction, deletePostAction } from "@/app/studio/blog/actions";
import { requireStudioSession } from "@/features/studio/auth/session";
import { StudioService } from "@/services/studio.service";

jest.mock("../../features/studio/auth/session", () => ({
  requireStudioSession: jest.fn(),
}));
jest.mock("../../services/studio.service", () => ({
  StudioService: {
    getPost: jest.fn(),
    deletePost: jest.fn(),
    deleteAsset: jest.fn(),
  },
}));
jest.mock("next/cache", () => ({
  unstable_cache: (fn: unknown) => fn,
  revalidatePath: jest.fn(),
  updateTag: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  redirect: jest.fn(() => {
    throw new Error("redirect");
  }),
}));

const state = { error: null };
function form() {
  const data = new FormData();
  data.set("id", "post-id");
  return data;
}

beforeEach(() => jest.resetAllMocks());

test("rejects an unauthenticated deletion before contacting Argos", async () => {
  jest
    .mocked(requireStudioSession)
    .mockRejectedValue(new Error("authentication"));
  await expect(deletePostAction(state, form())).rejects.toThrow(
    "authentication",
  );
  expect(StudioService.getPost).not.toHaveBeenCalled();
  expect(StudioService.deletePost).not.toHaveBeenCalled();
});

test("returns deletion errors without redirecting or invalidating editor data", async () => {
  jest
    .mocked(StudioService.getPost)
    .mockResolvedValue({ locale: "es", slug: "actual" } as Awaited<
      ReturnType<typeof StudioService.getPost>
    >);
  jest
    .mocked(StudioService.deletePost)
    .mockRejectedValue(new Error("Argos no está disponible"));
  const data = form();
  data.set("title", "Trabajo sin guardar");
  expect(await deletePostAction(state, data)).toEqual({
    error: "Argos no está disponible",
  });
  expect(data.get("title")).toBe("Trabajo sin guardar");
  expect(revalidatePath).not.toHaveBeenCalled();
});

test("invalidates the real deleted post, public caches and sitemap", async () => {
  jest
    .mocked(StudioService.getPost)
    .mockResolvedValue({ locale: "en", slug: "actual-slug" } as Awaited<
      ReturnType<typeof StudioService.getPost>
    >);
  await deletePostAction(state, form());
  expect(StudioService.deletePost).toHaveBeenCalledWith("post-id");
  expect(updateTag).toHaveBeenCalled();
  expect(revalidatePath).toHaveBeenCalledWith("/en/blog/actual-slug");
  expect(revalidatePath).toHaveBeenCalledWith("/sitemap.xml");
});

test("preserves a referenced-image error and refreshes only after successful deletion", async () => {
  jest
    .mocked(StudioService.deleteAsset)
    .mockRejectedValueOnce(new Error("La imagen está siendo utilizada"));
  expect(await deleteAssetAction(state, form())).toEqual({
    error: "La imagen está siendo utilizada",
  });
  expect(revalidatePath).not.toHaveBeenCalled();
  jest.mocked(StudioService.deleteAsset).mockResolvedValue({ deleted: true });
  expect(await deleteAssetAction(state, form())).toEqual({ error: null });
  expect(revalidatePath).toHaveBeenCalledWith("/studio/blog");
});
