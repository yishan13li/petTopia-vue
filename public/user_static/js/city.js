const cities = [
    "台北市", "高雄市", "台中市", "台南市", "新北市", "桃園市", 
	"基隆市", "新竹市", "新竹縣", "苗栗縣", "彰化縣", "南投縣",
	"雲林縣", "嘉義縣", "嘉義市", "屏東縣", "宜蘭縣", "台東縣",
    "花蓮縣", "澎湖縣", "金門縣", "馬祖列島", 
     
    
];

// 填充縣市選單
const citySelect = document.getElementById('city');
cities.forEach(city => {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    citySelect.appendChild(option);
});
