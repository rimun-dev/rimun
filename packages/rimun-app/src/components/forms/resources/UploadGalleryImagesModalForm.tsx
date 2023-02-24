import { Form, Formik } from "formik";
import CancelButton from "src/components/fields/base/CancelButton";
import MultipleImageField from "src/components/fields/base/MultipleImageField";
import SelectField from "src/components/fields/base/SelectField";
import SubmitButton from "src/components/fields/base/SubmitButton";
import Label from "src/components/fields/base/utils/Label";
import Modal, { ModalHeader, ModalProps } from "src/components/layout/Modal";
import Banner from "src/components/status/Banner";
import Spinner from "src/components/status/Spinner";
import { ResourcesRouterOutputs, trpc } from "src/trpc";
import * as Yup from "yup";

interface UploadGalleryImagesModalFormProps extends ModalProps {
  onImagesUploaded: (img: ResourcesRouterOutputs["createGalleryImage"]) => void;
}

export default function UploadGalleryImagesModalForm(
  props: UploadGalleryImagesModalFormProps
) {
  const mutation = trpc.resources.createGalleryImage.useMutation({
    onSuccess: (data) => {
      props.onImagesUploaded(data);
      props.setIsVisible(false);
    },
  });

  const sessionsQuery = trpc.info.getSessions.useQuery();

  return (
    <Modal
      {...props}
      className="w-full top-8 max-w-xl bg-white shadow-xl rounded-lg"
    >
      <ModalHeader onDismiss={() => props.setIsVisible(false)}>
        Upload New Pictures
      </ModalHeader>

      <div className="px-4">
        <p>
          The images that you upload here will be available on RIMUN's public
          website.
        </p>

        <Banner status="info" title="Multiple Uploads">
          You can upload multiple images at once simply by selecting them in the
          file explorer.
        </Banner>
      </div>

      {sessionsQuery.isLoading || !sessionsQuery.data ? (
        <Spinner />
      ) : (
        <Formik
          validateOnChange={false}
          validateOnBlur={false}
          validateOnMount={false}
          onSubmit={(values) =>
            Promise.all(
              values.images.map((img) =>
                mutation.mutate({
                  image: img.data,
                  session_id: values.session_id!,
                })
              )
            )
          }
          initialValues={{
            images: [] as { name: string; data: string }[],
            session_id: undefined,
          }}
          validationSchema={Yup.object({
            images: Yup.array(
              Yup.object({
                name: Yup.string(),
                data: Yup.string(),
              })
            ).required("Please select some files to upload."),
            session_id: Yup.number().required("Please choose a session."),
          })}
        >
          {() => (
            <Form className="p-4">
              <Label htmlFor="session_id" className="w-full">
                Session
                <SelectField
                  name="session_id"
                  options={sessionsQuery?.data.map((s) => ({
                    name: s.edition_display.toString(),
                    value: s.id,
                  }))}
                />
              </Label>

              <Label htmlFor="images" className="w-full block mt-4">
                Select the images
                <MultipleImageField name="images" />
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
                  Upload Images
                </SubmitButton>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </Modal>
  );
}
