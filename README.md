# Did They Really Say That?

This is website for the 'Did They Really Say That' project written in [React](https://reactjs.org) with [Next.js](https://nextjs.org) and [Tailwind CSS](https://tailwindcss.com).

## Getting Started

You will need [Node.js](https://nodejs.org/) installed.

To get started clone the repository and run `npm i` to install dependancies.

To start locally, run `npm run dev` and open `http://localhost:3000` in a browser.

You will need to create a file caled `.env` file in the root directory with the following environment variables defined:

* ELASTICSEARCH_URI
* MONGO_URI

These should point to an instance of Elasticsearch and to MongoDB respectively.

## Deployment

Changes to the master branch will automaically be deployed to http://did-they-really-say-that.now.sh within a few seconds.