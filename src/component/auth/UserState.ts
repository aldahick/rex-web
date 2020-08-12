import { AccessControl, Permission, Query } from "accesscontrol";
import * as _ from "lodash";
import { IRole } from "../../graphql/types";

const TOKEN_KEY = "rex.auth.token";
const ROLES_KEY = "rex.auth.roles";

export type AuthCheck = (can: Query) => Permission;

export const UserState = new (class {
  token?: string;

  private accessControl?: AccessControl;

  private roles?: IRole[];

  constructor() {
    const token = localStorage.getItem(TOKEN_KEY) ?? undefined;
    let roles: IRole[] | undefined;
    const rolesJson = localStorage.getItem(ROLES_KEY);
    if (rolesJson !== null) {
      roles = JSON.parse(rolesJson) as IRole[] | null ?? undefined;
    }
    if (token !== undefined && roles) {
      this.setAuth(token, roles);
    }
  }

  setAuth(token: string, roles: IRole[]) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
    this.token = token;
    this.roles = roles;
    this.createAccessControl();
  }

  removeAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLES_KEY);
    delete this.token;
    delete this.roles;
    delete this.accessControl;
  }

  get isAuthenticated(): boolean {
    return this.token !== undefined && !!this.roles && !!this.accessControl;
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
})();
