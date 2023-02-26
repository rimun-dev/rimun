import {
  ChevronDownIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import CircularButton from "src/components/buttons/CircularButton";
import EditSchoolApplicationModalForm from "src/components/forms/applications/EditSchoolApplicationModalForm";
import Card from "src/components/layout/Card";
import SchoolItemBadge from "src/components/layout/list/utils/SchoolItemBadge";
import Spinner from "src/components/status/Spinner";
import Tag, { TagStatus } from "src/components/status/Tag";
import { SearchRouterOutputs, trpc } from "src/trpc";

export default function SchoolApplicationList() {
  const { data, isLoading } = trpc.search.searchSchools.useQuery(
    { limit: Number.MAX_SAFE_INTEGER, filters: {} },
    { refetchOnWindowFocus: true }
  );

  const trpcCtx = trpc.useContext();

  const handleUpdate = () =>
    trpcCtx.search.searchSchools.invalidate({
      limit: Number.MAX_SAFE_INTEGER,
      filters: {},
    });

  if (isLoading || !data) return <Spinner />;

  return (
    <Card className="p-4 overflow-x-auto">
      <div style={{ minWidth: "628px" }}>
        <div className="grid grid-cols-7 p-2 text-xs text-slate-500 font-bold">
          <div className="col-span-3">Name</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2">Submission</div>
        </div>

        {data.result.map((s) => (
          <SchoolApplicationItem
            key={s.id}
            schoolApplicationData={s}
            onApplicationUpdated={handleUpdate}
          />
        ))}
      </div>
    </Card>
  );
}

interface SchoolApplicationItemProps {
  schoolApplicationData: SearchRouterOutputs["searchSchools"]["result"][0];
  onApplicationUpdated: () => void;
}

function SchoolApplicationItem(props: SchoolApplicationItemProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);

  let status: TagStatus = "warn";
  switch (props.schoolApplicationData.status_application) {
    case "ACCEPTED":
      status = "success";
      break;
    case "REFUSED":
      status = "error";
      break;
  }

  const delegate =
    props.schoolApplicationData.school.school_group_assignments.find(
      (a) => a.group.name === "delegate"
    );
  const chair =
    props.schoolApplicationData.school.school_group_assignments.find(
      (a) => a.group.name === "char"
    );
  const icj = props.schoolApplicationData.school.school_group_assignments.find(
    (a) => a.group.name === "icj"
  );
  const staff =
    props.schoolApplicationData.school.school_group_assignments.find(
      (a) => a.group.name === "staff"
    );

  return (
    <div className="border border-slate-100 rounded-sm w-full">
      <div className="p-4 grid grid-cols-7 items-center w-full">
        <SchoolItemBadge
          className="col-span-3"
          school={props.schoolApplicationData.school}
        />

        <div className="flex items-center col-span-1">
          <Tag status={status}>
            {props.schoolApplicationData.status_application}
          </Tag>
        </div>

        <div className="flex items-center col-span-2 text-xs text-slate-500">
          {new Date(props.schoolApplicationData.created_at).toLocaleString()}
        </div>

        <div className="flex items-center gap-2 justify-end col-span-1">
          <CircularButton
            icon={EllipsisHorizontalIcon}
            onClick={() => setShowModal(!showModal)}
          />
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
              <p className="font-bold mb-2">Primary Director</p>
              <p>
                {props.schoolApplicationData.contact_title}{" "}
                {props.schoolApplicationData.contact_name}{" "}
                {props.schoolApplicationData.contact_surname}
              </p>
              <a
                href={`mailto:${props.schoolApplicationData.contact_email}`}
                className="text-slate-500 hover:underline"
              >
                {props.schoolApplicationData.contact_email}
              </a>
            </div>

            <div>
              <p className="font-bold mb-2">Group Assignments</p>
              <div className="grid grid-cols-3">
                <span />
                <span>Requested</span>
                <span>Confirmed</span>
                <div className="col-span-3 h-2" />
                <span>Delegates</span>
                <span className="font-mono font-bold text-brand">
                  {delegate?.n_requested}
                </span>
                <span className="font-mono font-bold text-brand">
                  {delegate?.n_confirmed ?? "-"}
                </span>
                <span>Chairs</span>
                <span className="font-mono font-bold text-brand">
                  {chair?.n_requested}
                </span>
                <span className="font-mono font-bold text-brand">
                  {chair?.n_confirmed ?? "-"}
                </span>
                <span>ICJ Members</span>
                <span className="font-mono font-bold text-brand">
                  {icj?.n_requested}
                </span>
                <span className="font-mono font-bold text-brand">
                  {icj?.n_confirmed ?? "-"}
                </span>
                <span>Staff</span>
                <span className="font-mono font-bold text-brand">
                  {staff?.n_requested}
                </span>
                <span className="font-mono font-bold text-brand">
                  {staff?.n_confirmed ?? "-"}
                </span>
              </div>
            </div>
          </div>

          <div className="col-span-3">
            <p className="font-bold mb-2">Previous MUN Experience</p>
            <p>
              {props.schoolApplicationData.experience_mun ??
                "No previous experience."}
            </p>
            <p className="font-bold mt-4 mb-2">Extra Communications</p>
            <p>
              {props.schoolApplicationData.communications ??
                "No communications."}
            </p>
            <p className="font-bold mt-4 mb-2">
              Requires Housing?{" "}
              <span className="font-normal ml-2">
                {props.schoolApplicationData.status_housing === "NOT_REQUIRED"
                  ? "No"
                  : "Yes"}
              </span>
            </p>
          </div>
        </div>
      )}

      <EditSchoolApplicationModalForm
        isVisible={showModal}
        setIsVisible={setShowModal}
        schoolApplicationData={props.schoolApplicationData}
        onApplicationUpdated={props.onApplicationUpdated}
      />
    </div>
  );
}
