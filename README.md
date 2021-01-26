# Node.js recruitment task

## Results

* Create `.env` basing on `.env.example`, use this file to passing environmental variables
    * `MONGO_IP` should be set to `db` while using docker, otherwise it should be `localhost` or IP current machine
* To start app in dev mode, run in root project directory `docker-compose -f docker-compse.dev.yml up -d`
* To start app, run `docker-compose -f docker-compose.yml up -d`
* API Docs in file `nodejs-recruitment-task-api.postman_collection.json` or https://documenter.getpostman.com/view/5725201/TW6tLALV

___
We'd like you to build a simple Movies API. It should provide two endpoints:

1. `POST /movies`
   1. Allows creating a movie object based on movie title passed in the request body
   2. Bade on title additional movie details should be fetched from
      https://omdbapi.com/ and saved to the database. Data we would like you to
      fetch from OMDb API:
   ```
     Title: string
     Released: date
     Genre: string
     Directory: string
   ```
   3. Only authorized users can create a movie.
   4. `Basic` users are restricted to create a 5 movies per month (calendar
      month). `Premium` users have no limits.
1. `GET /movies`
   1. Should fetch a list of all movies created by an authorized user.

⚠️ Don't forget to verify user's authorization token before processing the
request. The token should be passed in request's `Authorization` header.

```
Authorization: Bearer <token>
```
## Prerequisites

You need to have `docker` and `docker-compose` installed on your computer to run the service


## Rules

- Database and framework choice are on your side.
- Your API has to be dockerized. Create `Dockerfile` and `docker-compose` and document the process of running it locally.
- Test your code.
- Provide documentation of your API.
- Application should be pushed to the public git repository and should have a
  working CI/CD pipeline that runs the tests. For example you can use GitHub
  Actions or CircleCI. Create a sample PR to show us the working CI/CD pipeline.

## What will be evaluated?

- Task completeness
- Architecture
- Code quality
- Tests quality
- Database design
- Technology stack
