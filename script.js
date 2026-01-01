document.addEventListener('DOMContentLoaded', () => {

    // ---------------------------------------------------------
    // 8. FILE DOWNLOAD SIMULATION
    // ---------------------------------------------------------
    
    // We attach this to window so buttons can call onclick="simulateDownload()"
    window.simulateDownload = function(filename) {
        
        // 1. Show "Downloading..." Modal
        if(typeof window.showModal === "function") {
            window.showModal("Downloading...", "Fetching " + filename + " from the server. Please wait...");
        } else {
            alert("Downloading " + filename + "...");
        }

        // 2. Simulate Delay (1.5 seconds)
        setTimeout(() => {
            
            // 3. Create a Dummy File on the fly
            const textContent = "This is a placeholder file for the CBSE Web Development Project.\n\nFile Name: " + filename + "\nDate: " + new Date().toLocaleString();
            
            // Create a blob (a virtual file in memory)
            const blob = new Blob([textContent], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            
            // Create a hidden link and click it
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename + ".txt"; // Appending .txt so it opens easily
            document.body.appendChild(a);
            
            a.click(); // TRIGGER DOWNLOAD
            
            // Cleanup
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            // 4. Close the "Downloading" modal and show Success
            if(typeof window.closeModal === "function") {
                window.closeModal();
                // Optional: Show success message briefly
                // setTimeout(() => window.showModal("Success", "Download Completed!"), 200);
            }

        }, 1500); // 1.5 second delay
    };
    const root = document.documentElement;

    // =========================================================
    // 1. DARK MODE LOGIC
    // =========================================================
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        if(themeBtn) themeBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                themeBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
            } else {
                localStorage.setItem('theme', 'light');
                themeBtn.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
            }
        });
    }

    // =========================================================
    // 2. FONT SIZE LOGIC
    // =========================================================
    const btnInc = document.getElementById('font-increase');
    const btnDec = document.getElementById('font-decrease');
    const btnReset = document.getElementById('font-reset');
    let currentSize = 16;

    const savedSize = localStorage.getItem('fontSize');
    if (savedSize) {
        currentSize = parseInt(savedSize);
        root.style.setProperty('--base-size', currentSize + 'px');
    }

    if (btnInc) btnInc.addEventListener('click', () => { if (currentSize < 24) { currentSize += 2; updateSize(); } });
    if (btnDec) btnDec.addEventListener('click', () => { if (currentSize > 12) { currentSize -= 2; updateSize(); } });
    if (btnReset) btnReset.addEventListener('click', () => { currentSize = 16; updateSize(); });

    function updateSize() {
        root.style.setProperty('--base-size', currentSize + 'px');
        localStorage.setItem('fontSize', currentSize);
    }

    // =========================================================
    // 3. FONT STYLE LOGIC
    // =========================================================
    const fontSelect = document.getElementById('font-selector');
    const savedFont = localStorage.getItem('fontStyle');
    if (savedFont && fontSelect) {
        fontSelect.value = savedFont;
        applyFont(savedFont);
    }
    if (fontSelect) {
        fontSelect.addEventListener('change', (e) => {
            applyFont(e.target.value);
            localStorage.setItem('fontStyle', e.target.value);
        });
    }

    function applyFont(type) {
        let fontStack;
        switch(type) {
            case 'serif': fontStack = "'Times New Roman', serif"; break;
            case 'mono': fontStack = "'Courier New', monospace"; break;
            case 'readable': fontStack = "Verdana, sans-serif"; break;
            default: fontStack = "'Segoe UI', sans-serif";
        }
        root.style.setProperty('--main-font', fontStack);
    }

    // =========================================================
    // 4. NAV HIGHLIGHT
    // =========================================================
    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                navLinks.forEach(n => n.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // =========================================================
    // 5. TABBED INTERFACE (Main Website)
    // =========================================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                button.classList.add('active');
                const targetContent = document.getElementById(button.getAttribute('data-tab'));
                if (targetContent) targetContent.classList.add('active');
            });
        });
    }

    // =========================================================
    // 6. RESULTS PAGE LOGIC (FIXED)
    // =========================================================
    const resultForm = document.getElementById('result-form');
    const loginSection = document.getElementById('login-section');
    const markSheet = document.getElementById('mark-sheet');
    const rollDisplay = document.getElementById('display-roll');
    const backToLoginBtn = document.getElementById('back-to-login');

    if (resultForm) {
        resultForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get values safely
            const rollNo = document.getElementById('roll-no').value.trim();
            const schoolNo = document.getElementById('school-no').value.trim();
            const admitId = document.getElementById('admit-id').value.trim();
            const captchaEl = document.querySelector('.captcha-box input');
            const captchaInput = captchaEl ? captchaEl.value.trim() : ""; 

            // Validation
            if (rollNo.length !== 8 || isNaN(rollNo)) {
                showError("Invalid Roll Number", "Please enter a valid 8-digit Roll Number (e.g., 12345678).");
                return;
            }
            if (schoolNo.length !== 5 || isNaN(schoolNo)) {
                showError("Invalid School Number", "Please enter a valid 5-digit School Number (e.g., 99999).");
                return;
            }
            if (admitId.length < 6) {
                showError("Invalid Admit Card ID", "Admit Card ID is too short (min 6 chars).");
                return;
            }
            if (captchaInput.toUpperCase() !== "K9PLX") {
                showError("Captcha Error", "Security PIN does not match. Please enter 'K9PLX'.");
                return;
            }

            // Success: Switch Views
            if(loginSection) loginSection.style.display = 'none';
            if(markSheet) markSheet.style.display = 'block';
            if(rollDisplay) rollDisplay.textContent = rollNo;
        });
    }

    if (backToLoginBtn) {
        backToLoginBtn.addEventListener('click', () => {
            markSheet.style.display = 'none';
            loginSection.style.display = 'block';
            resultForm.reset();
        });
    }

    // =========================================================
    // 7. SYSTEM MODAL LOGIC & ERROR HANDLER (FIXED)
    // =========================================================
    
    window.showModal = function(title, message) {
        const modal = document.getElementById('system-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalMsg = document.getElementById('modal-message');
        
        if(modal && modalTitle && modalMsg) {
            modalTitle.innerHTML = `<i class="fas fa-info-circle"></i> ${title}`;
            modalMsg.textContent = message;
            modal.style.display = 'flex';
        }
    };

    window.closeModal = function() {
        const modal = document.getElementById('system-modal');
        if(modal) modal.style.display = 'none';
    };

    const modalOverlay = document.getElementById('system-modal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) window.closeModal();
        });
    }

    // *** THE CRITICAL FIX: Fallback to Alert if Modal is missing ***
    function showError(title, message) {
        const modal = document.getElementById('system-modal');
        if (modal) {
            window.showModal(title, message);
        } else {
            // Fallback for pages (like results.html) that might lack the modal HTML
            alert(title + "\n\n" + message);
        }
    }

});