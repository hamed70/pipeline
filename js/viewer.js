Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IkhkRE5UbFZwMEYyMnNxV2siLCJqdGkiOiI1MWM0ZGZiYS1lMGZmLTQxMzYtYTVlYi0xODY2ZjZiNDQzYTQiLCJpZCI6NTAzMDUwLCJzdWIiOiJoYW1lZGFhYSIsImlzcyI6Imh0dHBzOi8vYXBpLmNlc2l1bS5jb20iLCJhdWQiOiJVbnRpdGxlZCIsImlhdCI6MTc4OTk3Mzc2OH0.Gk8rkv-aWXEHjuZUjNXWUjPBflqCw1ncsV302ZKZFlo';

const viewer = new Cesium.Viewer('cesiumContainer', {
    terrain: Cesium.Terrain.fromWorldTerrain(),
    baseLayerPicker: true,
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    animation: false,
    timeline: false,
    fullscreenButton: true,
    infoBox: false,
    selectionIndicator: false
});

// تنظیمات گرافیکی
viewer.scene.globe.enableLighting = true;
viewer.scene.fog.enabled = true;
viewer.scene.fog.density = 0.0002; // ✅ کمتر برای دید بهتر از ارتفاع بالا

// ✅ مرکز دقیق مرز مشهد با ارتفاع مناسب برای دیدن کل مرز
const mashhadCenter = {
    longitude: 59.5734,
    latitude: 36.2976,
    height: 120000 // ✅ 120 کیلومتر برای دیدن کل مرز مشهد
};

// ✅ استفاده از setView برای نمای فوری (بدون انیمیشن)
viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(
        mashhadCenter.longitude,
        mashhadCenter.latitude,
        mashhadCenter.height
    ),
    orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-90), // ✅ کاملاً عمودی از بالا
        roll: 0.0
    }
});

// ✅ تعریف viewer به صورت global
window.viewer = viewer;