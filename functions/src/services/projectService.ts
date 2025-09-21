/**
 * Project Service - Centralized business logic for project operations
 */
import {getFirestore, Timestamp} from "firebase-admin/firestore";
import {logger} from "firebase-functions/v2";
import {HttpsError} from "firebase-functions/v2/https";
import {NotificationService} from "./notificationService";

const db = getFirestore();

export interface CreateProjectRequest {
  accountId: string;
  name: string;
  description?: string;
  category?: string;
  // Align with frontend model
  status?: "Planning" | "Active" | "On Hold" | "Completed" | "Cancelled";
  startDate?: string;
  endDate?: string;
  budget?: number;
  priority?: "Low" | "Medium" | "High" | "Critical";
  tags?: string[];
  goals?: string[];
  requiredSkills?: string[];
  teamSize?: number;
  isPublic?: boolean;
  // Additional optional fields present in shared Project model
  color?: string;
  icon?: string;
  clientId?: string;
  archived?: boolean;
  standardProjectTemplateId?: string;
  standardCategory?: string;
  isStandardProject?: boolean;
  complexity?: string;
  timeframe?: string;
}

export interface UpdateProjectRequest {
  projectId: string;
  updates: Partial<CreateProjectRequest>;
  userId: string;
}

export interface AssignToProjectRequest {
  projectId: string;
  assigneeId: string;
  role?: string;
  permissions?: string[];
  notes?: string;
}

export class ProjectService {
  // Normalize incoming status to frontend-supported values
  private static normalizeStatus(
    status?: string,
  ): "Planning" | "Active" | "On Hold" | "Completed" | "Cancelled" {
    if (!status) return "Active";
    const s = String(status).toLowerCase();
    if (s === "planning") return "Planning";
    if (s === "active") return "Active";
    if (s === "on hold" || s === "on_hold" || s === "paused") return "On Hold";
    if (s === "completed" || s === "complete") return "Completed";
    if (s === "cancelled" || s === "canceled" || s === "archived")
      return "Cancelled";
    return "Active";
  }

  // Normalize incoming priority to frontend-supported values
  private static normalizePriority(
    priority?: string,
  ): "Low" | "Medium" | "High" | "Critical" {
    if (!priority) return "Medium";
    const p = String(priority).toLowerCase();
    if (p === "low") return "Low";
    if (p === "medium") return "Medium";
    if (p === "high") return "High";
    if (p === "critical" || p === "urgent") return "Critical";
    return "Medium";
  }
  /**
   * Create a new project
   */
  static async createProject(
    userId: string,
    request: CreateProjectRequest,
  ): Promise<{projectId: string; project: any}> {
    try {
      // Validate permissions
      await this.validateProjectPermissions(
        userId,
        request.accountId,
        "create",
      );

      const projectRef = db
        .collection("accounts")
        .doc(request.accountId)
        .collection("projects")
        .doc();

      const now = Timestamp.now();

      const projectData = {
        id: projectRef.id,
        accountId: request.accountId,
        name: request.name,
        description: request.description || "",
        category: request.category || "general",
        status: ProjectService.normalizeStatus(request.status),
        startDate: request.startDate || null,
        endDate: request.endDate || null,
        budget: request.budget ?? null,
        priority: ProjectService.normalizePriority(request.priority),
        tags: request.tags || [],
        goals: request.goals || [],
        requiredSkills: request.requiredSkills || [],
        teamSize: request.teamSize ?? 1,
        isPublic: request.isPublic ?? false,
        // Extra fields mirrored to match frontend model
        color: request.color || null,
        icon: request.icon || null,
        clientId: request.clientId || null,
        archived: request.archived ?? false,
        standardProjectTemplateId: request.standardProjectTemplateId || null,
        standardCategory: request.standardCategory || null,
        isStandardProject: request.isStandardProject ?? false,
        complexity: request.complexity || null,
        timeframe: request.timeframe || null,
        progress: 0,
        tasksCompleted: 0,
        totalTasks: 0,
        createdAt: now,
        createdBy: userId,
        lastModifiedAt: now,
        lastModifiedBy: userId,
      };

      const batch = db.batch();

      // Create project document
      batch.set(projectRef, projectData);

      // Create project owner assignment
      const assignmentRef = projectRef.collection("assignments").doc(userId);
      batch.set(assignmentRef, {
        id: userId,
        projectId: projectRef.id,
        role: "owner",
        permissions: ["read", "write", "delete", "manage"],
        status: "active",
        assignedAt: now,
        assignedBy: userId,
        createdAt: now,
        createdBy: userId,
      });

      // Add to main projects collection for global queries
      const globalProjectRef = db.collection("projects").doc(projectRef.id);
      batch.set(globalProjectRef, {
        ...projectData,
        accountRef: db.collection("accounts").doc(request.accountId),
      });

      await batch.commit();

      logger.info(`Project created: ${projectRef.id}`, {
        userId,
        accountId: request.accountId,
        projectName: request.name,
      });

      return {
        projectId: projectRef.id,
        project: projectData,
      };
    } catch (error) {
      logger.error("Error creating project:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to create project");
    }
  }

