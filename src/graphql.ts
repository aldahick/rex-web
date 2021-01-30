export type Maybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: Date;
  /** The `Upload` scalar type represents a file upload. */
  Upload: File;
};



export type IMediaItem = {
  __typename?: 'MediaItem';
  key: Scalars['String'];
  type: IMediaItemType;
};

export enum IMediaItemType {
  File = 'file',
  Directory = 'directory',
  Series = 'series'
}

export type ISteamPlayer = {
  __typename?: 'SteamPlayer';
  _id: Scalars['String'];
  nickname: Scalars['String'];
  avatarUrl: Scalars['String'];
  profileUrl: Scalars['String'];
  playingGame?: Maybe<ISteamGame>;
  ownedGames: Array<ISteamGame>;
};

export type ISteamGame = {
  __typename?: 'SteamGame';
  _id: Scalars['Int'];
  name: Scalars['String'];
};

export enum IAuthAction {
  CreateAny = 'createAny',
  CreateOwn = 'createOwn',
  DeleteAny = 'deleteAny',
  DeleteOwn = 'deleteOwn',
  ReadAny = 'readAny',
  ReadOwn = 'readOwn',
  UpdateAny = 'updateAny',
  UpdateOwn = 'updateOwn'
}

export enum IAuthClientType {
  Mobile = 'MOBILE',
  Web = 'WEB'
}

export type IAuthPermission = {
  __typename?: 'AuthPermission';
  resource: Scalars['String'];
  action: IAuthAction;
};

export type IAuthPermissionInput = {
  resource: Scalars['String'];
  action: IAuthAction;
};

export type IAuthToken = {
  __typename?: 'AuthToken';
  token: Scalars['String'];
  user: IUser;
};

export type IRole = {
  __typename?: 'Role';
  _id: Scalars['String'];
  name: Scalars['String'];
  permissions: Array<IAuthPermission>;
};

export type INote = {
  __typename?: 'Note';
  _id: Scalars['String'];
  createdAt: Scalars['DateTime'];
  title: Scalars['String'];
  body: Scalars['String'];
};

export type IProgress = {
  __typename?: 'Progress';
  _id: Scalars['String'];
  action: Scalars['String'];
  createdAt: Scalars['DateTime'];
  status: IProgressStatus;
  logs: Array<IProgressLog>;
};

export type IProgressLog = {
  __typename?: 'ProgressLog';
  createdAt: Scalars['DateTime'];
  text: Scalars['String'];
};

export enum IProgressStatus {
  Created = 'CREATED',
  InProgress = 'IN_PROGRESS',
  Complete = 'COMPLETE',
  Errored = 'ERRORED'
}

export type IMutation = {
  __typename?: 'Mutation';
  addRoleToUser: Scalars['Boolean'];
  createUser: IUser;
  setUserPassword: Scalars['Boolean'];
  addMediaDownload: IProgress;
  fetchSteamGames: IProgress;
  createAuthTokenGoogle: IAuthToken;
  /** username can also be email */
  createAuthTokenLocal: IAuthToken;
  /** requires auth */
  createAuthToken: IAuthToken;
  createRole: IRole;
  deleteRole: Scalars['Boolean'];
  updateRole: Scalars['Boolean'];
  updateRolePermissions: Scalars['Boolean'];
  createNote: INote;
  removeNote: Scalars['Boolean'];
  updateNoteBody: Scalars['Boolean'];
};


export type IMutationAddRoleToUserArgs = {
  userId: Scalars['String'];
  roleId: Scalars['String'];
};


export type IMutationCreateUserArgs = {
  email: Scalars['String'];
  username?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
};


export type IMutationSetUserPasswordArgs = {
  userId: Scalars['String'];
  password: Scalars['String'];
};


export type IMutationAddMediaDownloadArgs = {
  url: Scalars['String'];
  destinationKey: Scalars['String'];
};


export type IMutationCreateAuthTokenGoogleArgs = {
  googleIdToken: Scalars['String'];
  clientType: IAuthClientType;
};


export type IMutationCreateAuthTokenLocalArgs = {
  username: Scalars['String'];
  password: Scalars['String'];
};


export type IMutationCreateAuthTokenArgs = {
  userId: Scalars['String'];
};


export type IMutationCreateRoleArgs = {
  name: Scalars['String'];
};


export type IMutationDeleteRoleArgs = {
  id: Scalars['String'];
};


export type IMutationUpdateRoleArgs = {
  id: Scalars['String'];
  name: Scalars['String'];
};


export type IMutationUpdateRolePermissionsArgs = {
  id: Scalars['String'];
  permissions: Array<IAuthPermissionInput>;
};


export type IMutationCreateNoteArgs = {
  title: Scalars['String'];
};


export type IMutationRemoveNoteArgs = {
  id: Scalars['String'];
};


export type IMutationUpdateNoteBodyArgs = {
  id: Scalars['String'];
  body: Scalars['String'];
};

export type IQuery = {
  __typename?: 'Query';
  user: IUser;
  users: Array<IUser>;
  mediaItems: Array<IMediaItem>;
  steamGames: Array<ISteamGame>;
  steamPlayer: ISteamPlayer;
  steamPlayers: Array<ISteamPlayer>;
  roles: Array<IRole>;
  note: INote;
  notes: Array<INote>;
  progress: IProgress;
};


export type IQueryUserArgs = {
  id?: Maybe<Scalars['String']>;
};


export type IQueryMediaItemsArgs = {
  dir: Scalars['String'];
};


export type IQuerySteamGamesArgs = {
  page: Scalars['Int'];
  search: Scalars['String'];
};


export type IQuerySteamPlayerArgs = {
  steamId64: Scalars['String'];
};


export type IQuerySteamPlayersArgs = {
  steamIds64: Array<Scalars['String']>;
};


export type IQueryNoteArgs = {
  id: Scalars['String'];
};


export type IQueryProgressArgs = {
  id: Scalars['String'];
};

export type IUser = {
  __typename?: 'User';
  _id: Scalars['String'];
  email: Scalars['String'];
  username?: Maybe<Scalars['String']>;
  roles?: Maybe<Array<IRole>>;
  permissions?: Maybe<Array<IAuthPermission>>;
};

export enum ICacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}

