module.exports = {
  devServer: {
    proxy: {
      '/love_sports/love-sports-auth': {
        target: 'http://localhost:8081',
        changeOrigin: false,
        pathRewrite: {
          '^/love_sports/love-sports-auth': '/'
        }

      },
      '/love_sports/love-sports-file': {
        target: 'http://localhost:8083',
        changeOrigin: false,
        pathRewrite: {
          '^/love_sports/love-sports-file': '/'
        },
      },
    },

  },
  transpileDependencies: [
    'vuetify'
  ]
}
