import { ClientEvents } from '../../types/EventHandlerMap'
import { ErrorMessages } from '../../types/Errors'
import { UserProps } from '../../types'
import User from '../../models/User'

const userFetch = async (...[userId, callback]: Parameters<ClientEvents['userFetch']>) => {
  try {
    const user: UserProps[] = await User.find({ _id: userId })

    if (!user) {
      throw new Error(ErrorMessages.USER_NOT_FOUND)
    }

    callback?.({
      isSuccess: true,
      user: {
        _id: user[0]._id,
        userName: user[0].userName,
        name: user[0].name
      }
    })
  } catch (message) {
    callback?.({
      isSuccess: false,
      message: message
    })
  }
}

export default userFetch
