import {
  CalendarDaysIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import Logo from "src/components/brand/Logo";
import BaseRemoteImage from "src/components/imgs/BaseRemoteImage";
import Card from "src/components/layout/Card";
import Spinner from "src/components/status/Spinner";
import { TimelineRouterOutputs, trpc } from "src/trpc";
import { downloadDocument } from "src/utils/download";
import "./index.scss";

type TimelineEvent = TimelineRouterOutputs["getEvents"][0];

export default function LandingConferenceHallOfFame() {
  const { data, isLoading } = trpc.timeline.getEvents.useQuery();

  if (!data || isLoading) return <Spinner />;

  return (
    <div id="hall-of-fame" className="bg-slate-100">
      <div className="hero">
        <div className="hero__overlay" />
        <div className="hero__title">Hall of Fame</div>
        <div className="hero__description">
          A timeline overview of RIMUN's history and accomplishments.
        </div>
      </div>

      <div id="timeline" className="relative max-w-4xl mx-auto">
        <div className="absolute z-20 left-0 top-0 w-full h-full grid grid-cols-3">
          <div />
          <div className="w-2 h-full bg-slate-700 mx-auto" />
          <div />
        </div>
        <div className="z-30 w-full">
          {data
            .sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            )
            .map((event, idx) =>
              idx % 2 === 0 ? (
                <div
                  key={event.id}
                  className="grid grid-cols-5 py-8 items-center"
                >
                  <EventDate className="text-right" event={event} />
                  <EventDot />
                  <EventCard event={event} />
                </div>
              ) : (
                <div
                  key={event.id}
                  className="grid grid-cols-5 py-8 items-center"
                >
                  <EventCard event={event} />
                  <EventDot />
                  <EventDate className="text-left" event={event} />
                </div>
              )
            )}
        </div>
      </div>
    </div>
  );
}

function EventDate(
  props: { event: TimelineEvent } & React.HTMLProps<HTMLDivElement>
) {
  return (
    <div
      {...props}
      className={`col-span-2 font-bold text-xl ${props.className}`}
    >
      {new Date(props.event.date).toLocaleDateString()}
    </div>
  );
}

function EventDot() {
  return (
    <div className="flex justify-center items-center flex-shrink-0 col-span-1">
      <div className="bg-brand rounded-full overflow-hidden p-3 shadow-lg">
        <CalendarDaysIcon className="w-9 h-9 text-white" />
      </div>
    </div>
  );
}

function EventCard(props: { event: TimelineEvent }) {
  return (
    <Card className={`col-span-2 overflow-hidden relative shadow-xl`}>
      {props.event.type === "EDITION" && (
        <Logo className="absolute top-4 right-4 w-12 h-12 text-white opacity-60" />
      )}
      <div className="max-h-40 w-full bg-slate-50 over overflow-hidden">
        <BaseRemoteImage
          path={props.event.picture_path ?? ""}
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold">{props.event.name}</h3>
        <p className="text-xs mt-2 text-ellipsis line-clamp-3">
          {props.event.description}
        </p>
        {!!props.event.document_path && (
          <div className="flex items-center text-xs gap-1 pt-2">
            <DocumentArrowDownIcon className="w-4 h-4 text-blue-400" />
            <a
              className="hover:underline cursor-pointer text-blue-500"
              onClick={() =>
                downloadDocument(props.event.document_path!, props.event.name)
              }
            >
              More Information
            </a>
          </div>
        )}
      </div>
    </Card>
  );
}
