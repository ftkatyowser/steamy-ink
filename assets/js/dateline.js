(function () {
  var now = new Date();
  var realYear = now.getFullYear();
  var month = now.getMonth(); // 0-indexed

  // --- Volume & Issue ---
  var vol = realYear - 2022;
  var issueMap = [0, 0, 1, 2, 3, 4, 4, 5, 6, 7, 8, 9];
  var issue = issueMap[month];
  var volEl = document.getElementById('dateline-vol');
  if (volEl) {
    volEl.textContent = 'Vol. ' + vol + ', Issue ' + issue;
  }

  // --- Date for 16XX---
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

    if (phase < 0.0625) return { emoji: '🌑', name: 'New Moon' };
    if (phase < 0.1875) return { emoji: '🌒', name: 'Waxing Crescent' };
    if (phase < 0.3125) return { emoji: '🌓', name: 'First Quarter' };
    if (phase < 0.4375) return { emoji: '🌔', name: 'Waxing Gibbous' };
    if (phase < 0.5625) return { emoji: '🌕', name: 'Full Moon' };
    if (phase < 0.6875) return { emoji: '🌖', name: 'Waning Gibbous' };
    if (phase < 0.8125) return { emoji: '🌗', name: 'Last Quarter' };
    if (phase < 0.9375) return { emoji: '🌘', name: 'Waning Crescent' };
    return { emoji: '🌑', name: 'New Moon' };
  }

  var moon = getMoonPhase(now);
  var moonEl = document.getElementById('dateline-moon');
  if (moonEl) {
    moonEl.textContent = moon.emoji + ' ' + moon.name;
  }

  // --- Weather (Open-Meteo, Ava NY) ---
  var weatherEl = document.getElementById('dateline-weather');
  var weatherLink = 'https://forecast.weather.gov/MapClick.php?lat=43.418887&lon=-75.47949';

  var wmoCodes = {
    0:  { icon: '☀️', text: 'Clear' },
    1:  { icon: '🌤️', text: 'Mostly Clear' },
    2:  { icon: '⛅', text: 'Partly Cloudy' },
    3:  { icon: '☁️', text: 'Overcast' },
    45: { icon: '🌫️', text: 'Foggy' },
    48: { icon: '🌫️', text: 'Rime Fog' },
    51: { icon: '🌦️', text: 'Light Drizzle' },
    53: { icon: '🌦️', text: 'Drizzle' },
    55: { icon: '🌦️', text: 'Heavy Drizzle' },
    56: { icon: '❄️', text: 'Freezing Drizzle' },
    57: { icon: '❄️', text: 'Heavy Freezing Drizzle' },
    61: { icon: '🌧️', text: 'Light Rain' },
    63: { icon: '🌧️', text: 'Rain' },
    65: { icon: '🌧️', text: 'Heavy Rain' },
    66: { icon: '🌨️', text: 'Freezing Rain' },
    67: { icon: '🌨️', text: 'Heavy Freezing Rain' },
    71: { icon: '🌨️', text: 'Light Snow' },
    73: { icon: '❄️', text: 'Snow' },
    75: { icon: '❄️', text: 'Heavy Snow' },
    77: { icon: '❄️', text: 'Snow Grains' },
    80: { icon: '🌦️', text: 'Light Showers' },
    81: { icon: '🌧️', text: 'Showers' },
    82: { icon: '🌧️', text: 'Heavy Showers' },
    85: { icon: '🌨️', text: 'Light Snow Showers' },
    86: { icon: '🌨️', text: 'Heavy Snow Showers' },
    95: { icon: '⛈️', text: 'Thunderstorm' },
    96: { icon: '⛈️', text: 'Thunderstorm w/ Hail' },
    99: { icon: '⛈️', text: 'Thunderstorm w/ Heavy Hail' }
  };

  var sunsetEl = document.getElementById('dateline-sunset');
  if (sunsetEl) {
    sunsetEl.textContent = 'Maplewood, Freelands';
  }
  var apiUrl = 'https://api.open-meteo.com/v1/forecast?latitude=43.42&longitude=-75.35&current_weather=true&temperature_unit=fahrenheit&daily=sunset&timezone=America/New_York&forecast_days=1';

  // --- Session cache ---
  // One fetch per tab session, re-fetched after 30 minutes, and always
  // re-fetched once the local calendar date rolls over (sunset changes daily,
  // and a page left open past midnight must not keep yesterday's numbers).
  var CACHE_KEY = 'sip-dateline-weather';
  var CACHE_MAX_AGE_MS = 30 * 60 * 1000;
  var todayKey = realYear + '-' + (month + 1) + '-' + now.getDate();

  function readCache() {
    try {
      var raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var entry = JSON.parse(raw);
      if (!entry || entry.day !== todayKey) return null;
      if (now.getTime() - entry.at > CACHE_MAX_AGE_MS) return null;
      return entry.data;
    } catch (e) {
      return null;
    }
  }

  function writeCache(data) {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ day: todayKey, at: now.getTime(), data: data }));
    } catch (e) {
      // Storage unavailable (private mode, quota); the page still renders.
    }
  }

  function render(data) {
    var temp = Math.round(data.current_weather.temperature);
    var code = data.current_weather.weathercode;
    var weather = wmoCodes[code] || { icon: '', text: 'Unknown' };
    if (weatherEl) {
      weatherEl.innerHTML = '<a href="' + weatherLink + '" target="_blank" rel="noopener">' + weather.icon + ' ' + temp + '°F, ' + weather.text + '</a>';
    }
    // Sunset time. The API is asked for America/New_York and answers with a naive
    // local timestamp ("2026-09-02T19:35"), so read the clock straight off the
    // string. Handing it to Date() re-reads it against the reader's own timezone,
    // which prints the wrong sunset for anyone viewing from outside New York.
    if (sunsetEl && data.daily && data.daily.sunset && data.daily.sunset[0]) {
      var sunsetParts = /T(\d{1,2}):(\d{2})/.exec(data.daily.sunset[0]);
      if (sunsetParts) {
        var hours = parseInt(sunsetParts[1], 10);
        var minStr = sunsetParts[2];
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        sunsetEl.textContent = '🌅 Sunset ' + hours + ':' + minStr + ' ' + ampm;
      }
    }
  }

  function fallback() {
    if (weatherEl) {
      weatherEl.innerHTML = '<a href="' + weatherLink + '" target="_blank" rel="noopener">Weather: Look Outside</a>';
    }
  }

  var cached = readCache();
  if (cached) {
    render(cached);
  } else {
    fetch(apiUrl)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data && data.current_weather) {
          // Keep only what render() needs so the cache entry stays small.
          var slim = {
            current_weather: {
              temperature: data.current_weather.temperature,
              weathercode: data.current_weather.weathercode
            },
            daily: { sunset: (data.daily && data.daily.sunset) ? [data.daily.sunset[0]] : [] }
          };
          writeCache(slim);
          render(slim);
        } else {
          fallback();
        }
      })
      .catch(fallback);
  }
})();
