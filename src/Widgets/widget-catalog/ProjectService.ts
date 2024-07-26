import * as SDK from 'azure-devops-extension-sdk';
import { CommonServiceIds, IProjectPageService } from 'azure-devops-extension-api';

export class ProjectService {
  async getCurrentProject(): Promise<{ id: string, name: string } | undefined> {
    try {
      const pps = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService);
      const project = await pps.getProject();
      return project ? { id: project.id, name: project.name } : undefined;
    } catch (error) {
      console.error("Error getting current project:", error);
      return undefined;
    }
  }
}
