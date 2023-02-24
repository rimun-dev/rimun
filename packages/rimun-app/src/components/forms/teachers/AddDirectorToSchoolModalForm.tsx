import { Form, Formik } from "formik";
import ImagePreviewField from "src/components/fields/base/ImagePreviewField";
import Label from "src/components/fields/base/utils/Label";
import ModalFooter from "src/components/forms/utils/ModalFooter";
import PartialPersonForm from "src/components/forms/utils/PartialPersonForm";
import Modal, { ModalHeader, ModalProps } from "src/components/layout/Modal";
import { useStateDispatch } from "src/store";
import { DeviceActions } from "src/store/reducers/device";
import { DirectorsRouterInputs, trpc } from "src/trpc";
import phoneNumberValidationSchema from "src/validation/phoneNumber";
import * as Yup from "yup";

interface AddDirectorToSchoolModalFormProps extends ModalProps {
  onCreated: () => void;
}

export default function AddDirectorToSchoolModalForm(
  props: AddDirectorToSchoolModalFormProps
) {
  const dispatch = useStateDispatch();

  const mutation = trpc.directors.addDirector.useMutation({
    onSuccess: () => {
      props.onCreated();
      props.setIsVisible(false);
      dispatch(
        DeviceActions.displayAlert({
          status: "success",
          message: "Teacher was added successfully.",
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
        Teacher Information
      </ModalHeader>

      <Formik
        onSubmit={(v) => mutation.mutate(v)}
        validateOnBlur={false}
        validateOnChange={false}
        validateOnMount={false}
        validationSchema={Yup.object({
          name: Yup.string().required("Please insert your first name."),
          surname: Yup.string().required("Please insert your last name."),
          birthday: Yup.date()
            .max(new Date(Date.now()), "Your birthday must be in the past.")
            .required("Please insert your last name."),
          gender: Yup.string().oneOf(["m", "f", "nb"]),
          picture: Yup.string().required(
            "Please select a picture for your badge."
          ),
          phone_number: phoneNumberValidationSchema.required(
            "Please insert a phone number."
          ),
          allergies: Yup.string(),
          country_id: Yup.number().required("Please select a nationality."),
          tshirt_size: Yup.string(),
        })}
        initialValues={
          {
            name: "",
            surname: "",
            birthday: new Date(),
            gender: "m",
            picture: "",
            phone_number: "",
            allergies: "",
            country_id: 0,
            tshirt_size: "s",
          } as DirectorsRouterInputs["addDirector"]
        }
      >
        <Form className="p-4">
          <Label htmlFor="picture" className="md:ml-1">
            Badge Picture
            <ImagePreviewField name="picture" />
          </Label>

          <div className="h-4" />

          <PartialPersonForm />

          <ModalFooter
            actionTitle="Add Teacher"
            setIsVisible={props.setIsVisible}
            isLoading={mutation.isLoading}
          />
        </Form>
      </Formik>
    </Modal>
  );
}
