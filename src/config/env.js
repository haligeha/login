const urlDev = ''
const urlProd = 'http://39.104.189.84:30300'
var baseUrl = ''
process.env.NODE_ENV === 'development' ? baseUrl = urlDev : baseUrl = urlProd

export { baseUrl }