// ============================================
// MapLibre GL JS - راه‌اندازی نقشه
// ============================================

// ✅ بدون نیاز به توکن!
// در js/map.js، style را تغییر بده:

const map = new maplibregl.Map({
    container: 'map',
    // ✅ نقشه ماهواره‌ای Esri
    style: {
        version: 8,
        sources: {
            'esri-satellite': {
                type: 'raster',
                tiles: [
                    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                ],
                tileSize: 256,
                attribution: '© Esri'
            }
        },
        layers: [
            {
                id: 'esri-satellite',
                type: 'raster',
                source: 'esri-satellite',
                paint: {
                    'raster-opacity': 1.0
                }
            }
        ]
    },
    center: [59.5734, 36.2976],
    zoom: 10
});

// کنترل‌های نقشه
map.addControl(new maplibregl.NavigationControl(), 'bottom-right');
map.addControl(new maplibregl.ScaleControl({
    maxWidth: 150,
    unit: 'metric'
}), 'bottom-left');

// ذخیره به صورت global
window.map = map;

// رویداد لود نقشه
map.on('load', () => {
    console.log('✅ نقشه MapLibre بارگذاری شد');
    
    // فعال‌سازی توابع بعد از لود
    if (window.onMapLoad) {
        window.onMapLoad();
    }
});

// تابع برای پرش به مرکز مشهد
window.flyToMashhad = function() {
    map.flyTo({
        center: [59.5734, 36.2976],
        zoom: 10,
        pitch: 0,
        duration: 2000
    });
};