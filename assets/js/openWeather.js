const apiKey = "212da4a63aff52fd7ae7d051020ea10d"

// look city by name
async function getCityByName(query) {
    const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${apiKey}&units=imperial`)
    if (!res.ok) throw new Error('Response not OK')
    const data = await res.json()
    return data[0]
}

// get forecast
async function getForecast(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Response not OK')
    const data = await res.json()
    return data
}
// Exporting functions
const openWeather = {
    getCityByName,
    getForecast
}