import { Form, Formik, useField } from "formik";
import React from "react";
import FieldItem from "src/components/fields/FieldItem";
import ModalFooter from "src/components/forms/utils/ModalFooter";
import PersonItemBadge from "src/components/layout/list/utils/PersonItemBadge";
import Modal, { ModalHeader, ModalProps } from "src/components/layout/Modal";
import { SearchRouterOutputs, trpc } from "src/trpc";
import * as Yup from "yup";

interface DelGuestModalFormProps extends ModalProps {
  hostApplicationData: SearchRouterOutputs["searchPersons"]["result"][0];
  onUpdate: () => void;
}

export default function DelGuestModalForm(props: DelGuestModalFormProps) {
  const trpcCtx = trpc.useContext();

  const mutation = trpc.housing.deleteHousingMatch.useMutation({
    onSuccess: () => {
      trpcCtx.housing.getHostHousingMatches.invalidate(
        props.hostApplicationData.person.id
      );
      trpcCtx.housing.getStats.invalidate();
      props.onUpdate();
      props.setIsVisible(false);
    },
  });

  return (
    <Modal
      {...props}
      className="w-full top-8 max-w-xl bg-white shadow-xl rounded-lg"
    >
      <ModalHeader onDismiss={() => props.setIsVisible(false)}>
        Find Guest
      </ModalHeader>

      <Formik
        onSubmit={(v) => mutation.mutate(v.match_id)}
        initialValues={{ match_id: -1 }}
        validationSchema={Yup.object({ match_id: Yup.number() })}
      >
        <Form className="p-4">
          <p>
            Select a guest to remove from the housing list of{" "}
            <b>{props.hostApplicationData.person.full_name}</b>
          </p>

          <RemoveGuestField
            name="match_id"
            hostApplicationData={props.hostApplicationData}
          />

          <ModalFooter
            actionTitle="Remove Guest"
            isLoading={mutation.isLoading}
            setIsVisible={props.setIsVisible}
          />
        </Form>
      </Formik>
    </Modal>
  );
}

interface RemoveGuestFieldProps extends React.HTMLProps<HTMLInputElement> {
  name: string;
  label?: string;
  hostApplicationData: SearchRouterOutputs["searchPersons"]["result"][0];
}

function RemoveGuestField(props: RemoveGuestFieldProps) {
  const [field, { error, touched }, { setValue }] = useField<
    | SearchRouterOutputs["searchPersons"]["result"][0]["person"]["id"]
    | undefined
  >(props.name);
  return (
    <FieldItem {...{ error, touched }}>
      <div className="flex flex-col divide-y border">
        {props.hostApplicationData.person.host_matches.map((match) => {
          const isSelected = field.value === match.guest.id;
          return (
            <div
              key={match.id}
              className={`p-4 cursor-pointer ${
                isSelected ? "bg-blue-200" : undefined
              }`}
              onClick={() => setValue(isSelected ? undefined : match.id)}
            >
              <PersonItemBadge person={match.guest} />
            </div>
          );
        })}
      </div>
    </FieldItem>
  );
}
