import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import rehypeRaw from "rehype-raw";
import PersonItemBadge from "src/components/layout/list/utils/PersonItemBadge";
import Spinner from "src/components/status/Spinner";
import { NewsRouterOutputs, trpc } from "src/trpc";
import "./index.scss";

export default function LandingBlog() {
  const { data, isLoading } = trpc.news.getPosts.useQuery();

  if (!data || isLoading) return <Spinner />;

  return (
    <div id="blog">
      <div className="text-container">
        {data.map((p) => (
          <PostCard key={p.id} postData={p} />
        ))}
      </div>
    </div>
  );
}

interface PostCardProps {
  postData: NewsRouterOutputs["getPosts"][0];
}

function PostCard(props: PostCardProps) {
  return (
    <div className="post">
      <div className="post__header">
        <span className="post__header__main">
          <h2 className="post__header__main__title">{props.postData.title}</h2>
        </span>
        <div className="post__header__date">
          <CalendarDaysIcon />
          {new Date(props.postData.created_at).toDateString().slice(4)}
        </div>
      </div>
      <div className="post__author">
        <PersonItemBadge
          person={props.postData.author}
          description={
            props.postData.author.applications[0]?.confirmed_role?.name ??
            "Member of the RIMUN team"
          }
        />
      </div>

      <ReactMarkdown className="post__body" rehypePlugins={[rehypeRaw]}>
        {props.postData.body}
      </ReactMarkdown>
    </div>
  );
}
