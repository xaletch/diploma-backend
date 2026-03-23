import { STORAGE_URL } from "../constant/storage-url.constant";

export const buildFileUrl = (path: string | null) =>
  path ? `${STORAGE_URL}/${path}` : null;
