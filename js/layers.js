const layers = {};

// ✅ ترتیب لود اصلاح شد: اول مرز، بعد خطوط
async function loadMarz() {
    const dataSource = await Cesium.GeoJsonDataSource.load('data/marz.geojson');
    
    dataSource.entities.values.forEach(entity => {
        if (entity.polygon) {
            entity.polygon.material = new Cesium.ColorMaterialProperty(
                Cesium.Color.fromCssColorString('#ef4444').withAlpha(0.08)
            );
            entity.polygon.outline = true;
            entity.polygon.outlineColor = new Cesium.ConstantProperty(
                Cesium.Color.fromCssColorString('#ef4444')
            );
            entity.polygon.outlineWidth = 1;
            entity.polygon.height = new Cesium.ConstantProperty(500);
            entity.polygon.heightReference =
    new Cesium.ConstantProperty(
        Cesium.HeightReference.RELATIVE_TO_GROUND
    );
            entity.polygon.perPositionHeight = false;
        }
    });

    viewer.dataSources.add(dataSource);
    layers.marz = dataSource;
    
    console.log('✅ لایه مرز مشهد بارگذاری شد');
}

// ۱. لایه شبکه پیشنهادی (نارنجی)
async function loadPishnahad() {
    const dataSource = await Cesium.GeoJsonDataSource.load('data/pishnahad.geojson', {
        stroke: Cesium.Color.ORANGE,
        strokeWidth: 4,
        fill: Cesium.Color.TRANSPARENT
    });
    
    dataSource.entities.values.forEach(entity => {
        if (entity.polyline) {
            entity.polyline.width = 5;
            entity.polyline.material = Cesium.Color.ORANGE;
            entity.polyline.clampToGround = true;
        }
    });

    viewer.dataSources.add(dataSource);
    layers.pishnahad = dataSource;
}

// ۲. لایه شبکه موجود (آبی فیروزه‌ای)
async function loadMojood() {
    const dataSource = await Cesium.GeoJsonDataSource.load('data/mojood.geojson', {
        stroke: Cesium.Color.CYAN,
        strokeWidth: 3,
        fill: Cesium.Color.TRANSPARENT
    });
    
    dataSource.entities.values.forEach(entity => {
        if (entity.polyline) {
            entity.polyline.width = 4;
            entity.polyline.material = Cesium.Color.CYAN;
            entity.polyline.clampToGround = true;
        }
    });

    viewer.dataSources.add(dataSource);
    layers.mojood = dataSource;
}

// تابع روشن/خاموش کردن لایه‌ها
function toggleLayer(layerName, isVisible) {
    if (layers[layerName]) {
        layers[layerName].show = isVisible;
    }
}