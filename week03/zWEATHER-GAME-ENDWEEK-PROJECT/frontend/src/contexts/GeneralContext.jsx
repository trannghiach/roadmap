const API_KEY = 'd2e42a11cc0abcf0ec816af429c33051';

const weatherColors = {
  Clouds: "shadow-gray-500",
  Clear: "shadow-orange-500",
  Rain: "shadow-cyan-700",
  Snow: "shadow-neutral-200"
}

const unitMap = {
  standard: "°F",
  metric: "°C",
  imperial: "K"
}

const weatherIcons = [
  "01d", "01n", // Trời quang
  "02d", "02n", // Ít mây
  "03d", "03n", // Mây rải rác
  "04d", "04n", // Nhiều mây
  "09d", "09n", // Mưa rào
  "10d", "10n", // Mưa
  "11d", "11n", // Dông bão
  "13d", "13n", // Tuyết
  "50d", "50n"  // Sương mù
];

const iconRate = {
  "01d": 15,
  "01n": 10,
  "02d": 10,
  "02n": 7,
  "03d": 14,
  "03n": 14,
  "04d": 18,
  "04n": 18,
  "09d": 9,
  "09n": 9,
  "10d": 7,
  "10n": 6,
  "11d": 7,
  "11n": 7,
  "13d": 9,
  "13n": 9,
  "50d": 5,
  "50n": 5,
};

const weatherShadows = {
  Clouds: "shadow-gray-500",          // Nhiều mây (phổ biến nhất) → Xám nhạt
  Clear: "shadow-blue-400",           // Trời quang → Xanh dương nhạt
  Rain: "shadow-blue-600",            // Mưa → Xanh dương đậm
  Drizzle: "shadow-cyan-500",         // Mưa phùn → Xanh cyan
  Thunderstorm: "shadow-purple-600",  // Dông → Tím
  Snow: "shadow-indigo-500",          // Tuyết → Xanh tím
  Mist: "shadow-teal-500",            // Sương mù → Xanh teal
  Smoke: "shadow-gray-600",           // Khói → Xám đậm hơn Clouds
  Haze: "shadow-yellow-500",          // Sương mù nhẹ → Vàng (bụi mờ)
  Dust: "shadow-orange-600",          // Bụi → Cam
  Fog: "shadow-teal-700",             // Sương dày → Xanh teal đậm
  Sand: "shadow-amber-700",           // Cát bay → Nâu vàng
  Ash: "shadow-red-600",              // Tro núi lửa → Đỏ đậm
  Squall: "shadow-blue-800",          // Gió giật mạnh → Xanh dương siêu đậm
  Tornado: "shadow-red-800",          // Lốc xoáy (hiếm nhất) → Đỏ tối
  Locked: "shadow-gray-400"           // Khóa → Xám nhạt
};


const testWeatherData = [
  { main: "Clear", icon: "01d" },
  { main: "Clouds", icon: "02d" },
  { main: "Drizzle", icon: "09d" },
  { main: "Rain", icon: "10d" },
  { main: "Thunderstorm", icon: "11d" },
  { main: "Snow", icon: "13d" },
  { main: "Mist", icon: "50d" },
  { main: "Smoke", icon: "50d" },
  { main: "Haze", icon: "50d" },
  { main: "Dust", icon: "50d" },
  { main: "Fog", icon: "50d" },
  { main: "Sand", icon: "50d" },
  { main: "Ash", icon: "50d" },
  { main: "Squall", icon: "50d" },
  { main: "Tornado", icon: "50d" },
];

const weatherMainDistribution = {
  "Clear": 30,         // 30%
  "Clouds": 25,        // 25%
  "Rain": 15,          // 15%
  "Snow": 6,           // 6%
  "Drizzle": 5,        // 5%
  "Thunderstorm": 4,   // 4%
  "Mist": 4,           // 4%
  "Haze": 3,           // 3%
  "Fog": 2,            // 2%
  "Dust": 2,           // 2%
  "Sand": 1,           // 1%
  "Ash": 1,            // 1%
  "Smoke": 0.5,        // 0.5%
  "Squall": 0.5,       // 0.5%
  "Tornado": 0.5       // 0.5%
};

export {
    API_KEY,
    weatherColors,
    unitMap,
    weatherIcons,
    iconRate,
    weatherShadows,
    testWeatherData,
    weatherMainDistribution
}
