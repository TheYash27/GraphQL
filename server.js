const express = require('express')
const expressGraphQL = require('express-graphql')
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLNonNull } = require('graphql')

const app = express()

const girs = [
    { id: 1, name: 'S' },
    { id: 2, name: 'A' },
    { id: 3, name: 'P' }
]

const eduinss = [
    { id: 1, name: 'VPMSOSPSSS', girId: 1 },
    { id: 2, name: 'VPMSOSHS', girId: 2 },
    { id: 3, name: 'LPHS', girId: 3 },
    { id: 4, name: 'BITSPKKBGCY2Y3', girId: 2},
    { id: 5, name: 'BITSPKKBGCY4', girId: 1 }
]

const EduInsType = new GraphQLObjectType({
    name: 'EduIns',
    description: 'This represents 1 of the educational institutions that I have learned at',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        girId: { type: new GraphQLNonNull(GraphQLInt) },
        gir: {
            type: GirType,
            resolve: (eduins) => {
                return girs.find(gir => gir.id === eduins.girId)
            }
        }
    })
})

const GirType = new GraphQLObjectType({
    name: 'Gir',
    description: "This represents 1 of the girlfriends that I've had",
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        eduinss: {
            type: new GraphQLList(EduInsType),
            resolve: (gir) => {
                return eduinss.filter(eduins => eduins.girId === gir.id)
            }
        }
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'This is my root query',
    fields: () => ({
        eduins: {
            type: EduInsType,
            description: '1 of the educational institutions that I have learned at',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => eduinss.find(eduins => eduins.id === args.id)
        },
        eduinss: {
            type: new GraphQLList(EduInsType),
            description: 'A list of all the educational institutions that I have learned at',
            resolve: () => eduinss
        },
        girs: {
            type: new GraphQLList(GirType),
            description: "A list of all the girlfriends that I've had",
            resolve: () => girs
        },
        gir: {
            type: GirType,
            description: "1 of the girlfriends that I've had",
            resolve: (parent, args) => girs.find(gir => gir.id === args.id)
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'This is my root mutation',
    fields: () => ({
        addEduIns: {
            type: EduInsType,
            description: 'This is my query to add a new educational institution that I have learned at',
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                girId: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => {
                const eduins = {
                    id: (eduinss.length + 1),
                    name: args.name,
                    girId: args.girId
                }
                eduinss.push(eduins)
                return eduins
            }
        },
        addGir: {
            type: GirType,
            description: "This is my query to add a new girlfriend that I've had",
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => {
                const gir = {
                    id: (girs.length + 1),
                    name: args.name
                }
                girs.push(gir)
                return gir
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}))
app.listen(3000., () => {
    console.log('Congratulations! Ur basic Express server is running.')
})