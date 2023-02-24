import React from "react";
import CircularButton from "src/components/buttons/CircularButton";
import Card from "src/components/layout/Card";
import PersonItemBadge from "src/components/layout/list/utils/PersonItemBadge";
import { ModalProps } from "src/components/layout/Modal";
import Spinner from "src/components/status/Spinner";
import { SearchRouterInputs, SearchRouterOutputs, trpc } from "src/trpc";

type ModalPropsBase = ModalProps & {
  person: SearchRouterOutputs["searchPersons"]["result"][0]["person"];
};

interface PersonListProps {
  filters?: SearchRouterInputs["searchPersons"]["filters"];
  modalComponent?: (props: ModalPropsBase) => JSX.Element;
}

export default function PersonList({
  filters = {},
  ...props
}: PersonListProps) {
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
    <Card className="p-4">
      <div className="grid grid-cols-4 p-2 text-xs text-slate-500 font-bold">
        <div className="col-span-2">Name</div>
        <div className="col-span-1">Telephone</div>
      </div>

      {data.result.map((p) => (
        <PersonItem
          key={p.id}
          person={p.person}
          onPersonUpdated={handleUpdate}
          modalComponent={props.modalComponent}
        />
      ))}
    </Card>
  );
}

interface PersonItemProps {
  person: SearchRouterOutputs["searchPersons"]["result"][0]["person"];
  onPersonUpdated: () => void;
  modalComponent?: (props: ModalPropsBase) => JSX.Element;
}

function PersonItem(props: PersonItemProps) {
  const [showModal, setShowModal] = React.useState(false);

  const Modal = props.modalComponent ?? null;

  return (
    <div className="border border-slate-100 rounded-sm  w-full">
      <div className="p-4 grid grid-cols-4 w-full items-center">
        <PersonItemBadge className="col-span-2" {...props} />

        <div className="flex items-center col-span-1">
          {props.person.phone_number}
        </div>

        {Modal != null && (
          <div className="flex items-center gap-2 justify-end col-span-1">
            <CircularButton
              icon="dots-horizontal"
              onClick={() => setShowModal(!showModal)}
            />
          </div>
        )}
      </div>

      {!!Modal && (
        <Modal
          isVisible={showModal}
          setIsVisible={setShowModal}
          person={props.person}
        />
      )}
    </div>
  );
}
