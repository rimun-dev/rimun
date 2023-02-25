export function sortInCreationOrder<T extends { created_at: Date }>(
  a: T,
  b: T
): number {
  return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
}
