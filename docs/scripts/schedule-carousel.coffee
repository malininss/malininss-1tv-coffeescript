# Функция для упрощения создание элементов.
createElem = (tag, elemClass) ->
  elem = document.createElement(tag)
  elem.classList.add elemClass
  elem 

# Здесь нужно будет подтягивать актуальную дату.
todayDate = '2020-05-25'

# Обращаемся к json-файлу
referToJson = (callback) ->
  fetch('test.json', method: 'get').then((response) ->
    response.json()
  ).then((schedule) ->
    callback schedule
  ).catch (err) ->
    console.log err
  return

createScheduleList = (schedule) ->
  scheduleContainer = document.querySelector('.tv-widget__schedule-items')

  # Создаём расписание 
  for key of schedule
    moment.locale 'ru'
    date = moment(key)
    dayNumber = date.format('DD')
    mounth = date.format('MMMM')
    dayWeek = date.format('dd')
    scheduleItem = createElem('div', 'tv-widget__schedule-item')
    scheduleItem.dataset.date = key
    
    if dayWeek is 'сб' or dayWeek is 'вс'
      scheduleItem.classList.add 'tv-widget__schedule-item_weekend'
    else if dayWeek is 'пт'
      scheduleItem.classList.add 'tv-widget__schedule-item_friday'
      
    scheduleDay = createElem('div', 'tv-widget__day')
    scheduleDay.textContent = dayNumber

    scheduleMounth = createElem('div', 'tv-widget__mounth')
    scheduleMounth.textContent = mounth

    scheduleLine = createElem('div', 'tv-widget__line')

    scheduleWeekday = createElem('div', 'tv-widget__weekday')
    scheduleWeekday.textContent = dayWeek

    scheduleItem.appendChild scheduleDay
    scheduleItem.appendChild scheduleMounth
    scheduleItem.appendChild scheduleLine
    scheduleItem.appendChild scheduleWeekday

    scheduleContainer.appendChild scheduleItem

  # Обновляем элементы при загрузке страницы
  updateDayProgram todayDate, schedule[todayDate]

  # Регистрируем события
  registerEvents = ->
    scheduleDays = Array.from(document.querySelectorAll('.tv-widget__schedule-item'))
    scheduleDays.forEach (item) ->
      item.addEventListener 'click', (event) ->
        elem = event.target.closest('.tv-widget__schedule-item')
        updateDayProgram elem.getAttribute('data-date'), schedule[elem.getAttribute('data-date')]
        return
      return
    return

  registerEvents()
  return

# Обновляем элементы расписания под календарём
updateDayProgram = (date, schedule) ->
  widgetTitleSpan = document.querySelector('.tv_widget__today-date')
  widgetTitleSpanText = moment(date).format('dddd, DD MMMM YYYY')

  if date is todayDate
    widgetTitleSpan.textContent = ' на сегодня'
  else
    widgetTitleSpan.textContent = ''
  widgetTitleSpan.textContent += ". #{widgetTitleSpanText[0].toUpperCase() + widgetTitleSpanText.slice(1)}"

  programContainer = document.querySelector('.tv-widget__program-cards')
  programContainer.innerHTML = ''

  schedule.forEach (item, index) ->
    programCard = createElem('div', 'tv-widget__program-card')
    titleBlock = createElem('div', 'tv-widget__program-title-block')
    programTime = createElem('div', 'tv-widget__program-time')
    programTime.textContent = item.time
    programTitle = createElem('a', 'tv-widget__program-title')
    programTitle.href = '#'
    programTitle.textContent = item.title
    awards = createElem('div', 'tv-widget__program-awards')
    
    for key of item.awards
      if item.awards[key] is 'true'
        award = createElem('div', 'tv-widget__program-award')
        award.classList.add 'tv-widget__program-award_' + key
        awards.appendChild award

    programCountry = createElem('div', 'tv-widget__program-country')

    countryImg = document.createElement('img')
    countryImg.src = 'img/icons/russia-icon.svg'
    countryImg.alt = item.country
    
    programCountry.appendChild countryImg
    tvChannel = createElem('div', 'tv-widget__program-channel')
    
    channelImg = document.createElement('img')
    channelImg.src = 'img/icons/1tv-icon.svg'
    channelImg.alt = item.channel

    tvChannel.appendChild channelImg
    titleBlock.appendChild programTime
    titleBlock.appendChild programTitle
    titleBlock.appendChild awards

    if item.country
      titleBlock.appendChild programCountry

    titleBlock.appendChild tvChannel

    programDescription = createElem('div', 'tv-widget__program-description')
    programDescription.textContent = item.description

    programArtists = createElem('div', 'tv-widget__program-artists')

    item.artists.forEach (artistName, index) ->
      artistElem = createElem('a', 'tv-widget__program-artist')
      artistElem.href = '#'
      artistElem.textContent = artistName
      programArtists.appendChild artistElem

      if index != item.artists.length - 1
        programArtists.innerHTML += ', '
      return
      
    programCard.appendChild titleBlock
    programCard.appendChild programDescription
    programCard.appendChild programArtists

    # Тут нужно указать текущие время и дату. Используется для показа кнопок "Смотреть" и "Сейчас в эфире"
    if moment(date).format('L') is moment(todayDate).format('L') and item.time is '10:59'

      buttonBlock = createElem('div', 'tv-widget__button-block')
      button = createElem('div', 'look-button')
      button.textContent = 'Смотреть'

      liveTitle = createElem('div', 'tv-widget__life-now')
      liveTitle.textContent = 'Сейчас в эфире'

      buttonBlock.appendChild button
      buttonBlock.appendChild liveTitle
      programCard.appendChild buttonBlock

    programContainer.appendChild programCard
    return
  return


