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
import {BehaviorSubject, Observable} from "rxjs";
import {AppUser} from "../../models/user.model";
import {UsersService} from "./users.service";
import {AuthStoreService} from "./auth-store.service";
import {AppGroup} from "../../models/group.model";
import {GroupsService} from "./groups.service";

@Injectable({
  providedIn: "root",
})
export class StoreService {
  private usersSubject = new BehaviorSubject<Partial<AppUser>[]>([]);
  users$: Observable<Partial<AppUser>[]> = this.usersSubject.asObservable();

  private groupsSubject = new BehaviorSubject<Partial<AppGroup>[]>([]);
  groups$: Observable<Partial<AppGroup>[]> = this.groupsSubject.asObservable();

  constructor(
    private authStoreService: AuthStoreService,
    private groupsService: GroupsService,
    private usersService: UsersService,
  ) {
    this.loadInitialData();
  }

  loadInitialData() {
    this.authStoreService.user$.subscribe((user) => {
      if (!user) return;
      this.getUserById(user.uid);
    });

    this.groupsService
      .getGroups() // load initial groups data
      .then((groups) => {
        this.groupsSubject.next(groups);
      });
  }

  getUserById(userId: string | null): void {
    this.usersService
      .getUserById(userId) // replace 'field', 'condition', 'value' with your actual values
      .then((user) => {
        this.addUserToState(user as Partial<AppUser>);
      });
  }

  createUser(user: Partial<AppUser>) {
    if (!user.id) throw new Error("User must have a id");
    this.usersService.createUser(user);
    this.addUserToState(user as Partial<AppUser>);
  }

  updateUser(user: Partial<AppUser>) {
    this.usersService.updateUser(user);
    this.updateUserInState(user);
  }

  deleteUser(userId: string) {
    this.usersService.deleteUser(userId);
    this.removeUserFromState(userId);
  }

  addUserToState(user: Partial<AppUser>) {
    const currentState = this.usersSubject.getValue();
    this.usersSubject.next([...currentState, user]);
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

  createGroup(group: Partial<AppGroup>) {
    this.groupsService.createGroup(group).then((groupId) => {
      if (groupId) {
        this.addGroupToState({...group, id: groupId});
      }
    });
  }

  updateGroup(group: Partial<AppGroup>) {
    this.groupsService.updateGroup(group);
    this.updateGroupInState(group);
  }

  deleteGroup(groupId: string) {
    this.groupsService.deleteGroup(groupId);
    this.removeGroupFromState(groupId);
  }

  addGroupToState(group: Partial<AppGroup>) {
    const currentState = this.groupsSubject.getValue();
    this.groupsSubject.next([...currentState, group]);
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
}
