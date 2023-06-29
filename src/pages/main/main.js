require('../../sass/main.scss');
require('../common/menu.js');
require('../common/modal.js');


import pets from '../../data/pets.json';

const state = {
    prev: [],
    curr: [],
    next: [],
};

const generateRandom = (min, max, exclude = []) => {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return exclude.includes(num) ? generateRandom(min, max, exclude) : num;
}

const pseudoGenerator = (current, prev = current, length = 3) => {
    Array.from({ length }).map(() => {
        current.push(generateRandom(0, 7, [...current, ...prev]));
    });
};

pseudoGenerator(state.curr);

const cache = {};

function importAll(r) {
    r.keys().forEach((key) => (cache[key] = r(key)));
}

importAll(require.context('/assets/images/pets', true, /\.png$/));

const cardContainer = document.querySelector('.pets-slider');
const arrowLeft = document.querySelector('.arrow-left');
const arrowRight = document.querySelector('.arrow-right');
const slides = document.querySelectorAll('.slide');
const prevSlideCards = slides[0].querySelectorAll('.pet-card');
const activeSlideCards = slides[1].querySelectorAll('.pet-card');
const nextSlideCards = slides[2].querySelectorAll('.pet-card');
const modal = document.querySelector('.modal');
const modalBackground = document.querySelector('.modal-background');
const modalClose = document.querySelector('.modal-close');

const modalContent = {
    name: modal.querySelector('.pet-name'),
    "img-hi": modal.querySelector('.pet-image'),
    breed: modal.querySelector('.pet-breed'),
    description: modal.querySelector('.pet-description'),
    age: modal.querySelector('.pet-age'),
    inoculations: modal.querySelector('.pet-inoculations'),
    diseases: modal.querySelector('.pet-deseases'),
    parasites: modal.querySelector('.pet-parasites'),
}

const handleCardClick = (e) => {
    const cardId = e.currentTarget.dataset.id;

    const cardData = pets[cardId];

    Object.entries(modalContent).forEach(([key, value]) => {
        if (key === "img-hi") {
            value.src = cache[cardData[key]];

            return;
        }

        if (key === "breed") {
            value.innerHTML = `${cardData["type"]} - ${cardData[key]}`;

            return;
        }

        value.innerHTML = cardData[key];
    });

    document.body.style.overflow = 'hidden';
    modal.classList.add('show');
    modal.classList.remove('hide');
}

const handleCloseModal = (e) => {
    document.body.style.overflow = '';
    modal.classList.add('hide');
    modal.classList.remove('show');
}

modalBackground.addEventListener('click', handleCloseModal);

modalClose.addEventListener('click', handleCloseModal);

document.querySelectorAll('.pet-card').forEach((item) => {
    item.addEventListener('click', handleCardClick);
})

const changeCard = (state, item, index) => {
    const cardItemIndex = state[index];

    item.dataset.id = cardItemIndex;

    const cardData = pets[cardItemIndex];

    const img = item.querySelector('img');
    img.src = cache[cardData.img];

    const p = item.querySelector('p');
    p.innerHTML = cardData.name;
}

activeSlideCards.forEach((item, index) => changeCard(state.curr, item, index));

cardContainer.addEventListener('animationend', () => {
    activeSlideCards.forEach((item, index) => changeCard(state.curr, item, index));

    cardContainer.classList.remove('transition-right');
    cardContainer.classList.remove('transition-left');

    arrowRight.addEventListener('click', moveRight);
    arrowLeft.addEventListener('click', moveLeft);
})

let lastDirection = '';

const moveRight = () => {
    if (lastDirection === 'left') {
        nextSlideCards.forEach((item, index) => changeCard(state.prev, item, index));

        const temp = state.curr;
        state.curr = state.prev;
        state.prev = temp;

        lastDirection = 'right';
    } else {

        lastDirection = 'right';

        state.next = [];
        pseudoGenerator(state.next, state.curr);

        nextSlideCards.forEach((item, index) => changeCard(state.next, item, index));

        const temp = state.curr;
        state.curr = state.next;
        state.prev = temp;

        state.next = [];
    }

    cardContainer.classList.add('transition-right');
    arrowRight.removeEventListener("click", moveRight);
    arrowLeft.removeEventListener("click", moveLeft);
}

const moveLeft = () => {
    if (lastDirection === 'right') {
        prevSlideCards.forEach((item, index) => changeCard(state.prev, item, index));

        const temp = state.curr;
        state.curr = state.prev;
        state.prev = temp;

        lastDirection = 'left';
    } else {

        lastDirection = 'left';

        state.next = [];
        pseudoGenerator(state.next, state.curr);

        prevSlideCards.forEach((item, index) => changeCard(state.next, item, index));

        const temp = state.curr;
        state.curr = state.next;
        state.prev = temp;

        state.next = [];
    }

    cardContainer.classList.add('transition-left');
    arrowRight.removeEventListener("click", moveRight);
    arrowLeft.removeEventListener("click", moveLeft);
}

arrowRight.addEventListener('click', moveRight);
arrowLeft.addEventListener('click', moveLeft);

console.log('Самопроверка: 110 баллов. Реализовал всё.')

