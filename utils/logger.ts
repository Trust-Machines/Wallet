import axios from 'axios'

const NEW_RELIC_API_KEY = '68d2105ded6e34c7b4cd9dcf325b25f5FFFFNRAL'
const APP_VERSION = '0.1' // TODO: Make this dynamic

export const LOGGER_EVENTS = {
    ROUTING: "routing",
    ERROR: "error",
    DEBUG: "debug",
    INFO: "info"
  }

export async function logger(event = LOGGER_EVENTS.DEBUG, payload: any, module = '') {
    const userAddress = '0xsampleaddress' // TODO: get this from asyncstorage

    const message = typeof payload === 'object' && payload !== null ? JSON.stringify(payload) : payload
    const formattedMessage = message !== null ? message?.replace(/\\/g, '') : null

    if (event) {
        if (event === LOGGER_EVENTS.ERROR) {
            console.warn(formattedMessage)
        } else {
            console.log(formattedMessage)
        }
    }

    axios.post('https://log-api.newrelic.com/log/v1?Api-Key=' + NEW_RELIC_API_KEY, {
      message: `Log: ${formattedMessage} | User Address: ${userAddress}`,
      userAddress: userAddress,
      module,
      version: APP_VERSION
    })
}