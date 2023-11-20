import User from '../../models/User'
import { ClientEvents } from '../../types/EventHandlerMap'

const userLogIn = async (
  ...[userName, password, callback]: Parameters<ClientEvents['userLogIn']>
) => {
  try {
    const user = await User.find({ userName })

    if (!user || user.length === 0) {
      throw new Error('User not found')
    }

    if (user[0].passwordHash !== password) {
      throw new Error('Password is incorrect')
    }

    callback?.({
      isSuccess: true,
      user: user
    })
  } catch (error) {
    console.log('error = ', error)
  }
}

export default userLogIn
