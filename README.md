# How to run
1. Run `npm install serverless -g` to install serverless CLI globally.
2. Run `npm install`.
3. Setup local mysql database and provide a connection details to `.env` file in the root of the project (Use .env.example as an template for that). Please remember to run the sql script to create a tables and fill it.
4. Run `serverless offline --noAuth`.
3. Send a HTTP request for `http://localhost:3000/dev/stats/week?weekId=1`.

