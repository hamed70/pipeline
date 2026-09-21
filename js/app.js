function initApp() {
    if (!map.isStyleLoaded()) {
        map.on('load', initLayers);
    } else {
        initLayers();
    }
}

function initLayers() {
    console.log('در حال بارگذاری لایه‌های جدید...');
    
    // بارگذاری همزمان همه لایه‌ها
    Promise.all([
        loadMasirPishnehadi(),
        loadHarim20(),
        loadHarimPolyline(),
        loadHarimPolygon()
    ]).then(() => {
        console.log('✅ همه لایه‌ها با موفقیت بارگذاری شدند');
        
        // ✅ تنظیم نمای اولیه نقشه روی محدوده داده‌ها (مرکز مشهد/محدوده پروژه)
        map.jumpTo({
            center: [59.5, 36.4], // مرکز تقریبی مختصات داده‌های شما
            zoom: 11
        });
        
        setupEventListeners();
        checkMobileAndMinimize();
    }).catch(err => {
        console.error('❌ خطا در بارگذاری لایه‌ها:', err);
        alert('خطا در خواندن فایل‌های GeoJSON. لطفاً نام فایل‌ها و پوشه data را بررسی کنید.');
    });
}

function setupEventListeners() {
    // اتصال چک‌باکس‌ها به لایه‌های جدید
    document.getElementById('lyr-masir').addEventListener('change', (e) => toggleLayer('masir', e.target.checked));
    document.getElementById('lyr-harim-20').addEventListener('change', (e) => toggleLayer('harim20', e.target.checked));
    document.getElementById('lyr-harim-poly').addEventListener('change', (e) => toggleLayer('harimpoly', e.target.checked));
    document.getElementById('lyr-harim-polygon').addEventListener('change', (e) => toggleLayer('harimpolygon', e.target.checked));
    
    // دکمه بازنشانی نما
    document.getElementById('btnReset').addEventListener('click', () => {
        map.flyTo({ center: [59.5, 36.4], zoom: 11, duration: 2000 });
    });
    
    // دکمه انیمیشن
    document.getElementById('btnAnimate').addEventListener('click', () => window.startAnimation());
    
    // دکمه‌های سرعت
    document.querySelectorAll('.speed-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const speed = parseFloat(e.target.dataset.speed);
            window.setAnimationSpeed(speed);
            document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
        });
    });
    
    // دکمه‌های جمع‌کردن پنل‌ها
    document.getElementById('toggleLayerPanel').addEventListener('click', () => {
        document.getElementById('layerPanel').classList.toggle('minimized');
    });
    document.getElementById('toggleToolbar').addEventListener('click', () => {
        document.getElementById('toolbar').classList.toggle('minimized');
    });
}

function checkMobileAndMinimize() {
    if (window.innerWidth <= 768) {
        document.getElementById('layerPanel').classList.add('minimized');
        document.getElementById('toolbar').classList.add('minimized');
    }
}

window.addEventListener('load', initApp);
window.addEventListener('resize', checkMobileAndMinimize);