  /**
   * Update an existing project
   */
  static async updateProject(request: UpdateProjectRequest): Promise<void> {
    try {
      const projectRef = db.collection("projects").doc(request.projectId);

      const projectDoc = await projectRef.get();
      if (!projectDoc.exists) {
        throw new HttpsError("not-found", "Project not found");
      }

      const project = projectDoc.data()!;

      // Check permissions
      await this.validateProjectPermissions(
        request.userId,
        project.accountId,
        "update",
        request.projectId,
      );

      const batch = db.batch();
      const now = Timestamp.now();

      const updatesRaw = {
        ...request.updates,
      } as any;
      // Normalize known enums if present
      if (updatesRaw.status)
        updatesRaw.status = ProjectService.normalizeStatus(updatesRaw.status);
      if (updatesRaw.priority)
        updatesRaw.priority = ProjectService.normalizePriority(
          updatesRaw.priority,
        );
      const updates = {
        ...updatesRaw,
        lastModifiedAt: now,
        lastModifiedBy: request.userId,
      };

      // Update in main projects collection
      batch.update(projectRef, updates);

      // Update in account's projects subcollection
      const accountProjectRef = db
        .collection("accounts")
        .doc(project.accountId)
        .collection("projects")
        .doc(request.projectId);

      batch.update(accountProjectRef, updates);

      await batch.commit();

      logger.info(`Project updated: ${request.projectId}`);
    } catch (error) {
      logger.error("Error updating project:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to update project");
    }
  }

  /**
   * Delete a project
   */
  static async deleteProject(projectId: string, userId: string): Promise<void> {
    try {
      const projectRef = db.collection("projects").doc(projectId);
      const projectDoc = await projectRef.get();

      if (!projectDoc.exists) {
        throw new HttpsError("not-found", "Project not found");
      }

      const project = projectDoc.data()!;

      // Check permissions
      await this.validateProjectPermissions(
        userId,
        project.accountId,
        "delete",
        projectId,
      );

      const batch = db.batch();

      // Delete main project document
      batch.delete(projectRef);

      // Delete from account's projects subcollection
      const accountProjectRef = db
        .collection("accounts")
        .doc(project.accountId)
        .collection("projects")
        .doc(projectId);

      batch.delete(accountProjectRef);

      // Delete all project subcollections
      const subcollections = ["assignments", "tasks", "timeEntries", "files"];

      for (const subcollection of subcollections) {
        const subColRef = projectRef.collection(subcollection);
        const docs = await subColRef.get();
        docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
      }

      await batch.commit();

      logger.info(`Project deleted: ${projectId}`);
    } catch (error) {
      logger.error("Error deleting project:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to delete project");
    }
  }

