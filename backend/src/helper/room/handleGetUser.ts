import { RoomProps, UserProps } from '../../types';
import { ErrorMessages } from '../../types/Errors';

function handleGetUser(room: RoomProps, id: string): UserProps {
	const user = room.users.find((user: any) => user.socketId === id);

	if (!user) {
		throw new Error(ErrorMessages.USER_NOT_FOUND);
	}

	return user;
}

export default handleGetUser;
