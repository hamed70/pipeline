// ============================================
// مدیریت لایه‌ها در MapLibre
// ============================================

const layers = {};
let animationState = {
    isAnimating: false,
    speed: 1,
    intervalId: null
};

// ۱. لایه مرز مشهد (Polygon)
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

// . لایه شبکه پیشنهادی (LineString)
function loadPishnahad() {
    return fetch('data/pishnahad.geojson')
        .then(res => res.json())
        .then(geojson => {
            map.addSource('pishnahad', {
                type: 'geojson',
                data: geojson
            });
            
            map.addLayer({
                id: 'pishnahad',
                type: 'line',
                source: 'pishnahad',
                paint: {
                    'line-color': '#f59e0b',
                    'line-width': 4,
                    'line-opacity': 0.9
                }
            });
            
            // اضافه کردن popup روی کلیک
            map.on('click', 'pishnahad', (e) => {
                showPopup(e.lngLat, e.features[0].properties, 'شبکه پیشنهادی');
            });
            
            // تغییر cursor روی hover
            map.on('mouseenter', 'pishnahad', () => {
                map.getCanvas().style.cursor = 'pointer';
            });
            map.on('mouseleave', 'pishnahad', () => {
                map.getCanvas().style.cursor = '';
            });
            
            layers.pishnahad = 'pishnahad';
            console.log('✅ لایه شبکه پیشنهادی اضافه شد');
        });
}

// . لایه شبکه موجود (LineString)
function loadMojood() {
    return fetch('data/mojood.geojson')
        .then(res => res.json())
        .then(geojson => {
            map.addSource('mojood', {
                type: 'geojson',
                data: geojson
            });
            
            map.addLayer({
                id: 'mojood',
                type: 'line',
                source: 'mojood',
                paint: {
                    'line-color': '#06b6d4',
                    'line-width': 3,
                    'line-opacity': 0.9
                }
            });
            
            map.on('click', 'mojood', (e) => {
                showPopup(e.lngLat, e.features[0].properties, 'شبکه موجود');
            });
            
            map.on('mouseenter', 'mojood', () => {
                map.getCanvas().style.cursor = 'pointer';
            });
            map.on('mouseleave', 'mojood', () => {
                map.getCanvas().style.cursor = '';
            });
            
            layers.mojood = 'mojood';
            console.log('✅ لایه شبکه موجود اضافه شد');
        });
}

// تابع روشن/خاموش کردن لایه‌ها
function toggleLayer(layerName, isVisible) {
    if (layers[layerName]) {
        if (layerName === 'marz') {
            map.setLayoutProperty(layers.marz.fill, 'visibility', isVisible ? 'visible' : 'none');
            map.setLayoutProperty(layers.marz.line, 'visibility', isVisible ? 'visible' : 'none');
        } else {
            map.setLayoutProperty(layers[layerName], 'visibility', isVisible ? 'visible' : 'none');
        }
    }
}

// تابع حرکت خودکار (جایگزین Flight Mode)
// تابع حرکت خودکار با ترتیب صحیح
window.startAnimation = function() {
    if (animationState.isAnimating) {
        stopAnimation();
        return;
    }
    
    animationState.isAnimating = true;
    document.getElementById('btnAnimate').textContent = '⏸️ توقف';
    document.getElementById('btnAnimate').classList.remove('btn-primary');
    document.getElementById('btnAnimate').classList.add('btn-warning');
    
    // ✅ دریافت نقاط با ترتیب صحیح
    const orderedPoints = getOrderedRoutePoints();
    
    if (orderedPoints.length === 0) {
        console.error('هیچ نقطه‌ای یافت نشد');
        stopAnimation();
        return;
    }
    
    let currentIndex = 0;
    
    function animate() {
        if (!animationState.isAnimating) return;
        
        if (currentIndex >= orderedPoints.length) {
            // پایان مسیر - برگشت به ابتدا
            currentIndex = 0;
        }
        
        const point = orderedPoints[currentIndex];
        
        // محاسبه zoom مناسب بر اساس تراکم نقاط
        const zoom = 14;
        
        map.flyTo({
            center: point,
            zoom: zoom,
            duration: 1000 / animationState.speed,
            essential: true,
            easing: (t) => t // حرکت یکنواخت
        });
        
        currentIndex++;
        animationState.intervalId = setTimeout(animate, 1500 / animationState.speed);
    }
    
    animate();
};

// ✅ تابع مرتب‌سازی نقاط بر اساس اتصال منطقی
function getOrderedRoutePoints() {
    const source = map.getSource('pishnahad');
    if (!source || !source._data) return [];
    
    const geojson = source._data;
    const allPoints = [];
    
    // ✅ استراتژی : دنبال کردن هر LineString به ترتیب
    geojson.features.forEach((feature, index) => {
        if (feature.geometry.type === 'LineString') {
            const coords = feature.geometry.coordinates;
            
            // اضافه کردن نقاط به ترتیب
            coords.forEach((coord, i) => {
                allPoints.push({
                    lng: coord[0],
                    lat: coord[1],
                    featureIndex: index,
                    pointIndex: i
                });
            });
        }
    });
    
    // ✅ استراتژی ۲: اگر می‌خواهی بر اساس Distance مرتب کنی
    // (فرض بر این است که فیلد Distance نشان‌دهنده ترتیب است)
    const featuresWithDistance = geojson.features.filter(f => 
        f.geometry.type === 'LineString' && f.properties.Distance !== undefined
    );
    
    if (featuresWithDistance.length > 0) {
        // مرتب‌سازی بر اساس Distance
        featuresWithDistance.sort((a, b) => a.properties.Distance - b.properties.Distance);
        
        const orderedByDistance = [];
        featuresWithDistance.forEach((feature, idx) => {
            const coords = feature.geometry.coordinates;
            coords.forEach(coord => {
                orderedByDistance.push({
                    lng: coord[0],
                    lat: coord[1],
                    distance: feature.properties.Distance,
                    capacity: feature.properties.capacity
                });
            });
        });
        
        console.log(`✅ ${orderedByDistance.length} نقطه با ترتیب Distance مرتب شد`);
        return orderedByDistance;
    }
    
    console.log(`✅ ${allPoints.length} نقطه به ترتیب طبیعی مسیر یافت شد`);
    return allPoints;
}

function stopAnimation() {
    animationState.isAnimating = false;
    if (animationState.intervalId) {
        clearTimeout(animationState.intervalId);
    }
    document.getElementById('btnAnimate').textContent = '🎬 حرکت خودکار';
    document.getElementById('btnAnimate').classList.remove('btn-warning');
    document.getElementById('btnAnimate').classList.add('btn-primary');
}

window.setAnimationSpeed = function(speed) {
    animationState.speed = speed;
};