  /**
   * Assign user to project
   */
  static async assignToProject(
    assignerId: string,
    request: AssignToProjectRequest,
  ): Promise<void> {
    try {
      // Check permissions
      const projectRef = db.collection("projects").doc(request.projectId);
      const projectDoc = await projectRef.get();

      if (!projectDoc.exists) {
        throw new HttpsError("not-found", "Project not found");
      }

      const project = projectDoc.data()!;

      await this.validateProjectPermissions(
        assignerId,
        project.accountId,
        "manage",
        request.projectId,
      );

      // Get assignee account data
      const assigneeDoc = await db
        .collection("accounts")
        .doc(request.assigneeId)
        .get();
      if (!assigneeDoc.exists) {
        throw new HttpsError("not-found", "Assignee account not found");
      }

      const assignee = assigneeDoc.data()!;
      const now = Timestamp.now();

      const assignmentData = {
        id: request.assigneeId,
        projectId: request.projectId,
        accountId: project.accountId,
        name: assignee.name,
        email: assignee.email,
        iconImage: assignee.iconImage || null,
        role: request.role || "member",
        permissions: request.permissions || ["read"],
        status: "active",
        notes: request.notes || null,
        assignedAt: now,
        assignedBy: assignerId,
        createdAt: now,
        createdBy: assignerId,
      };

      const batch = db.batch();

      // Create assignment in project's assignments subcollection
      const assignmentRef = projectRef
        .collection("assignments")
        .doc(request.assigneeId);
      batch.set(assignmentRef, assignmentData);

      // Create reference in assignee's assigned projects
      const userProjectRef = db
        .collection("accounts")
        .doc(request.assigneeId)
        .collection("assignedProjects")
        .doc(request.projectId);

      batch.set(userProjectRef, {
        id: request.projectId,
        accountId: project.accountId,
        name: project.name,
        description: project.description,
        role: request.role || "member",
        status: "active",
        assignedAt: now,
        assignedBy: assignerId,
      });

      await batch.commit();

      // Send notification to assignee
      try {
        await NotificationService.sendNotification({
          recipientId: request.assigneeId,
          type: "admin_notification",
          title: "Project Assignment",
          message: `You have been assigned to project "${project.name}"`,
          senderId: assignerId,
          relatedAccountId: project.accountId,
          data: {
            projectId: request.projectId,
            role: request.role || "member",
          },
        });
      } catch (notificationError) {
        logger.error(
          "Failed to send project assignment notification:",
          notificationError,
        );
      }

      logger.info(`User assigned to project`, {
        projectId: request.projectId,
        assigneeId: request.assigneeId,
        assignerId,
        role: request.role,
      });
    } catch (error) {
      logger.error("Error assigning to project:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to assign to project");
    }
  }

  /**
   * Get projects for an account
   */
  static async getAccountProjects(
    accountId: string,
    userId: string,
    options: {
      status?: string;
      category?: string;
      limit?: number;
      offset?: number;
    } = {},
  ): Promise<any[]> {
    try {
      // Check permissions
      await this.validateProjectPermissions(userId, accountId, "read");

      let query = db
        .collection("accounts")
        .doc(accountId)
        .collection("projects")
        .orderBy("createdAt", "desc");

      if (options.status) {
        query = query.where("status", "==", options.status);
      }

      if (options.category) {
        query = query.where("category", "==", options.category);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.offset(options.offset);
      }

      const snapshot = await query.get();
      return snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
    } catch (error) {
      logger.error("Error getting account projects:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to get projects");
    }
  }

  /**
   * Get user's assigned projects
   */
  static async getUserAssignedProjects(
    userId: string,
    options: {
      status?: string;
      limit?: number;
      offset?: number;
    } = {},
  ): Promise<any[]> {
    try {
      let query = db
        .collection("accounts")
        .doc(userId)
        .collection("assignedProjects")
        .orderBy("assignedAt", "desc");

      if (options.status) {
        query = query.where("status", "==", options.status);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.offset(options.offset);
      }

      const snapshot = await query.get();
      return snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
    } catch (error) {
      logger.error("Error getting user assigned projects:", error);
      throw new HttpsError("internal", "Failed to get assigned projects");
    }
  }

