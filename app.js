// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand(); // Разворачиваем на весь экран
tg.MainButton.hide();

// Данные (хранятся в Telegram Cloud)
let userData = {
    completedModules: [],
    currentModule: null
};

// Модули обучения
const modules = {
    1: {
        title: "Общие положения",
        content: "• Тренер подчиняется Руководителю, Старшему тренеру и Администратору\n• Приходить на работу нужно за 15 минут до занятия\n• При замене приоритет - групповые занятия\n• Отпуск согласовывается заранее, замену находишь сам",
        question: "За сколько минут нужно приходить на работу?",
        options: ["5 минут", "10 минут", "15 минут"],
        correct: 2
    },
    2: {
        title: "Внешний вид и поведение",
        content: "• Опрятный внешний вид\n• Спортивная или корпоративная форма\n• Нельзя сидеть в тренерской - нужно быть у ресепшн\n• Запрещено курение и алкоголь",
        question: "Где должен находиться тренер до начала занятия?",
        options: ["В тренерской", "У ресепшн, встречать учеников", "В танцевальном зале"],
        correct: 1
    },
    3: {
        title: "Стандарты сервиса",
        content: "• Встречать учеников у ресепшн\n• После пробного занятия - обязательно дать обратную связь родителю\n• Общаться с родителями очно до/после занятий\n• Не переходить в неформальное общение вне студии",
        question: "Что нужно сделать после пробного занятия?",
        options: ["Ничего, пусть администратор", "Поговорить с родителем и дать обратную связь", "Отправить сообщение в WhatsApp"],
        correct: 1
    },
    4: {
        title: "Запрещенные действия",
        content: "❌ ЗАПРЕЩЕНО:\n• Опаздывать на занятия\n• Сидеть в тренерской до последнего\n• Оставлять детей без присмотра\n• Допускать третьих лиц без согласования\n• Самостоятельно регистрировать на соревнования\n• Неформальное общение с родителями",
        question: "Что из перечисленного ЗАПРЕЩЕНО тренеру?",
        options: ["Общаться с родителями после занятия", "Сидеть в тренерской до последнего момента", "Проветривать зал перед занятием"],
        correct: 1
    },
    5: {
        title: "Штрафы",
        content: "💰 ШТРАФЫ:\n• Опоздание: 500₽ за каждые 15 мин\n• Опоздание на группу: ×2 от ставки\n• Игнорирование поручений: 1000₽ (повторно 2000₽)\n• Отмена занятия за <4 часов: 2000₽",
        question: "Какой штраф за игнорирование поручения администратора?",
        options: ["500₽", "1000₽", "Увольнение"],
        correct: 1
    },
    6: {
        title: "Премии",
        content: "🎁 ПРЕМИИ:\n• 1000₽ - соблюдение всех пунктов инструкции за месяц\n• 1000₽ - помощь на мероприятиях\n• Бонус за количество клиентов (от 5 и от 10 человек)",
        question: "Какая премия выплачивается за соблюдение всех пунктов инструкции?",
        options: ["500₽", "1000₽", "2000₽"],
        correct: 1
    },
    7: {
        title: "KPI тренера",
        content: "📊 Основные показатели:\n• Посещаемость групп\n• Удержание учеников\n• Рост численности группы\n• Участие в мероприятиях\n• Качество подготовки учеников",
        question: "Что входит в KPI тренера?",
        options: ["Только посещаемость", "Посещаемость, удержание, рост численности", "Только участие в мероприятиях"],
        correct: 1
    },
    8: {
        title: "Безопасность",
        content: "🛡️ ПРАВИЛА БЕЗОПАСНОСТИ:\n• Не запускать детей в зал одних\n• Не трогать зеркала и стены\n• Проветривание и контроль температуры\n• После занятия выключить аппаратуру, убрать инвентарь",
        question: "Какое правило безопасности является обязательным?",
        options: ["Можно оставить детей на 5 минут", "Нельзя запускать детей в зал одних", "Дети могут сами включать музыку"],
        correct: 1
    }
};

