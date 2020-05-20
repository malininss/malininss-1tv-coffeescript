const arrows = document.querySelectorAll('.tv-widget__arrow-circle');

const carouselContainer = document.querySelector('.tv-widget__schedule-corousel');
const carousel = document.querySelector('.tv-widget__schedule-items');

let firstSlide = true;
let lastSlide = false;

let itemWidth = 84; // Ширина элемента
let numberOfSteps; // Количество шагов, которое предстоит сделать 
let currentStepWidth = 60; // Изначальное остояние left 
const itemsNumber = document.querySelectorAll('.tv-widget__schedule-item').length; // Количество элементов

let itemsScrolled = 0; //Количество элементов, которые мы скроллим

const pushSlider = (direction = 'right') => {

  const containerWidth = carouselContainer.offsetWidth; // Ширина контейнера

  switch(true) { // В зависимости от ширины контейнера определяем, сколько элементов надо прокрутить
    case (containerWidth < 360):
      numberOfSteps = 1;
      break;
    case (containerWidth < 420): 
      numberOfSteps = 2;
      break;
    case (containerWidth < 505):
      numberOfSteps = 3;
      break;
    case (containerWidth < 585): 
      numberOfSteps = 4;
      break;
    default:
      numberOfSteps = 5;
  }
  
  let remainedToScroll =  itemsNumber - itemsScrolled - numberOfSteps - 2; // Определяем, сколько элементов предстоить прокрутить

  if (direction === 'right') {

    if (remainedToScroll < numberOfSteps) { // Если количество элементов, сколько можно прокрутить, меньше количества шагов
      console.log('Мы подошли к концу. Прокручиваем элементов: ' + remainedToScroll)
      numberOfSteps = remainedToScroll; // Говорим, сколько шагов прокручиваем
      console.log('Прокручиваем шагов: ', numberOfSteps);
      lastSlide = true; // Определяем, что слайд последний
    } 
  }

  let slideWidth = itemWidth * numberOfSteps; // Определяем ширину слайда


  if (direction === 'right') { // Прокручиваем вправо
    currentStepWidth -= slideWidth; // Прокручиваем
    itemsScrolled += numberOfSteps;

    if (lastSlide && remainedToScroll !== 0) {
      // currentStepWidth -= 60;
      currentStepWidth = -2016 + containerWidth - 40;
      console.log('Добавляем отступ для последнего слайда');
    }

    if (firstSlide) {
      console.log('Уходим из первого слайда');
      currentStepWidth += itemWidth;
      currentStepWidth -= 60;
      firstSlide = false;

    }

  } else { // Если прокручиваем влево
    currentStepWidth += slideWidth;
    itemsScrolled -= numberOfSteps;

    if (itemsScrolled <= 0) {
      currentStepWidth = 60; // возвращаемся в первую позицию
      itemsScrolled = 0;
      firstSlide = true;
    }

    if (lastSlide) {
      console.log('Уходим из последнего слайда');
      lastSlide = false;
    }
  }

  carousel.style.left = currentStepWidth.toString() + 'px';

}

Array.from(arrows).forEach(item => {
  item.addEventListener('click', (event) => {
    if (event.target.parentElement.classList.contains('tv-widget__arrow-circle_right')) {
      pushSlider();
    } else {
      pushSlider('left');
    }
  });
});
