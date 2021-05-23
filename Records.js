const {Schema, model} = require('mongoose')
const mongoose = require('mongoose')

const Records = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
    required: true,
    auto: true,
  },
  name: String,
  record: String,
  date: String,
  level: String,
})

module.exports = model('Records', Records)



