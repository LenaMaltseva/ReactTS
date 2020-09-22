const {ApolloServer} = require('apollo-server')
const schema = require('./schema')
const mongoose = require('mongoose')

const server = new ApolloServer({schema})
const DB_URL =
    'mongodb+srv://LenaDB:zaq1xsw2@cluster0.tjpex.mongodb.net/app?retryWrites=true&w=majority'

server
    .listen()
    .then(({url}) => {
        console.log(`🚀 Server ready at ${url}`)
    })
    .catch(err => console.log('⛔️ Server connection is failed:', err.message))

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})

const dbConnection = mongoose.connection
dbConnection.once('open', () => console.log(`🚀 DB connected`))
dbConnection.on('error', err =>
    console.log('⛔ ️Database connection is failed:', err)
)
