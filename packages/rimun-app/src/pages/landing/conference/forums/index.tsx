import {
  Bars3Icon,
  DocumentArrowDownIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Link, useLocation } from "react-router-dom";
import rehypeRaw from "rehype-raw";
import AvatarCircle from "src/components/imgs/AvatarCircle";
import Banner from "src/components/status/Banner";
import Spinner from "src/components/status/Spinner";
import { CDN_ENDPOINT } from "src/config";
import { InfoRouterOutputs, trpc } from "src/trpc";
import "./index.scss";

export default function LandingConferenceForums() {
  const { data, isLoading } = trpc.info.getForums.useQuery();
  const location = useLocation();

  if (!data || isLoading) return <Spinner />;

  return (
    <div id="forums">
      <Menu data={data} />
      <ForumPage
        forumData={
          data.forums.find((f) =>
            location.pathname.includes(f.acronym.toLowerCase())
          )!
        }
      />
    </div>
  );
}

function Menu(props: { data: InfoRouterOutputs["getForums"] }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  return (
    <div id="forums-nav" className={isOpen ? "open" : undefined}>
      <div id="clickout" onClick={() => setIsOpen(false)}></div>
      <div className="container">
        <button
          id="forums-btn"
          className="btn btn-sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Bars3Icon className="w-4 h-4" />
          <span>All Forums</span>
        </button>
        <nav id="forums-dropdown" className={isOpen ? "open" : undefined}>
          <ul>
            {props.data.forums.map((f) => (
              <li
                key={f.id}
                className={
                  location.pathname.includes(f.acronym) ? "selected" : undefined
                }
              >
                <Link to={`/conference/forums/${f.acronym.toLowerCase()}`}>
                  <span>{f.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

interface ForumPageProps {
  forumData: InfoRouterOutputs["getForums"]["forums"][0];
}

function ForumPage(props: ForumPageProps) {
  const { data, isLoading } = trpc.search.searchPersons.useQuery({
    filters: {
      application: {
        status_application: "ACCEPTED",
        confirmed_role: {
          forum: { acronym: props.forumData.acronym },
        },
      },
    },
  });

  if (!data || isLoading) return <Spinner />;

  return (
    <>
      <div
        id="forum-bg"
        style={{
          backgroundImage: `url(${CDN_ENDPOINT}/${props.forumData.image_path})`,
        }}
      >
        <div className="container" id="forum-name">
          <h1>{props.forumData.name}</h1>
        </div>
      </div>
      <div className="container">
        <div id="forum-description">
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>
            {props.forumData.description ?? ""}
          </ReactMarkdown>
        </div>
        <ul id="forum-mains">
          {data.result.map((pa) => (
            <li key={pa.id} className="main">
              <AvatarCircle path={pa.person.picture_path} format="md" />
              <div className="main__text">
                <p className="main__text__name">{pa.person.full_name}</p>
                <p className="main__text__role">{pa.confirmed_role?.name}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="container" id="forum-committees">
        {props.forumData.committees.map((c) => (
          <CommitteeItem key={c.id} committeeData={c} />
        ))}
      </div>
      {props.forumData.committees.length === 0 && (
        <div className="container">
          <Banner status="info" title="Committees">
            The committees for this forum have not been announced yet.
          </Banner>
        </div>
      )}
    </>
  );
}

interface CommitteeItemProps {
  committeeData: InfoRouterOutputs["getForums"]["forums"][0]["committees"][0];
}

function CommitteeItem(props: CommitteeItemProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={`committee ${isOpen ? "open" : undefined}`}>
      <div className="committee-header" onClick={() => setIsOpen(!isOpen)}>
        <span>{props.committeeData.name}</span>
        <div className="committee__header__icon">
          <PlusIcon className="w-6 h-6" />
        </div>
      </div>

      <div className={isOpen ? "committee-body" : "hidden"}>
        {!!props.committeeData.topics && (
          <div className="committee-body__section">
            <h3>Topics</h3>
            <ul className="topics">
              {props.committeeData.topics.map((t) => (
                <li key={t.id} className="topic">
                  <span className="topic__name">{t.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div
          className="committee-body__section"
          v-if="committeeData.chairs && committeeData.chairs.length > 0"
        >
          <h3>Chairs</h3>
          <ul>
            {props.committeeData.person_applications.map((pa) => (
              <li key={pa.id} className="chair">
                <AvatarCircle path={pa.person.picture_path} format="md" />
                <div className="chair__text">
                  <p className="chair__text__name">{pa.person.full_name}</p>
                  <p className="chair__text__role">{pa.confirmed_role?.name}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {!!props.committeeData.report && (
          <div className="committee-body__section">
            <h3>Background Guide</h3>
            <a
              className="guide__link text-blue-500 hover:underline"
              target="_blank"
              href={`${CDN_ENDPOINT}/${props.committeeData.report?.document_path}`}
              download
            >
              <DocumentArrowDownIcon className="w-4 h-4" />
              <span>Download</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
