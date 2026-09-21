// ============================================
// Flight Mode - پرواز سینمایی روی خط لوله
// ============================================

let flightState = {
    isFlying: false,
    isPaused: false,
    currentKeyframe: 0,
    keyframes: [],
    speed: 1,
    animationId: null
};

// ساخت keyframes برای پرواز
function buildFlightKeyframes() {
    const keyframes = [];
    
    const targetLayer = layers.pishnahad || layers.mojood;
    if (!targetLayer) {
        console.error('❌ هیچ لایه‌ای برای پرواز وجود ندارد');
        return keyframes;
    }

    const allPositions = [];
    targetLayer.entities.values.forEach(entity => {
        if (entity.polyline) {
            const positions = entity.polyline.positions.getValue(Cesium.JulianDate.now());
            positions.forEach(pos => {
                const cartographic = Cesium.Cartographic.fromCartesian(pos);
                allPositions.push({
                    longitude: cartographic.longitude,
                    latitude: cartographic.latitude,
                    height: cartographic.height
                });
            });
        }
    });

    if (allPositions.length === 0) {
        console.error('❌ هیچ نقطه‌ای در لایه یافت نشد');
        return keyframes;
    }

    console.log(`✅ ${allPositions.length} نقطه برای پرواز یافت شد`);

    const step = Math.max(1, Math.floor(allPositions.length / 50));
    
    for (let i = 0; i < allPositions.length; i += step) {
        const point = allPositions[i];
        
        // ✅ ارتفاع دوربین افزایش یافت: 800 متر به جای 300 متر
        const cameraHeight = point.height + 1500;
        
        let heading = 0;
        if (i + step < allPositions.length) {
            const nextPoint = allPositions[i + step];
            heading = Math.atan2(
                nextPoint.longitude - point.longitude,
                nextPoint.latitude - point.latitude
            );
        }
        
        keyframes.push({
            position: Cesium.Cartesian3.fromRadians(
                point.longitude,
                point.latitude,
                cameraHeight
            ),
            orientation: {
                heading: heading,
                // ✅ زاویه نگاه اصلاح شد: -15 درجه به جای -25 درجه
                pitch: Cesium.Math.toRadians(-15),
                roll: 0.0
            },
            duration: 2
        });
    }

    return keyframes;
}

// شروع پرواز
function startFlight() {
    if (flightState.isFlying) {
        console.log('پرواز در حال انجام است');
        return;
    }

    flightState.keyframes = buildFlightKeyframes();
    
    if (flightState.keyframes.length === 0) {
        alert('خطا در ساخت مسیر پرواز');
        return;
    }

    flightState.isFlying = true;
    flightState.isPaused = false;
    flightState.currentKeyframe = 0;

    document.getElementById('btnFlight').textContent = '⏸️ توقف پرواز';
    document.getElementById('btnFlight').classList.remove('btn-secondary');
    document.getElementById('btnFlight').classList.add('btn-warning');
    document.getElementById('btnReset').disabled = true;

    flyToNextKeyframe();
}

// پرواز به keyframe بعدی
function flyToNextKeyframe() {
    if (!flightState.isFlying || flightState.isPaused) {
        return;
    }

    if (flightState.currentKeyframe >= flightState.keyframes.length) {
        stopFlight();
        alert('✅ پرواز تمام شد!');
        return;
    }

    const keyframe = flightState.keyframes[flightState.currentKeyframe];
    const duration = keyframe.duration / flightState.speed;

    viewer.camera.flyTo({
        destination: keyframe.position,
        orientation: keyframe.orientation,
        duration: duration,
        complete: () => {
            flightState.currentKeyframe++;
            flyToNextKeyframe();
        },
        cancel: () => {
            // ✅ اصلاح حلقه بی‌نهایت: فقط state را به‌روز کن، stopFlight را صدا نزن
            console.log('پرواز لغو شد');
            flightState.isFlying = false;
            flightState.isPaused = false;
            flightState.currentKeyframe = 0;
            
            document.getElementById('btnFlight').textContent = '🎬 پرواز خودکار';
            document.getElementById('btnFlight').classList.remove('btn-warning');
            document.getElementById('btnFlight').classList.add('btn-secondary');
            document.getElementById('btnReset').disabled = false;
        }
    });
}

// توقف پرواز
function stopFlight() {
    const wasFlying = flightState.isFlying;
    
    flightState.isFlying = false;
    flightState.isPaused = false;
    flightState.currentKeyframe = 0;

    document.getElementById('btnFlight').textContent = '🎬 پرواز خودکار';
    document.getElementById('btnFlight').classList.remove('btn-warning');
    document.getElementById('btnFlight').classList.add('btn-secondary');
    document.getElementById('btnReset').disabled = false;

    // ✅ فقط اگر واقعاً در حال پرواز بودیم، لغو کنیم
    if (wasFlying) {
        viewer.camera.cancelFlight();
    }
}

// Pause/Resume پرواز
function togglePause() {
    if (!flightState.isFlying) {
        startFlight();
        return;
    }

    if (flightState.isPaused) {
        flightState.isPaused = false;
        document.getElementById('btnFlight').textContent = '⏸️ توقف پرواز';
        flyToNextKeyframe();
    } else {
        flightState.isPaused = true;
        document.getElementById('btnFlight').textContent = '▶️ ادامه پرواز';
        viewer.camera.cancelFlight();
    }
}

// تنظیم سرعت پرواز
function setFlightSpeed(speed) {
    flightState.speed = speed;
    console.log(`سرعت پرواز تنظیم شد: ${speed}x`);
}