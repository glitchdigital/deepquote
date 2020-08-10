import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const admininstrators = ['me@iaincollins.com']

const options = {
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    })
  ],
}

export default (req, res) => NextAuth(req, res, options)