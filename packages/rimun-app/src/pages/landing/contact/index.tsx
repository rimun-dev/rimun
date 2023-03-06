import ContactForm from "src/components/forms/contact/ContactForm";
import "./index.scss";

export default function LandingContact() {
  return (
    <div id="contact">
      <div className="hero">
        <div className="hero__overlay" />
        <div className="hero__title">Get in touch</div>
        <div className="hero__description">
          We really care about your RIMUN experience. If you need our help,
          please do not hesitate to contact us via our email{" "}
          <a href="" className="link">
            info@rimun.com
          </a>{" "}
          or using the following form.
        </div>
      </div>
      <div className="container">
        <ContactForm />
      </div>
    </div>
  );
}
