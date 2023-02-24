import { Form, Formik } from "formik";
import NumberInputField from "src/components/fields/base/NumberInputField";
import TextInputField from "src/components/fields/base/TextInputField";
import Label from "src/components/fields/base/utils/Label";
import ModalFooter from "src/components/forms/utils/ModalFooter";
import Modal, { ModalHeader, ModalProps } from "src/components/layout/Modal";
import { useStateDispatch } from "src/store";
import { DeviceActions } from "src/store/reducers/device";
import { CommitteesRouterOutputs, InfoRouterOutputs, trpc } from "src/trpc";
import * as Yup from "yup";

interface EditCommitteeModalFormProps extends ModalProps {
  committeeData: InfoRouterOutputs["getForums"]["forums"][0]["committees"][0];
  onUpdated: (c: CommitteesRouterOutputs["updateCommittee"]) => void;
}

export default function EditCommitteeModalForm(
  props: EditCommitteeModalFormProps
) {
  const dispatch = useStateDispatch();

  const mutation = trpc.committees.updateCommittee.useMutation({
    onSuccess: (data) => {
      props.onUpdated(data);
      props.setIsVisible(false);
      dispatch(
        DeviceActions.displayAlert({
          status: "success",
          message: "Committee was updated successfully.",
        })
      );
    },
  });

  return (
    <Modal
      {...props}
      className="w-full top-8 max-w-sm bg-white shadow-xl rounded-lg"
    >
      <ModalHeader onDismiss={() => props.setIsVisible(false)}>
        Modify Committee
      </ModalHeader>

      <p className="px-4 text-sm">
        Edit information for committee <b>{props.committeeData.name}</b>
      </p>

      <Formik
        onSubmit={(v) =>
          mutation.mutate({ ...v, committee_id: props.committeeData.id })
        }
        initialValues={{
          name: props.committeeData.name,
          size: props.committeeData.size,
        }}
        validationSchema={Yup.object({
          name: Yup.string().required(
            "Please choose a name for this committee."
          ),
          size: Yup.number()
            .min(1, "Please choose a size greater than 0.")
            .required("Please choose a size for this committee."),
        })}
      >
        <Form className="p-4">
          <Label htmlFor="name" className="w-full block mt-4">
            Name
            <TextInputField name="name" placeholder="e.g. Legal Committee" />
          </Label>

          <Label htmlFor="size" className="w-full block mt-4">
            Number of Delegates
            <NumberInputField name="size" />
          </Label>

          <ModalFooter
            isLoading={mutation.isLoading}
            setIsVisible={props.setIsVisible}
            actionTitle="Update"
          />
        </Form>
      </Formik>
    </Modal>
  );
}
