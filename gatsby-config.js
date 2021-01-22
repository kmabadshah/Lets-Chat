module.exports = {
  pathPrefix: '/letschat',
  siteMetadata: {
    title: `Socket Chat`,
    description: `Chat app built with Gatsby, Strapi and Socket.io`,
    author: `KMA Badshah`
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-preload-fonts`,
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        printRejected: true // Print removed selectors and processed file names
        //develop: true, // Enable while using `gatsby develop`
      }
    },

    {
      resolve: `gatsby-plugin-layout`,
      options: {
        component: require.resolve(`./src/components/wrapper.js`)
      }
    }
  ]
}
