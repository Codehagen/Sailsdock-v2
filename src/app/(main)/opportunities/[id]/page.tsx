import { DashboardShell } from "@/components/shell/shell";
import { getOpportunityDetails } from "@/actions/opportunity/get-details-opportunities";
import { notFound } from "next/navigation";
import { format, parseISO } from "date-fns";
import { nb } from "date-fns/locale";

export default async function OpportunityDetailsPage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  const opportunityId = params.id;
  const opportunityDetails = await getOpportunityDetails(opportunityId);
  // console.log(opportunityDetails);

  if (!opportunityDetails) {
    notFound();
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{opportunityDetails.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Opportunity Details</h2>
            <p>
              <strong>ID:</strong> {opportunityDetails.id}
            </p>
            <p>
              <strong>UUID:</strong> {opportunityDetails.uuid}
            </p>
            <p>
              <strong>Status:</strong> {opportunityDetails.status}
            </p>
            <p>
              <strong>Stage:</strong> {opportunityDetails.stage}
            </p>
            <p>
              <strong>Value:</strong> {opportunityDetails.value} NOK
            </p>
            <p>
              <strong>Created:</strong>{" "}
              {formatDate(opportunityDetails.date_created)}
            </p>
            <p>
              <strong>Last Updated:</strong>{" "}
              {formatDate(opportunityDetails.last_updated)}
            </p>
            <p>
              <strong>Est. Completion:</strong>{" "}
              {formatDate(opportunityDetails.est_completion)}
            </p>
            <p>
              <strong>Closed:</strong>{" "}
              {opportunityDetails.is_closed ? "Yes" : "No"}
            </p>
            <p>
              <strong>Won:</strong> {opportunityDetails.is_won ? "Yes" : "No"}
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Additional Information</h2>
            <p>
              <strong>Description:</strong>{" "}
              {opportunityDetails.description || "No description available"}
            </p>
            <p>
              <strong>User ID:</strong> {opportunityDetails.user}
            </p>
            <h3 className="text-lg font-semibold mt-4">User Details</h3>
            <p>
              <strong>Name:</strong>{" "}
              {opportunityDetails.user_details.first_name}{" "}
              {opportunityDetails.user_details.last_name}
            </p>
            <p>
              <strong>Email:</strong> {opportunityDetails.user_details.email}
            </p>
            <h3 className="text-lg font-semibold mt-4">Progress</h3>
            <p>
              <strong>Step 1:</strong>{" "}
              {opportunityDetails.step_1 ? "Completed" : "Not Completed"}
            </p>
            <p>
              <strong>Step 2:</strong>{" "}
              {opportunityDetails.step_2 ? "Completed" : "Not Completed"}
            </p>
            <p>
              <strong>Step 3:</strong>{" "}
              {opportunityDetails.step_3 ? "Completed" : "Not Completed"}
            </p>
            <p>
              <strong>Step 4:</strong>{" "}
              {opportunityDetails.step_4 ? "Completed" : "Not Completed"}
            </p>
            <p>
              <strong>Step 5:</strong>{" "}
              {opportunityDetails.step_5 ? "Completed" : "Not Completed"}
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "N/A";
  const date = parseISO(dateString);
  return format(date, "d. MMMM yyyy 'kl.' HH:mm", { locale: nb });
}
