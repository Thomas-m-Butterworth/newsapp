# Northcoders News API
## Setup
`.env*` is ignored by the repo, you will therefore need to create your own testing and development environments to connect to these databases locally.

Create new `.env.test` & `.env.development` files with the following contents. This will link the correct databses to the correct environment.

```
// .env.test
PGDATBASE=nc_news_test

// .env.development
PGDATBASE=nc_news
```

This can be acheived with the following terminal command:
```
echo "PGDATBASE=nc_news" > .env.development
echo "PGDATABASE=nc_news_test" > .env.test
```