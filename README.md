<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aura | Smart Student Dashboard</title>
    
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700&display=swap" rel="stylesheet">

    <style>
        :root {
            --bg: #030712;
            --accent: #8b5cf6;
            --accent-glow: rgba(139, 92, 246, 0.3);
            --card-bg: rgba(17, 24, 39, 0.6);
            --border: rgba(255, 255, 255, 0.08);
            --text-muted: #9ca3af;
        }

        * { 
            box-sizing: border-box; 
            font-family: 'Plus Jakarta Sans', sans-serif;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        body {
            background-color: var(--bg);
            background-image: 
                radial-gradient(at 0% 0%, rgba(139, 92, 246, 0.15) 0px, transparent 50%),
                radial-gradient(at 100% 100%, rgba(37, 99, 235, 0.1) 0px, transparent 50%);
            color: white;
            margin: 0;
            overflow: hidden;
            height: 100vh;
        }

        /* --- UI COMPONENTS --- */
        .glass-card {
            background: var(--card-bg);
            backdrop-filter: blur(16px);
            border: 1px solid var(--border);
            border-radius: 24px;
            padding: 24px;
        }

        .glass-card:hover {
            transform: translateY(-5px);
            border-color: var(--accent);
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        /* --- LAYOUT --- */
        .app-container {
            display: flex;
            height: 100vh;
            opacity: 0; /* Starts hidden for splash screen logic */
        }

        .sidebar {
            width: 280px;
            background: rgba(3, 7, 18, 0.8);
            backdrop-filter: blur(20px);
            border-right: 1px solid var(--border);
            padding: 40px 24px;
            display: flex;
            flex-direction: column;
        }

        .main-content {
            flex: 1;
            padding: 40px;
            overflow-y: auto;
        }

        /* --- SPLASH SCREEN --- */
        #splash {
            position: fixed;
            inset: 0;
            background: var(--bg);
            z-index: 1000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        .loader {
            width: 50px;
            height: 50px;
            border: 3px solid transparent;
            border-top-color: var(--accent);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* --- BENTO GRID --- */
        .bento-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-top: 30px;
        }

        .span-2 { grid-column: span 2; }
        .span-4 { grid-column: span 4; }

        /* --- INTERACTIVE ELEMENTS --- */
        .fab {
            position: fixed;
            bottom: 40px;
            right: 40px;
            background: var(--accent);
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 0 20px var(--accent-glow);
        }
    </style>
</head>
<body>

    <div id="splash">
        <div class="loader"></div>
        <h2 class="mt-4 font-semibold tracking-widest text-sm">AURA INITIALIZING</h2>
    </div>

    <div class="app-container" id="appShell">
        <aside class="sidebar">
            <div class="text-2xl font-bold mb-12 tracking-tighter text-purple-500">AURA PRO</div>
            <nav class="space-y-4">
                <div class="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 cursor-pointer">Dashboard</div>
                <div class="p-3 hover:bg-white/5 rounded-xl text-gray-400 cursor-pointer">Tutorials</div>
                <div class="p-3 hover:bg-white/5 rounded-xl text-gray-400 cursor-pointer">Skill Exchange</div>
            </nav>
            
            <div class="mt-auto flex items-center gap-3 p-4 glass-card">
                <img src="profile.jpg" class="w-10 h-10 rounded-full border border-purple-500/50" alt="Dev">
                <div>
                    <div class="text-xs font-bold">Gowtham Raju</div>
                    <div class="text-[10px] text-gray-500">249Y1A0575</div>
                </div>
            </div>
        </aside>

        <main class="main-content">
            <header class="flex justify-between items-center">
                <div>
                    <h1 class="text-3xl font-bold tracking-tight">Academic Pulse</h1>
                    <p class="text-gray-500 text-sm mt-1" id="dateDisplay"></p>
                </div>
                <div class="glass-card py-2 px-4 text-xs font-semibold text-green-400 border-green-500/20">
                    SYSTEM SECURE • CLOUD AUTH ACTIVE
                </div>
            </header>

            <div class="bento-grid">
                <div class="glass-card">
                    <div class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Completion</div>
                    <div class="text-3xl font-bold mt-2"><span id="compRate">0</span>%</div>
                    <div class="w-full bg-white/5 h-1.5 mt-4 rounded-full overflow-hidden">
                        <div id="progressBar" class="bg-purple-500 h-full w-0"></div>
                    </div>
                </div>

                <div class="glass-card">
                    <div class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Focus Score</div>
                    <div class="text-3xl font-bold mt-2">84.2</div>
                </div>

                <div class="glass-card span-2 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-purple-500/30">
                    <div class="text-[10px] font-bold text-purple-300 uppercase tracking-widest">Aura Insight</div>
                    <h3 class="text-lg font-semibold mt-2" id="insightTitle">Analyzing data...</h3>
                    <p class="text-xs text-gray-400 mt-1" id="insightText">Add tasks to see your personalized advisor.</p>
                </div>

                <div class="glass-card span-4">
                    <div class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Productivity Trend</div>
                    <canvas id="productivityChart" height="100"></canvas>
                </div>
            </div>
        </main>
    </div>

    <div class="fab" onclick="addNewTask()">+</div>

    <script>
        // 1. Initialize Date
        document.getElementById('dateDisplay').innerText = new Date().toDateString().toUpperCase();

        // 2. Splash Screen Logic
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.getElementById('splash').style.opacity = '0';
                document.getElementById('appShell').style.opacity = '1';
                setTimeout(() => document.getElementById('splash').remove(), 600);
            }, 1500);
        });

        // 3. Task & State Management
        let tasks = [];
        function addNewTask() {
            const taskName = prompt("Enter Study Goal:");
            if (taskName) {
                tasks.push({ name: taskName, done: false });
                updateState();
            }
        }

        function updateState() {
            const total = tasks.length;
            const completed = tasks.filter(t => t.done).length;
            const rate = total === 0 ? 0 : Math.round((completed / total) * 100);

            document.getElementById('compRate').innerText = rate;
            document.getElementById('progressBar').style.width = rate + '%';

            // Smart Insight Logic
            const title = document.getElementById('insightTitle');
            if (total === 0) title.innerText = "Ready to start? 🚀";
            else if (rate < 50) title.innerText = "Focus Required ⚠️";
            else title.innerText = "Peak Productivity! 🎉";
        }

        // 4. Chart.js Implementation
        const ctx = document.getElementById('productivityChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    data: [65, 78, 66, 89, 92, 85, 95],
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { 
                    x: { grid: { display: false }, ticks: { color: '#4b5563' } },
                    y: { display: false } 
                }
            }
        });
    </script>
</body>
</html>
