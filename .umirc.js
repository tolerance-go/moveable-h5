// ref: https://umijs.org/config/
export default {
  base: '/moveable-h5/',
  outputPath: './docs',
  publicPath: './',
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        title: 'moveable',
      },
    ],
  ],
};
