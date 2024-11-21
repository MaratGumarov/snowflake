const path = require('path');

module.exports = {
    entry: './src/index.js', // Входной файл
    output: {
        filename: 'bundle.js', // Собранный выходной файл
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.(js|mp3)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.(mp3|ogg|wav)$/, // Обработка аудиофайлов
                use: [
                  {
                    loader: 'file-loader',
                    options: {
                      name: '[name].[ext]',
                      outputPath: 'assets/audio/',
                    },
                  },
                ],
              },
        ],
        
    },
    mode: 'development',
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'), // Указываем папку со статическими файлами
        },
        compress: true,
        port: 9000,
        allowedHosts: 'all', // Разрешаем все хосты
        host: '0.0.0.0', // Прослушивание всех адресов (не только localhost)
        client: {
            webSocketURL: 'auto://0.0.0.0:9000/ws', // Поддержка для WebSocket
        },
        headers: {
            'Access-Control-Allow-Origin': '*', // Разрешаем все источники
        },
    },
};
