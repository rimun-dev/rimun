import { Form, Formik } from "formik";
import ImagePreviewField from "src/components/fields/base/ImagePreviewField";
import ModalFooter from "src/components/forms/utils/ModalFooter";
import Modal, { ModalHeader, ModalProps } from "src/components/layout/Modal";
import { useStateDispatch } from "src/store";
import { DeviceActions } from "src/store/reducers/device";
import { RouterOutputs, trpc } from "src/trpc";
import * as Yup from "yup";

interface UpdateSessionImageModalFormProps extends ModalProps {
  sessionData: RouterOutputs["sessions"]["getAllSessions"][0];
}

export default function UpdateSessionImageModalForm(
  props: UpdateSessionImageModalFormProps
) {
  const dispatch = useStateDispatch();
  const trpcCtx = trpc.useUtils();

  const mutation = trpc.sessions.updateSession.useMutation({
    onSuccess: () => {
      trpcCtx.sessions.invalidate();
      props.setIsVisible(false);
      dispatch(
        DeviceActions.displayAlert({
          status: "success",
          message: "Session's picture was updated successfully.",
        })
      );
    },
  });

  return (
    <Modal
      {...props}
      className="w-full top-8 max-w-xl bg-white shadow-xl rounded-lg"
    >
      <ModalHeader onDismiss={() => props.setIsVisible(false)}>
        Update Session's picture
      </ModalHeader>

      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        validateOnMount={false}
        onSubmit={(v) => mutation.mutate(v)}
        initialValues={{ picture: "", id: props.sessionData.id }}
        validationSchema={Yup.object({
          picture: Yup.string().required(
            "Please select an image (PNG, JPEG, etc.)."
          ),
        })}
      >
        <Form className="p-4">
          <div className="flex flex-col justify-center items-center pb-4">
            <ImagePreviewField name="picture" />
          </div>
          <ModalFooter
            actionTitle="Update Picture"
            setIsVisible={props.setIsVisible}
            isLoading={mutation.isLoading}
          />
        </Form>
      </Formik>
    </Modal>
  );
}
