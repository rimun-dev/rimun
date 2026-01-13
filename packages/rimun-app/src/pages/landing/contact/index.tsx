import ContactForm from "src/components/forms/contact/ContactForm";
import Spinner from "src/components/status/Spinner";
import { trpc } from "src/trpc";
import "./index.scss";

export default function LandingContact() {
  const { data: team, isLoading } = trpc.info.getTeam.useQuery();

  if (isLoading) return <Spinner />;

  const internationalManager = team?.find(
    (member) =>
      member.confirmed_role?.name ===
      "Conference Manager for Relations with International Delegations"
  );

  return (
    <div id="contact">
      <div className="hero">
        <div className="hero__overlay" />
        <div className="hero__title">Get in touch</div>

        <div className="hero__description">
          We really care about your RIMUN experience. If you need our help,
          please do not hesitate to contact us via our email{" "}
          <a href="mailto:info@rimun.com" className="link">
            info@rimun.com
          </a>{" "}
          or using the following form.
        </div>

        {internationalManager?.person.account?.email && (
          <div className="hero__description mt-4">
            If you are a foreign school, contact directly our{" "}
            <strong>
              Conference Manager for Relations with International Delegations
            </strong>{" "}
            at{" "}
            <a
              href={`mailto:${internationalManager.person.account.email}`}
              className="link"
            >
              {internationalManager.person.account.email}
            </a>
            .
          </div>
        )}
      </div>

      <div className="container">
        <ContactForm />
      </div>
    </div>
  );
}
