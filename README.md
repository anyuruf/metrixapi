# Metrix API

## Quick introduction
I built a familytree app using the grandstack starter kit https://grandstack.io/docs/getting-started-grand-stack-starter/ (api only option).  Apollo server setup.
Upgraded neo4j-graphql-library version 2.0 from 1.1 https://neo4j.com/docs/graphql-manual/current/. Upgraded the config setup to remove Express. The Neo4j graphql manual got great documentation on how to setup the whole api up without going to the grandstack website.

The secret sauce is  the /src/schema/type-defs.js file which's got the type/node, relationship and authorization definitions. Very intuitive!!

## Quick start

npm install
```
npm run dev
```

This will start the GraphQL service (by default on localhost:4001/grahpql) where you can issue GraphQL requests or access GraphQL Playground in the browser:

![GraphQL Playground](img/graphql-playground.png)

## Configure

Set your Neo4j connection string and credentials in `.env`. For example:

_.env_

```
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=letmein
AUTH_DIRECTIVES_ROLE_KEY=https://<auth0domain_OR_Custom_Auth_Doamin>/role
JWT_SECRET="-----BEGIN PUBLIC KEY-----<ACTUAL_PUBLIC_KEY_CONTENT_WITH_CRLF>-----END PUBLIC KEY-----"
```

Note that grand-stack-starter does not currently bundle a distribution of Neo4j. You can download [Neo4j Desktop](https://neo4j.com/download/) and run locally for development, spin up a [hosted Neo4j Sandbox instance](https://neo4j.com/download/), run Neo4j in one of the [many cloud options](https://neo4j.com/developer/guide-cloud-deployment/), or [spin up Neo4j in a Docker container](https://neo4j.com/developer/docker/). Just be sure to update the Neo4j connection string and credentials accordingly in `.env`.



## Deployment

You can deploy to any service that hosts Node.js apps, but [Vercel](https://vercel.com/home) is a great easy to use service for hosting your app that has an easy to use free plan for small projects.

To deploy your GraphQL service on Zeit Now, first install [Vercel](https://vercel.com/download) - you'll need to provide an email address. Then run

```
vercel
```

to deploy your GraphQL service on Vercel. Once deployed you'll be given a fresh URL that represents the current state of your application where you can access your GraphQL endpoint and GraphQL Playgound. For example: https://grand-stack-starter-api-pqdeodpvok.vercel.sh/

## Seeding The Database

Optionally you can seed the GraphQL service by executing mutations that will write sample data to the database:

```
npm run seedDb
```
