import { getCurrentUser } from "@/actions/user/get-user-data";
import { getAllPeople } from "@/actions/people/get-all-people";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { Pagination } from "@/components/ui/pagination";
import { AddPersonSheet } from "@/components/people/AddPersonSheet";

export default async function PeoplePage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const pageSize = 10; // You can adjust this or make it dynamic

  const {
    data: people,
    totalCount,
    totalPages,
  } = await getAllPeople(pageSize, page);
  console.log("People data:", people);


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Personer</h2>
        <div className="hidden items-center space-x-2 md:flex">
          <AddPersonSheet />
        </div>
      </div>

      {people && people.length > 0 ? (
        <>
          <ul className="space-y-4">
            {people.map((person) => (
              <li key={person.uuid} className="border p-4 rounded-md">
                <h3 className="text-lg font-semibold">{person.name}</h3>
                <p>{person.title}</p>
                <p>Email: {person.email}</p>
                <p>Phone: {person.phone}</p>
              </li>
            ))}
          </ul>
          <Pagination page={page} totalPages={totalPages} />
        </>
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
