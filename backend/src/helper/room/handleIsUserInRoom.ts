import { RoomProps, UserProps } from '../../types';

function handleIsUserInRoom(room: RoomProps, socketId: string): boolean {
	return room.users.some((user: UserProps) => user.socketId === socketId);
}

export default handleIsUserInRoom;
