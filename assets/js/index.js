$(document).ready(function () {
    const citySearchInputEl = $('#city-name-input');
    const selectedCityNameEl = $('#selected-city-name');
    const searchBtn = $('#search-button');
    const todaysDateEl = $('#todays-date');
    const todaysWeatherIconEl = $('#todays-weather-icon');
    const todaysTempsEl = $('#todays-temps');
    const todaysWindEl = $('#todays-wind');
    const todaysHumidityEl = $('#todays-humidity');
    const errorModal = new bootstrap.Modal('#error-modal');
    const errorModalTrace = $('#error-modal-trace');
    const errorModalActionSuggestion = $('#error-modal-action-suggestion');
    const searchHistoryEntriesEl = $('#search-history-entries');
    const forecastCardContainerEl = $('#forecast-cards-container');

    const defaultCity = 'Minneapolis';
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    // Handle URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const currentSearchParam = urlParams.get('search-city-name');

    if (currentSearchParam) {
        citySearchInputEl.val(currentSearchParam);
        selectedCityNameEl.text(currentSearchParam);
    } else {
        citySearchInputEl.val(defaultCity);
    }

    // Add search to history
    function addSearchToHistory(query) {
        if (!searchHistory.includes(query)) {
            searchHistory = [query, ...searchHistory.slice(0, 9)];
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
            renderSearchHistory();
        }
    }

    // Initialize search history
    function initializeSearchHistory() {
        searchHistory = [];
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        renderSearchHistory();
    }

    // Perform search
    function search(query) {
        addSearchToHistory(query);
        urlParams.set('search-city-name', query);
        history.replaceState(null, '', `${window.location.pathname}?${urlParams.toString()}`);
        window.location.reload();
    }

    // Handle search button click
    searchBtn.on('click', () => search(citySearchInputEl.val()));

    // Create search entry button
    function getSearchEntryButton(cityName) {
        return $('<button>')
            .addClass('btn btn-secondary d-block mb-2')
            .text(cityName)
            .on('click', () => search(cityName));
    }

    // Render search history
    function renderSearchHistory() {
        searchHistoryEntriesEl.empty();
        searchHistory.forEach(entry => {
            const component = getSearchEntryButton(entry);
            searchHistoryEntriesEl.append(component);
        });
    }

    // Render forecast cards
    function renderForecastCards(forecastDays) {
        forecastCardContainerEl.empty();
        let prevDay = dayjs.unix(forecastDays[0].dt);
        let dayMax = forecastDays[0].main.temp;
        let dayMin = forecastDays[0].main.temp;

        forecastDays.forEach((currentForecastDay, index) => {
            dayMax = Math.max(dayMax, currentForecastDay.main.temp);
            dayMin = Math.min(dayMin, currentForecastDay.main.temp);

            if (prevDay.format('MM-DD-YYYY') !== dayjs.unix(currentForecastDay.dt).format('MM-DD-YYYY')) {
                const tempH = Math.round(dayMax);
                const tempL = Math.round(dayMin);
                const wind = Math.round(currentForecastDay.wind.speed);
                const humidity = currentForecastDay.main.humidity;
                const iconId = currentForecastDay.weather[0].icon;

                const cardHtml = `
                    <div class="card border-info text-dark mb-2">
                        <div class="card-body d-flex flex-column align-items-center">
                            <img src="https://openweathermap.org/img/wn/${iconId}@2x.png" class="mb-2" style="width: 80px;" />
                            <h6 class="card-title mb-1">${dayjs.unix(currentForecastDay.dt).format('ddd')}</h6>
                            <p class="card-text">${tempH}° / ${tempL}°</p>
                            <p class="card-text">Wind: ${wind} MPH</p>
                            <p class="card-text">Humidity: ${humidity}%</p>
                        </div>
                    </div>
                `;

                forecastCardContainerEl.append(cardHtml);
                dayMax = currentForecastDay.main.temp;
                dayMin = currentForecastDay.main.temp;
            }
            prevDay = dayjs.unix(currentForecastDay.dt);
        });
    }

    // Render today's weather
    function renderTodaysWeather(forecast) {
        todaysDateEl.text(dayjs().format("ddd M/D/YY"));
        todaysWeatherIconEl.attr('src', `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`);
        todaysTempsEl.text(`${Math.round(forecast.main.temp)}°`);
        todaysWindEl.text(`Wind: ${Math.round(forecast.wind.speed)} MPH`);
        todaysHumidityEl.text(`Humidity: ${Math.round(forecast.main.humidity)}%`);
    }

    // Fetch and display weather data
    function fetchWeatherData(city) {
        openWeather.getCityByName(city)
            .then(citySearchData => {
                return openWeather.getForecast(citySearchData.lat.toFixed(2), citySearchData.lon.toFixed(2));
            })
            .then(forecastData => {
                renderForecastCards(forecastData.list);
                renderTodaysWeather(forecastData.list[0]);
            })
            .catch(error => {
                console.error(error);
                errorModalTrace.text(error);
                errorModalActionSuggestion.text('Please try to search for another city');
                errorModal.show();
            });
    }

    // Initialize the dashboard
    if (currentSearchParam) {
        fetchWeatherData(currentSearchParam);
    } else {
        fetchWeatherData(defaultCity);
    }

    renderSearchHistory();
});
