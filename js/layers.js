const layers = {};
let animationState = {
    isAnimating: false,
    speed: 1,
    intervalId: null
};

let layerVisibility = {
    masir: true,
    harim20: true,
    harim200: true,
    harim7: true
};

// . مسیر ۶۵ متری پیشنهادی (سبز)
async function loadMasirPishnahadi() {
    try {
        const response = await fetch('data/masir_pishnehadi_polyliens.geojson');
        const geojson = await response.json();
        
        const sourceId = 'masir-pishnehadi';
        const layerId = 'masir-pishnehadi-line';
        
        if (map.getSource(sourceId)) {
            map.getSource(sourceId).setData(geojson);
        } else {
            map.addSource(sourceId, { type: 'geojson', data: geojson });
        }
        
        if (!map.getLayer(layerId)) {
            map.addLayer({
                id: layerId,
                type: 'line',
                source: sourceId,
                paint: { 
                    'line-color': '#10b981',
                    'line-width': 6,
                    'line-opacity': 0.95
                }
            });
        }
        
        map.setLayoutProperty(layerId, 'visibility', 
            layerVisibility.masir ? 'visible' : 'none');
        
        layers.masir = layerId;
        console.log('✅ لایه مسیر پیشنهادی بارگذاری شد');
    } catch (error) {
        console.error('❌ خطا در بارگذاری مسیر پیشنهادی:', error);
    }
}

// ۲. حریم ۲۰ متری (نارنجی)
async function loadHarim20() {
    try {
        const response = await fetch('data/harim_20m.geojson');
        const geojson = await response.json();
        
        const sourceId = 'harim-20';
        const layerId = 'harim-20-line';
        
        if (map.getSource(sourceId)) {
            map.getSource(sourceId).setData(geojson);
        } else {
            map.addSource(sourceId, { type: 'geojson', data: geojson });
        }
        
        if (!map.getLayer(layerId)) {
            map.addLayer({
                id: layerId,
                type: 'line',
                source: sourceId,
                paint: { 
                    'line-color': '#f59e0b',
                    'line-width': 4,
                    'line-opacity': 0.9
                }
            });
        }
        
        map.setLayoutProperty(layerId, 'visibility', 
            layerVisibility.harim20 ? 'visible' : 'none');
        
        layers.harim20 = layerId;
        console.log('✅ لایه حریم ۲۰ متری بارگذاری شد');
    } catch (error) {
        console.error('❌ خطا در بارگذاری حریم ۰ متری:', error);
    }
}

// ۳. حریم ۲۰۰ متری (آبی)
async function loadHarim200() {
    try {
        const response = await fetch('data/harim_polyline.geojson');
        const geojson = await response.json();
        
        const sourceId = 'harim-200';
        const layerId = 'harim-200-line';
        
        if (map.getSource(sourceId)) {
            map.getSource(sourceId).setData(geojson);
        } else {
            map.addSource(sourceId, { type: 'geojson', data: geojson });
        }
        
        if (!map.getLayer(layerId)) {
            map.addLayer({
                id: layerId,
                type: 'line',
                source: sourceId,
                paint: { 
                    'line-color': '#3b82f6',
                    'line-width': 5,
                    'line-opacity': 0.85
                }
            });
        }
        
        map.setLayoutProperty(layerId, 'visibility', 
            layerVisibility.harim200 ? 'visible' : 'none');
        
        layers.harim200 = layerId;
        console.log('✅ لایه حریم ۲۰۰ متری بارگذاری شد');
    } catch (error) {
        console.error('❌ خطا در بارگذاری حریم ۲۰۰ متری:', error);
    }
}

