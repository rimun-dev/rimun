import { NewsRouterOutputs } from "src/trpc";

export const TARGET_AUDIENCES = ["PERSON", "SCHOOL", "ALL"] as const;

export function extractTargetAudienceFromPost(
  blogPost: NewsRouterOutputs["getPosts"][0]
) {
  let target = "ALL";
  if (!(blogPost.is_for_persons && blogPost.is_for_schools)) {
    target = blogPost.is_for_persons ? "PERSON" : "SCHOOL";
  } else {
    target = "ALL";
  }
  return target;
}
