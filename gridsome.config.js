// This is where project configuration and plugin options are located. 
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: '14 Trees Foundation',
  siteDescription: "14 Trees Foundation is a charitable organization dedicated to building sustainable, carbon-footprint-neutral eco-systems through re-forestation",
  plugins: [
    // { use: 'gridsome-plugin-typescript' },
    {
      use: '@gridsome/source-contentful',
      options: {
        space: process.env.CONTENTFUL_SPACE_ID, // required
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,// required
        host: 'cdn.contentful.com',
        environment: process.env.CONTENTFUL_SOURCE_ENV,
        typeName: 'Contentful'
      }
    },
    {
      use: 'gridsome-plugin-windicss',
       options: {
        // see https://github.com/windicss/vite-plugin-windicss/blob/main/packages/plugin-utils/src/options.ts
      },
    },
    {
      use: 'gridsome-source-static-meta',
      options: {
        path: 'content/site/*.json'
      }
    },
    {
      use: 'gridsome-plugin-flexsearch',
      options: {
        searchFields: ['title', 'content'],
        collections: [{
          typeName: 'ContentfulCampaign',
          indexName: 'Campaign',
          fields: ['title', 'heading', 'subtitle', 'content']
        }]
      }
    }
  ],
  templates: {
    ContentfulCampaign: '/projects/:title',
    ContentfulContentPage: '/:title',
    ContentfulBlogPost: '/blogs/:slug',
    ContentfulEventSite: '/event/:slug',
  },
  chainWebpack: config => {
      config.resolve.alias.set('@pageImage', '@/assets/images');
  }
}