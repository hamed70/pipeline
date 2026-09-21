
const satelliteStyle = {
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
            paint: { 'raster-opacity': 1.0 }
        }
    ]
};

// ✅ نقطه شروع پرواز (شرق‌ترین نقطه مسیر)
const startPoint = {
    longitude: 59.767,
    latitude: 36.306,
    zoom: 13
};

// ایجاد نقشه - ✅ مرکز روی نقطه شروع (شرق)
const map = new maplibregl.Map({
    container: 'map',
    style: satelliteStyle,
    center: [startPoint.longitude, startPoint.latitude],
    zoom: startPoint.zoom,
    pitch: 45,
    bearing: -15,
    maxZoom: 19
});

// کنترل‌ها
map.addControl(new maplibregl.NavigationControl({
    visualizePitch: true,
    showCompass: true,
    showZoom: true
}), 'bottom-right');

map.addControl(new maplibregl.ScaleControl({
    maxWidth: 150,
    unit: 'metric'
}), 'bottom-left');

window.map = map;

// ✅ پرش به نقطه شروع (شرق)
window.flyToStart = function() {
    map.flyTo({
        center: [startPoint.longitude, startPoint.latitude],
        zoom: startPoint.zoom,
        pitch: 45,
        bearing: -15,
        duration: 2000
    });
};

// رویداد لود نقشه
map.on('load', () => {
    console.log('✅ نقشه ماهواره‌ای بارگذاری شد');
    if (window.onMapLoad) window.onMapLoad();
});