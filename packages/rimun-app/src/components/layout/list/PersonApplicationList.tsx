import {
  ChevronDownIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import CircularButton from "src/components/buttons/CircularButton";
import EditPersonApplicationModalForm from "src/components/forms/applications/EditPersonApplicationModalForm";
import Card from "src/components/layout/Card";
import PersonItemBadge from "src/components/layout/list/utils/PersonItemBadge";
import Spinner from "src/components/status/Spinner";
import Tag, { TagStatus } from "src/components/status/Tag";
import { SearchRouterInputs, SearchRouterOutputs, trpc } from "src/trpc";
import useAuthenticatedState from "src/utils/useAuthenticatedState";

interface PersonApplicationListProps {
  filters?: SearchRouterInputs["searchPersons"]["filters"];
}

export default function PersonApplicationList({
  filters = {},
}: PersonApplicationListProps) {
  // TODO: introduce pagination with `useInfiniteQuery`
  const { data, isLoading } = trpc.search.searchPersons.useQuery(
    { limit: Number.MAX_SAFE_INTEGER, filters },
    { refetchOnWindowFocus: true }
  );

  const trpcCtx = trpc.useContext();

  const handleUpdate = () =>
    trpcCtx.search.searchPersons.invalidate({
      limit: Number.MAX_SAFE_INTEGER,
      filters,
    });

  if (isLoading || !data) return <Spinner />;

  return (
    <Card className="p-4 overflow-x-auto">
      <div style={{ minWidth: "628px" }}>
        <div className="grid grid-cols-7 p-2 text-xs text-slate-500 font-bold">
          <div className="col-span-2">Name</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-1">Submission</div>
        </div>

        {data.result.map((item) => (
          <PersonApplicationItem
            key={item.id}
            applicationData={item}
            onApplicationUpdated={handleUpdate}
          />
        ))}
      </div>
    </Card>
  );
}

interface PersonApplicationItemProps {
  applicationData: SearchRouterOutputs["searchPersons"]["result"][0];
  onApplicationUpdated: () => void;
}

function PersonApplicationItem(props: PersonApplicationItemProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);

  const authState = useAuthenticatedState();

  let status: TagStatus = "warn";
  switch (props.applicationData.status_application) {
    case "ACCEPTED":
      status = "success";
      break;
    case "REFUSED":
      status = "error";
      break;
  }

  const notAllowedToUpdate =
    authState.account.is_school &&
    props.applicationData.requested_group?.name !== "delegate";

  return (
    <div className="border border-slate-100 rounded-sm w-full">
      <div className="p-4 sm:grid sm:grid-cols-7 w-full items-center">
        <PersonItemBadge
          className="col-span-2"
          person={props.applicationData.person}
          description={props.applicationData.school?.name}
        />

        <div className="flex items-center col-span-1">
          <Tag status={status}>{props.applicationData.status_application}</Tag>
        </div>

        <div className="flex items-center col-span-2 text-xs text-slate-500">
          {props.applicationData.confirmed_role?.name ?? "-"}
        </div>

        <div className="flex items-center col-span-1 text-xs text-slate-500">
          {new Date(props.applicationData.created_at).toLocaleDateString()}
        </div>

        <div className="flex items-center gap-2 justify-end col-span-1">
          {!notAllowedToUpdate && (
            <CircularButton
              icon={EllipsisHorizontalIcon}
              onClick={() => setShowModal(!showModal)}
            />
          )}
          <CircularButton
            icon={ChevronDownIcon}
            className={`transition-transform ${
              isOpen ? "rotate-180" : undefined
            }`}
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
      </div>

      {isOpen && (
        <div className="p-4 grid grid-cols-5 text-xs border-t border-slate-100">
          <div className="col-span-2 flex flex-col gap-4">
            <div>
              <p className="font-bold mb-2">English Level</p>
              <p>{props.applicationData.eng_certificate}</p>
            </div>

            <div>
              <p className="font-bold mb-2">Available as host?</p>
              <p>{props.applicationData.housing_is_available ? "Yes" : "No"}</p>
            </div>

            <div>
              <p className="font-bold mb-2">Requested role</p>
              <p>{props.applicationData.requested_role?.name ?? "-"}</p>
            </div>
          </div>

          <div className="col-span-3">
            <p className="font-bold mb-2">Previous MUN Experience</p>
            <p>
              {props.applicationData.experience_mun ??
                "No previous experience."}
            </p>
            <p className="font-bold mt-4 mb-2">Other Previous Experience</p>
            <p>
              {props.applicationData.experience_other ?? "No other experience."}
            </p>
          </div>
        </div>
      )}

      <EditPersonApplicationModalForm
        isVisible={showModal}
        setIsVisible={setShowModal}
        applicationData={props.applicationData}
        onApplicationUpdated={props.onApplicationUpdated}
      />
    </div>
  );
}
