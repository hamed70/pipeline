async function initApp() {
    try {
        console.log('در حال بارگذاری لایه‌ها...');
        
        // ✅ ترتیب لود اصلاح شد
        await Promise.all([
            loadMarz(),      // اول مرز
            loadPishnahad(), // بعد خطوط
            loadMojood()
        ]);
        
        console.log('✅ همه لایه‌ها با موفقیت بارگذاری شدند.');

        // اتصال چک‌باکس‌ها
        document.getElementById('lyr-pishnahad').addEventListener('change', (e) => {
            toggleLayer('pishnahad', e.target.checked);
        });
        
        document.getElementById('lyr-mojood').addEventListener('change', (e) => {
            toggleLayer('mojood', e.target.checked);
        });
        
        document.getElementById('lyr-marz').addEventListener('change', (e) => {
            toggleLayer('marz', e.target.checked);
        });

        // دکمه بازنشانی
        document.getElementById('btnReset').addEventListener('click', () => {
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(59.5734, 36.2976, 120000),
                orientation: {
                    heading: Cesium.Math.toRadians(0),
                    pitch: Cesium.Math.toRadians(-90),
                    roll: 0.0
                },
                duration: 2
            });
        });

        // اتصال دکمه Flight Mode
        document.getElementById('btnFlight').addEventListener('click', () => {
            if (flightState.isFlying) {
                togglePause();
            } else {
                startFlight();
            }
        });

        // اتصال دکمه‌های سرعت
        document.querySelectorAll('.speed-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const speed = parseFloat(e.target.dataset.speed);
                setFlightSpeed(speed);
                document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // ✅ اتصال دکمه‌های toggle
        setupToggles();

        // ✅ تشخیص موبایل و مینیمایز خودکار
        checkMobileAndMinimize();

    } catch (error) {
        console.error('❌ خطا در بارگذاری لایه‌ها:', error);
        alert('خطا در بارگذاری داده‌ها. لطفاً کنسول مرورگر (F12) را بررسی کنید.');
    }
}

// ✅ تابع toggle ساده
function setupToggles() {
    const layerPanel = document.getElementById('layerPanel');
    const toolbar = document.getElementById('toolbar');
    const toggleLayerBtn = document.getElementById('toggleLayerPanel');
    const toggleToolbarBtn = document.getElementById('toggleToolbar');

    toggleLayerBtn.addEventListener('click', () => {
        layerPanel.classList.toggle('minimized');
        toggleLayerBtn.textContent = layerPanel.classList.contains('minimized') ? '+' : '−';
    });

    toggleToolbarBtn.addEventListener('click', () => {
        toolbar.classList.toggle('minimized');
        toggleToolbarBtn.textContent = toolbar.classList.contains('minimized') ? '+' : '−';
    });
}

// ✅ تشخیص موبایل و مینیمایز خودکار
function checkMobileAndMinimize() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        document.getElementById('layerPanel').classList.add('minimized');
        document.getElementById('toolbar').classList.add('minimized');
        document.getElementById('toggleLayerPanel').textContent = '+';
        document.getElementById('toggleToolbar').textContent = '+';
    }
}

window.addEventListener('load', initApp);

// ✅ تغییر اندازه پنجره را گوش کن
window.addEventListener('resize', () => {
    checkMobileAndMinimize();
});