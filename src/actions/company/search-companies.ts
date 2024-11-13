"use server";

import { z } from "zod";

interface CompanySearchResult {
  organisasjonsnummer: string;
  navn: string;
  forretningsadresse?: {
    adresse?: string[];
    postnummer?: string;
    poststed?: string;
  };
}

interface SearchResponse {
  _embedded?: {
    enheter?: CompanySearchResult[];
  };
  page?: {
    totalElements?: number;
  };
}

const searchParamsSchema = z.object({
  name: z.string().min(2),
});

export async function searchCompanies(query: string) {
  try {
    const params = searchParamsSchema.parse({ name: query });

    const searchParams = new URLSearchParams({
      navn: params.name,
      size: "10",
    });

    const response = await fetch(
      `https://data.brreg.no/enhetsregisteret/api/enheter?${searchParams.toString()}`,
      {
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    const data = (await response.json()) as SearchResponse;

    if (!data._embedded?.enheter) {
      console.log("No results found or unexpected response structure:", data);
      return [];
    }

    return data._embedded.enheter.map((company) => ({
      value: company.organisasjonsnummer,
      label: company.navn,
      address: company.forretningsadresse?.adresse?.[0] || "",
      postalCode: company.forretningsadresse?.postnummer || "",
      city: company.forretningsadresse?.poststed || "",
    }));
  } catch (error) {
    console.error("Error searching companies:", error);
    return [];
  }
}
