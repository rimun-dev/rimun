import MDEditor from "@uiw/react-md-editor";
import React from "react";
import rehypeSanitize from "rehype-sanitize";
import CircularButton from "src/components/buttons/CircularButton";
import UpdateBlogPostModalForm from "src/components/forms/news/UpdateBlogPostModalForm";
import ConfirmationModal from "src/components/layout/ConfirmationModal";
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
          <img
            alt={`${blogPost.author.name}'s picture`}
            className="rounded-full h-12 w-12 bg-slate-400 overflow-hidden object-cover"
          />
          <div className="ml-4 text-xs">
            <p className="font-bold">
              {blogPost.author.name} {blogPost.author.surname}
            </p>
            <p className="font-light text-slate-500">
              {blogPost.author.applications[0]!.confirmed_role?.name ??
                "Member of the RIMUN team"}
            </p>
          </div>
        </div>

        <div className="px-4 pb-4" data-color-mode="light">
          <MDEditor.Markdown
            source={blogPost.body}
            rehypePlugins={[[rehypeSanitize]]}
          />
        </div>

        {canEdit && (
          <DropDown
            className="absolute right-4 top-4"
            items={[
              { name: "Edit", onClick: () => setShowUpdateModal(true) },
              { name: "Delete", onClick: () => setShowDeleteModal(true) },
            ]}
          >
            <CircularButton icon="dots-horizontal" />
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
