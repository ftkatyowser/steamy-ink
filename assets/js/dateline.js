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

  // WMO weather code descriptions with icons
  var wmoCodes = {
    0:  { icon: '\u2600\uFE0F', text: 'Clear' },
    1:  { icon: '\uD83C\uDF24\uFE0F', text: 'Mostly Clear' },
    2:  { icon: '\u26C5', text: 'Partly Cloudy' },
    3:  { icon: '\u2601\uFE0F', text: 'Overcast' },
    45: { icon: '\uD83C\uDF2B\uFE0F', text: 'Foggy' },
    48: { icon: '\uD83C\uDF2B\uFE0F', text: 'Rime Fog' },
    51: { icon: '\uD83C\uDF26\uFE0F', text: 'Light Drizzle' },
    53: { icon: '\uD83C\uDF26\uFE0F', text: 'Drizzle' },
    55: { icon: '\uD83C\uDF26\uFE0F', text: 'Heavy Drizzle' },
    56: { icon: '\u2744\uFE0F', text: 'Freezing Drizzle' },
    57: { icon: '\u2744\uFE0F', text: 'Heavy Freezing Drizzle' },
    61: { icon: '\uD83C\uDF27\uFE0F', text: 'Light Rain' },
    63: { icon: '\uD83C\uDF27\uFE0F', text: 'Rain' },
    65: { icon: '\uD83C\uDF27\uFE0F', text: 'Heavy Rain' },
    66: { icon: '\uD83C\uDF28\uFE0F', text: 'Freezing Rain' },
    67: { icon: '\uD83C\uDF28\uFE0F', text: 'Heavy Freezing Rain' },
    71: { icon: '\uD83C\uDF28\uFE0F', text: 'Light Snow' },
    73: { icon: '\u2744\uFE0F', text: 'Snow' },
    75: { icon: '\u2744\uFE0F', text: 'Heavy Snow' },
    77: { icon: '\u2744\uFE0F', text: 'Snow Grains' },
    80: { icon: '\uD83C\uDF26\uFE0F', text: 'Light Showers' },
    81: { icon: '\uD83C\uDF27\uFE0F', text: 'Showers' },
    82: { icon: '\uD83C\uDF27\uFE0F', text: 'Heavy Showers' },
    85: { icon: '\uD83C\uDF28\uFE0F', text: 'Light Snow Showers' },
    86: { icon: '\uD83C\uDF28\uFE0F', text: 'Heavy Snow Showers' },
    95: { icon: '\u26C8\uFE0F', text: 'Thunderstorm' },
    96: { icon: '\u26C8\uFE0F', text: 'Thunderstorm w/ Hail' },
    99: { icon: '\u26C8\uFE0F', text: 'Thunderstorm w/ Heavy Hail' }
  };

  var apiUrl = 'https://api.open-meteo.com/v1/forecast?latitude=43.42&longitude=-75.35&current_weather=true&temperature_unit=fahrenheit';

  fetch(apiUrl)
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data && data.current_weather) {
        var temp = Math.round(data.current_weather.temperature);
        var code = data.current_weather.weathercode;
        var weather = wmoCodes[code] || { icon: '', text: 'Unknown' };
        if (weatherEl) {
          weatherEl.innerHTML = '<a href="' + weatherLink + '" target="_blank" rel="noopener">' + weather.icon + ' ' + temp + '°F, ' + weather.text + '</a>';
        }
      }
    })
    .catch(function () {
      if (weatherEl) {
        weatherEl.innerHTML = '<a href="' + weatherLink + '" target="_blank" rel="noopener">Weather unavailable</a>';
      }
    });
})();
