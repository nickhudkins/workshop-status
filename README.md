Workshop Status
===

`npm install`

You will need Postgres and Node.

Create a .env file with the following keys:

```
GITHUB_CLIENT_ID=''
GITHUB_CLIENT_SECRET=''
GITHUB_CALLBACK_URL='/auth/github/callback'
PORT=3000
BASE_URL='http://localhost:3000'
SECRET='some super secret thing if you want'
DATABASE_URL='postgres://localhost:5432/workshopstatus'
NODE_ENV=development
```

`npm run start:dev`

or....

`npm run build && npm start`

You'll need to create a row in the Workshop table to have anything work.

`/auth/login` will result in a github authentication, and a user created in the DB.

`/workshops/:slug` must be a Workshop in your DB matching.

`/workshops/:slug/status` User must have isAdmin bool set TRUE in DB.

That's all I can think of. Pardon the mess.
