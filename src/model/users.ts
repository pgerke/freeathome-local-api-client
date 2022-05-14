/** Describes the user collection. */
export interface Users {
  /** The user properties for the user identified by the key. */
  [key: string]: {
    /** Determines whether or not the user account is enabled. */
    enabled: boolean;
    /** An array of flags for the user account. */
    flags: Array<string>;
    /** An array of the permissions granted to the user. */
    grantedPermissions: Array<string>;
    /** The user's JID. */
    jid: string;
    /** The users name. */
    name: string;
    /** The array of the permissions requested by the user. */
    requestedPermissions: Array<string>;
    /** The user's role. */
    role: string;
  };
}
