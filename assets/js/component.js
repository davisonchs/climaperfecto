

function getForecastCard(tempH, tempL, wind, humidity, iconId, unixTimestamp) {
    const date = dayjs.unix(unixTimestamp)
    return `
    <div class="card-body bg-primary text-white">
        <h5 class="card-title w-100">${date.format('ddd')} ${date.format('DD')}</h5>

        <img src="https://openweathermap.org/img/wn/${iconId.substring(0, 2)}d@2x.png" style="width: 100px;"></img>

        <span class="d-block fs-3" style="margin-bottom: -10px;">${tempH}° / ${tempL}°</span>
        <strong><span class="d-block fs-6 text-white">H/L</span></strong>
        <div>Wind: ${wind} MPH</div>
        <div>Humidity: ${humidity}%</div>
    </div>`
}

function getSearchEntryButton(query) {
    const el = $('<a>')
    el.attr('href', `?search-city-name=${query}`)
    el.addClass("btn btn-sm btn-secondary w-100 mt-1")
    el.text(query)

    return el
}