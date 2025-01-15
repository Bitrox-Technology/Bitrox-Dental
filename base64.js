const base64= require("base-64")
let credential = require("./credentials.json")
console.log(credential)

let jsonString = JSON.stringify(credential);
let encodeData = base64.encode(jsonString)

console.log(encodeData)

let decodeData = base64.decode(encodeData)
jsonString = JSON.parse(decodeData)
console.log(decodeData)

console.log(jsonString)