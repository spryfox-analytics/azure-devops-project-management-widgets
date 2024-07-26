import { ProjectService } from './ProjectService';
import { TeamService } from './TeamService';
import { IterationService } from './IterationService';
import { CapacityService } from './CapacityService';
import { TeamContext } from 'azure-devops-extension-api/Core';

export async function getTeamMembersCapacities(): Promise<{ [memberName: string]: number }> {
  const projectService = new ProjectService();
  const teamService = new TeamService();
  const iterationService = new IterationService();
  const capacityService = new CapacityService();

  const project = await projectService.getCurrentProject();
  if (!project) {
    console.log("Project information is missing.");
    return {};
  }
  console.log(`Found project: ${project.name}`);

  const team = await teamService.getDefaultTeam(project.id);
  if (!team) {
    console.log("Team information is missing.");
    return {};
  }
  console.log(`Found team: ${team.name}`);

  const teamContext: TeamContext = { projectId: project.id, teamId: team.id, project: project.name, team: team.name };
  const iterationId = await iterationService.getCurrentIterationId(teamContext);
  if (!iterationId) {
    console.log("Current iteration information is missing.");
    return {};
  }
  console.log(`Found iteration: ${iterationId}`);

  const teamMembers = await teamService.getTeamMembers(project.id, team.id);
  return await capacityService.getTeamMembersCapacities(teamContext, iterationId, teamMembers);
}