// Загрузка данных
function loadData() {
    const saved = tg.initDataUnsafe?.user?.id;
    if (saved) {
        const stored = localStorage.getItem(`saxar_progress_${saved}`);
        if (stored) {
            userData = JSON.parse(stored);
        }
    }
    updateProgress();
}

// Сохранение данных
function saveData() {
    const userId = tg.initDataUnsafe?.user?.id;
    if (userId) {
        localStorage.setItem(`saxar_progress_${userId}`, JSON.stringify(userData));
    }
}

// Обновление прогресса
function updateProgress() {
    const total = Object.keys(modules).length;
    const completed = userData.completedModules.length;
    const percent = Math.round((completed / total) * 100);
    
    document.getElementById('progressFill').style.width = `${percent}%`;
    document.getElementById('progressText').innerHTML = `Прогресс: ${completed}/${total} модулей (${percent}%)`;
}

// Отображение модулей
function renderModules() {
    const grid = document.getElementById('modulesGrid');
    grid.innerHTML = '';
    
    for (let [id, module] of Object.entries(modules)) {
        const isCompleted = userData.completedModules.includes(parseInt(id));
        const card = document.createElement('div');
        card.className = `module-card ${isCompleted ? 'completed' : ''}`;
        card.innerHTML = `
            <h3>
                Модуль ${id}: ${module.title}
                <span class="module-status">${isCompleted ? '✅' : '📚'}</span>
            </h3>
            <p>${module.content.substring(0, 100)}...</p>
            <div class="module-content" id="module-${id}-content">
                <div class="test-question">
                    <strong>❓ ${module.question}</strong>
                    <div class="test-options">
                        ${module.options.map((opt, idx) => `
                            <button class="test-option" data-module="${id}" data-option="${idx}">
                                ${String.fromCharCode(65 + idx)}. ${opt}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        // Обработчик клика на карточку
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('test-option')) {
                const content = card.querySelector('.module-content');
                content.classList.toggle('active');
            }
        });
        
        // Обработчики ответов
        card.querySelectorAll('.test-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const moduleId = parseInt(btn.dataset.module);
                const option = parseInt(btn.dataset.option);
                checkAnswer(moduleId, option);
            });
        });
        
        grid.appendChild(card);
    }
}

// Проверка ответа
function checkAnswer(moduleId, option) {
    const isCorrect = (option === modules[moduleId].correct);
    
    if (isCorrect) {
        if (!userData.completedModules.includes(moduleId)) {
            userData.completedModules.push(moduleId);
            saveData();
            updateProgress();
            
            tg.showPopup({
                title: "✅ Правильно!",
                message: `Модуль ${moduleId} пройден!`,
                buttons: [{type: "ok"}]
            });
            
            renderModules();
        }
    } else {
        tg.showPopup({
            title: "❌ Неправильно",
            message: `Правильный ответ: ${String.fromCharCode(65 + modules[moduleId].correct)}. ${modules[moduleId].options[modules[moduleId].correct]}\n\nПовтори материал и попробуй снова.`,
            buttons: [{type: "ok"}]
        });
    }
}

// Переключение табов
function setupTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;
            
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            contents.forEach(content => content.classList.remove('active'));
            document.getElementById(`${tabId}Tab`).classList.add('active');
        });
    });
}

// Обратная связь
function setupFeedback() {
    const btn = document.getElementById('feedbackBtn');
    btn.addEventListener('click', () => {
        tg.showPopup({
            title: "❓ Задать вопрос",
            message: "Напишите свой вопрос администратору",
            buttons: [
                {type: "default", text: "Отправить вопрос"},
                {type: "cancel"}
            ]
        }, (buttonId) => {
            if (buttonId === 0) {
                // Отправляем вопрос в Telegram бот
                tg.sendData(JSON.stringify({
                    type: 'question',
                    text: 'Тренер задает вопрос через Mini App'
                }));
                
                tg.showAlert("Вопрос отправлен администратору! Ответ придет в ближайшее время.");
            }
        });
    });
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderModules();
    setupTabs();
    setupFeedback();
    
    // Настраиваем цвета под тему Telegram
    tg.setBackgroundColor(tg.themeParams.bg_color);
    tg.setHeaderColor(tg.themeParams.bg_color);
});