  /**
   * Search public projects
   */
  static async searchProjects(
    searchOptions: {
      query?: string;
      category?: string;
      tags?: string[];
      status?: string;
      limit?: number;
      offset?: number;
    } = {},
  ): Promise<any[]> {
    try {
      let query = db
        .collection("projects")
        .where("isPublic", "==", true)
        .orderBy("createdAt", "desc");

      if (searchOptions.category) {
        query = query.where("category", "==", searchOptions.category);
      }

      if (searchOptions.status) {
        query = query.where("status", "==", searchOptions.status);
      }

      if (searchOptions.limit) {
        query = query.limit(searchOptions.limit);
      }

      if (searchOptions.offset) {
        query = query.offset(searchOptions.offset);
      }

      const snapshot = await query.get();
      let results = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));

      // Filter by tags if provided
      if (searchOptions.tags && searchOptions.tags.length > 0) {
        results = results.filter((project: any) =>
          searchOptions.tags!.some(
            (tag) => project.tags && project.tags.includes(tag),
          ),
        );
      }

      // Filter by query text if provided
      if (searchOptions.query) {
        const queryLower = searchOptions.query.toLowerCase();
        results = results.filter(
          (project: any) =>
            project.name.toLowerCase().includes(queryLower) ||
            (project.description &&
              project.description.toLowerCase().includes(queryLower)),
        );
      }

      return results;
    } catch (error) {
      logger.error("Error searching projects:", error);
      throw new HttpsError("internal", "Failed to search projects");
    }
  }

  // Private helper methods
  private static async validateProjectPermissions(
    userId: string,
    accountId: string,
    action: "create" | "read" | "update" | "delete" | "manage",
    projectId?: string,
  ): Promise<void> {
    // Load account for owner/admin checks and user self-ownership
    const accountSnap = await db.collection("accounts").doc(accountId).get();
    if (!accountSnap.exists) {
      throw new HttpsError("not-found", "Account not found");
    }
    const account = accountSnap.data() as any;

    // Allow if acting on own user account
    if (userId === accountId) return;

    // For groups: allow if user is creator/owner or in admin/moderator denormalized arrays
    if (account?.type === "group") {
      const isCreator = account?.createdBy === userId;
      const inAdmins = Array.isArray(account?.adminIds)
        ? account.adminIds.includes(userId)
        : false;
      const inMods = Array.isArray(account?.moderatorIds)
        ? account.moderatorIds.includes(userId)
        : false;
      if (isCreator || inAdmins || inMods) return;
    }

    // Fallback to relatedAccounts membership
    const relatedAccountDoc = await db
      .collection("accounts")
      .doc(accountId)
      .collection("relatedAccounts")
      .doc(userId)
      .get();

    if (!relatedAccountDoc.exists) {
      throw new HttpsError("permission-denied", "No access to this account");
    }

    const relation = relatedAccountDoc.data() as any;
    const isApproved = relation?.status === "accepted";
    if (!isApproved) {
      throw new HttpsError("permission-denied", "Account access not approved");
    }

    // For create, update, delete, manage actions, require admin/moderator access or assignment-level permission
    if (["create", "update", "delete", "manage"].includes(action)) {
      if (["admin", "moderator"].includes(relation?.access)) return;

      // Otherwise require project assignment permission (when projectId is given)
      if (projectId) {
        const assignmentDoc = await db
          .collection("projects")
          .doc(projectId)
          .collection("assignments")
          .doc(userId)
          .get();

        if (assignmentDoc.exists) {
          const assignment = assignmentDoc.data()!;
          const requiredPermissions: {[key: string]: string[]} = {
            create: ["write"],
            update: ["write"],
            delete: ["delete"],
            manage: ["manage"],
          };

          if (
            assignment.permissions?.some((perm: string) =>
              requiredPermissions[action]?.includes(perm),
            )
          ) {
            return;
          }
        }

        throw new HttpsError(
          "permission-denied",
          `Insufficient permissions for ${action}`,
        );
      }

      // If no projectId and not admin/mod, creating/updating is denied
      throw new HttpsError(
        "permission-denied",
        `Insufficient permissions for ${action}`,
      );
    }
  }
}