// ۴. حریم ۷ متری (قرمز - پلی‌گان)
async function loadHarim7() {
    try {
        const response = await fetch('data/harim_polygon.geojson');
        const geojson = await response.json();
        
        const sourceId = 'harim-7';
        const fillLayerId = 'harim-7-fill';
        const outlineLayerId = 'harim-7-outline';
        
        if (map.getSource(sourceId)) {
            map.getSource(sourceId).setData(geojson);
        } else {
            map.addSource(sourceId, { type: 'geojson', data: geojson });
        }
        
        if (!map.getLayer(fillLayerId)) {
            map.addLayer({
                id: fillLayerId,
                type: 'fill',
                source: sourceId,
                paint: { 
                    'fill-color': '#ef4444',
                    'fill-opacity': 0.3
                }
            });
        }
        
        if (!map.getLayer(outlineLayerId)) {
            map.addLayer({
                id: outlineLayerId,
                type: 'line',
                source: sourceId,
                paint: { 
                    'line-color': '#dc2626',
                    'line-width': 3,
                    'line-opacity': 0.9
                }
            });
        }
        
        const visibility = layerVisibility.harim7 ? 'visible' : 'none';
        map.setLayoutProperty(fillLayerId, 'visibility', visibility);
        map.setLayoutProperty(outlineLayerId, 'visibility', visibility);
        
        layers.harim7 = [fillLayerId, outlineLayerId];
        console.log('✅ لایه حریم ۷ متری بارگذاری شد');
    } catch (error) {
        console.error('❌ خطا در بارگذاری حریم ۷ متری:', error);
    }
}

// تابع روشن/خاموش کردن لایه
function toggleLayer(layerName, isVisible) {
    layerVisibility[layerName] = isVisible;
    const visibility = isVisible ? 'visible' : 'none';
    
    if (layerName === 'harim7') {
        if (map.getLayer('harim-7-fill')) {
            map.setLayoutProperty('harim-7-fill', 'visibility', visibility);
        }
        if (map.getLayer('harim-7-outline')) {
            map.setLayoutProperty('harim-7-outline', 'visibility', visibility);
        }
    } else if (layers[layerName]) {
        if (map.getLayer(layers[layerName])) {
            map.setLayoutProperty(layers[layerName], 'visibility', visibility);
        }
    }
}

// ✅ تابع استخراج نقاط برای انیمیشن (از شرق به غرب)
function getOrderedRoutePoints() {
    const source = map.getSource('masir-pishnehadi');
    if (!source || !source._data) return [];
    
    const geojson = source._data;
    const allPoints = [];
    
    geojson.features.forEach(feature => {
        if (feature.geometry.type === 'LineString') {
            feature.geometry.coordinates.forEach(coord => {
                allPoints.push(coord);
            });
        }
    });
    
    // ✅ مرتب‌سازی از شرق به غرب (longitude از بزرگتر به کوچکتر)
    allPoints.sort((a, b) => b[0] - a[0]);
    
    return allPoints;
}

// تابع شروع انیمیشن
window.startAnimation = function() {
    if (animationState.isAnimating) {
        stopAnimation();
        return;
    }
    
    const points = getOrderedRoutePoints();
    if (points.length === 0) {
        alert('نقاطی برای پرواز یافت نشد.');
        return;
    }
    
    animationState.isAnimating = true;
    
    const btnAnimate = document.getElementById('btnAnimate');
    btnAnimate.textContent = '⏸️ توقف';
    btnAnimate.className = 'btn-warning';
    
    let currentIndex = 0;
    const step = Math.max(1, Math.floor(points.length / 80));
    
    function animate() {
        if (!animationState.isAnimating) return;
        
        if (currentIndex >= points.length) {
            stopAnimation();
            alert('✅ پرواز به پایان رسید!');
            return;
        }
        
        const point = points[currentIndex];
        map.flyTo({
            center: point,
            zoom: 14,
            pitch: 45,
            bearing: -15,
            duration: 800 / animationState.speed,
            essential: true
        });
        
        currentIndex += step;
        animationState.intervalId = setTimeout(animate, 1000 / animationState.speed);
    }
    
    animate();
};

function stopAnimation() {
    animationState.isAnimating = false;
    if (animationState.intervalId) {
        clearTimeout(animationState.intervalId);
    }
    
    const btnAnimate = document.getElementById('btnAnimate');
    btnAnimate.textContent = '🎬 پرواز روی مسیر';
    btnAnimate.className = 'btn-primary';
}

window.setAnimationSpeed = function(speed) {
    animationState.speed = speed;
};

window.toggleLayer = toggleLayer;