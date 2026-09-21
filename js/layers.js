const layers = {};
let animationState = {
    isAnimating: false,
    speed: 1,
    intervalId: null
};
function loadMarz() {
    return fetch('data/marz.geojson')
        .then(res => res.json())
        .then(geojson => {
            map.addSource('marz', {
                type: 'geojson',
                data: geojson
            });
            
            map.addLayer({
                id: 'marz-fill',
                type: 'fill',
                source: 'marz',
                paint: {
                    'fill-color': '#ef4444',
                    'fill-opacity': 0.08
                }
            });
            
            map.addLayer({
                id: 'marz-line',
                type: 'line',
                source: 'marz',
                paint: {
                    'line-color': '#ef4444',
                    'line-width': 2
                }
            });
            
            layers.marz = { fill: 'marz-fill', line: 'marz-line' };
            console.log('✅ لایه مرز اضافه شد');
        });
}

// ۱. مسیر پیشنهادی (هدف انیمیشن)
async function loadMasirPishnehadi() {
    const response = await fetch('data/masir_pishnehadi_polyliens.geojson');
    const geojson = await response.json();
    
    map.addSource('masir-pishnehadi', { type: 'geojson', data: geojson });
    map.addLayer({
        id: 'masir-pishnehadi-line',
        type: 'line',
        source: 'masir-pishnehadi',
        paint: { 'line-color': '#10b981', 'line-width': 5, 'line-opacity': 0.9 }
    });
    
    // کلیک برای پاپ‌آپ
    map.on('click', 'masir-pishnehadi-line', (e) => showPopup(e.lngLat, e.features[0].properties, 'مسیر پیشنهادی'));
    map.on('mouseenter', 'masir-pishnehadi-line', () => map.getCanvas().style.cursor = 'pointer');
    map.on('mouseleave', 'masir-pishnehadi-line', () => map.getCanvas().style.cursor = '');
    
    layers.masir = 'masir-pishnehadi-line';
}

// ۲. حریم ۲۰ متری
async function loadHarim20() {
    const response = await fetch('data/harim_20m.geojson');
    const geojson = await response.json();
    
    map.addSource('harim-20', { type: 'geojson', data: geojson });
    map.addLayer({
        id: 'harim-20-line',
        type: 'line',
        source: 'harim-20',
        paint: { 'line-color': '#f59e0b', 'line-width': 3, 'line-opacity': 0.8 }
    });
    layers.harim20 = 'harim-20-line';
}

// ۳. حریم گاز (پلی‌لاین)
async function loadHarimPolyline() {
    const response = await fetch('data/harim_polyline.geojson');
    const geojson = await response.json();
    
    map.addSource('harim-poly', { type: 'geojson', data: geojson });
    map.addLayer({
        id: 'harim-poly-line',
        type: 'line',
        source: 'harim-poly',
        paint: { 'line-color': '#3b82f6', 'line-width': 4, 'line-opacity': 0.9 }
    });
    layers.harimpoly = 'harim-poly-line';
}

// ۴. حریم گاز (پلی‌گان)
async function loadHarimPolygon() {
    const response = await fetch('data/harim_polygon.geojson');
    const geojson = await response.json();
    
    map.addSource('harim-polygon', { type: 'geojson', data: geojson });
    
    // اول Fill (پرکردن شفاف)
    map.addLayer({
        id: 'harim-polygon-fill',
        type: 'fill',
        source: 'harim-polygon',
        paint: { 'fill-color': '#ef4444', 'fill-opacity': 0.15 }
    });
    // بعد Outline (خط دور)
    map.addLayer({
        id: 'harim-polygon-outline',
        type: 'line',
        source: 'harim-polygon',
        paint: { 'line-color': '#ef4444', 'line-width': 2 }
    });
    
    layers.harimpolygon = ['harim-polygon-fill', 'harim-polygon-outline'];
}

// تابع روشن/خاموش کردن
function toggleLayer(layerName, isVisible) {
    const visibility = isVisible ? 'visible' : 'none';
    if (layerName === 'harimpolygon') {
        map.setLayoutProperty(layers.harimpolygon[0], 'visibility', visibility);
        map.setLayoutProperty(layers.harimpolygon[1], 'visibility', visibility);
    } else {
        map.setLayoutProperty(layers[layerName], 'visibility', visibility);
    }
}

// ✅ تابع استخراج نقاط برای انیمیشن از لایه مسیر پیشنهادی
function getOrderedRoutePoints() {
    const source = map.getSource('masir-pishnehadi');
    if (!source || !source._data) return [];
    
    const geojson = source._data;
    const allPoints = [];
    
    geojson.features.forEach(feature => {
        if (feature.geometry.type === 'LineString') {
            feature.geometry.coordinates.forEach(coord => {
                allPoints.push(coord); // [longitude, latitude]
            });
        }
    });
    
    return allPoints;
}

// ✅ تابع شروع انیمیشن
window.startAnimation = function() {
    if (animationState.isAnimating) {
        stopAnimation();
        return;
    }
    
    const points = getOrderedRoutePoints();
    if (points.length === 0) {
        alert('نقاطی برای پرواز یافت نشد. لطفاً بررسی کنید لایه مسیر پیشنهادی لود شده باشد.');
        return;
    }
    
    animationState.isAnimating = true;
    document.getElementById('btnAnimate').textContent = '⏸️ توقف';
    document.getElementById('btnAnimate').classList.replace('btn-primary', 'btn-warning');
    
    let currentIndex = 0;
    const step = Math.max(1, Math.floor(points.length / 60)); // نرم‌تر کردن حرکت
    
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
            zoom: 14, // زوم مناسب برای دیدن مسیر حین حرکت
            duration: 1000 / animationState.speed,
            essential: true
        });
        
        currentIndex += step;
        animationState.intervalId = setTimeout(animate, 1200 / animationState.speed);
    }
    
    animate();
};

function stopAnimation() {
    animationState.isAnimating = false;
    if (animationState.intervalId) clearTimeout(animationState.intervalId);
    document.getElementById('btnAnimate').textContent = '🎬 پرواز روی مسیر';
    document.getElementById('btnAnimate').classList.replace('btn-warning', 'btn-primary');
}

window.setAnimationSpeed = function(speed) {
    animationState.speed = speed;
};