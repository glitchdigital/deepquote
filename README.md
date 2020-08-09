# Deepquote

This is website for www.deepquote.io

## Technology stack

* [React](https://reactjs.org)
* [Tailwind CSS](https://tailwindcss.com)
* [Next.js](https://nextjs.org)
* Elasticsearch
* MongoDB

## Getting Started

You will need [Node.js](https://nodejs.org/) installed.

To get started clone the repository and run `npm i` to install dependancies.

To start locally, run `npm run dev` and open `http://localhost:3000` in a browser.

You will need to create a file caled `.env` file in the root directory with the following environment variables defined:

* ELASTICSEARCH_URI
* MONGO_URI

These should point to an instance of Elasticsearch and to MongoDB respectively.

## Deployment

When changes are pushed to the main branch on GitHub they will be deployed to https://www.deepquote.io within a few seconds.