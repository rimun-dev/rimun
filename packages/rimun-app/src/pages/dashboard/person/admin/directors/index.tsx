import Card from "src/components/layout/Card";
import PersonSearchResultItem from "src/components/layout/list/PersonSearchResultItem";
import Spinner from "src/components/status/Spinner";
import PageTitle from "src/components/typography/PageTitle";
import { trpc } from "src/trpc";

export default function AdminDirectors() {
  const { data, isLoading } = trpc.directors.getAllDirectors.useQuery();

  if (isLoading || !data) return <Spinner />;

  return (
    <>
      <PageTitle>List of MUN Directors</PageTitle>
      {data.map((schoolData) => (
        <Card className="my-4 p-4" key={schoolData.id}>
          <h3 className="block mb-4 font-bold">{schoolData.school.name}</h3>
          {schoolData.school.person_applications.map((da) => (
            <PersonSearchResultItem
              key={da.id}
              personData={da.person}
              onClick={() => {
                // TODO: navigate to profile
              }}
            />
          ))}
          {schoolData.school.person_applications.length === 0 && (
            <p className="text-slate-500 text-sm mt-2">
              There are no MUN Directors for this school yet.
            </p>
          )}
        </Card>
      ))}
    </>
  );
}
