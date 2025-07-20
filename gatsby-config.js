/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

module.exports = {
  pathPrefix: "/futurestats-website",
  /*pathPrefix: "/",*/
  /*pathPrefix: "/futurestats-website",*/
  /* Your site config here */
  plugins: [
    {
      resolve: 'gatsby-plugin-copy-files',
	    options: {
		    source: `${__dirname}/content`,
		    destination: ''
	    },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content`,
        name: `content`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          /*
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 630,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          */
          `gatsby-remark-prismjs`,
          /*`gatsby-remark-copy-linked-files`,*/
          /*`gatsby-remark-smartypants`,*/
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`
  ]
}
