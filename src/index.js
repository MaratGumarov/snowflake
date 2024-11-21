import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';


let scene, camera, renderer, controls, snowflakes = [];
let popSound;
let popSoundInitialized = false;
let params = {
    snowflakeCount: 1000,
    maxFractalComplexity: 3,
    fallSpeedMultiplier: 1,
};

function init() {
    // Создаем сцену, камеру и рендерер
    reinitialize();

    // GUI контроллер
    const gui = new dat.GUI();
    gui.add(params, 'snowflakeCount', 100, 10000, 100).onChange(reinitialize);
    gui.add(params, 'maxFractalComplexity', 1, 5, 1).onChange(reinitialize);
    gui.add(params, 'fallSpeedMultiplier', 0.1, 5, 0.1).onChange(() => updateFallSpeed());

    // Добавляем обработчик кликов мыши
    window.addEventListener('click', (event) => {
    initializeSound();
    onSnowflakeClick(event);
});
    window.addEventListener('touchstart', (event) => {
    initializeSound();
    onSnowflakeClick(event);
}, { passive: false });
    window.addEventListener('touchstart', onSnowflakeClick);

    // Анимация
    animate();
}

function reinitialize() {
    // Очищаем старую сцену и удаляем старые элементы
    if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
        document.body.removeChild(renderer.domElement);
    }
    if (scene) {
        scene.clear();
    }

    // Создаем новую сцену
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Камера
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 100;

    // Рендерер
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Добавляем управление с помощью мыши
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    // Генерация снежинок
    generateSnowflakes(params.snowflakeCount);
}

function generateSnowflakes(count) {
    // Удаляем старые снежинки
    snowflakes.forEach(snowflake => scene.remove(snowflake));
    snowflakes = [];

    // Создаем новые снежинки
    for (let i = 0; i < count; i++) {
        const snowflake = createSnowflake();
        scene.add(snowflake);
        snowflakes.push(snowflake);
    }
}

function createSnowflake() {
    // Создаем начальный шестиугольник и генерируем фрактал с небольшой случайностью
    const center = new THREE.Vector3(0, 0, 0);
    const radius = Math.random() * 2 + 1; // Случайный радиус между 1 и 3
    let points = createHexagon(center, radius);
    points = kochFractal(points, Math.floor(Math.random() * params.maxFractalComplexity) + 1); // Итерации между 1 и maxFractalComplexity

    // Создаем геометрию на основе точек
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    // Линии для визуализации снежинки
    const material = new THREE.LineBasicMaterial({ color: 0xffffff });
    const line = new THREE.LineLoop(geometry, material);

    // Размещаем снежинки с разным смещением
    line.position.x = (Math.random() - 0.5) * 200;
    line.position.y = (Math.random() - 0.5) * 200;
    line.position.z = (Math.random() - 0.5) * 200;

    // Добавляем случайное начальное вращение для каждой снежинки
    line.rotation.x = Math.random() * Math.PI * 2;
    line.rotation.y = Math.random() * Math.PI * 2;
    line.rotation.z = Math.random() * Math.PI * 2;

    // Добавляем случайное вращение скорости для каждой снежинки
    line.rotationSpeed = new THREE.Vector3(
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01
    );

    // Скорость падения снежинки
    line.fallSpeed = (Math.random() * 0.1 + 0.02) * params.fallSpeedMultiplier;

    // Добавляем рандомные множители для движения по X и Z
    line.noiseXMultiplier = (Math.random() - 0.5) * 0.02;
    line.noiseZMultiplier = (Math.random() - 0.5) * 0.02;

    return line;
}

function updateFallSpeed() {
    // Обновляем скорость падения для всех снежинок
    snowflakes.forEach(snowflake => {
        snowflake.fallSpeed = (Math.random() * 0.1 + 0.02) * params.fallSpeedMultiplier;
    });
}

// Функция для анимации снежинок
function animate() {
    requestAnimationFrame(animate);

    // Обновляем каждую снежинку
    snowflakes.forEach(snowflake => {
        // Обновляем позицию снежинки (падение вниз)
        snowflake.position.y -= snowflake.fallSpeed;

        // Добавляем более естественные колебания в позиции X и Z с использованием случайных множителей
        snowflake.position.x += Math.sin(Date.now() * 0.01 + snowflake.position.y) * snowflake.noiseXMultiplier;
        snowflake.position.z += Math.cos(Date.now() * 0.01 + snowflake.position.y) * snowflake.noiseZMultiplier;

        // Добавляем небольшие случайные смещения для большей естественности
        snowflake.position.x += (Math.random() - 0.5) * 0.01;
        snowflake.position.z += (Math.random() - 0.5) * 0.01;

        // Если снежинка падает ниже определенного уровня, перемещаем ее наверх
        if (snowflake.position.y < -100) {
            snowflake.position.y = 100;
        }

        // Обновляем вращение снежинки вокруг своей оси
        snowflake.rotation.x += snowflake.rotationSpeed.x;
        snowflake.rotation.y += snowflake.rotationSpeed.y;
        snowflake.rotation.z += snowflake.rotationSpeed.z;
    });

    controls.update();
    renderer.render(scene, camera);
}

// Функция для обработки клика по снежинке
function initializeSound() {
    if (!popSoundInitialized) {
        popSound = new Audio();
        const canPlayMp3 = popSound.canPlayType('audio/mpeg');
        if (canPlayMp3) {
            popSound.src = 'assets/audio/pop.mp3';
        } else {
            const canPlayOgg = popSound.canPlayType('audio/ogg');
            if (canPlayOgg) {
                popSound.src = 'pop.ogg';
            } else {
                popSound.src = 'pop.wav';
            }
        }
        popSound.load();
        popSoundInitialized = true;
    }
}

function onSnowflakeClick(event) {
    // Получаем координаты клика
    const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );

    // Определяем объекты, с которыми пересекается луч
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(snowflakes);

    // Удаляем пересеченные снежинки
    intersects.forEach(intersect => {
        // popSound.play();
        scene.remove(intersect.object);
        snowflakes = snowflakes.filter(snowflake => snowflake !== intersect.object);
    });
}

// Функция для создания начального шестиугольника
function createHexagon(center, radius) {
    const points = [];
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        points.push(
            new THREE.Vector3(
                center.x + radius * Math.cos(angle),
                center.y + radius * Math.sin(angle),
                0
            )
        );
    }
    points.push(points[0]); // Соединяем последний с первым для замыкания
    return points;
}

// Функция для генерации фрактальной линии Коха с элементом случайности
function kochFractal(points, iterations) {
    for (let i = 0; i < iterations; i++) {
        const newPoints = [];
        for (let j = 0; j < points.length - 1; j++) {
            const p1 = points[j];
            const p2 = points[j + 1];
            const delta = new THREE.Vector3().subVectors(p2, p1).multiplyScalar(1 / 3);

            const pA = p1.clone().add(delta);
            const pC = p2.clone().sub(delta);

            // Добавляем элемент случайности в форму снежинки
            const randomAngle = Math.PI / 3 + (Math.random() - 0.5) * (Math.PI / 12);
            const pB = p1
                .clone()
                .add(delta)
                .add(new THREE.Vector3().copy(delta).applyAxisAngle(new THREE.Vector3(0, 0, 1), randomAngle));

            newPoints.push(p1, pA, pB, pC);
        }
        newPoints.push(points[points.length - 1]);
        points = newPoints;
    }
    return points;
}

// Вызов функции инициализации
document.addEventListener('DOMContentLoaded', () => {
    init();
});
