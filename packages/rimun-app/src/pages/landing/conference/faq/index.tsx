import { PlusIcon } from "@heroicons/react/24/outline";
import React from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import rehypeRaw from "rehype-raw";
import Spinner from "src/components/status/Spinner";
import { ResourcesRouterOutputs, trpc } from "src/trpc";
import "./index.scss";

export default function LandingConferenceFaq() {
  const { data, isLoading } = trpc.resources.getFaqs.useQuery();

  if (!data || isLoading) return <Spinner />;

  return (
    <div id="faqs">
      <div className="hero">
        <div className="hero__overlay" />
        <div className="hero__title">F.A.Q.</div>
        <div className="hero__description">
          Here you can find answers to the most frequently asked questions about
          the conference.
        </div>
      </div>
      <div className="container">
        {data.map((ca) => (
          <div key={ca.id} className="faq-category">
            <h2 className="title my-6 text-center">{ca.name}</h2>
            {ca.faqs.map((faq) => (
              <FaqItem key={faq.id} faqData={faq} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

interface FaqItemProps {
  faqData: ResourcesRouterOutputs["getFaqs"][0]["faqs"][0];
}

function FaqItem(props: FaqItemProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={`faq ${isOpen ? "open" : undefined}`}>
      <div className="faq__header" onClick={() => setIsOpen(!isOpen)}>
        <span>{props.faqData.question}</span>
        <PlusIcon className="w-6 h-6" />
      </div>
      <ReactMarkdown
        className={isOpen ? "faq__body" : "hidden"}
        rehypePlugins={[rehypeRaw]}
      >
        {props.faqData.answer}
      </ReactMarkdown>
    </div>
  );
}
