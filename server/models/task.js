const {Schema, model} = require('mongoose')

const taskSchema = new Schema({
    title: String,
    isCompleted: Boolean,
    isPinned: Boolean,
    hasSnooze: Boolean,
})

module.exports = model('Task', taskSchema)
