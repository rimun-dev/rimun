import { PlusIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Link } from "react-router-dom";
import Banner from "src/components/status/Banner";
import Spinner from "src/components/status/Spinner";
import PageTitle from "src/components/typography/PageTitle";
import { trpc } from "src/trpc";
import useAuthenticatedState from "src/utils/useAuthenticatedState";
import CTAButton from "../buttons/CTAButton";
import CreateBlogPostModalForm from "../forms/news/CreateBlogPostModalForm";
import BlogPostItem from "../layout/list/BlogPostItem";

export default function NewsFeed() {
  const [showCreateModal, setShowCreateModal] = React.useState<boolean>(false);

  const authState = useAuthenticatedState();

  const { data, isLoading } = trpc.news.getPosts.useQuery();

  if (!data || isLoading) return <Spinner />;

  const canCreatePosts =
    authState.account.is_admin ||
    authState.account.person?.applications.sort(
      (a, b) => b.created_at.getTime() - a.created_at.getTime()
    )[0]?.confirmed_group?.name === "secretariat";

  const hasApplied = (authState.account.person?.applications.length ?? 0) > 0;

  return (
    <div className="max-w-5xl mx-auto">
      <PageTitle>News Feed</PageTitle>

      {canCreatePosts && (
        <CTAButton icon={PlusIcon} onClick={() => setShowCreateModal(true)}>
          Create Blog Post
        </CTAButton>
      )}

      {!hasApplied && (
        <Banner
          status="info"
          title="Welcome to your Dashboard!"
          className="text-base"
        >
          It seems like you have not yet applied to this year's session. When
          you are ready you can{" "}
          <Link
            to="/dashboard/application"
            className="text-blue-500 hover:underline"
          >
            start your application
          </Link>
          .
          <br />
          We hope to see you soon during the conference!
        </Banner>
      )}

      <div className="flex flex-col gap-4 mt-4">
        {data
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .map((post) => (
            <BlogPostItem
              key={post.id}
              blogPost={post}
              canEdit={canCreatePosts}
            />
          ))}
      </div>

      <CreateBlogPostModalForm
        isVisible={showCreateModal}
        setIsVisible={setShowCreateModal}
      />
    </div>
  );
}
