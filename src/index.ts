import "reflect-metadata";
import express, { Express } from "express";
import { ApolloServer } from 'apollo-server-express'; // bu kullanım kaldırılacak. @apollo/server şeklinde kullanılacak
//import { ApolloServer } from '@apollo/server';
import { buildSchema } from "type-graphql";
import { TaskResolver } from "./resolvers/task";
//import { ApolloServerPluginLandingPageGraphQLPlaygroundOptions } from 'apollo-server-core';
import { DataSource } from 'typeorm'; 
import { Task } from "./entities/Task";

/*
createConnection(), createConnections() are deprecated, since Connection is called DataSource now, to create a connection and connect to the database simply do:

const myDataSource = new DataSource({ //... })
await myDataSource.connect()

*/
const main = async () => {

    const conn = await new DataSource({
        type: "postgres",
        database: "todolist-graphql-db",
        entities: [Task],
        logging: true,
        synchronize: true,
        username: "postgres",
        password: "postgres",
        port: 5432
    })

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [TaskResolver],
            validate: false,
        })
        //plugins: [ApolloServerPluginLandingPageGraphQLPlaygroundOptions()],
    });
    await apolloServer.start();
    const app: Express = express();

    apolloServer.applyMiddleware({ app })
    app.get('/', (_req, res) => res.send("Hello World"));
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

main().catch((err) => console.error(err));