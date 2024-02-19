import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import rehypeRaw from "rehype-raw";
import Spinner from "src/components/status/Spinner";
import { CDN_ENDPOINT } from "src/config";
import { trpc } from "src/trpc";

export default function LandingConferenceTheme() {
  const { data, isLoading } = trpc.info.getCurrentSession.useQuery();

  if (!data || isLoading) return <Spinner />;

  return (
    <div id="theme">
      <div
        className="hero"
        style={{ backgroundImage: `url(${CDN_ENDPOINT}/${data.image_path})` }}
      >
        <div className="hero__overlay" />
        <div className="hero__title">{data.title}</div>
        <div className="hero__description">{data.subtitle}</div>
      </div>
      <div className="container">
        <div id="theme-body" className="py-8 max-w-3xl mx-auto">
          <ReactMarkdown
            className="text-justify flex flex-col gap-4"
            rehypePlugins={[rehypeRaw]}
          >
            {data.description ?? ""}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
