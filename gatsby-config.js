module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `${__dirname}/content/posts`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `persons`,
        path: `${__dirname}/content/persons`,
      },
    },
    `gatsby-plugin-mdx`,
  ],
};
