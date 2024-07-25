import * as SDK from 'azure-devops-extension-sdk';
import { CommonServiceIds, IProjectPageService, getClient } from 'azure-devops-extension-api';
import { WorkRestClient, TeamMemberCapacityIdentityRef, Activity } from 'azure-devops-extension-api/Work';
import { CoreRestClient, TeamContext } from 'azure-devops-extension-api/Core';
import { IdentityRef } from 'azure-devops-extension-api/WebApi';

async function getCurrentProject(): Promise<{ id: string, name: string } | undefined> {
  const pps = await SDK.getService<IProjectPageService>(
    CommonServiceIds.ProjectPageService
  );
  const project = await pps.getProject();
  return project ? { id: project.id, name: project.name } : undefined;
}

async function getDefaultTeam(projectId: string): Promise<{ id: string, name: string } | undefined> {
  const coreClient = getClient(CoreRestClient);
  const teams = await coreClient.getTeams(projectId);
  // Assuming the first team is the default team, you might need to adjust this logic
  return teams.length > 0 ? { id: teams[0].id, name: teams[0].name } : undefined;
}

async function getCurrentIterationId(teamContext: TeamContext): Promise<string | undefined> {
  const workClient = getClient(WorkRestClient);
  const iterations = await workClient.getTeamIterations(teamContext);
  const currentDate = new Date();
  const currentIteration = iterations.find(iteration => {
    const startDate = new Date(iteration.attributes?.startDate);
    const finishDate = new Date(iteration.attributes?.finishDate);
    return startDate <= currentDate && finishDate >= currentDate;
  });
  return currentIteration?.id;
}

async function getTeamMembers(projectId: string, teamId: string): Promise<IdentityRef[]> {
  const coreClient = getClient(CoreRestClient);
  const teamMembers = await coreClient.getTeamMembersWithExtendedProperties(projectId, teamId);
  return teamMembers.map(member => member.identity);
}

export async function getTeamMembersCapacities(): Promise<{ [memberName: string]: number }> {
  const project = await getCurrentProject();
  if (!project) {
    throw new Error("Project information is missing.");
  }

  const team = await getDefaultTeam(project.id);
  if (!team) {
    throw new Error("Team information is missing.");
  }

  const teamContext: TeamContext = { projectId: project.id, teamId: team.id, project: project.name, team: team.name };

  const iterationId = await getCurrentIterationId(teamContext);
  if (!iterationId) {
    throw new Error("Current iteration information is missing.");
  }

  const teamMembers = await getTeamMembers(project.id, team.id);

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
}
