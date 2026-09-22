function initApp() {
    if (!map.isStyleLoaded()) {
        map.on('load', initLayers);
    } else {
        initLayers();
    }
}

async function initLayers() {
    console.log('در حال بارگذاری لایه‌ها...');
    
    try {
        // اول لایه نامرئی پرواز
        await loadInvisibleFlightPath();
        
        // بعد بقیه لایه‌ها
        await loadHarim200();
        await loadHarim7();
        await loadHarim20();
        await loadMasirPishnahadi();
        
        console.log('✅ همه لایه‌ها با موفقیت بارگذاری شدند');
        
        // ✅ تنظیم نمای اولیه دقیقاً روی نقطه شروع (شرق مسیر)
        // از همان متغیر startPoint که در map.js تعریف شده استفاده می‌کنیم
        map.jumpTo({
            center: [59.70553249057415, 36.315647991413179],
            zoom: 13,
            pitch: 45,
            bearing: -15
        });
        
        setupEventListeners();
        checkMobileAndMinimize();
    } catch (error) {
        console.error('❌ خطا در بارگذاری لایه‌ها:', error);
        alert('خطا در بارگذاری لایه‌ها. لطفاً فایل‌های GeoJSON را بررسی کنید.');
    }
}

function setupEventListeners() {
    // چک‌باکس لایه‌ها
    document.getElementById('lyr-masir').addEventListener('change', (e) => {
        toggleLayer('masir', e.target.checked);
    });
    
    document.getElementById('lyr-harim-20').addEventListener('change', (e) => {
        toggleLayer('harim20', e.target.checked);
    });
    
    document.getElementById('lyr-harim-200').addEventListener('change', (e) => {
        toggleLayer('harim200', e.target.checked);
    });
    
    document.getElementById('lyr-harim-7').addEventListener('change', (e) => {
        toggleLayer('harim7', e.target.checked);
    });
    
    // دکمه بازنشانی - برمی‌گردد به نقطه شروع (شرق)
    document.getElementById('btnReset').addEventListener('click', () => {
        window.flyToStart();
    });
    
    // دکمه انیمیشن
    document.getElementById('btnAnimate').addEventListener('click', () => {
        window.startAnimation();
    });
    
    // دکمه‌های سرعت
    document.querySelectorAll('.speed-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const speed = parseFloat(e.target.dataset.speed);
            window.setAnimationSpeed(speed);
            document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
        });
    });
    
    // toggle پنل‌ها
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