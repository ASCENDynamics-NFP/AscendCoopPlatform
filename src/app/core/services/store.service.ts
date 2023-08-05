/***********************************************************************************************
* Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
* Copyright (C) 2023  ASCENDynamics NFP
*
* This file is part of Nonprofit Social Networking Platform.
*
* Nonprofit Social Networking Platform is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published
* by the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.

* Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.

* You should have received a copy of the GNU Affero General Public License
* along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
***********************************************************************************************/
import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {AppUser} from "../../models/user.model";
import {UsersService} from "./users.service";
import {AuthStoreService} from "./auth-store.service";
import {AppGroup} from "../../models/group.model";
import {GroupsService} from "./groups.service";
import {environment} from "../../../environments/environment";
import {FirestoreService} from "./firestore.service";

@Injectable({
  providedIn: "root",
})
export class StoreService {
  private collectionsSubscription: Subscription;
  private usersSubject = new BehaviorSubject<Partial<AppUser>[]>([]);
  users$: Observable<Partial<AppUser>[]> = this.usersSubject.asObservable();

  private groupsSubject = new BehaviorSubject<Partial<AppGroup>[]>([]);
  groups$: Observable<Partial<AppGroup>[]> = this.groupsSubject.asObservable();

  constructor(
    private authStoreService: AuthStoreService,
    private groupsService: GroupsService,
    private usersService: UsersService,
    private firestoreService: FirestoreService,
  ) {
    this.loadInitialData();
    this.collectionsSubscription = this.firestoreService
      .listenToMultipleDocumentsInMultipleCollections(
        this.firestoreService.getCollectionsSubject(),
      )
      .subscribe((data) => {
        // Get the current collections from the subject
        const currentCollections = this.firestoreService
          .getCollectionsSubject()
          .getValue();

        // Go through each document
        data.forEach((doc) => {
          doc = {...doc, id: doc["id"]};
          // Check each collection
          currentCollections.forEach((collection) => {
            // If the collection's ids include the document's id, add the document to the corresponding array
            if (collection.ids.includes(doc["id"])) {
              if (collection.collectionName === "users") {
                this.addUserToState(doc as Partial<AppUser>);
              } else if (collection.collectionName === "groups") {
                this.addGroupToState(doc as Partial<AppGroup>);
              }
            }
          });
        });
        if (!environment.production) {
          console.log(
            "Firestore",
            this.firestoreService.getCollectionsSubject().getValue(),
            data,
            "Groups",
            this.groupsSubject.getValue(),
            "Users",
            this.usersSubject.getValue(),
          );
        }
      });
  }

  loadInitialData() {
    this.authStoreService.user$.subscribe((user) => {
      if (user) {
        this.firestoreService.addIdToCollection("users", user.uid);
      } else {
        this.collectionsSubscription.unsubscribe();
      }
    });

    this.groupsService
      .getGroups() // load initial groups data
      .then((groups) => {
        // this.groupsSubject.next(groups);
        for (let group of groups) {
          this.addGroupToState(group as Partial<AppGroup>);
          if (group.admins) {
            group.admins.forEach((adminId) => {
              if (adminId === this.authStoreService.getCurrentUser()?.uid) {
                console.log("Admin of group", group);
                this.firestoreService.addIdToCollection("groups", group.id);
              }
            });
          }
        }
      });
  }

  /**
   * Fetches a user by their id and adds them to the usersSubject state if they don't already exist in it.
   * @param {string | null} userId - The id of the user to fetch and add to the state.
   */
  getUserById(userId: string | null): void {
    if (!userId) return;

    const currentState = this.usersSubject.getValue();
    const userExists = currentState.some((user) => user.id === userId);

    if (!userExists) {
      this.usersService.getUserById(userId).then((user) => {
        if (user) {
          this.addUserToState(user as Partial<AppUser>);
          if (!environment.production) {
            console.log(`User with id ${userId} added to state.`);
          }
        } else {
          if (!environment.production) {
            console.log(`User with id ${userId} not found.`);
          }
        }
      });
    } else {
      if (!environment.production) {
        console.log(`User with id ${userId} already exists in state.`);
      }
    }
  }

