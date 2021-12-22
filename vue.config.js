module.exports = {
  devServer: {
    proxy: {
      '/love_sports/love-sports-auth': {
        target: 'http://localhost:8081/',
        changeOrigin: true,
        pathRewrite: {
          '^/love_sports/love-sports-auth': '/'
        }
      }
    }
  },
  transpileDependencies: [
    'vuetify'
  ]
}
