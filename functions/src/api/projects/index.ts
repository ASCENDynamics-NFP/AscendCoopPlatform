/**
 * Project API - Callable functions for project management
 */
import {onCall, HttpsError} from "firebase-functions/v2/https";
import {logger} from "firebase-functions/v2";
import {
  ProjectService,
  CreateProjectRequest,
  AssignToProjectRequest,
} from "../../services/projectService";

/**
 * Create a new project
 */
export const createProject = onCall(
  {
    region: "us-central1",
    enforceAppCheck: false,
    memory: "512MiB",
    timeoutSeconds: 60,
  },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const userId = request.auth.uid;
    const data = request.data as CreateProjectRequest;

    // Validate required fields
    if (!data.accountId || !data.name) {
      throw new HttpsError(
        "invalid-argument",
        "Account ID and project name are required",
      );
    }

    if (data.name.length < 2 || data.name.length > 100) {
      throw new HttpsError(
        "invalid-argument",
        "Project name must be between 2 and 100 characters",
      );
    }

    try {
      const result = await ProjectService.createProject(userId, data);

      logger.info(`Project created via API: ${result.projectId}`, {
        userId,
        accountId: data.accountId,
        projectName: data.name,
      });

      return {
        success: true,
        projectId: result.projectId,
        project: result.project,
      };
    } catch (error) {
      logger.error("Project creation failed:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Project creation failed");
    }
  },
);

/**
 * Update an existing project
 */
export const updateProject = onCall(
  {
    region: "us-central1",
    enforceAppCheck: false,
    memory: "256MiB",
    timeoutSeconds: 30,
  },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const userId = request.auth.uid;
    const {projectId, updates} = request.data as {
      projectId: string;
      updates: Partial<CreateProjectRequest>;
    };

    if (!projectId) {
      throw new HttpsError("invalid-argument", "Project ID is required");
    }

    if (
      updates.name &&
      (updates.name.length < 2 || updates.name.length > 100)
    ) {
      throw new HttpsError(
        "invalid-argument",
        "Project name must be between 2 and 100 characters",
      );
    }

    try {
      await ProjectService.updateProject({
        projectId,
        updates,
        userId,
      });

      return {
        success: true,
        message: "Project updated successfully",
      };
    } catch (error) {
      logger.error("Project update failed:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Project update failed");
    }
  },
);

/**
 * Delete a project
 */
export const deleteProject = onCall(
  {
    region: "us-central1",
    enforceAppCheck: false,
    memory: "256MiB",
    timeoutSeconds: 60,
  },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const userId = request.auth.uid;
    const {projectId} = request.data as {projectId: string};

    if (!projectId) {
      throw new HttpsError("invalid-argument", "Project ID is required");
    }

    try {
      await ProjectService.deleteProject(projectId, userId);

      return {
        success: true,
        message: "Project deleted successfully",
      };
    } catch (error) {
      logger.error("Project deletion failed:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Project deletion failed");
    }
  },
);

/**
 * Assign user to project
 */
export const assignToProject = onCall(
  {
    region: "us-central1",
    enforceAppCheck: false,
    memory: "256MiB",
    timeoutSeconds: 30,
  },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const userId = request.auth.uid;
    const data = request.data as AssignToProjectRequest;

    if (!data.projectId || !data.assigneeId) {
      throw new HttpsError(
        "invalid-argument",
        "Project ID and assignee ID are required",
      );
    }

    try {
      await ProjectService.assignToProject(userId, data);

      return {
        success: true,
        message: "User assigned to project successfully",
      };
    } catch (error) {
      logger.error("Project assignment failed:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Project assignment failed");
    }
  },
);

/**
 * Get projects for an account
 */
export const getAccountProjects = onCall(
  {
    region: "us-central1",
    enforceAppCheck: false,
    memory: "256MiB",
    timeoutSeconds: 30,
  },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const userId = request.auth.uid;
    const {accountId, status, category, limit, offset} = request.data as {
      accountId: string;
      status?: string;
      category?: string;
      limit?: number;
      offset?: number;
    };

    if (!accountId) {
      throw new HttpsError("invalid-argument", "Account ID is required");
    }

    try {
      const projects = await ProjectService.getAccountProjects(
        accountId,
        userId,
        {status, category, limit, offset},
      );

      return {
        success: true,
        projects,
      };
    } catch (error) {
      logger.error("Failed to get account projects:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to get projects");
    }
  },
);

/**
 * Get user's assigned projects
 */
export const getUserAssignedProjects = onCall(
  {
    region: "us-central1",
    enforceAppCheck: false,
    memory: "256MiB",
    timeoutSeconds: 30,
  },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const userId = request.auth.uid;
    const {status, limit, offset} = request.data as {
      status?: string;
      limit?: number;
      offset?: number;
    };

    try {
      const projects = await ProjectService.getUserAssignedProjects(userId, {
        status,
        limit,
        offset,
      });

      return {
        success: true,
        projects,
      };
    } catch (error) {
      logger.error("Failed to get user assigned projects:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to get assigned projects");
    }
  },
);

/**
 * Search public projects
 */
export const searchProjects = onCall(
  {
    region: "us-central1",
    enforceAppCheck: false,
    memory: "256MiB",
    timeoutSeconds: 30,
  },
  async (request) => {
    const {query, category, tags, status, limit, offset} = request.data as {
      query?: string;
      category?: string;
      tags?: string[];
      status?: string;
      limit?: number;
      offset?: number;
    };

    try {
      const projects = await ProjectService.searchProjects({
        query,
        category,
        tags,
        status,
        limit,
        offset,
      });

      return {
        success: true,
        projects,
      };
    } catch (error) {
      logger.error("Failed to search projects:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to search projects");
    }
  },
);
