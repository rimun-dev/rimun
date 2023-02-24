import { Form, Formik } from "formik";
import CancelButton from "src/components/fields/base/CancelButton";
import DocumentField from "src/components/fields/base/DocumentField";
import SubmitButton from "src/components/fields/base/SubmitButton";
import TextInputField from "src/components/fields/base/TextInputField";
import Label from "src/components/fields/base/utils/Label";
import Modal, { ModalHeader, ModalProps } from "src/components/layout/Modal";
import Banner from "src/components/status/Banner";
import { trpc } from "src/trpc";
import * as Yup from "yup";

interface UploadDocumentModalFormProps extends ModalProps {
  onDocumentUploaded: () => void;
}

export default function UploadDocumentModalForm(
  props: UploadDocumentModalFormProps
) {
  const mutation = trpc.resources.createDocument.useMutation({
    onSuccess: () => {
      props.onDocumentUploaded();
      props.setIsVisible(false);
    },
  });

  return (
    <Modal
      {...props}
      className="w-full top-8 max-w-xl bg-white shadow-xl rounded-lg"
    >
      <ModalHeader onDismiss={() => props.setIsVisible(false)}>
        Upload New Document
      </ModalHeader>

      <div className="px-4">
        <p>
          The resources that you upload here will be available on RIMUN's public
          website.
        </p>

        <Banner status="warn" title="File Format">
          Please only upload PDF files. Other formats are currently not
          supported.
        </Banner>
      </div>

      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        validateOnMount={false}
        onSubmit={(v) => mutation.mutate(v)}
        initialValues={{ document: "", name: "" }}
        validationSchema={Yup.object({
          document: Yup.string().required("Please select a file to upload."),
          name: Yup.string().required(
            "Please choose a name for this document."
          ),
        })}
      >
        {() => (
          <Form className="p-4">
            <Label htmlFor="name" className="w-full">
              Title
              <TextInputField
                name="name"
                placeholder="e.g. Delegate's Handbook"
              />
            </Label>

            <Label htmlFor="document" className="w-full block mt-4">
              Select a document
              <DocumentField name="document" />
            </Label>

            <div className="flex mt-6 justify-between">
              <CancelButton
                onClick={() => props.setIsVisible(false)}
                className="flex justify-center items-center flex-1 mr-2"
              >
                Cancel
              </CancelButton>

              <SubmitButton
                isLoading={mutation.isLoading}
                className="ml-2 flex-1"
              >
                Upload Document
              </SubmitButton>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
