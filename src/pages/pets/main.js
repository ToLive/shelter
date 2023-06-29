require('../../sass/main.scss');
require('../common/menu.js');
require('../common/modal.js');

import pets from '../../data/pets.json';

const cache = {};

function importAll(r) {
   r.keys().forEach((key) => (cache[key] = r(key)));
}

importAll(require.context('/assets/images/pets', true, /\.png$/));

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

/////////////////////

let breakpoint;
let pages;

const currentPageIndicator = document.querySelector('.current-page-indicator');

const calcBreakpoint = (width) => {
   if (width >= 1217) {

      return 1280;
   }

   if (width < 1217 && width >= 681) {
      breakpoint = 768;

      return 768;
   }

   return 320;
};

const pagesPerBreakpoint = {
   320: 16,
   768: 8,
   1280: 6
};

const itemsPerPage = {
   6: 8,
   8: 6,
   16: 3,
}

breakpoint = calcBreakpoint(window.innerWidth);
pages = pagesPerBreakpoint[breakpoint];

window.addEventListener("resize", (event) => {
   const windowWidth = event.target.innerWidth;

   breakpoint = calcBreakpoint(windowWidth);
   pages = pagesPerBreakpoint[breakpoint];

   setPage(currentPage > pages ? pages : currentPage);
});

const seed = [[4, 0, 5], [3, 1, 6], [7, 2]];
const shuffledArray = (arr) => arr.map((item) => item.sort((a, b) => 0.5 - Math.random())).flat();

const petsArray = Array.from({ length: 6 }, () => shuffledArray(seed)).flat();

const activeCards = document.querySelectorAll('.pet-card');

const changeCard = (index, item, skipFade = false) => {
   if (!skipFade) {
      item.classList.add('fade-out');
   }

   setTimeout(() => {
      const cardItemIndex = index;
      item.dataset.id = cardItemIndex;

      const cardData = pets[cardItemIndex];

      const img = item.querySelector('img');
      img.src = cache[cardData.img];

      const p = item.querySelector('p');
      p.innerHTML = cardData.name;

      item.classList.remove('fade-out');
   }, skipFade ? 1 : 500);
}

activeCards.forEach((item, index) => {
   item.addEventListener('click', handleCardClick);
   changeCard(petsArray[index], item, true);
})

let currentPage = 1;

const arrowLeft = document.querySelector('.arrow-left:not(.fastforward-left)');
const arrowRight = document.querySelector('.arrow-right:not(.fastforward-right)');
const fastForwardLeft = document.querySelector('.fastforward-left');
const fastForwardRight = document.querySelector('.fastforward-right');

function setPage(index) {
   const arrayStart = index * itemsPerPage[pages] - itemsPerPage[pages];
   const arrayEnd = index * itemsPerPage[pages];

   const petsForPage = petsArray.slice(arrayStart, arrayEnd);

   activeCards.forEach((item, index) => {
      if (index < itemsPerPage[pages]) {
         changeCard(petsForPage[index], item);
      }
   })

   currentPageIndicator.innerHTML = index;

   if (index > 1) {
      arrowLeft.disabled = false;
      arrowLeft.classList.add('button-round-empty');
      arrowLeft.classList.remove('button-round-disabled');
      fastForwardLeft.disabled = false;
      fastForwardLeft.classList.add('button-round-empty');
      fastForwardLeft.classList.remove('button-round-disabled');
   }

   if (index === 1) {
      arrowLeft.disabled = true;
      arrowLeft.classList.remove('button-round-empty');
      arrowLeft.classList.add('button-round-disabled');
      fastForwardLeft.disabled = true;
      fastForwardLeft.classList.remove('button-round-empty');
      fastForwardLeft.classList.add('button-round-disabled');
   }

   if (index === pages) {
      arrowRight.disabled = true;
      arrowRight.classList.remove('button-round-empty');
      arrowRight.classList.add('button-round-disabled');
      fastForwardRight.disabled = true;
      fastForwardRight.classList.remove('button-round-empty');
      fastForwardRight.classList.add('button-round-disabled');
   }

   if (index < pages) {
      arrowRight.disabled = false;
      arrowRight.classList.add('button-round-empty');
      arrowRight.classList.remove('button-round-disabled');
      fastForwardRight.disabled = false;
      fastForwardRight.classList.add('button-round-empty');
      fastForwardRight.classList.remove('button-round-disabled');
   }
}

arrowRight.addEventListener('click', (e) => {
   currentPage = currentPage < pages ? currentPage + 1 : currentPage;
   setPage(currentPage);
})

arrowLeft.addEventListener('click', (e) => {
   currentPage = currentPage > 1 ? currentPage - 1 : currentPage;
   setPage(currentPage);
})

fastForwardRight.addEventListener('click', (e) => {
   currentPage = pages;

   setPage(currentPage);
})

fastForwardLeft.addEventListener('click', (e) => {
   currentPage = 1;

   setPage(currentPage);
})

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

