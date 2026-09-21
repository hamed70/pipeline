const popupElement = document.getElementById('customPopup');
const fieldTranslations = {
    'OBJECTID': 'شناسه',
    'Name': 'نام',
    'Shape_Length': 'طول',
    'Shape_Area': 'مساحت',
    'Layer': 'لایه',
    'Color': 'رنگ',
    'Linetype': 'نوع خط',
    'Elevation': 'ارتفاع',
    'LineWt': 'ضخامت خط'
};

window.showPopup = function(lngLat, properties, title) {
    let html = `<div class="popup-header">${title}</div><div class="popup-body">`;
    
    for (let key in properties) {
        if (properties.hasOwnProperty(key) && properties[key] !== null && properties[key] !== '') {
            const value = properties[key];
            const label = fieldTranslations[key] || key;
            
            let formattedValue = value;
            if (typeof value === 'number') {
                formattedValue = value.toLocaleString('fa-IR', {
                    maximumFractionDigits: 4
                });
            }
            
            html += `<div><span>${label}:</span> <strong>${formattedValue}</strong></div>`;
        }
    }
    
    html += '</div>';
    popupElement.innerHTML = html;
    popupElement.style.display = 'block';
    
    const coords = map.project(lngLat);
    const popupWidth = 240;
    const popupHeight = 200;
    
    let left = coords.x + 15;
    let top = coords.y - 50;
    
    if (left + popupWidth > window.innerWidth) {
        left = coords.x - popupWidth - 15;
    }
    
    if (top + popupHeight > window.innerHeight) {
        top = coords.y - popupHeight;
    }
    
    popupElement.style.left = `${left}px`;
    popupElement.style.top = `${top}px`;
};

map.on('click', (e) => {
    if (!e.originalEvent.target.closest('.custom-popup') && 
        !e.originalEvent.target.closest('.maplibregl-canvas')) {
        popupElement.style.display = 'none';
    }
});

map.on('move', () => {
    popupElement.style.display = 'none';
});