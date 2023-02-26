import { Form, Formik } from "formik";
import SearchPersonField from "src/components/fields/base/SearchPersonField";
import ModalFooter from "src/components/forms/utils/ModalFooter";
import Modal, { ModalHeader, ModalProps } from "src/components/layout/Modal";
import { SearchRouterOutputs, trpc } from "src/trpc";
import * as Yup from "yup";

interface AddGuestModalFormProps extends ModalProps {
  host: SearchRouterOutputs["searchPersons"]["result"][0]["person"];
  onUpdate: () => void;
}

export default function AddGuestModalForm(props: AddGuestModalFormProps) {
  const trpcCtx = trpc.useContext();

  const mutation = trpc.housing.createHousingMatch.useMutation({
    onSuccess: () => {
      props.onUpdate();
      trpcCtx.housing.getHostHousingMatches.invalidate(props.host.id);
      trpcCtx.housing.getStats.invalidate();
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
        onSubmit={(v) => mutation.mutate({ ...v, host_id: props.host.id })}
        initialValues={{ guest_id: -1 }}
        validationSchema={Yup.object({ guest_id: Yup.number() })}
      >
        <Form className="p-4">
          <p>
            Select a guest that will be hosted by{" "}
            <b>
              {props.host.name} {props.host.surname}
            </b>
          </p>

          <SearchPersonField
            name="guest_id"
            filters={{
              application: {
                status_application: "ACCEPTED",
                status_housing: "ACCEPTED",
              },
            }}
          />

          <ModalFooter
            actionTitle="Select Guest"
            isLoading={mutation.isLoading}
            setIsVisible={props.setIsVisible}
          />
        </Form>
      </Formik>
    </Modal>
  );
}
