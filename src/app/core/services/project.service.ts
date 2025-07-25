import {Injectable} from "@angular/core";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Observable, of} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {FirestoreService} from "./firestore.service";
import {Project} from "@shared/models/project.model";

@Injectable({
  providedIn: "root",
})
export class ProjectService {
  constructor(
    private afs: AngularFirestore,
    private firestore: FirestoreService,
  ) {}

  getProjects(accountId: string): Observable<Project[]> {
    return this.afs
      .collection<Project>(`accounts/${accountId}/projects`)
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Project;
            const id = a.payload.doc.id;
            return {...data, id};
          }),
        ),
        catchError((error) => {
          console.error("Error loading projects:", error);
          return of([]);
        }),
      );
  }

  createProject(accountId: string, project: Project): Promise<string> {
    return this.firestore.addDocument(
      `accounts/${accountId}/projects`,
      project,
    );
  }

  updateProject(
    accountId: string,
    projectId: string,
    data: Partial<Project>,
  ): Promise<void> {
    return this.firestore.updateDocument(
      `accounts/${accountId}/projects`,
      projectId,
      data,
    );
  }

  setArchived(
    accountId: string,
    projectId: string,
    archived: boolean,
  ): Promise<void> {
    return this.updateProject(accountId, projectId, {archived});
  }
}
