// ============================================
// راه‌اندازی برنامه
// ============================================

function initApp() {
    // منتظر لود نقشه بمان
    if (!map.isStyleLoaded()) {
        map.on('load', initLayers);
    } else {
        initLayers();
    }
}

function initLayers() {
    console.log('در حال بارگذاری لایه‌ها...');
    
    // بارگذاری لایه‌ها (ترتیب مهم است)
    loadMarz()
        .then(() => loadPishnahad())
        .then(() => loadMojood())
        .then(() => {
            console.log('✅ همه لایه‌ها بارگذاری شدند');
            setupEventListeners();
            checkMobileAndMinimize();
        })
        .catch(err => {
            console.error(' خطا:', err);
            alert('خطا در بارگذاری لایه‌ها');
        });
}

function setupEventListeners() {
    // چک‌باکس لایه‌ها
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
        window.flyToMashhad();
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
    setupToggles();
}

function setupToggles() {
    const layerPanel = document.getElementById('layerPanel');
    const toolbar = document.getElementById('toolbar');
    
    document.getElementById('toggleLayerPanel').addEventListener('click', () => {
        layerPanel.classList.toggle('minimized');
    });
    
    document.getElementById('toggleToolbar').addEventListener('click', () => {
        toolbar.classList.toggle('minimized');
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