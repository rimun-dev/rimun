import {
  ChevronDownIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import CircularButton from "src/components/buttons/CircularButton";
import CTAButton from "src/components/buttons/CTAButton";
import CreateFaqCategoryModalForm from "src/components/forms/resources/CreateFaqCategoryModalForm";
import CreateFaqModalForm from "src/components/forms/resources/CreateFaqModalForm";
import UpdateFaqModalForm from "src/components/forms/resources/UpdateFaqModalForm";
import Card from "src/components/layout/Card";
import ConfirmationModal from "src/components/layout/ConfirmationModal";
import Spinner from "src/components/status/Spinner";
import PageTitle from "src/components/typography/PageTitle";
import { ResourcesRouterOutputs, trpc } from "src/trpc";

export default function AdminFaqs() {
  const [showFaqModal, setShowFaqModal] = React.useState(false);
  const [showFaqCategoryModal, setShowFaqCategoryModal] = React.useState(false);

  const { data, isLoading } = trpc.resources.getFaqs.useQuery(undefined, {
    refetchOnWindowFocus: true,
  });

  const trpcCtx = trpc.useContext();

  const handleUpdate = () => trpcCtx.resources.getFaqs.invalidate();

  if (isLoading || !data) return <Spinner />;

  return (
    <>
      <PageTitle>Frequently Asked Questions</PageTitle>

      <div className="flex gap-4">
        <CTAButton icon={PlusIcon} onClick={() => setShowFaqModal(true)}>
          Create F.A.Q.
        </CTAButton>
        <CTAButton
          icon={PlusIcon}
          onClick={() => setShowFaqCategoryModal(true)}
        >
          Create Category
        </CTAButton>
      </div>

      {data.map((c) => (
        <Card className="flex flex-col mt-4 p-4 gap-1">
          <h2 className="font-bold">{c.name}</h2>
          {c.faqs.map((faq) => (
            <FaqItem key={faq.id} faq={faq} handleUpdate={handleUpdate} />
          ))}
          {c.faqs.length === 0 && (
            <p>There are no questions in this category.</p>
          )}
        </Card>
      ))}

      <CreateFaqModalForm
        isVisible={showFaqModal}
        setIsVisible={setShowFaqModal}
        onFaqCreated={handleUpdate}
        categories={data}
      />

      <CreateFaqCategoryModalForm
        isVisible={showFaqCategoryModal}
        setIsVisible={setShowFaqCategoryModal}
        onFaqCategoryCreated={handleUpdate}
      />
    </>
  );
}

interface FaqItemProps {
  faq: ResourcesRouterOutputs["getFaqs"][0]["faqs"][0];
  handleUpdate: () => void;
}

function FaqItem(props: FaqItemProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [showAnswer, setShowAnswer] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showUpdateModal, setShowUpdateModal] = React.useState(false);

  const mutation = trpc.resources.deleteFaq.useMutation({
    onSuccess: props.handleUpdate,
  });

  return (
    <div
      className="border border-slate-200 rounded-sm"
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
    >
      <div className="flex items-center justify-between p-4">
        <div>{props.faq.question}</div>

        <div
          className={`flex items-center gap-2 ${
            isFocused
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <CircularButton
            icon={PencilIcon}
            onClick={() => setShowUpdateModal(true)}
          />
          <CircularButton
            icon={TrashIcon}
            onClick={() => setShowDeleteModal(true)}
          />
          <CircularButton
            icon={ChevronDownIcon}
            className={`transition-transform ${
              showAnswer ? "rotate-180" : undefined
            }`}
            onClick={() => setShowAnswer(!showAnswer)}
          />
        </div>
      </div>

      {showAnswer && (
        <div className="p-4 text-sm text-slate-600">{props.faq.answer}</div>
      )}

      <ConfirmationModal
        isVisible={showDeleteModal}
        setIsVisible={setShowDeleteModal}
        title="Delete F.A.Q."
        onConfirm={() => mutation.mutate(props.faq.id)}
      >
        Are you sure you want to delete the FA.Q. <b>{props.faq.question}</b>?
      </ConfirmationModal>

      <UpdateFaqModalForm
        isVisible={showUpdateModal}
        setIsVisible={setShowUpdateModal}
        faq={props.faq}
        onFaqUpdated={props.handleUpdate}
      />
    </div>
  );
}
