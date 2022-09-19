module.exports = {
  babel: {
    loaderOptions: {
      ignore: [
        "./node_modules/mapbox-gl/dist/mapbox-gl.js",
        "./node_modules/maplibre-gl/dist/maplibre-gl.js"
      ],
    },
  },
}
