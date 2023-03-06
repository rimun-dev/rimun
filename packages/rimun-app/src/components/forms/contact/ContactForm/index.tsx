import { Form, Formik } from "formik";
import TextAreaField from "src/components/fields/base/TextAreaField";
import TextInputField from "src/components/fields/base/TextInputField";
import Spinner from "src/components/status/Spinner";
import { useStateDispatch } from "src/store";
import { DeviceActions } from "src/store/reducers/device";
import { trpc } from "src/trpc";
import * as Yup from "yup";
import "./index.scss";

/*
  <Alert
    status="success"
    msg="Thank you! We have received your email."
    v-if="success"
  />

*/

export default function ContactForm() {
  const dispatch = useStateDispatch();

  const mutation = trpc.contact.sendContactEmail.useMutation({
    onSuccess: () => {
      dispatch(
        DeviceActions.displayAlert({
          status: "success",
          message: "Thank you! We have received your email.",
        })
      );
    },
  });

  return (
    <Formik
      onSubmit={(v) => mutation.mutate(v)}
      initialValues={{ name: "", email: "", body: "" }}
      validationSchema={Yup.object({
        name: Yup.string().required("Please insert your full name."),
        email: Yup.string()
          .email("Please insert a valid email.")
          .required("Please insert your email."),
        body: Yup.string().required("Please insert your message."),
      })}
    >
      <Form id="mail-form">
        <label htmlFor="name">
          Your Full Name
          <TextInputField name="name" placeholder="John Doe" />
        </label>

        <label htmlFor="email">
          Your Email Address
          <TextInputField
            type="email"
            name="email"
            placeholder="john@doe.com"
          />
        </label>

        <label htmlFor="body">
          <span>Your message</span>
          <TextAreaField
            name="body"
            placeholder="Write your message here..."
            required
          />
        </label>

        <div>
          {mutation.isLoading ? (
            <Spinner />
          ) : (
            <input
              type="submit"
              value="Send"
              className="btn btn-fl btn-primary"
            />
          )}
        </div>
      </Form>
    </Formik>
  );
}
