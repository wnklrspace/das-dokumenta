import router from 'express'
import { attemptLogin, handleLogin } from '../Controller/authController'

const route = router.Router()

route.route('/login').get(handleLogin).post(attemptLogin)

export default route
