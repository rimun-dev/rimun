import Rimun from "src/entities";

export function sortInCreationOrder<T extends Rimun.UniqueEntity>(a: T, b: T): number {
  return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
}
