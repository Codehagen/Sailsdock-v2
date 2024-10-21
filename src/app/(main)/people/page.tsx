import { Suspense } from "react";
import { getAllPeople } from "@/actions/people/get-all-people";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { AddPersonSheet } from "@/components/people/AddPersonSheet";
import { PeopleTable } from "@/components/people/people-table/data-table";
import { columns } from "@/components/people/people-table/columns";
import { PeopleTableSkeleton } from "@/components/people/people-table-skeleton";

export default async function PeoplePage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Personer</h2>
        <div className="hidden items-center space-x-2 md:flex">
          <AddPersonSheet />
        </div>
      </div>

      <div className="overflow-hidden">
        <Suspense fallback={<PeopleTableSkeleton />}>
          <PeopleTableWrapper />
        </Suspense>
      </div>
    </div>
  );
}

async function PeopleTableWrapper() {
  const { data: people, totalCount } = await getAllPeople(10, 1);

  if (people && people.length > 0) {
    return (
      <PeopleTable
        columns={columns}
        initialData={people}
        initialTotalCount={totalCount}
      />
    );
  } else {
    return (
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="user" />
        <EmptyPlaceholder.Title>Ingen personer funnet</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          Du har ikke lagt til noen personer ennå. Legg til en person for å
          komme i gang.
        </EmptyPlaceholder.Description>
        <AddPersonSheet />
      </EmptyPlaceholder>
    );
  }
}
