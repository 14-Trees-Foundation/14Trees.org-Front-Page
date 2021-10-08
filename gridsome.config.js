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
      use: 'gridsome-plugin-tailwindcss',
      options: {
        tailwindConfig: './tailwind.config.js',
        purgeConfig: {
          whitelist: ['svg-inline--fa', 'table', 'table-striped', 'table-bordered', 'table-hover', 'table-sm'],
          whitelistPatterns: [/fa-$/, /blockquote$/, /code$/, /pre$/, /table$/, /table-$/, /vueperslide$/, /vueperslide-$/]
        },
        presetEnvConfig: {},
        shouldPurge: false,
        shouldImport: false,
        shouldTimeTravel: false,
        shouldPurgeUnusedKeyframes: true,
      }
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