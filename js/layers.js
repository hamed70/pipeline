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

// ✅ لایه نامرئی برای پرواز (Flight Path)
async function loadInvisibleFlightPath() {
    try {
        const flightPathGeoJSON = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "id": 1,
                    "geometry": {
                        "type": "LineString",
                        "coordinates": [
                            [59.70553249057415, 36.315647991413179],
                            [59.703272918832134, 36.319441299191681],
                            [59.701166513578698, 36.3217077886857],
                            [59.699194968887085, 36.323211807130541],
                            [59.6957309637001, 36.325235970531658],
                            [59.690381578603102, 36.328299217572443],
                            [59.68774538648934, 36.329675637062458],
                            [59.681766912366804, 36.332372968348317],
                            [59.67666891802223, 36.334670580659498],
                            [59.670856525903361, 36.337529772455305],
                            [59.662423310643327, 36.341617084632801],
                            [59.656523694514782, 36.344512660913885],
                            [59.651468559217562, 36.347560276020808],
                            [59.645840692067168, 36.350870559641905],
                            [59.640344509534799, 36.354075362917506],
                            [59.637099794000562, 36.355739396243713],
                            [59.630819895574085, 36.358473520125045],
                            [59.62656567037024, 36.360791977283185],
                            [59.619379462466853, 36.365533676575552],
                            [59.615917464150485, 36.368611579118465],
                            [59.612645794101319, 36.371685219940105],
                            [59.610708496988636, 36.372985355151066],
                            [59.590809740948039, 36.382301032857292],
                            [59.571027655418376, 36.391516764958823],
                            [59.557047332116902, 36.399764888098531],
                            [59.55404082645709, 36.401632853114037],
                            [59.54390641954123, 36.412825850487209],
                            [59.541923735246009, 36.4146294197296],
                            [59.536322665881421, 36.4180302169406],
                            [59.52604409533307, 36.423643457238256],
                            [59.523565474624618, 36.424209096911298],
                            [59.52211634733267, 36.424346526536361],
                            [59.52054101232185, 36.424213692531076],
                            [59.519323233113688, 36.423963154649563],
                            [59.517635691741887, 36.423361359749755],
                            [59.516211565673359, 36.42245400051285],
                            [59.514854712381727, 36.421355351852398],
                            [59.51197670915888, 36.418526644174221]
                        ]
                    },
                    "properties": {
                        "OBJECTID": 1,
                        "Shape_Length": 21825.76194934309
                    }
                }
            ]
        };

        const sourceId = 'invisible-flight-path';
        const layerId = 'invisible-flight-path-line';
        
        if (map.getSource(sourceId)) {
            map.getSource(sourceId).setData(flightPathGeoJSON);
        } else {
            map.addSource(sourceId, { 
                type: 'geojson', 
                data: flightPathGeoJSON 
            });
        }
        
        // ✅ لایه کاملاً نامرئی (opacity: 0)
        if (!map.getLayer(layerId)) {
            map.addLayer({
                id: layerId,
                type: 'line',
                source: sourceId,
                paint: { 
                    'line-color': '#ffffff',
                    'line-width': 0,        // ✅ عرض خط صفر
                    'line-opacity': 0       // ✅ شفافیت کامل (نامرئی)
                }
            });
        }
        
        layers.flightPath = layerId;
        console.log('✅ لایه نامرئی پرواز بارگذاری شد');
    } catch (error) {
        console.error('❌ خطا در بارگذاری لایه پرواز:', error);
    }
}

// ۱. مسیر ۶۵ متری پیشنهادی (سبز)
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
        
        map.on('click', layerId, (e) => {
            showPopup(e.lngLat, e.features[0].properties, 'مسیر ۶۵ متری پیشنهادی');
        });
        map.on('mouseenter', layerId, () => {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', layerId, () => {
            map.getCanvas().style.cursor = '';
        });
        
        layers.masir = layerId;
        console.log('✅ لایه مسیر پیشنهادی بارگذاری شد');
    } catch (error) {
        console.error('❌ خطا در بارگذاری مسیر پیشنهادی:', error);
    }
}

// ۲. حریم ۰ متری (نارنجی)
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
        console.error('❌ خطا در بارگذاری حریم ۲۰ متری:', error);
    }
}

// ۳. حریم ۲۰ متری (آبی)
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

// . حریم ۷ متری (قرمز - پلی‌گان)
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
        console.error(' خطا در بارگذاری حریم ۷ متری:', error);
    }
}

// تابع بازبارگذاری همه لایه‌ها
window.reloadAllLayers = async function() {
    console.log('🔄 در حال بازبارگذاری لایه‌ها...');
    
    await loadInvisibleFlightPath();  // ✅ لایه نامرئی
    await loadHarim200();
    await loadHarim7();
    await loadHarim20();
    await loadMasirPishnahadi();
    
    console.log('✅ همه لایه‌ها بازبارگذاری شدند');
};

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

// ✅ تابع استخراج نقاط برای انیمیشن از لایه نامرئی
function getOrderedRoutePoints() {
    const source = map.getSource('invisible-flight-path');
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
    
    // مرتب‌سازی از شرق به غرب (longitude از بزرگتر به کوچکتر)
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