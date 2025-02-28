# CRUD Notes

CRUD Notes is a simple API build using Node.js with TypeScript and Express.js. It contains endpoints to create, list, read one, update, and delete notes

## Initialization

To use this application, you need a PostgreSQL database running with at least one table with the following definition:
```sql
CREATE TABLE note (
	id VARCHAR(40) PRIMARY KEY,
	title VARCHAR(128) NOT NULL,
	description TEXT NOT NULL,
	createdAt TIMESTAMP NOT NULL,
	updatedAt TIMESTAMP NOT NULL
);
```
You will need the following environment variables defined in a .env file at the root of the repository. SERVER_PORT refers to the port you want this application to run on. The rest are the connection details for your postgres database:\

`SERVER_PORT`\
`POSTGRES_HOST`\
`POSTGRES_USER`\
`POSTGRES_PASSWORD`\
`POSTGRES_DB`\
`POSTGRES_PORT`

make sure to run `npm install` to install all necessary dependencies.

## Running the Application

To run, simply run `npm run build` followed by `npm start` and you should be able to make requests against it.

## Testing
To run the test suite, simply run the command `npm test`. The tests do not depend on the database being in any particular state, but it will make a number of inserts

## Time
I did not complete this all in one sitting, so I'm not completely sure how long I spent, but I would estimate approximately 3 hours.