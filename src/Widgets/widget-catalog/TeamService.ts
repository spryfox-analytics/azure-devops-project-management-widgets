import { getClient } from 'azure-devops-extension-api';
import { CoreRestClient } from 'azure-devops-extension-api/Core';
import {IdentityRef} from "azure-devops-extension-api/WebApi";

export class TeamService {
  async getDefaultTeam(projectId: string): Promise<{ id: string, name: string } | undefined> {
    try {
      const coreClient = getClient(CoreRestClient);
      const teams = await coreClient.getTeams(projectId);
      return teams.length > 0 ? { id: teams[1].id, name: teams[1].name } : undefined;
    } catch (error) {
      console.error("Error getting default team:", error);
      return undefined;
    }
  }

  async getTeamMembers(projectId: string, teamId: string): Promise<IdentityRef[]> {
    try {
      const coreClient = getClient(CoreRestClient);
      const teamMembers = await coreClient.getTeamMembersWithExtendedProperties(projectId, teamId);
      return teamMembers.map(member => member.identity);
    } catch (error) {
      console.error("Error getting team members:", error);
      return [];
    }
  }
}
