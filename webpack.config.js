import path from 'path';

export default {
  entry: './src/index.js', 
  output: {
    path: path.resolve('dist'),
    filename: 'index.js', 
    library: {
      name: 'ReactVideoAnnotation',
      type: 'umd', 
    },
    module: true,
    libraryTarget: 'module',
    clean: true, 
  },
  experiments: {
    outputModule: true,
  },
  externals: {
    react: 'react',
    'react-dom': 'react-dom',
    lodash: 'lodash',
    'react-icons': 'react-icons',
    'react-konva': 'react-konva',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, 
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react', 
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], 
  },
  mode: 'production', 
};
