import { getCurrentUser } from "@/actions/user/get-user-data";
import { getAllPeople } from "@/actions/people/get-all-people";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { AddPersonSheet } from "@/components/people/AddPersonSheet";
import { PeopleTable } from "@/components/people/people-table/data-table";
import { columns } from "@/components/people/people-table/columns";

export default async function PeoplePage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const pageSize = 10;

  const {
    data: people,
    totalCount,
  } = await getAllPeople(pageSize, page);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Personer</h2>
        <div className="hidden items-center space-x-2 md:flex">
          <AddPersonSheet />
        </div>
      </div>

      {people && people.length > 0 ? (
        <PeopleTable
          columns={columns}
          initialData={people}
          initialTotalCount={totalCount}
        />
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="user" />
          <EmptyPlaceholder.Title>Legg til person</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Du har ikke lagt til noen personer. Legg til en person for å komme i
            gang.
          </EmptyPlaceholder.Description>
          <AddPersonSheet />
        </EmptyPlaceholder>
      )}
    </div>
  );
}
