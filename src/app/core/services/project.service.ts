import {Injectable} from "@angular/core";
import {Observable, of, throwError} from "rxjs";
import {catchError, map, tap} from "rxjs/operators";
import {
  FirebaseFunctionsService,
  CreateProjectRequest,
  UpdateProjectRequest,
  AssignToProjectRequest,
  SearchProjectsRequest,
} from "./firebase-functions.service";

@Injectable({
  providedIn: "root",
})
export class ProjectService {
  constructor(private firebaseFunctions: FirebaseFunctionsService) {}

  /**
   * Create a new project using callable function
   */
  createProject(data: CreateProjectRequest): Observable<any> {
    return this.firebaseFunctions.createProject(data).pipe(
      tap((result) => {
        // Optionally add any additional processing here
      }),
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }

  /**
   * Update an existing project using callable function
   */
  updateProject(data: UpdateProjectRequest): Observable<any> {
    return this.firebaseFunctions.updateProject(data).pipe(
      catchError((error) => {
        throw error;
      }),
    );
  }

  /**
   * Delete a project using callable function
   */
  deleteProject(accountId: string, projectId: string): Observable<any> {
    return this.firebaseFunctions.deleteProject(accountId, projectId).pipe(
      catchError((error) => {
        throw error;
      }),
    );
  }

  /**
   * Assign a user to a project using callable function
   */
  assignToProject(data: AssignToProjectRequest): Observable<any> {
    return this.firebaseFunctions.assignToProject(data).pipe(
      catchError((error) => {
        throw error;
      }),
    );
  }

  /**
   * Get all projects for an account using callable function
   */
  getAccountProjects(accountId: string): Observable<any> {
    return this.firebaseFunctions.getAccountProjects(accountId).pipe(
      map((result) => result.projects || []),
      catchError((error) => {
        return of([]);
      }),
    );
  }

  /**
   * Get projects assigned to current user using callable function
   */
  getUserAssignedProjects(): Observable<any> {
    return this.firebaseFunctions.getUserAssignedProjects().pipe(
      map((result) => result.projects || []),
      catchError((error) => {
        return of([]);
      }),
    );
  }

  /**
   * Search projects with filtering options using callable function
   */
  searchProjects(params: SearchProjectsRequest): Observable<any> {
    return this.firebaseFunctions.searchProjects(params).pipe(
      map((result) => result.projects || []),
      catchError((error) => {
        return of([]);
      }),
    );
  }

  /**
   * Set a project as archived/unarchived - legacy method that calls updateProject
   */
  setArchived(
    accountId: string,
    projectId: string,
    archived: boolean,
  ): Observable<any> {
    return this.updateProject({
      accountId,
      projectId,
      updates: {archived} as any, // Add archived to the interface if needed
    });
  }

  // Legacy method for backward compatibility - should be migrated to getAccountProjects
  getProjects(accountId: string): Observable<any[]> {
    return this.getAccountProjects(accountId);
  }
}
