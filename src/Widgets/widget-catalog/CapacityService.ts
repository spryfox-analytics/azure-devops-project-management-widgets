import { getClient } from 'azure-devops-extension-api';
import { WorkRestClient, Activity } from 'azure-devops-extension-api/Work';
import { IdentityRef } from 'azure-devops-extension-api/WebApi';
import {TeamContext} from "azure-devops-extension-api/Core";

export class CapacityService {
  async getTeamMembersCapacities(teamContext: TeamContext, iterationId: string, teamMembers: IdentityRef[]): Promise<{ [memberName: string]: number }> {
    try {
      const capacitiesPromises = teamMembers.map(async member => {
        const capacity = await getClient(WorkRestClient).getCapacityWithIdentityRef(teamContext, iterationId, member.id);
        const totalCapacity = capacity.activities.reduce((sum, activity: Activity) => sum + activity.capacityPerDay, 0);
        return { name: member.displayName, totalCapacity };
      });

      const capacities = await Promise.all(capacitiesPromises);

      const capacitiesMap: { [memberName: string]: number } = {};
      capacities.forEach(cap => {
        capacitiesMap[cap.name] = cap.totalCapacity;
      });

      return capacitiesMap;
    } catch (error) {
      console.error("Error getting team members capacities:", error);
      return {};
    }
  }
}
