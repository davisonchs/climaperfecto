const apiKey = "212da4a63aff52fd7ae7d051020ea10d"

// look city by name
async function getCityByName(query) {
    const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${apiKey}&units=imperial`)
    if (!res.ok) throw new Error('Response not OK')
    const data = await res.json()
    return data[0]
}

