import { Form, Formik } from "formik";
import SubmitButton from "src/components/buttons/SubmitButton";
import CancelButton from "src/components/fields/base/CancelButton";
import NumberInputField from "src/components/fields/base/NumberInputField";
import SelectField from "src/components/fields/base/SelectField";
import Label from "src/components/fields/base/utils/Label";
import Modal, { ModalHeader, ModalProps } from "src/components/layout/Modal";
import Banner from "src/components/status/Banner";
import { SearchRouterOutputs, trpc } from "src/trpc";
import * as Yup from "yup";

interface EditSchoolApplicationModalFormProps extends ModalProps {
  schoolApplicationData: SearchRouterOutputs["searchSchools"]["result"][0];
  onApplicationUpdated: () => void;
}

export default function EditSchoolApplicationModalForm(
  props: EditSchoolApplicationModalFormProps
) {
  const mutation = trpc.applications.updateSchoolApplication.useMutation({
    onSuccess: () => {
      props.onApplicationUpdated();
      props.setIsVisible(false);
    },
  });

  const delegate = props.schoolApplicationData.assignments.find(
    (a) => a.group.name === "delegate"
  )!;
  const chair = props.schoolApplicationData.assignments.find(
    (a) => a.group.name === "chair"
  )!;
  const staff = props.schoolApplicationData.assignments.find(
    (a) => a.group.name === "staff"
  )!;
  const icj = props.schoolApplicationData.assignments.find(
    (a) => a.group.name === "icj"
  )!;

  return (
    <Modal
      {...props}
      className="w-full top-8 max-w-md bg-white shadow-xl rounded-lg"
    >
      <ModalHeader onDismiss={() => props.setIsVisible(false)}>
        Update Application Status
      </ModalHeader>
      <p className="px-4 text-sm">
        Here you can manage the application status for{" "}
        <b>{props.schoolApplicationData.school.name}</b> and edit the number of
        assigned students for each group.
      </p>

      <Banner
        status="warn"
        title="Potentially Dangerous Action"
        className="mx-4"
      >
        Please beware that setting a school application status to{" "}
        <b className="text-red-500">REFUSED</b> or{" "}
        <b className="text-orange-500">HOLD</b> if it had been previously
        accepted will reset/delete all data relative to its students including
        housing matches, delegations, etc. However, you can safely update the
        group assignments while keeping the status on{" "}
        <b className="text-green-500">ACCEPTED</b>.
      </Banner>

      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        validateOnMount={false}
        onSubmit={(values) => {
          if (values.status_application === "ACCEPTED") {
            mutation.mutate({
              school_id: props.schoolApplicationData.school_id,
              status_application: values.status_application,
              assignments: values.assignments.map((a) => ({
                group_id: a.group_id,
                n_confirmed: a.n_confirmed ?? 0,
              })),
            });
          } else {
            mutation.mutate({
              school_id: props.schoolApplicationData.school_id,
              status_application: values.status_application,
            });
          }
        }}
        initialValues={{
          status_application: props.schoolApplicationData.status_application,
          assignments: [
            {
              group_id: delegate?.group_id,
              n_confirmed: delegate?.n_requested,
            },
            { group_id: chair?.group_id, n_confirmed: chair?.n_requested },
            { group_id: icj?.group_id, n_confirmed: icj?.n_requested },
            { group_id: staff?.group_id, n_confirmed: staff?.n_requested },
          ],
        }}
        validationSchema={Yup.object({
          status_application: Yup.string()
            .oneOf(["hold", "accepted", "refused"])
            .required("Please select the application status."),
          assignments: Yup.array(
            Yup.object({
              group_id: Yup.number(),
              n_confirmed: Yup.number().nullable(true),
            })
          ),
        })}
      >
        {({ values }) => (
          <Form className="p-4">
            <Label htmlFor="status_application" className="w-full">
              Status
              <SelectField
                name="status_application"
                className="w-full"
                options={[
                  { name: "Hold", value: "hold" },
                  { name: "Accepted", value: "accepted" },
                  { name: "Refused", value: "refused" },
                ]}
              />
            </Label>

            <div
              className={
                values.status_application !== "ACCEPTED"
                  ? "opacity-25 pointer-events-none"
                  : undefined
              }
            >
              <h3 className="w-full text-sm font-bold mt-6">
                Group Assignments
              </h3>
              <p className="w-full text-xs mt-2">
                Please insert the number of students for each category.
              </p>

              <div className="flex gap-4 my-4">
                <div className="flex flex-col gap-2 items-center">
                  <NumberInputField
                    name="assignments[0].n_confirmed"
                    min={0}
                    className="w-16"
                  />
                  <span className="text-xs">Delegates</span>
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <NumberInputField
                    name="assignments[1].n_confirmed"
                    min={0}
                    className="w-16"
                  />
                  <span className="text-xs">Chairs</span>
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <NumberInputField
                    name="assignments[2].n_confirmed"
                    min={0}
                    className="w-16"
                  />
                  <span className="text-xs">ICJ</span>
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <NumberInputField
                    name="assignments[3].n_confirmed"
                    min={0}
                    className="w-16"
                  />
                  <span className="text-xs">Staff</span>
                </div>
              </div>
            </div>

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
                Update Application
              </SubmitButton>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
