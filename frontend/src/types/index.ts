import { ErrorMessages } from './Errors'

export type RoomsObserverProps = {
  _id: string
  users: { name: string }[]
}

export type RoomsProps = {
  [key: string]: RoomProps
}

export type RoomProps = {
  _id: string
  host: HostProps
  users: UserProps[]
  sessionToken?: string
  document?: {
    _id: string
    title: string
    slug: string
    filePath: string
  }
}

export enum UserRoomEvents {
  ALREADY_JOINED = 'alreadyJoined',
  JOINABLE = 'joinable',
  NON_EXISTENT = 'nonExistent'
}

export type HostProps = {
  _id: string
  socketId: string
  userName: string
}

export type DBUserProps = {
  _id: string
  name: string
  userName: string
  email: string
  passwordHash: string
  role: string
  comments: CommentProps['_id'][]
  documents: DocumentProps['_id'][]
}

export enum UserModes {
  DEFAULT = 'default',
  CREATION = 'creation',
  EDIT = 'edit'
}

export type UserProps = {
  _id: string
  name: string
  userName: string
  socketId: string
  mode: UserModes
  cursorProps: {
    x: number
    y: number
    opacity: number
  }
}

export type ColleagueProps = UserProps

export type CommentProps = {
  _id: string | 'draft'
  left: number
  top: number
  resolved: boolean
  timesEdited: number
  className: string
  content: string
  createdAt: Date
  createdBy: UserProps['_id']
  document: DocumentProps['_id']
}

export type DocumentProps = {
  _id: string
  title: string
  slug: string
  createdAt: Date
  filePath: string
  comments: CommentProps['_id'][]
  createdBy: UserProps['_id']
  availableTo: UserProps['_id'][]
}

export type UserLogInResponse =
  | {
      isSuccess: true
      user: any
    }
  | {
      isSuccess: false
      message: ErrorMessages | unknown
    }

export type Callback = (response: Response) => void

export interface ClientEvents {
  userLogIn: (
    email: string,
    password: string,
    callback?: (response: UserLogInResponse) => void
  ) => void
  userFetch: (
    userId: string,
    callback?: (
      response:
        | Response
        | { isSuccess: boolean; user: { _id: string; userName: string; name: string } }
    ) => void
  ) => void
  roomCreate: (
    userId: string,
    userName: string,
    roomName: string,
    document: {
      _id: string
      title: string
      slug: string
      filePath: string
    },
    callback?: Callback
  ) => void
  roomJoin: (userId: string, userName: string, roomName: string, callback?: Callback) => void
  roomLeave: (callback?: Callback) => void
  roomCheck: (roomId: string, user: UserProps, document: DocumentProps, callback?: Callback) => void
  roomUpdate: (roomId: string, callback?: Callback) => void
  roomFetchOnReload: (roomId: string, callback?: any) => void
  roomCheckForUser: (roomId: string, callback?: any) => void
  roomCheckForComments: (documentId: string, callback?: any) => void
  roomOverviewLoad: (roomId: string, callback?: any) => void
  updateCursor: (
    roomId: string,
    userId: string,
    cursorProps: { x: number; y: number; opacity: number },
    callback?: Callback
  ) => void
  documentCreate: (userId: string, title: string, file: any, callback?: Callback) => void
  documentsFetch: (userId: string, callback?: Callback) => void
  documentFetch: (roomId: string, _id: string, slug: string, callback?: Callback) => void
  commentCreate: (
    left: string,
    top: string,
    className: string,
    content: string,
    createdBy: string,
    documentId: DocumentProps['_id'],
    roomId: RoomProps['_id'],
    callback?: Callback
  ) => void
  commentsFetch: (documentId: DocumentProps['_id'][], callback?: Callback) => void
  commentUpdate: (
    commentId: CommentProps['_id'],
    documentId: DocumentProps['_id'],
    roomId: RoomProps['_id'],
    content: string,
    timesEdited: number,
    callback?: Callback
  ) => void
  commentResolve: (
    commentId: CommentProps['_id'],
    documentId: DocumentProps['_id'],
    roomId: RoomProps['_id'],
    resolvedState: boolean,
    callback?: Callback
  ) => void
  commentsChanged: (
    documentId: DocumentProps['_id'],
    newComment: CommentProps,
    callback?: Callback
  ) => void
  commentStateSetter: (userId: string, roomId: string, mode: UserModes, callback?: Callback) => void
}

export interface ServerEvents {
  userJoined: (roomId: string, userId: string) => void
  roomChecked: (roomId: string, state: 'nonexistent' | 'joinable') => void
  userLeft: () => void
  roomChanged: (room: RoomProps) => void
}
