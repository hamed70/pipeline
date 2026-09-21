// ============================================
// مدیریت Popup
// ============================================

const popupElement = document.getElementById('customPopup');
const fieldTranslations = {
    'LAYER': 'نام لایه',
    'capacity': 'ظرفیت (اینچ)',
    'Distance': 'فاصله',
    'Shape_Length': 'طول',
    'OBJECTID': 'شناسه',
    'Name': 'نام'
};

window.showPopup = function(lngLat, properties, title) {
    let html = `<div class="popup-header">${title}</div><div class="popup-body">`;
    
    for (let key in properties) {
        if (properties.hasOwnProperty(key)) {
            const value = properties[key];
            const label = fieldTranslations[key] || key;
            const formattedValue = typeof value === 'number' 
                ? value.toLocaleString('fa-IR', {maximumFractionDigits: 2}) 
                : value;
            
            html += `<div><span>${label}:</span> <strong>${formattedValue}</strong></div>`;
        }
    }
    
    html += '</div>';
    popupElement.innerHTML = html;
    popupElement.style.display = 'block';
    
    // محاسبه موقعیت popup
    const coords = map.project(lngLat);
    popupElement.style.left = `${coords.x + 15}px`;
    popupElement.style.top = `${coords.y - 50}px`;
};

// بستن popup با کلیک خارج
map.on('click', (e) => {
    if (!e.originalEvent.target.closest('.custom-popup')) {
        popupElement.style.display = 'none';
    }
});

// بستن popup با تغییر zoom/pan
map.on('move', () => {
    popupElement.style.display = 'none';
});