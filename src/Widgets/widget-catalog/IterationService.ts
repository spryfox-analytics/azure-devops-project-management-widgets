import { getClient } from 'azure-devops-extension-api';
import { WorkRestClient } from 'azure-devops-extension-api/Work';
import {TeamContext} from "azure-devops-extension-api/Core";

export class IterationService {
  async getCurrentIterationId(teamContext: TeamContext): Promise<string | undefined> {
    try {
      const workClient = getClient(WorkRestClient);
      const iterations = await workClient.getTeamIterations(teamContext);
      const currentDate = new Date();
      const currentIteration = iterations.find(iteration => {
        const startDate = new Date(iteration.attributes?.startDate);
        const finishDate = new Date(iteration.attributes?.finishDate);
        return startDate <= currentDate && finishDate >= currentDate;
      });
      return currentIteration?.id;
    } catch (error) {
      console.error("Error getting current iteration:", error);
      return undefined;
    }
  }
}
