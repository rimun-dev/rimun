import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import CircularButton from "src/components/buttons/CircularButton";
import UpdateBlogPostModalForm from "src/components/forms/news/UpdateBlogPostModalForm";
import ConfirmationModal from "src/components/layout/ConfirmationModal";
import PersonItemBadge from "src/components/layout/list/utils/PersonItemBadge";
import { NewsRouterOutputs, trpc } from "src/trpc";
import DropDown from "../DropDown";

interface BlogPostItemProps extends React.HTMLProps<HTMLDivElement> {
  canEdit: boolean;
  blogPost: NewsRouterOutputs["getPosts"][0];
}

export default function BlogPostItem({
  canEdit,
  blogPost,
  ...props
}: BlogPostItemProps) {
  const [showUpdateModal, setShowUpdateModal] = React.useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

  const trpcCtx = trpc.useContext();

  const mutation = trpc.news.deletePost.useMutation({
    onSuccess: () => trpcCtx.news.getPosts.invalidate(),
  });

  return (
    <>
      <div
        {...props}
        className={`relative border border-slate-200 bg-white rounded-lg ${props.className}`}
      >
        <div className="py-4">
          <div className="font-bold text-lg px-4">{blogPost.title}</div>
          <div className="text-xs px-4 text-slate-500">
            {new Date(blogPost.created_at).toLocaleString("it-IT")}
          </div>
        </div>

        <div className="px-4 pb-4 flex items-center">
          <PersonItemBadge
            person={blogPost.author}
            description={
              blogPost.author.applications[0]?.confirmed_role?.name ??
              "Member of the RIMUN team"
            }
          />
        </div>

        <div className="px-4 pb-4" data-color-mode="light">
          <ReactMarkdown className="text-justify" rehypePlugins={[rehypeRaw]}>
            {blogPost.body}
          </ReactMarkdown>
        </div>

        {canEdit && (
          <DropDown
            className="absolute right-4 top-4"
            items={[
              { name: "Edit", onClick: () => setShowUpdateModal(true) },
              { name: "Delete", onClick: () => setShowDeleteModal(true) },
            ]}
          >
            <CircularButton icon={EllipsisHorizontalIcon} />
          </DropDown>
        )}
      </div>

      <UpdateBlogPostModalForm
        isVisible={showUpdateModal}
        setIsVisible={setShowUpdateModal}
        blogPost={blogPost}
      />

      <ConfirmationModal
        isVisible={showDeleteModal}
        setIsVisible={setShowDeleteModal}
        onConfirm={() => mutation.mutate(blogPost.id)}
        isLoading={mutation.isLoading}
        title="Delete Blog Post"
      >
        Are you sure you want to delete this post?
      </ConfirmationModal>
    </>
  );
}
