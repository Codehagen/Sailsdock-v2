"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { OpportunityData } from "@/lib/internal-api/types";
import { getCurrentUser } from "@/actions/user/get-user-data";

interface UpdatePositionData {
  stage: string;
}

interface BulkUpdateData {
  id: string;
  stage: string;
  position: number;
}

export async function getKanbanBoard() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.company_details?.uuid) {
      console.error("No workspace found for user");
      return { data: null };
    }

    const response = await apiClient.kanban.getBoard(
      currentUser.company_details.uuid
    );

    if (response.success) {
      return { data: response.data };
    } else {
      console.error("Failed to fetch kanban board:", response.status);
      return { data: null };
    }
  } catch (error: any) {
    console.error("Error in getKanbanBoard:", error.message);
    return { data: null };
  }
}

export async function createKanbanCard(
  cardData: Partial<OpportunityData>
): Promise<OpportunityData | null> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.company_details?.uuid) return null;

    const response = await apiClient.kanban.create(
      currentUser.company_details.uuid,
      cardData
    );

    if (response.success && response.data.length > 0) {
      return response.data[0];
    }
    return null;
  } catch (error: any) {
    console.error("Error in createKanbanCard:", error.message);
    return null;
  }
}

export async function updateKanbanCard(
  cardId: string,
  cardData: Partial<OpportunityData>
): Promise<OpportunityData | null> {
  try {
    const response = await apiClient.kanban.update(cardId, cardData);
    if (response.success && response.data.length > 0) {
      return response.data[0];
    }
    return null;
  } catch (error: any) {
    console.error("Error in updateKanbanCard:", error.message);
    return null;
  }
}

export async function deleteKanbanCard(cardId: string): Promise<boolean> {
  try {
    const response = await apiClient.kanban.delete(cardId);
    return response.success;
  } catch (error: any) {
    console.error("Error in deleteKanbanCard:", error.message);
    return false;
  }
}

export async function updateCardPosition(
  opportunityId: string,
  updateData: UpdatePositionData
): Promise<OpportunityData | null> {
  try {
    const response = await apiClient.kanban.updateCardPosition(opportunityId, {
      stage: updateData.stage,
    });

    if (response.success && response.data.length > 0) {
      return response.data[0];
    }
    return null;
  } catch (error: any) {
    console.error("Error in updateCardPosition:", error.message);
    return null;
  }
}

export async function bulkUpdateCards(
  updates: BulkUpdateData[]
): Promise<OpportunityData[] | null> {
  try {
    const response = await apiClient.kanban.bulkUpdate(updates);
    if (response.success && response.data.length > 0) {
      return response.data[0];
    }
    return null;
  } catch (error: any) {
    console.error("Error in bulkUpdateCards:", error.message);
    return null;
  }
}

export async function reorderColumn(
  columnId: string,
  cardIds: string[]
): Promise<boolean> {
  try {
    const response = await apiClient.kanban.reorderColumn(columnId, cardIds);
    return response.success;
  } catch (error: any) {
    console.error("Error in reorderColumn:", error.message);
    return false;
  }
}

export async function getKanbanColumns() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.company_details?.uuid) {
      console.error("No workspace found for user");
      return { data: null };
    }

    const response = await apiClient.kanban.getBoardColumns(
      currentUser.company_details.uuid
    );

    if (response.success) {
      return { data: response.data };
    }
    return { data: null };
  } catch (error: any) {
    console.error("Error in getKanbanColumns:", error.message);
    return { data: null };
  }
}
