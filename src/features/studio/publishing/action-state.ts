export type StudioActionState = {
  error: string | null;
};

export const initialStudioActionState: StudioActionState = { error: null };

export type StudioFormAction = (
  state: StudioActionState,
  formData: FormData,
) => Promise<StudioActionState>;
