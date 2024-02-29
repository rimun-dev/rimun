import { ArrowDownIcon } from "@heroicons/react/24/outline";

import Card from "src/components/layout/Card";
import Spinner from "src/components/status/Spinner";
import PageTitle from "src/components/typography/PageTitle";
import { trpc } from "src/trpc";

export default function AdminExports() {
  const attendeesTSVQuery = trpc.exports.getAttendeesTSV.useQuery(undefined, {
    enabled: false,
    onSuccess: (data) => {
      window.open(`data:text/csv;charset=utf-8,${data}`);
    },
  });

  return (
    <div className="max-w-3xl mx-auto">
      <PageTitle>Exports</PageTitle>

      <Card className="divide-y">
        <ExportElement
          isLoading={attendeesTSVQuery.isRefetching}
          onDownload={() => attendeesTSVQuery.refetch()}
          name="Attendees List"
        >
          Obtain an excel sheet containing relevant information about the
          attendees.
        </ExportElement>

        {/*
          const badgesQuery = trpc.exports.generateBadge.useQuery(undefined, {
            enabled: false,
            onSuccess: downloadBase64File,
                });
        <ExportElement
          isLoading={badgesQuery.isFetching || badgesQuery.isRefetching}
          onDownload={() => badgesQuery.refetch()}
          name="Badges"
        >
          Obtain a PDF document containing all attendees' badges (plus some
          extra blanks). Note: this takes a while.
        </ExportElement>
        <ExportElement
          isLoading={attendeesTSVQuery.isRefetching}
          onDownload={() => attendeesTSVQuery.refetch()}
          name="Certificates"
        >
          Obtain a PDF document containing all participation certificates.
        </ExportElement>
        <ExportElement
          isLoading={attendeesTSVQuery.isRefetching}
          onDownload={() => attendeesTSVQuery.refetch()}
          name="Placards"
        >
          Obtain a PDF document containing all country placards.
        </ExportElement>
  */}
      </Card>
    </div>
  );
}

interface ExportElementProps extends React.HTMLProps<HTMLDivElement> {
  name: string;
  children: string;
  isLoading: boolean;
  onDownload: () => void;
}

function ExportElement({
  children,
  isLoading,
  onDownload,
  ...props
}: ExportElementProps) {
  return (
    <div {...props} className="p-4 flex justify-between items-center relative">
      <div>
        <h2 className="font-bold shrink-0">{props.name}</h2>
        <p className="text-xs shrink-0">{children}</p>
      </div>
      {isLoading ? (
        <Spinner className="mx-0" />
      ) : (
        <DownloadButton onClick={onDownload} />
      )}
    </div>
  );
}
function DownloadButton(props: React.HTMLProps<HTMLButtonElement>) {
  return (
    <button
      {...props}
      type="button"
      className={`rounded-md flex items-center gap-2 bg-slate-200 hover:bg-slate-300 px-4 py-2 ${props.className}`}
    >
      <span>Download</span>
      <ArrowDownIcon className="w-4 h-4" />
    </button>
  );
}
