import { useQuery } from "react-query";
import Rimun from "src/entities";
import { infoService } from "src/services";

type ForumsInformation =
  | {
      isLoading: true;
    }
  | {
      isLoading: false;
      forums: Rimun.Forum[];
      getForumName: (id: Rimun.Identifier) => string | undefined;
    };

export default function useForumsInformation(): ForumsInformation {
  const { data, isLoading } = useQuery(["info", "forums"], () => infoService.getForums(), {
    cacheTime: Infinity,
    staleTime: Infinity,
  });

  if (isLoading || !data) return { isLoading: true };

  return {
    isLoading: false,
    forums: data.data.forums,
    getForumName: (id) => data.data.forums.find((f) => f.id === id)?.name,
  };
}
