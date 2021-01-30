import { AccessControl, Permission, Query } from "accesscontrol";
import * as _ from "lodash";
import { action, computed, makeObservable, observable } from "mobx";
import { singleton } from "tsyringe";

import { IRole } from "../graphql";

const TOKEN_KEY = "rex.auth.token/v2";
interface AuthTokenData {
  token: string;
  roles: IRole[];
}

export type AuthCheck = (can: Query) => Permission;

@singleton()
export class AuthStore {
  @observable private data?: AuthTokenData;

  private accessControl?: AccessControl;

  constructor() {
    makeObservable(this);
    let token: AuthTokenData | undefined;
    const tokenJson = localStorage.getItem(TOKEN_KEY);

    if (tokenJson !== null) {
      token = JSON.parse(tokenJson) as AuthTokenData | null ?? undefined;
    }
    if (token) {
      this.setToken(token);
    }
  }

  @action.bound
  setToken(token: AuthTokenData): void {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
    this.data = token;
    this.createAccessControl();
  }

  @action.bound
  removeAuth(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.data = this.accessControl = undefined;
  }

  @computed
  get token(): string | undefined {
    return this.data?.token;
  }

  @computed
  get roles(): IRole[] | undefined {
    return this.data?.roles;
  }

  @computed
  get isAuthenticated(): boolean {
    return this.data !== undefined && !!this.accessControl;
  }

  isAuthorized(check: AuthCheck): boolean {
    if (!this.roles) {
      return false;
    }
    return this.roles.some(r => this.accessControl
      && check(this.accessControl.can(r.name)).granted
    ) || false;
  }

  private createAccessControl() {
    if (!this.roles) {
      return;
    }
    this.accessControl = new AccessControl(_.flatten(
      this.roles.map(role => role.permissions.map(permission => ({
        role: role.name,
        resource: permission.resource,
        action: permission.action,
        attributes: "*",
      }))),
    ));
  }
}
