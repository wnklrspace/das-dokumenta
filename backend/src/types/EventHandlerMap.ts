import { Server, Socket } from 'socket.io'
import { CommentProps, DocumentProps, RoomProps, RoomsProps, UserModes, UserProps } from '.'
import type { ErrorMessages as Message } from './Errors'

export interface EventHandlerProps {
  io: Server<ClientEvents, ServerEvents>
  socket: Socket<ClientEvents, ServerEvents>
  rooms: RoomsProps
}

export type Response =
  | {
      isSuccess: true
    }
  | {
      isSuccess: false
      message: Message | unknown
    }

export type UserLogInResponse =
  | {
      isSuccess: true
      user: any
    }
  | {
      isSuccess: false
      message: Message | unknown
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
  commentFetch: (commentId: CommentProps['_id'][], callback?: any) => void
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
  commentChanged: (comment: unknown) => void
  availableComments: (comments: unknown[]) => void
  documentCreated: (document: unknown) => void
  availableDocuments: (documents: unknown[]) => void
  roomFeedback: (
    roomId: RoomProps['_id'],
    state: string,
    user: UserProps,
    returnedDocument: unknown
  ) => void
  roomChanged: (room: RoomProps) => void
  roomsOverview: (rooms: unknown[]) => void
}
