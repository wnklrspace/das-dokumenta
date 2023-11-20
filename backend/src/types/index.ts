export enum UserRoomEvents {
  ALREADY_JOINED = 'alreadyJoined',
  JOINABLE = 'joinable',
  NON_EXISTENT = 'nonExistent'
}

export enum UserModes {
  DEFAULT = 'default',
  CREATION = 'creation',
  EDIT = 'edit'
}

export type RoomsProps = {
  [key: string]: RoomProps
}

export type RoomProps = {
  _id: string
  host: HostProps
  users: UserProps[]
  sessionToken?: string
  document: {
    _id: string
    title: string
    slug: string
  }
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

export type CommentProps = {
  _id: string
  top: number
  left: number
  resolved: boolean
  timesEdited: number
  className: string
  content: string
  createdBy: UserProps['_id']
  document: DocumentProps['_id']
}