# слайдер
arrows = document.querySelectorAll('.tv-widget__arrow-circle')
carouselContainer = document.querySelector('.tv-widget__schedule-corousel')
carousel = document.querySelector('.tv-widget__schedule-items')
firstSlide = true
lastSlide = false
itemWidth = 84 # Ширина элемента

numberOfSteps = undefined # Количество шагов, которое предстоит сделать 
currentStepWidth = 60 # Изначальное остояние left 
itemsScrolled = 0 #Количество элементов, которые мы скроллим


pushSlider = (direction = 'right') ->
  itemsNumber = document.querySelectorAll('.tv-widget__schedule-item').length # Общее количество элементов
  containerWidth = carouselContainer.offsetWidth # Ширина контейнера
 
  # В зависимости от ширины контейнера определяем, сколько элементов надо прокрутить
  switch true
    when containerWidth < 360
      numberOfSteps = 1
    when containerWidth < 420
      numberOfSteps = 2
    when containerWidth < 505
      numberOfSteps = 3
    when containerWidth < 585
      numberOfSteps = 4
    else
      numberOfSteps = 5

  # Определяем, сколько элементов предстоить прокрутить. 
  remainedToScroll = itemsNumber - itemsScrolled - numberOfSteps - 2

  if direction is 'right'
    if remainedToScroll < numberOfSteps # Если количество элементов, сколько можно прокрутить, меньше количества шагов
      numberOfSteps = remainedToScroll # Говорим, сколько шагов прокручиваем
      lastSlide = true # Определяем, что слайд последний

  slideWidth = itemWidth * numberOfSteps  # Определяем ширину слайда (насколько нужно прокрутить)

  if direction is 'right'
    currentStepWidth -= slideWidth
    itemsScrolled += numberOfSteps

    if lastSlide and remainedToScroll != 0
      currentStepWidth = -1 * itemWidth * itemsNumber + containerWidth - 40
      
    if firstSlide
      currentStepWidth += itemWidth
      currentStepWidth -= 60
      firstSlide = false
  else # Если прокручиваем влево
    currentStepWidth += slideWidth
    itemsScrolled -= numberOfSteps

    if itemsScrolled <= 0
      currentStepWidth = 60 # возвращаемся в изначальню первую позицию
      itemsScrolled = 0
      firstSlide = true 

    if lastSlide
      lastSlide = false

  carousel.style.left = currentStepWidth.toString() + 'px'
  return

Array.from(arrows).forEach (item) ->
  item.addEventListener 'click', (event) ->
    if event.target.parentElement.classList.contains('tv-widget__arrow-circle_right')
      pushSlider()
    else
      pushSlider 'left'
    return
  return

# Создаём календарь
referToJson createScheduleList