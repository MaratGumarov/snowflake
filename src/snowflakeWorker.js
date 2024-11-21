// snowflakeWorker.js

self.addEventListener('message', function(e) {
    const snowflakes = e.data;
    const newSnowflakes = snowflakes.map(snowflake => {
        // Обновляем позицию снежинки (падение вниз)
        snowflake.position.y -= snowflake.fallSpeed;

        // Добавляем небольшую флуктуацию в позиции x и z
        snowflake.position.x += Math.sin(Date.now() * 0.001 + snowflake.position.y) * 0.01;
        snowflake.position.z += Math.cos(Date.now() * 0.001 + snowflake.position.y) * 0.01;

        // Если снежинка падает ниже определенного уровня, перемещаем ее наверх
        if (snowflake.position.y < -100) {
            snowflake.position.y = 100;
        }

        return snowflake;
    });

    self.postMessage(newSnowflakes);
});
