const popup = document.getElementById('customPopup');
const popupTitle = document.getElementById('popupTitle');
const popupBody = document.getElementById('popupBody');

// دیکشنری ترجمه فیلدها به فارسی
const fieldTranslations = {
    'LAYER': 'نام لایه',
    'capacity': 'ظرفیت (اینچ)',
    'Distance': 'فاصله',
    'Shape_Length': 'طول شکل',
    'OBJECTID': 'شناسه عارضه',
    'Name': 'نام',
    'AreaHectar': 'مساحت (هکتار)'
};

// ✅ استفاده از window.viewer برای اطمینان از دسترسی global
window.viewer.screenSpaceEventHandler.setInputAction(function (movement) {
    const pickedObject = window.viewer.scene.pick(movement.position);

    if (Cesium.defined(pickedObject) && pickedObject.id) {
        const entity = pickedObject.id;
        const props = entity.properties;

        if (!props) return;

        popupTitle.textContent = props.LAYER ? props.LAYER.getValue() : (props.Name ? props.Name.getValue() : 'جزئیات عارضه');
        
        let html = '';
        for (let key in props) {
            if (props.hasOwnProperty(key) && key !== 'name') {
                const rawValue = props[key].getValue();
                const value = typeof rawValue === 'number' ? rawValue.toLocaleString('fa-IR', {maximumFractionDigits: 2}) : rawValue;
                const label = fieldTranslations[key] || key;
                
                html += `<div><span>${label}:</span> <strong>${value}</strong></div>`;
            }
        }

        popupBody.innerHTML = html;
        popup.style.display = 'block';

        popup.style.left = (movement.position.x + 15) + 'px';
        popup.style.top = (movement.position.y + 15) + 'px';

    } else {
        popup.style.display = 'none';
    }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);