  searchUsersByName(name: string): void {
    this.usersService
      .searchUsersByName(name) // replace 'field', 'condition', 'value' with your actual values
      .then((users) => {
        if (users) {
          users.forEach((user) => {
            this.addUserToState(user as Partial<AppUser>);
          });
        }
      });
  }

  createUser(user: Partial<AppUser>) {
    if (!user.id) throw new Error("User must have a id");
    this.usersService.createUser(user);
    this.firestoreService.addIdToCollection("users", user.id);
  }

  updateUser(user: Partial<AppUser>) {
    this.usersService.updateUser(user);
    this.updateUserInState(user);
  }

  deleteUser(userId: string) {
    this.usersService.deleteUser(userId);
    this.firestoreService.removeIdFromCollection("users", userId);
  }

  addUserToState(user: Partial<AppUser>) {
    const currentState = this.usersSubject.getValue();
    const userIndex = currentState.findIndex((u) => u.id === user.id);
    if (!environment.production) {
      console.log("StoreService: addUserToState");
      if (userIndex !== -1) {
        console.log("User already exists in the state, update it");
      }
    }
    if (userIndex !== -1) {
      // User already exists in the state, update it
      currentState[userIndex] = user;
    } else {
      // User doesn't exist in the state, add it
      currentState.push(user);
    }

    this.usersSubject.next(currentState);
    // this.logChange("Users", user, currentState, this.usersSubject.getValue());
  }

  updateUserInState(user: Partial<AppUser>) {
    const currentState = this.usersSubject.getValue();
    const updatedState = currentState.map((u) => (u.id === user.id ? user : u));
    this.usersSubject.next(updatedState);
  }

  removeUserFromState(userId: string) {
    const currentState = this.usersSubject.getValue();
    const updatedState = currentState.filter((u) => u.id !== userId);
    this.usersSubject.next(updatedState);
  }

  searchGroups(name: string): void {
    let currentState = this.groupsSubject.getValue();
    this.groupsService.searchGroups(name).then((groups) => {
      groups.forEach((group) => {
        this.addGroupToState(group);
      });
      this.logChange(
        "Groups",
        name,
        currentState,
        this.groupsSubject.getValue(),
      );
    });
  }

  async createGroup(group: Partial<AppGroup>) {
    return this.groupsService.createGroup(group).then((groupId) => {
      if (groupId) {
        // this.addGroupToState({...group, id: groupId});
        this.firestoreService.addIdToCollection("groups", groupId);
      }
      return groupId;
    });
  }

  updateGroup(group: Partial<AppGroup>) {
    this.groupsService.updateGroup(group);
    this.updateGroupInState(group);
  }

  deleteGroup(groupId: string) {
    this.groupsService.deleteGroup(groupId);
    this.removeGroupFromState(groupId);
    this.firestoreService.removeIdFromCollection("groups", groupId);
  }

  updateGroupInState(group: Partial<AppGroup>) {
    const currentState = this.groupsSubject.getValue();
    const updatedState = currentState.map((g) =>
      g.id === group.id ? group : g,
    );
    this.groupsSubject.next(updatedState);
  }

  removeGroupFromState(groupId: string) {
    const currentState = this.groupsSubject.getValue();
    const updatedState = currentState.filter((g) => g.id !== groupId);
    this.groupsSubject.next(updatedState);
  }

  addGroupToState(group: Partial<AppGroup>) {
    const currentState = this.groupsSubject.getValue();
    const groupIndex = currentState.findIndex((g) => g.id === group.id);

    if (!environment.production) {
      console.log("StoreService: addGroupToState");
      if (groupIndex !== -1) {
        console.log("Group already exists in the state, update it");
      }
    }
    if (groupIndex !== -1) {
      // Group already exists in the state, update it
      currentState[groupIndex] = group;
    } else {
      // Group doesn't exist in the state, add it
      currentState.push(group);
    }

    this.groupsSubject.next(currentState);
  }

  logChange(
    collection: string,
    newValue: any,
    currentState: any,
    updatedState: any,
  ) {
    if (!environment.production) {
      console.log(
        "StoreService: " + "collectionSubject: ",
        this.firestoreService.getCollectionsSubject().getValue(),
        collection,
        newValue,
        "Previous state",
        currentState,
        "Updated state",
        updatedState,
      );
    }
  }
}
