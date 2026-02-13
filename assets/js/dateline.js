(function () {
  var now = new Date();
  var realYear = now.getFullYear();
  var month = now.getMonth(); // 0-indexed

  // --- Volume & Issue ---
  var vol = realYear - 2022;
  // Game schedule: March(1)–December(9), skipping July
  var issueMap = [0, 0, 1, 2, 3, 4, 0, 5, 6, 7, 8, 9];
  //              Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec
  var issue = issueMap[month];
  var volEl = document.getElementById('dateline-vol');
  if (volEl) {
    volEl.textContent = 'Vol. ' + vol + ', Issue ' + issue;
  }

  // --- Date with fictional year ---
  var fictionalYear = realYear - 422;
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  var dateStr = days[now.getDay()] + ', ' + months[month] + ' ' + now.getDate() + ', ' + fictionalYear;
  var dateEl = document.getElementById('dateline-date');
  if (dateEl) {
    dateEl.textContent = dateStr;
  }

  // --- Moon Phase ---
  function getMoonPhase(date) {
    // Synodic month calculation based on a known new moon (Jan 6, 2000)
    var knownNew = new Date(2000, 0, 6, 18, 14, 0);
    var synodic = 29.53058867;
    var diff = (date.getTime() - knownNew.getTime()) / 1000;
    var days = diff / 86400;
    var cycles = days / synodic;
    var phase = cycles - Math.floor(cycles);

    if (phase < 0.0625) return { emoji: '\uD83C\uDF11', name: 'New Moon' };
    if (phase < 0.1875) return { emoji: '\uD83C\uDF12', name: 'Waxing Crescent' };
    if (phase < 0.3125) return { emoji: '\uD83C\uDF13', name: 'First Quarter' };
    if (phase < 0.4375) return { emoji: '\uD83C\uDF14', name: 'Waxing Gibbous' };
    if (phase < 0.5625) return { emoji: '\uD83C\uDF15', name: 'Full Moon' };
    if (phase < 0.6875) return { emoji: '\uD83C\uDF16', name: 'Waning Gibbous' };
    if (phase < 0.8125) return { emoji: '\uD83C\uDF17', name: 'Last Quarter' };
    if (phase < 0.9375) return { emoji: '\uD83C\uDF18', name: 'Waning Crescent' };
    return { emoji: '\uD83C\uDF11', name: 'New Moon' };
  }

  var moon = getMoonPhase(now);
  var moonEl = document.getElementById('dateline-moon');
  if (moonEl) {
    moonEl.textContent = moon.emoji + ' ' + moon.name;
  }

  // --- Weather (Open-Meteo, Ava NY) ---
  var weatherEl = document.getElementById('dateline-weather');
  var weatherLink = 'https://weather.com/weather/hoursbydays/l/43.42,-75.35';

  // WMO weather code descriptions
  var wmoCodes = {
    0: 'Clear', 1: 'Mostly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Rime Fog',
    51: 'Light Drizzle', 53: 'Drizzle', 55: 'Heavy Drizzle',
    56: 'Freezing Drizzle', 57: 'Heavy Freezing Drizzle',
    61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain',
    66: 'Freezing Rain', 67: 'Heavy Freezing Rain',
    71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow',
    77: 'Snow Grains',
    80: 'Light Showers', 81: 'Showers', 82: 'Heavy Showers',
    85: 'Light Snow Showers', 86: 'Heavy Snow Showers',
    95: 'Thunderstorm', 96: 'Thunderstorm w/ Hail', 99: 'Thunderstorm w/ Heavy Hail'
  };

  var apiUrl = 'https://api.open-meteo.com/v1/forecast?latitude=43.42&longitude=-75.35&current_weather=true&temperature_unit=fahrenheit';

  fetch(apiUrl)
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data && data.current_weather) {
        var temp = Math.round(data.current_weather.temperature);
        var code = data.current_weather.weathercode;
        var condition = wmoCodes[code] || 'Unknown';
        if (weatherEl) {
          weatherEl.innerHTML = '<a href="' + weatherLink + '" target="_blank" rel="noopener">' + temp + '°F, ' + condition + '</a>';
        }
      }
    })
    .catch(function () {
      if (weatherEl) {
        weatherEl.innerHTML = '<a href="' + weatherLink + '" target="_blank" rel="noopener">Weather unavailable</a>';
      }
    });
})();
