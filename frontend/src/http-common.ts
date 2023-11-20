import axios from 'axios'

export default axios.create({
  baseURL: `http://${process.env.REACT_APP_IP_ADDRESS}:4000`,
  withCredentials: true,
  headers: {
    'Content-type': 'application/json'
  }
})
