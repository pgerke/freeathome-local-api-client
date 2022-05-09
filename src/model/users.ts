/**
 * Describes the user collection
 *
 * @interface
 */
export interface Users {
  [key: string]: {
    enabled: boolean;
    flags: Array<string>;
    grantedPermissions: Array<string>;
    jid: string;
    name: string;
    requestedPermissions: Array<string>;
    role: string;
  };
}
