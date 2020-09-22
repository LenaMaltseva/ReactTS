const {gql, makeExecutableSchema, PubSub} = require('apollo-server')
const Task = require('../models/task')

const pubsub = new PubSub()
const TASK_ADDED = 'TASK_ADDED'
const TASK_EDIT = 'TASK_EDIT'

const typeDefs = gql`
    type Task {
        id: ID!
        title: String
        isCompleted: Boolean
        isPinned: Boolean
        hasSnooze: Boolean
    }
    input TaskInput {
        id: ID!
        title: String
        isCompleted: Boolean
        isPinned: Boolean
        hasSnooze: Boolean
    }
    interface MutationResponse {
        code: String!
        success: Boolean!
        message: String
    }
    type TasksUpdateResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String
        task: Task
    }
    type Query {
        tasks: [Task]!
        task(id: ID!): Task
    }
    type Mutation {
        addTask(title: String!): TasksUpdateResponse!
        editTask(task: TaskInput): TasksUpdateResponse!
        deleteTask(id: ID!): TasksUpdateResponse!
    }
    type Subscription {
        taskChanged: Task
    }
`

const resolvers = {
    Query: {
        tasks() {
            return Task.find()
        },
        task(_, args) {
            return Task.findById(args.id)
        },
    },
    Mutation: {
        async addTask(_, {title}) {
            try {
                const newTask = new Task({
                    title,
                    isCompleted: false,
                    isPinned: false,
                    hasSnooze: false,
                })
                await newTask.save()

                pubsub.publish(TASK_ADDED, {taskChanged: newTask})
                return setResponse('SUCCESS', newTask)
            } catch (err) {
                return setResponse('ERROR')
            }
        },
        async editTask(_, {task: {id, ...updates}}) {
            try {
                const updTask = await Task.findByIdAndUpdate(
                    id,
                    {$set: updates},
                    {new: true}
                )
                pubsub.publish(TASK_EDIT, {
                    taskChanged: updTask,
                })
                return setResponse('SUCCESS', updTask)
            } catch (err) {
                return setResponse('ERROR')
            }
        },
        deleteTask(_, {id}) {
            try {
                const delTask = Task.findByIdAndDelete(id)
                return setResponse('SUCCESS', delTask)
            } catch (err) {
                return setResponse('ERROR')
            }
        },
    },
    Subscription: {
        taskChanged: {
            subscribe: () => pubsub.asyncIterator([TASK_ADDED, TASK_EDIT]),
        },
    },
}

const setResponse = (type, task) => {
    switch (type) {
        case 'ERROR': {
            return {
                code: 500,
                success: false,
                message: 'Something get wrong, try again later',
            }
        }
        case 'SUCCESS':
        default: {
            return {
                code: 200,
                success: true,
                task,
            }
        }
    }
}

module.exports = makeExecutableSchema({
    typeDefs,
    resolvers,
    resolverValidationOptions: {requireResolversForResolveType: false},
})
