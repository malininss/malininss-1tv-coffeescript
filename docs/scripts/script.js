const todayDate = '2020-05-25' // Здесь нужно будет подтягивать актуальную дату.

const refetToJson = (callback) => {
  fetch('test.json', {method: 'get'})
  .then(response => response.json())
  .then(schedule => {
    callback(schedule)
  })
  .catch(err => console.log(err))
}

const createScheduleList = (schedule) => {
  
  const scheduleContainer = document.querySelector('.tv-widget__schedule-items');
  
  for (key in schedule) {

    moment.locale('ru');
    const date = moment(key); 

    const dayNumber = date.format('DD');
    const mounth = date.format('MMMM');
    const dayWeek = date.format('dd');

    const scheduleItem = document.createElement('div');
    scheduleItem.classList.add('tv-widget__schedule-item');
    scheduleItem.dataset.date = key;

    if (dayWeek === 'сб' || dayWeek === 'вс') {
      scheduleItem.classList.add('tv-widget__schedule-item_weekend');
    } else if (dayWeek === 'пт') {
      scheduleItem.classList.add('tv-widget__schedule-item_friday');
    }
  
    const scheduleDay = document.createElement('div');
    scheduleDay.classList.add('tv-widget__day');
    scheduleDay.textContent = dayNumber;

    const scheduleMounth = document.createElement('div');
    scheduleMounth.classList.add('tv-widget__mounth');
    scheduleMounth.textContent = mounth;
  
    const scheduleLine = document.createElement('div');
    scheduleLine.classList.add('tv-widget__line');

    const scheduleWeekday = document.createElement('div');
    scheduleWeekday.classList.add('tv-widget__weekday');
    scheduleWeekday.textContent = dayWeek;
  
    scheduleItem.appendChild(scheduleDay);
    scheduleItem.appendChild(scheduleMounth);
    scheduleItem.appendChild(scheduleLine);
    scheduleItem.appendChild(scheduleWeekday);

    scheduleContainer.appendChild(scheduleItem);
  }

  updateDayProgram(todayDate, schedule[todayDate]);

  const registerEvents = () => {
    const scheduleDays = Array.from(document.querySelectorAll('.tv-widget__schedule-item'));

    scheduleDays.forEach(item => {
      item.addEventListener('click', (event) => {
        let elem = event.target.closest('.tv-widget__schedule-item');
        updateDayProgram(elem.getAttribute('data-date'), schedule[elem.getAttribute('data-date')])
      })
    })
  }
  registerEvents();
}


const updateDayProgram = (date, schedule) => {
  const widgetTitleSpan = document.querySelector('.tv_widget__today-date');
  const widgetTitleSpanText = moment(date).format('dddd, DD MMMM YYYY');

  console.log(date === todayDate);
  if (date === todayDate) {
    widgetTitleSpan.textContent = ' на сегодня';
  } else {
    widgetTitleSpan.textContent = '';
  }

  widgetTitleSpan.textContent += '. ' + widgetTitleSpanText[0].toUpperCase() + widgetTitleSpanText.slice(1);;

  const programContainer = document.querySelector('.tv-widget__program-cards');
  programContainer.innerHTML = '';
  
  const createElem = function(tag, elemClass) {
    const elem = document.createElement(tag);
    elem.classList.add(elemClass);
    return elem;
  }

  schedule.forEach((item, index) => {

    const programCard = createElem('div', 'tv-widget__program-card');
    const titleBlock = createElem('div', 'tv-widget__program-title-block');
          
    const programTime = createElem('div', 'tv-widget__program-time');
    programTime.textContent = item.time;

    const programTitle = createElem('a', 'tv-widget__program-title');
    programTitle.href = "#";
    programTitle.textContent = item.title;

    const awards = createElem('div', 'tv-widget__program-awards');

    for (key in item.awards) {
      if (item.awards[key] === 'true') {
        const award = createElem('div', 'tv-widget__program-award');
        award.classList.add('tv-widget__program-award_' + key);
        awards.appendChild(award);
      }
    }

    const programCountry = createElem('div', 'tv-widget__program-country');
  
    const countryImg = document.createElement('img');
    countryImg.src = 'img/icons/russia-icon.svg';
    countryImg.alt = item.country;

    programCountry.appendChild(countryImg);
  
    const tvChannel = createElem('div', 'tv-widget__program-channel');
    const channelImg = document.createElement('img');
    channelImg.src = 'img/icons/1tv-icon.svg';
    channelImg.alt = item.channel;

    tvChannel.appendChild(channelImg);
    titleBlock.appendChild(programTime);
    titleBlock.appendChild(programTitle);
    titleBlock.appendChild(awards);
    if (item.country) titleBlock.appendChild(programCountry);

    titleBlock.appendChild(tvChannel);

    const programDescription = createElem('div', 'tv-widget__program-description');
    programDescription.textContent = item.description;

    const programArtists = createElem('div', 'tv-widget__program-artists');

    item.artists.forEach((artistName, index) => {
      const artistElem = createElem('a', 'tv-widget__program-artist');
      artistElem.href = "#";
      artistElem.textContent = artistName

      programArtists.appendChild(artistElem);

      if (index !== item.artists.length - 1) {
        programArtists.innerHTML += ', ';
      }
      
    });

    programCard.appendChild(titleBlock);
    programCard.appendChild(programDescription);
    programCard.appendChild(programArtists);

    if (moment(date).format('L') === todayDate && item.time === '10:59') { // Тут нужно указать текущие время и дату
      const buttonBlock = createElem('div', 'tv-widget__button-block');

      const button = createElem('div', 'look-button');
      button.textContent = 'Смотреть';

      const liveTitle = createElem('div', 'tv-widget__life-now');
      liveTitle.textContent = 'Сейчас в эфире';

      buttonBlock.appendChild(button);
      buttonBlock.appendChild(liveTitle);

      programCard.appendChild(buttonBlock);

    }
    programContainer.appendChild(programCard); 
  })
} 


refetToJson(createScheduleList);



















// слайдер
const arrows = document.querySelectorAll('.tv-widget__arrow-circle');

const carouselContainer = document.querySelector('.tv-widget__schedule-corousel');
const carousel = document.querySelector('.tv-widget__schedule-items');

let firstSlide = true;
let lastSlide = false;

let itemWidth = 84; // Ширина элемента
let numberOfSteps; // Количество шагов, которое предстоит сделать 
let currentStepWidth = 60; // Изначальное остояние left 

let itemsScrolled = 0; //Количество элементов, которые мы скроллим

const pushSlider = (direction = 'right') => {
  const itemsNumber = document.querySelectorAll('.tv-widget__schedule-item').length; // Количество элементов
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
      console.log(itemsNumber);
      currentStepWidth = ((-1) * itemWidth * itemsNumber) + containerWidth - 40;
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