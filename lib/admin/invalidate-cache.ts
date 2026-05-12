import { updateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";

type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

export function invalidateCacheTags(...tags: CacheTag[]) {
  for (const tag of tags) {
    updateTag(tag);
  }
}
