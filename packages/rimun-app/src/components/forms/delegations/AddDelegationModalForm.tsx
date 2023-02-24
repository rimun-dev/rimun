import { Form, Formik } from "formik";
import CheckBoxField from "src/components/fields/base/CheckBoxField";
import CountrySelectField from "src/components/fields/base/CountrySelectField";
import NumberInputField from "src/components/fields/base/NumberInputField";
import SelectField from "src/components/fields/base/SelectField";
import TextInputField from "src/components/fields/base/TextInputField";
import Label from "src/components/fields/base/utils/Label";
import ModalFooter from "src/components/forms/utils/ModalFooter";
import Modal, { ModalHeader, ModalProps } from "src/components/layout/Modal";
import { useStateDispatch } from "src/store";
import { DeviceActions } from "src/store/reducers/device";
import { DelegationsRouterOutputs, trpc } from "src/trpc";
import * as Yup from "yup";

interface AddDelegationModalFormProps extends ModalProps {
  onCreated: (d: DelegationsRouterOutputs["createDelegation"]) => void;
}

export default function AddDelegationModalForm(
  props: AddDelegationModalFormProps
) {
  const dispatch = useStateDispatch();

  const mutation = trpc.delegations.createDelegation.useMutation({
    onSuccess: (data) => {
      props.onCreated(data);
      props.setIsVisible(false);
      dispatch(
        DeviceActions.displayAlert({
          status: "success",
          message: "Delegation was created successfully.",
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
        Create Delegation
      </ModalHeader>

      <p className="px-4 text-sm">Create a new delegation.</p>

      <Formik
        // @ts-ignore
        onSubmit={(v) => mutation.mutate(v)}
        initialValues={{
          name: "",
          is_individual: false,
          n_delegates: 1,
          country_id: -1,
          type: "country",
        }}
        validationSchema={Yup.object({
          name: Yup.string(),
          country_id: Yup.number(),
          n_delegates: Yup.number()
            .min(1, "Delegation must have a minimum of 1 delegate.")
            .required(),
          type: Yup.string()
            .oneOf(["country", "ngo", "igo", "historical-country"])
            .required(),
          is_individual: Yup.boolean().default(false).required(),
        })}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({ values }) => (
          <Form className="p-4">
            <Label htmlFor="target">
              <div className="mt-4">Delegation type</div>
              <SelectField
                name="type"
                options={[
                  { name: "Country", value: "country" },
                  { name: "IGO", value: "igo" },
                  { name: "NGO", value: "ngo" },
                  { name: "Historical Country", value: "historical-country" },
                ]}
              />
            </Label>

            <Label htmlFor="name">
              <div className="flex flex-row items-center gap-4  mt-4">
                <p>Is this delegation meant for the HSC?</p>
                <CheckBoxField name="is_individual" />
                (check=yes)
              </div>
            </Label>

            {values.type !== "country" && (
              <Label htmlFor="name" className="w-full bloc mt-4">
                Delegation Name
                <TextInputField
                  name="name"
                  placeholder="Insert delegation name"
                />
              </Label>
            )}

            {values.type === "country" && (
              <Label htmlFor="country_id" className="w-full bloc mt-4">
                Country
                <CountrySelectField name="country_id" />
              </Label>
            )}

            {!values.is_individual && (
              <Label htmlFor="name" className="w-full bloc mt-4">
                Number of Delegates
                <NumberInputField name="n_delegates" />
              </Label>
            )}

            <div className="h-8" />

            <ModalFooter
              isLoading={mutation.isLoading}
              {...props}
              actionTitle="Create Delegation"
            />
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