console.log(`
\n\nРеализация burger menu на обеих страницах: +26
\nпри ширине страницы меньше 768рх панель навигации скрывается, появляется бургер-иконка: +2
\nпри нажатии на бургер-иконку, справа плавно появляется адаптивное меню шириной 320px, бургер-иконка плавно поворачивается на 90 градусов: +4
\nвысота адаптивного меню занимает всю высоту экрана: +2
\nпри повторном нажатии на бургер-иконку или на свободное от бургер-меню пространство адаптивное меню плавно скрывается уезжая за правую часть экрана, бургер-иконка плавно поворачивается на 90 градусов обратно: +4
бургер-иконка создана при помощи html+css, без использования изображений: +2
ссылки в адаптивном меню работают, обеспечивая плавную прокрутку по якорям, сохраняются заданные на первом этапе выполнения задания требования интерактивности элементов меню: +2
при клике по любой ссылке (интерактивной или неинтерактивной) в меню адаптивное меню плавно скрывается вправо, бургер-иконка поворачивается на 90 градусов обратно: +2
расположение и размеры элементов в бургер-меню соответствует макету (центрирование по вертикали и горизонтали элементов меню, расположение иконки). При этом на странице Pets цветовая схема может быть как темная, так и светлая: +2
\nобласть, свободная от бургер-меню, затемняется: +2
\nстраница под бургер-меню не прокручивается: +4
\n\nРеализация слайдера-карусели на странице Main: +36
\nпри нажатии на стрелки происходит переход к новому блоку элементов: +4
\nсмена блоков происходит с соответствующей анимацией карусели (способ выполнения анимации не проверяется): +4
\nслайдер бесконечен, т.е. можно бесконечно много нажимать влево или вправо, и каждый раз будет прокрутка в эту сторону с новым набором карточек: +4
\nпри переключении влево или вправо прокручивается ровно столько карточек, сколько показывается при текущей ширине экрана (3 для 1280px, 2 для 768px, 1 для 320px): +4
\nкаждый новый слайд содержит псевдослучайный набор карточек животных, т.е. формируется из исходных объектов в случайном порядке со следующими условиями:
\nв текущем блоке слайда карточки с питомцами не повторяются: +4
\nв следующем блоке нет дублирования карточек с текущим блоком. Например в слайдере из 3 элементов, следующий выезжающий слайд будет содержать 3 (из 8 доступных) новых карточки питомца, таких, каких не было среди 3х карточек на предыдущем уехавшем слайде: +4
\nсохраняется только одно предыдущее состояние. Т.е. при последовательном переходе два раза влево, а потом два раза вправо, мы получим набор карточек, отличный от исходного: +4
\nпри каждой перезагрузке страницы формируется новая последовательность карточек: +2
\nгенерация наборов карточек происходит на основе 8 объектов с данными о животными: +2
\nпри изменении ширины экрана (от 1280px до 320px и обратно), слайдер перестраивается и работает без перезагрузки страницы (набор карточек при этом может как изменяться, так и оставаться тем же, скрывая лишнюю или добавляя недостающую, и сохраняя при этом описанные для слайдера требования): +4
\n\nРеализация пагинации на странице Pets: +36
\nпри перезагрузке страницы всегда открывается первая страница пагинации: +2
\nпри нажатии кнопок > или < открывается следующая или предыдущая страница пагинации соответственно: +2
\nпри нажатии кнопок >> или << открывается последняя или первая страница пагинации соответственно: +2
\nпри открытии первой страницы кнопки << и < неактивны: +2
\nпри открытии последней страницы кнопки > и >> неактивны: +2
\nв кружке по центру указан номер текущей страницы. При переключении страниц номер меняется на актуальный: +2
\nкаждая страница пагинации содержит псевдослучайный набор питомцев, т.е. формируется из исходных объектов в случайном порядке со следующими условиями:
\nпри загрузке страницы формируется массив из 48 объектов питомцев. Каждый из 8 питомцев должен встречаться ровно 6 раз: +4
\nпри каждой перезагрузке страницы формируется новый массив со случайной последовательностью: +4
\nкарточки питомцев не должны повторяться на одной странице: +4
\nпри переключении страницы данные меняются (для >1280px меняется порядок карточек, для остальных - меняется набор и порядок карточек): +4
\nпри неизменных размерах области пагинации, в том числе размерах окна браузера, и без перезагрузки страницы, возвращаясь на страницу под определенным номером, контент на ней всегда будет одинаков. Т.е. карточки питомцев будут в том же расположении, что и были до перехода на другие страницы: +2
\nобщее количество страниц при ширине экрана 1280px - 6, при 768px - 8, при 320px - 16 страниц: +2
\nпри изменении ширины экрана (от 1280px до 320px и обратно), пагинация перестраивается и работает без перезагрузки страницы (страница может оставаться той же или переключаться, при этом сформированный массив - общая последовательность карточек - не обновляется, сохраняются все остальные требования к пагинации): +4
\n\nРеализация попап на обеих страницах: +12
\nпопап появляется при нажатии на любое место карточки с описанием конкретного животного: +2
\nчасть страницы вне попапа затемняется: +2
\nпри открытии попапа вертикальный скролл страницы становится неактивным, при закрытии - снова активным: +2
\nпри нажатии на область вокруг попапа или на кнопку с крестиком попап закрывается, при этом при нажатии на сам попап ничего не происходит: +2
\nкнопка с крестиком интерактивная: +2
\nокно попапа (не считая кнопку с крестиком) центрировано по всем осям, размеры элементов попапа и их расположение совпадают с макетом: +2
`);
