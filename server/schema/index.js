const {gql, makeExecutableSchema, PubSub} = require('apollo-server')

let tasks = [
    {
        title: 'очень важная задача',
        id: '1600699355009',
        isCompleted: false,
    },
    {
        title: 'blabla',
        id: '1600699198271',
        isCompleted: false,
    },
]

const setResponse = type => {
    switch (type) {
        case 'ERROR': {
            return {
                code: 500,
                success: false,
                message: 'Something get wrong, try again later',
                tasks: [],
            }
        }
        default: {
            return {
                code: 200,
                success: true,
                tasks,
            }
        }
    }
}

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
        tasks: [Task]
    }
    type Query {
        tasks: [Task]!
        task(id: ID!): Task
    }
    type Mutation {
        addTask(title: String!): TasksUpdateResponse!
        editTask(updTask: TaskInput): TasksUpdateResponse!
        deleteTask(id: ID!): TasksUpdateResponse!
    }
    type Subscription {
        taskChanged: Task
    }
`

const resolvers = {
    Query: {
        tasks() {
            return tasks
        },
        task(_, args) {
            return tasks.find(task => task.id === args.id)
        },
    },
    Mutation: {
        addTask(_, {title}) {
            try {
                const newTask = {
                    title,
                    isCompleted: false,
                    isPinned: false,
                    hasSnooze: false,
                    id: Date.now().toString(),
                }
                tasks.push(newTask)
                pubsub.publish(TASK_ADDED, {taskChanged: newTask})
                return setResponse()
            } catch (err) {
                return setResponse('ERROR')
            }
        },
        editTask(_, {updTask}) {
            try {
                const taskIdx = tasks.findIndex(task => task.id === updTask.id)
                const updatedTask = {...tasks[taskIdx], ...updTask}
                tasks = [
                    ...tasks.slice(0, taskIdx),
                    updatedTask,
                    ...tasks.slice(taskIdx + 1),
                ]
                pubsub.publish(TASK_EDIT, {
                    taskChanged: updatedTask,
                })
                return setResponse()
            } catch (err) {
                return setResponse('ERROR')
            }
        },
        deleteTask(_, {id}) {
            try {
                const taskIdx = tasks.findIndex(task => task.id === id)
                tasks = [
                    ...tasks.slice(0, taskIdx),
                    ...tasks.slice(taskIdx + 1),
                ]
                return setResponse()
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

module.exports = makeExecutableSchema({
    typeDefs,
    resolvers,
    resolverValidationOptions: {requireResolversForResolveType: false},
})
