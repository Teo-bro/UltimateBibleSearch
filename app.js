// 전역 변수
    const versionsMeta = {
        'kr': { file: 'bible_data.json', name: '한글킹제임스', abbr: '한킹', isEn: false, data: {} },
        'en': { file: 'bible_data_en.json', name: 'KJV', abbr: 'KJV', isEn: true, data: {} },
        'hjy': { file: 'bible_data_hjy.json', name: '흠정역', abbr: '흠정', isEn: false, data: {} },
        'krv': { file: 'bible_data_krv.json', name: '개역한글', abbr: '개역', isEn: false, data: {} },
        'krv2': { file: 'bible_data_krv2.json', name: '개역개정', abbr: '개정', isEn: false, data: {} }
    };
    
    // 💡 초기 설정: 한글킹제임스성경만 뜨게 변경
    let selectedVersions = ['kr']; 

    let currentBook = null; 
    let currentChapter = null; 
    let currentVerse = null; 
    let displayMode = "standard"; 
    let searchMode = "exact"; // 💡 검색 모드 (exact, and, or)
    let isCaseSensitive = false; 
    let currentFontSize = "16px"; 
    let toastTimeout; 

    // 타임 로딩 변수
    let currentSearchResults = [];
    let currentSearchWord = "";
    let renderedResultCount = 0;
    const RENDER_CHUNK_SIZE = 200;
    let isSearchActive = false;
    let renderTimer = null;

    let historyStack = []; 
    let redoStack = [];    
    let isRestoring = false; 
    
    // 성경 책 정보
    const bibleBooks = [
        { name: "창세기", abbr: "창", enName: "Genesis", enAbbr: "Gen", chapters: 50, testament: "old" },
        { name: "출애굽기", abbr: "출", enName: "Exodus", enAbbr: "Exod", chapters: 40, testament: "old" },
        { name: "레위기", abbr: "레", enName: "Leviticus", enAbbr: "Lev", chapters: 27, testament: "old" },
        { name: "민수기", abbr: "민", enName: "Numbers", enAbbr: "Num", chapters: 36, testament: "old" },
        { name: "신명기", abbr: "신", enName: "Deuteronomy", enAbbr: "Deut", chapters: 34, testament: "old" },
        { name: "여호수아", abbr: "수", enName: "Joshua", enAbbr: "Josh", chapters: 24, testament: "old" },
        { name: "재판관기", abbr: "판", enName: "Judges", enAbbr: "Judg", chapters: 21, testament: "old" },
        { name: "룻기", abbr: "룻", enName: "Ruth", enAbbr: "Ruth", chapters: 4, testament: "old" },
        { name: "사무엘상", abbr: "삼상", enName: "1 Samuel", enAbbr: "1 Sam", chapters: 31, testament: "old" },
        { name: "사무엘하", abbr: "삼하", enName: "2 Samuel", enAbbr: "2 Sam", chapters: 24, testament: "old" },
        { name: "열왕기상", abbr: "왕상", enName: "1 Kings", enAbbr: "1 Kgs", chapters: 22, testament: "old" },
        { name: "열왕기하", abbr: "왕하", enName: "2 Kings", enAbbr: "2 Kgs", chapters: 25, testament: "old" },
        { name: "역대기상", abbr: "대상", enName: "1 Chronicles", enAbbr: "1 Chr", chapters: 29, testament: "old" },
        { name: "역대기하", abbr: "대하", enName: "2 Chronicles", enAbbr: "2 Chr", chapters: 36, testament: "old" },
        { name: "에스라", abbr: "스", enName: "Ezra", enAbbr: "Ezra", chapters: 10, testament: "old" },
        { name: "느헤미야", abbr: "느", enName: "Nehemiah", enAbbr: "Neh", chapters: 13, testament: "old" },
        { name: "에스더", abbr: "에", enName: "Esther", enAbbr: "Esth", chapters: 10, testament: "old" },
        { name: "욥기", abbr: "욥", enName: "Job", enAbbr: "Job", chapters: 42, testament: "old" },
        { name: "시편", abbr: "시", enName: "Psalms", enAbbr: "Ps", chapters: 150, testament: "old" },
        { name: "잠언", abbr: "잠", enName: "Proverbs", enAbbr: "Prov", chapters: 31, testament: "old" },
        { name: "전도서", abbr: "전", enName: "Ecclesiastes", enAbbr: "Eccl", chapters: 12, testament: "old" },
        { name: "솔로몬의 노래", abbr: "솔", enName: "Song of Solomon", enAbbr: "Song", chapters: 8, testament: "old" },
        { name: "이사야", abbr: "사", enName: "Isaiah", enAbbr: "Isa", chapters: 66, testament: "old" },
        { name: "예레미야", abbr: "렘", enName: "Jeremiah", enAbbr: "Jer", chapters: 52, testament: "old" },
        { name: "예레미야 애가", abbr: "애", enName: "Lamentations", enAbbr: "Lam", chapters: 5, testament: "old" },
        { name: "에스겔", abbr: "겔", enName: "Ezekiel", enAbbr: "Ezek", chapters: 48, testament: "old" },
        { name: "다니엘", abbr: "단", enName: "Daniel", enAbbr: "Dan", chapters: 12, testament: "old" },
        { name: "호세아", abbr: "호", enName: "Hosea", enAbbr: "Hos", chapters: 14, testament: "old" },
        { name: "요엘", abbr: "욜", enName: "Joel", enAbbr: "Joel", chapters: 3, testament: "old" },
        { name: "아모스", abbr: "암", enName: "Amos", enAbbr: "Amos", chapters: 9, testament: "old" },
        { name: "오바댜", abbr: "옵", enName: "Obadiah", enAbbr: "Obad", chapters: 1, testament: "old" },
        { name: "요나", abbr: "욘", enName: "Jonah", enAbbr: "Jonah", chapters: 4, testament: "old" },
        { name: "미카", abbr: "미", enName: "Micah", enAbbr: "Mic", chapters: 7, testament: "old" },
        { name: "나훔", abbr: "나", enName: "Nahum", enAbbr: "Nah", chapters: 3, testament: "old" },
        { name: "하박국", abbr: "합", enName: "Habakkuk", enAbbr: "Hab", chapters: 3, testament: "old" },
        { name: "스파냐", abbr: "슾", enName: "Zephaniah", enAbbr: "Zeph", chapters: 3, testament: "old" },
        { name: "학개", abbr: "학", enName: "Haggai", enAbbr: "Hag", chapters: 2, testament: "old" },
        { name: "스카랴", abbr: "슼", enName: "Zechariah", enAbbr: "Zech", chapters: 14, testament: "old" },
        { name: "말라키", abbr: "말", enName: "Malachi", enAbbr: "Mal", chapters: 4, testament: "old" },
        { name: "마태복음", abbr: "마", enName: "Matthew", enAbbr: "Matt", chapters: 28, testament: "new" },
        { name: "마가복음", abbr: "막", enName: "Mark", enAbbr: "Mark", chapters: 16, testament: "new" },
        { name: "누가복음", abbr: "눅", enName: "Luke", enAbbr: "Luke", chapters: 24, testament: "new" },
        { name: "요한복음", 파br: "요", enName: "John", enAbbr: "John", chapters: 21, testament: "new" },
        { name: "사도행전", abbr: "행", enName: "Acts", enAbbr: "Acts", chapters: 28, testament: "new" },
        { name: "로마서", abbr: "롬", enName: "Romans", enAbbr: "Rom", chapters: 16, testament: "new" },
        { name: "고린도전서", abbr: "고전", enName: "1 Corinthians", enAbbr: "1 Cor", chapters: 16, testament: "new" },
        { name: "고린도후서", abbr: "고후", enName: "2 Corinthians", enAbbr: "2 Cor", chapters: 13, testament: "new" },
        { name: "갈라디아서", abbr: "갈", enName: "Galatians", enAbbr: "Gal", chapters: 6, testament: "new" },
        { name: "에베소서", abbr: "엡", enName: "Ephesians", enAbbr: "Eph", chapters: 6, testament: "new" },
        { name: "빌립보서", abbr: "빌", enName: "Philippians", enAbbr: "Phil", chapters: 4, testament: "new" },
        { name: "골로새서", abbr: "골", enName: "Colossians", enAbbr: "Col", chapters: 4, testament: "new" },
        { name: "데살로니가전서", abbr: "살전", enName: "1 Thessalonians", enAbbr: "1 Thess", chapters: 5, testament: "new" },
        { name: "데살로니가후서", abbr: "살후", enName: "2 Thessalonians", enAbbr: "2 Thess", chapters: 3, testament: "new" },
        { name: "디모데전서", abbr: "딤전", enName: "1 Timothy", enAbbr: "1 Tim", chapters: 6, testament: "new" },
        { name: "디모데후서", abbr: "딤후", enName: "2 Timothy", enAbbr: "2 Tim", chapters: 4, testament: "new" },
        { name: "디도서", abbr: "딛", enName: "Titus", enAbbr: "Titus", chapters: 3, testament: "new" },
        { name: "빌레몬서", abbr: "몬", enName: "Philemon", enAbbr: "Phlm", chapters: 1, testament: "new" },
        { name: "히브리서", abbr: "히", enName: "Hebrews", enAbbr: "Heb", chapters: 13, testament: "new" },
        { name: "야고보서", abbr: "약", enName: "James", enAbbr: "Jas", chapters: 5, testament: "new" },
        { name: "베드로전서", abbr: "벧전", enName: "1 Peter", enAbbr: "1 Pet", chapters: 5, testament: "new" },
        { name: "베드로후서", abbr: "벧후", enName: "2 Peter", enAbbr: "2 Pet", chapters: 3, testament: "new" },
        { name: "요한일서", abbr: "요일", enName: "1 John", enAbbr: "1 John", chapters: 5, testament: "new" },
        { name: "요한이서", abbr: "요이", enName: "2 John", enAbbr: "2 John", chapters: 1, testament: "new" },
        { name: "요한삼서", abbr: "요삼", enName: "3 John", enAbbr: "3 John", chapters: 1, testament: "new" },
        { name: "유다서", abbr: "유", enName: "Jude", enAbbr: "Jude", chapters: 1, testament: "new" },
        { name: "요한계시록", abbr: "계", enName: "Revelation", enAbbr: "Rev", chapters: 22, testament: "new" }
    ];

    const abbrToName = {};
    const nameToAbbr = {};
    const bookToChapters = {};
    bibleBooks.forEach(book => {
        abbrToName[book.abbr] = book.name;
        nameToAbbr[book.name] = book.abbr;
        bookToChapters[book.name] = book.chapters;
        bookToChapters[book.abbr] = book.chapters;
    });

    document.addEventListener('DOMContentLoaded', () => {
        const fetchPromises = Object.keys(versionsMeta).map(key => 
            fetch(versionsMeta[key].file)
                .then(res => res.json())
                .then(data => {
                    data.forEach(item => {
                        let bookName = item.book;
                        if (versionsMeta[key].isEn) {
                            const bookObj = bibleBooks.find(b => b.enName.toLowerCase() === item.book.toLowerCase() || b.name === item.book);
                            if(bookObj) bookName = bookObj.name;
                        }
                        if (!versionsMeta[key].data[bookName]) versionsMeta[key].data[bookName] = {};
                        if (!versionsMeta[key].data[bookName][item.chapter]) versionsMeta[key].data[bookName][item.chapter] = {};
                        versionsMeta[key].data[bookName][item.chapter][item.verse] = item.text;
                    });
                })
                .catch(err => console.error(`${versionsMeta[key].file} 로드 실패:`, err))
        );

        Promise.all(fetchPromises).then(() => {
            document.getElementById('output-wrapper').innerHTML = ''; 
            createBookButtons();
            initDragAndDrop(); 
            updateUIBySelectedVersions(); 
            setupEventListeners();
            loadInitialData();
            document.getElementById('format-dropdown').value = displayMode;
            document.getElementById('search-mode-dropdown').value = searchMode;
        });
    });

    // 정규식 특수문자 이스케이프 함수
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // 💡 패널 생성 및 상단 복사 버튼/이름 배치
    function updateUIBySelectedVersions() {
        const wrapper = document.getElementById('output-wrapper');
        
        const prevContents = {};
        selectedVersions.forEach(v => {
            const contentEl = document.getElementById(`content-${v}`);
            if(contentEl) prevContents[v] = contentEl.innerHTML;
        });

        wrapper.innerHTML = '';

        selectedVersions.forEach(v => {
            const pane = document.createElement('div');
            pane.id = `output-${v}`;
            pane.className = 'output-pane font-malgun';
            pane.style.fontSize = currentFontSize;
            
            const meta = versionsMeta[v];
            let labelHtml = "";
            // 한킹, KJV 제외 다른 역본은 패널 상단에 라벨 추가
            if (v !== 'kr' && v !== 'en') {
                labelHtml = `<span style="font-weight:bold; margin-left:10px; color:#555;">[${meta.name}]</span>`;
            }

            let innerHTML = `
                <div class="pane-header">
                    <button class="button btn-copy" onclick="copyContent('${v}')" style="margin-left:0; padding:4px 10px; font-size:14px;">복사</button>
                    ${labelHtml}
                </div>
                <div class="pane-content" id="content-${v}">`;
            
            if(prevContents[v]) {
                innerHTML += prevContents[v];
            }
            innerHTML += `</div>`;
            
            pane.innerHTML = innerHTML;
            wrapper.appendChild(pane);
        });

        setTimeout(alignVerseHeights, 50);
    }

    // 💡 패널 안의 content 영역끼리 높이 맞추기
    function alignVerseHeights() {
        if (selectedVersions.length <= 1) {
            selectedVersions.forEach(v => {
               const c = document.getElementById(`content-${v}`);
               if(c) Array.from(c.children).forEach(el => el.style.minHeight = 'auto');
            });
            return;
        }

        const contentPanes = selectedVersions.map(v => document.getElementById(`content-${v}`));
        if(contentPanes.some(p => !p)) return;

        contentPanes.forEach(p => {
            Array.from(p.children).forEach(el => el.style.minHeight = 'auto');
        });

        const count = contentPanes[0].children.length;
        for (let i = 0; i < count; i++) {
            let maxHeight = 0;
            const rowElements = [];
            for (let j = 0; j < contentPanes.length; j++) {
                const el = contentPanes[j].children[i];
                if (el) {
                    rowElements.push(el);
                    maxHeight = Math.max(maxHeight, el.getBoundingClientRect().height);
                }
            }
            if (maxHeight > 0) {
                rowElements.forEach(el => el.style.minHeight = `${maxHeight}px`);
            }
        }
    }

    window.addEventListener('resize', () => { setTimeout(alignVerseHeights, 100); });

    function initDragAndDrop() {
        const lists = document.querySelectorAll('.dnd-list');
        lists.forEach(list => {
            list.addEventListener('dragover', e => {
                e.preventDefault();
                const afterElement = getDragAfterElement(list, e.clientY);
                const draggable = document.querySelector('.dragging');
                if (draggable) {
                    // 💡 최대 4개 제한
                    if (list.id === 'selected-versions-list' && list.children.length >= 4 && !list.contains(draggable)) {
                        return; 
                    }
                    if (afterElement == null) {
                        list.appendChild(draggable);
                    } else {
                        list.insertBefore(draggable, afterElement);
                    }
                }
            });
        });
        renderDndLists();
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.dnd-item:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function renderDndLists() {
        const selectedList = document.getElementById('selected-versions-list');
        const availableList = document.getElementById('available-versions-list');
        selectedList.innerHTML = '';
        availableList.innerHTML = '';

        Object.keys(versionsMeta).forEach(vKey => {
            const li = document.createElement('li');
            li.className = 'dnd-item';
            li.draggable = true;
            li.dataset.version = vKey;
            li.textContent = versionsMeta[vKey].name;
            
            li.addEventListener('dragstart', () => li.classList.add('dragging'));
            li.addEventListener('dragend', () => {
                li.classList.remove('dragging');
                updateSelectedVersionsFromUI();
            });

            if (selectedVersions.includes(vKey)) {
                selectedList.appendChild(li);
            } else {
                availableList.appendChild(li);
            }
        });
        
        const sortedSelected = [];
        selectedVersions.forEach(v => {
            const el = selectedList.querySelector(`[data-version="${v}"]`);
            if(el) { sortedSelected.push(el); el.remove(); }
        });
        sortedSelected.forEach(el => selectedList.appendChild(el));
    }

    function updateSelectedVersionsFromUI() {
        const selectedList = document.getElementById('selected-versions-list');
        const newSelected = [...selectedList.children].map(li => li.dataset.version);
        
        if (newSelected.length === 0) {
            showToast('⚠️ 최소 1개 이상의 역본을 선택해야 합니다.');
            renderDndLists();
            return;
        }

        if (JSON.stringify(newSelected) !== JSON.stringify(selectedVersions)) {
            selectedVersions = newSelected;
            updateUIBySelectedVersions();
            
            if (isSearchActive && currentSearchWord) {
                executeSearch(document.getElementById('search-input').value.trim()); 
            } else if (currentBook && currentChapter) {
                displayChapter(currentBook, currentChapter, currentVerse ? [currentVerse] : []);
            }
        }
    }

    function createBookButtons() {
        const sidebar = document.getElementById('bible-buttons-container');
        sidebar.innerHTML = ''; // 초기화
        let currentTestament = null;
        for (let i = 0; i < bibleBooks.length; i += 3) {
            if (currentTestament === "old" && bibleBooks[i].testament === "new") {
                const testamentGap = document.createElement('div');
                testamentGap.className = 'new-testament-gap';
                sidebar.appendChild(testamentGap);
            }
            currentTestament = bibleBooks[i].testament;
            const booksRow = document.createElement('div');
            booksRow.className = 'books-row';
            for (let j = 0; j < 3 && i + j < bibleBooks.length; j++) {
                const book = bibleBooks[i + j];
                const button = document.createElement('button');
                button.className = `book-button ${book.testament}`;
                button.textContent = book.abbr;
                button.setAttribute('data-book', book.name);
                button.addEventListener('click', () => selectBook(book.name));
                booksRow.appendChild(button);
            }
            sidebar.appendChild(booksRow);
        }
    }

    function selectBook(bookName, skipSave = false, targetChapter = 1) {
        if (!skipSave) saveState();
        currentBook = bookName;
        currentChapter = targetChapter; 
        currentVerse = null;
        document.querySelectorAll('.book-button').forEach(btn => btn.classList.remove('active'));
        const selectedBtn = document.querySelector(`.book-button[data-book="${bookName}"]`);
        if (selectedBtn) selectedBtn.classList.add('active');
        document.querySelectorAll('.chapter-container').forEach(container => container.remove());
        createChapterButtons(bookName);
        displayChapter(bookName, targetChapter);
        const chapterButtons = document.querySelectorAll('.chapter-button');
        if (chapterButtons.length > 0 && chapterButtons[targetChapter - 1]) {
            chapterButtons[targetChapter - 1].classList.add('active');
        }
        document.getElementById('navigation-buttons').classList.remove('hidden');
    }

    function createChapterButtons(bookName) {
        const bookButton = document.querySelector(`.book-button[data-book="${bookName}"]`);
        if (!bookButton) return;
        const booksRow = bookButton.parentElement;
        const chapterContainer = document.createElement('div');
        chapterContainer.className = 'chapter-container';
        const numChapters = bookToChapters[bookName];
        for (let i = 1; i <= numChapters; i++) {
            const button = document.createElement('button');
            button.className = 'chapter-button';
            button.textContent = i;
            button.setAttribute('data-chapter', i);
            button.addEventListener('click', () => selectChapter(i));
            chapterContainer.appendChild(button);
        }
        booksRow.parentElement.insertBefore(chapterContainer, booksRow.nextSibling);
    }

    function selectChapter(chapter, skipSave = false) {
        if (!skipSave) saveState();
        currentChapter = chapter;
        document.querySelectorAll('.chapter-button').forEach(btn => btn.classList.remove('active'));
        const selectedChapterBtn = document.querySelector(`.chapter-button[data-chapter="${chapter}"]`);
        if (selectedChapterBtn) selectedChapterBtn.classList.add('active');
        displayChapter(currentBook, chapter);
    }

    function displayChapter(bookName, chapter, highlightVerses = []) {
        isSearchActive = false; 
        clearTimeout(renderTimer);
        
        if (!versionsMeta['kr'].data[bookName] || !versionsMeta['kr'].data[bookName][chapter]) {
            selectedVersions.forEach(v => {
                const c = document.getElementById(`content-${v}`);
                if(c) c.innerHTML = `<p class="error" data-verse-id="header">데이터가 없습니다.</p>`;
            });
            return;
        }
        
        const verseNums = Object.keys(versionsMeta['kr'].data[bookName][chapter]).map(Number).sort((a, b) => a - b);
        
        selectedVersions.forEach(v => {
            const outContent = document.getElementById(`content-${v}`);
            if(!outContent) return;
            const meta = versionsMeta[v];
            const displayBookName = meta.isEn ? (bibleBooks.find(b => b.name === bookName)?.enName || bookName) : bookName;
            
            let html = `<h2 class="chapter-title" data-verse-id="header">${displayBookName} ${chapter}${meta.isEn ? "" : (bookName==="시편"?"편":"장")}</h2>`;
            
            for (const verseNum of verseNums) {
                const text = meta.data[bookName]?.[chapter]?.[verseNum] || "";
                const isHighlighted = highlightVerses.includes(verseNum);
                const verseNumClass = isHighlighted ? 'verse-number verse-highlight' : 'verse-number';
                const uniqueId = `verse-${bookName}-${chapter}-${verseNum}`;
                
                html += `<p data-verse-id="${uniqueId}"><span class="${verseNumClass}" style="cursor: pointer;" onclick="executeSearch('${displayBookName} ${chapter}:${verseNum}')">${verseNum}</span> ${text}</p>`;
            }
            outContent.innerHTML = html;
        });

        document.getElementById('output-wrapper').scrollTop = 0;
        
        setTimeout(() => {
            alignVerseHeights();
            if (highlightVerses.length > 0) {
                const firstHighlight = document.querySelector('.verse-highlight');
                if (firstHighlight) firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 50);
    }

    // 💡 검색 로직 (다중 단어 AND/OR 처리 및 전체 하이라이트)
    function searchWord(word) {
        saveState();
        clearTimeout(renderTimer); 
        
        let results = [];
        
        // 검색어 단어 분리
        const words = searchMode === 'exact' ? [word] : word.split(/\s+/).filter(w => w.length > 0);
        if (words.length === 0) return;

        const isEnglishSearch = /[a-zA-Z]/.test(words[0]);
        const baseVersionKey = isEnglishSearch && selectedVersions.includes('en') ? 'en' : selectedVersions[0];
        const targetData = versionsMeta[baseVersionKey].data;
        const regexFlags = isCaseSensitive ? 'g' : 'gi';
        
        for (const book in targetData) {
            for (const chapter in targetData[book]) {
                for (const verse in targetData[book][chapter]) {
                    const textTarget = targetData[book][chapter][verse];
                    
                    let isMatch = false;
                    if (searchMode === 'exact') {
                        isMatch = new RegExp(escapeRegExp(words[0]), regexFlags).test(textTarget);
                    } else if (searchMode === 'and') {
                        isMatch = words.every(w => new RegExp(escapeRegExp(w), regexFlags).test(textTarget));
                    } else if (searchMode === 'or') {
                        isMatch = words.some(w => new RegExp(escapeRegExp(w), regexFlags).test(textTarget));
                    }

                    if (isMatch) {
                        results.push({ book, chapter: parseInt(chapter), verse: parseInt(verse) });
                    }
                }
            }
        }
        
        currentSearchResults = results;
        currentSearchWord = word;
        renderedResultCount = 0;
        isSearchActive = true;
        
        if (results.length === 0) {
            selectedVersions.forEach(v => {
                const c = document.getElementById(`content-${v}`);
                if(c) c.innerHTML = `<p class="error" data-verse-id="header">'${word}'에 대한 검색 결과가 없습니다.</p>`;
            });
            return;
        }

        // 결과 요약 문구 동적 생성
        let summaryText = "";
        if (searchMode === 'exact') {
            // 기존 문구 유지 (발견된 횟수를 구하기가 exact일땐 쉬움)
            const exactRegex = new RegExp(escapeRegExp(words[0]), regexFlags);
            let totalOccurrences = 0;
            results.forEach(r => {
                const matchArr = targetData[r.book][r.chapter][r.verse].match(exactRegex);
                if(matchArr) totalOccurrences += matchArr.length;
            });
            summaryText = `'${word}'이(가) ${results.length}개의 구절에서 총 ${totalOccurrences}번 등장합니다.`;
        } else {
            summaryText = `검색된 구절: 총 ${results.length}개`;
        }
        
        selectedVersions.forEach((v, idx) => {
            const outContent = document.getElementById(`content-${v}`);
            if(!outContent) return;
            const style = idx === 0 ? "font-size: 1.2em; font-weight: bold;" : "font-size: 1.2em; font-weight: bold; color: transparent; user-select: none;";
            outContent.innerHTML = `<p class="search-header" data-verse-id="header" style="${style}">${summaryText}</p>`;
        });
        
        document.getElementById('output-wrapper').scrollTop = 0;
        renderNextSearchChunk();
        renderTimer = setTimeout(autoRenderRemaining, 40);
    }

    function autoRenderRemaining() {
        if (!isSearchActive || renderedResultCount >= currentSearchResults.length) return;
        renderNextSearchChunk();
        renderTimer = setTimeout(autoRenderRemaining, 40);
    }

    function renderNextSearchChunk(renderAll = false) {
        if (!isSearchActive || renderedResultCount >= currentSearchResults.length) return;
        
        const chunkEnd = renderAll ? currentSearchResults.length : Math.min(renderedResultCount + RENDER_CHUNK_SIZE, currentSearchResults.length);
        const regexFlags = isCaseSensitive ? 'g' : 'gi';
        
        const words = searchMode === 'exact' ? [currentSearchWord] : currentSearchWord.split(/\s+/).filter(w => w.length > 0);
        const highlightRegex = new RegExp('(' + words.map(escapeRegExp).join('|') + ')', regexFlags);
        
        selectedVersions.forEach(v => {
            const outContent = document.getElementById(`content-${v}`);
            if(!outContent) return;
            const meta = versionsMeta[v];
            let html = "";
            
            for (let idx = renderedResultCount; idx < chunkEnd; idx++) {
                const { book, chapter, verse } = currentSearchResults[idx];
                const text = meta.data[book]?.[chapter]?.[verse] || "";
                
                // 검색된 모든 단어 동시 하이라이트
                const highlighted = text.replace(highlightRegex, match => `<span class="highlight">${match}</span>`);
                
                const bookObj = bibleBooks.find(b => b.name === book);
                const displayBook = meta.isEn ? (bookObj?.enName || book) : book;
                const displayAbbr = meta.isEn ? (bookObj?.enAbbr || book) : (nameToAbbr[book] || book);
                const uniqueId = `search-${idx}`;

                let p = "";
                switch (displayMode) {
                    case 'standard': p = `<p data-verse-id="${uniqueId}"><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verse}">${displayBook} ${chapter}:${verse}</span><br>${highlighted}</p>`; break;
                    case 'abbr': p = `<p data-verse-id="${uniqueId}"><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verse}">${displayAbbr} ${chapter}:${verse}</span> ${highlighted}</p>`; break;
                    case 'quote': p = `<p data-verse-id="${uniqueId}">「${highlighted}」<br><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verse}">(${displayBook} ${chapter}:${verse})</span></p>`; break;
                    case 'short-quote': p = `<p data-verse-id="${uniqueId}">「${highlighted}」<span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verse}">(${displayAbbr} ${chapter}:${verse})</span></p>`; break; 
                    case 'double-quote': p = `<p data-verse-id="${uniqueId}">『${highlighted}』<br><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verse}">(${displayBook} ${chapter}:${verse})</span></p>`; break;
                    case 'double-short-quote': p = `<p data-verse-id="${uniqueId}">『${highlighted}』<span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verse}">(${displayAbbr} ${chapter}:${verse})</span></p>`; break;
                    case 'sequence': p = `<p data-verse-id="${uniqueId}"><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verse}">${displayAbbr} ${chapter}:${verse}</span> ${highlighted}</p>`; break;
                }
                html += p;
            }
            outContent.insertAdjacentHTML('beforeend', html);
        });
        
        renderedResultCount = chunkEnd;
        setTimeout(alignVerseHeights, 10);
    }

    function executeSearch(rawQuery) {
        document.getElementById('search-input').value = rawQuery;
        let query = rawQuery.trim();
        if (!query) {
            selectedVersions.forEach(v => { 
                const c = document.getElementById(`content-${v}`);
                if(c) c.innerHTML = `<p class="error" data-verse-id="header">검색할 단어나 구절을 입력해주세요.</p>`; 
            });
            return;
        }
        document.getElementById('navigation-buttons').classList.add('hidden');
        
        query = query.replace(/(\d)\.(\d)/g, '$1:$2');
        const refRegex = /((?:\d\s*)?[가-힣a-zA-Z]+(?:\s+[가-힣a-zA-Z]+)*)\s*(\d+)[:]([\d,\-]+)/g;
        let matches = [...query.matchAll(refRegex)];
        let stripped = query.replace(refRegex, '').replace(/[, ]/g, '').trim();
        
        if (matches.length > 0 && stripped.length === 0) {
            parseMultipleReferences(matches, rawQuery);
        } else {
            searchWord(rawQuery);
        }
    }

    function parseMultipleReferences(matches, rawQuery) {
        saveState();
        isSearchActive = false; 
        clearTimeout(renderTimer); 
        function clean(str) { return str.replace(/\s+/g, '').toLowerCase().normalize('NFC'); }
        
        const allGroups = [];
        
        for (const match of matches) {
            let bookRaw = match[1];
            let chapter = match[2];
            let versePart = match[3];
            let cleanBookRaw = clean(bookRaw);
            let bookObj = bibleBooks.find(b => clean(b.name) === cleanBookRaw || clean(b.abbr) === cleanBookRaw || clean(b.enName) === cleanBookRaw || clean(b.enAbbr) === cleanBookRaw || clean(b.enName).startsWith(cleanBookRaw));
            
            if (!bookObj) {
                selectedVersions.forEach(v => {
                    const c = document.getElementById(`content-${v}`);
                    if(c) c.innerHTML = `<p class="error" data-verse-id="header">잘못된 책 이름입니다: ${bookRaw}</p>`;
                });
                return;
            }

            const book = bookObj.name;
            const chapterData = versionsMeta['kr'].data[book]?.[chapter];
            if (!chapterData) {
                selectedVersions.forEach(v => {
                    const c = document.getElementById(`content-${v}`);
                    if(c) c.innerHTML = `<p class="error" data-verse-id="header">존재하지 않는 장: ${bookObj.name} ${chapter}장</p>`;
                });
                return;
            }

            const verses = [];
            const parts = versePart.split(',');
            for (const part of parts) {
                if (part.includes('-')) {
                    const [start, end] = part.split('-').map(Number);
                    if (start > end) return;
                    for (let v = start; v <= end; v++) {
                        if (chapterData[v]) verses.push({ book, chapter, verse: v });
                    }
                } else {
                    const v = Number(part);
                    if (chapterData[v]) verses.push({ book, chapter, verse: v });
                }
            }
            allGroups.push({ book, chapter: parseInt(chapter), verses });
        }

        const allVerses = allGroups.flatMap(g => g.verses);
        displayVerseResults(allVerses, allGroups);
    }

    function displayVerseResults(verses, verseGroups = null) {
        if (!verses || verses.length === 0) {
            selectedVersions.forEach(v => {
                const c = document.getElementById(`content-${v}`);
                if(c) c.innerHTML = '<p class="error" data-verse-id="header">검색 결과가 없습니다.</p>';
            });
            return;
        }

        selectedVersions.forEach((v, vIndex) => {
            const outContent = document.getElementById(`content-${v}`);
            if(!outContent) return;
            const meta = versionsMeta[v];
            let html = "";

            if (verseGroups) {
                verseGroups.forEach((group, groupIndex) => {
                    const { book, chapter, verses: groupVerses } = group;
                    if (groupVerses.length === 0) return;

                    const bookObj = bibleBooks.find(b => b.name === book);
                    const displayBook = meta.isEn ? (bookObj?.enName || book) : book;
                    const displayAbbr = meta.isEn ? (bookObj?.enAbbr || book) : (nameToAbbr[book] || book);
                    const verseNums = groupVerses.map(vv => vv.verse).sort((a, b) => a - b);
                    
                    let ranges = [], currentRange = [verseNums[0]];
                    for (let i = 1; i < verseNums.length; i++) {
                        if (verseNums[i] === verseNums[i-1] + 1) currentRange.push(verseNums[i]);
                        else { ranges.push(currentRange); currentRange = [verseNums[i]]; }
                    }
                    ranges.push(currentRange);

                    const verseRef = ranges.map(range => range.length === 1 ? range[0] : `${range[0]}-${range[range.length - 1]}`).join(',');
                    const combinedText = groupVerses.sort((a, b) => a.verse - b.verse).map(vv => meta.data[book]?.[chapter]?.[vv.verse] || "").join(' ');

                    const uniqueId = `vsearch-${groupIndex}`;
                    let p = "";
                    switch (displayMode) {
                        case 'standard': p = `<p data-verse-id="${uniqueId}"><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verseNums.join(',')}">${displayBook} ${chapter}:${verseRef}</span><br>${combinedText}</p>`; break;
                        case 'abbr': p = `<p data-verse-id="${uniqueId}"><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verseNums.join(',')}">${displayAbbr} ${chapter}:${verseRef}</span> ${combinedText}</p>`; break;
                        case 'quote': p = `<p data-verse-id="${uniqueId}">「${combinedText}」<br><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verseNums.join(',')}">(${displayBook} ${chapter}:${verseRef})</span></p>`; break;
                        case 'short-quote': p = `<p data-verse-id="${uniqueId}">「${combinedText}」<span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verseNums.join(',')}">(${displayAbbr} ${chapter}:${verseRef})</span></p>`; break; 
                        case 'double-quote': p = `<p data-verse-id="${uniqueId}">『${combinedText}』<br><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verseNums.join(',')}">(${displayBook} ${chapter}:${verseRef})</span></p>`; break;
                        case 'double-short-quote': p = `<p data-verse-id="${uniqueId}">『${combinedText}』<span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verseNums.join(',')}">(${displayAbbr} ${chapter}:${verseRef})</span></p>`; break; 
                        case 'sequence': {
                            let seq = "";
                            groupVerses.sort((a, b) => a.verse - b.verse).forEach((vv, vIdx) => {
                                const t = meta.data[book]?.[chapter]?.[vv.verse] || "";
                                if (vIdx === 0) seq += `<span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${vv.verse}">${displayAbbr} ${chapter}:${vv.verse}</span> ${t}`;
                                else seq += `<br><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${vv.verse}">${chapter}:${vv.verse}</span> ${t}`;
                            });
                            p = `<p data-verse-id="${uniqueId}">${seq}</p>`;
                            break;
                        }
                    }
                    html += p;
                    if (verseGroups.length > 1 && groupIndex < verseGroups.length - 1) {
                        html += `<div style="margin: 10px 0;" data-verse-id="spacer-${groupIndex}"></div>`;
                    }
                });
            } else {
                verses.forEach((verseObj, idx) => {
                    const { book, chapter, verse: verseNum } = verseObj;
                    const text = meta.data[book]?.[chapter]?.[verseNum] || "";
                    const bookObj = bibleBooks.find(b => b.name === book);
                    const displayBook = meta.isEn ? (bookObj?.enName || book) : book;
                    const displayAbbr = meta.isEn ? (bookObj?.enAbbr || book) : (nameToAbbr[book] || book);
                    const uniqueId = `vs-${idx}`;
                    
                    let p = "";
                    switch (displayMode) {
                        case 'standard': p = `<p data-verse-id="${uniqueId}"><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verse="${verseNum}" data-verses="${verseNum}">${displayBook} ${chapter}:${verseNum}</span><br>${text}</p>`; break;
                        case 'abbr': p = `<p data-verse-id="${uniqueId}"><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verse="${verseNum}" data-verses="${verseNum}">${displayAbbr} ${chapter}:${verseNum}</span> ${text}</p>`; break;
                        case 'quote': p = `<p data-verse-id="${uniqueId}">「${text}」<br><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verse="${verseNum}" data-verses="${verseNum}">(${displayBook} ${chapter}:${verseNum})</span></p>`; break;
                        case 'short-quote': p = `<p data-verse-id="${uniqueId}">「${text}」<span class="reference" data-book="${book}" data-chapter="${chapter}" data-verse="${verseNum}" data-verses="${verseNum}">(${displayAbbr} ${chapter}:${verseNum})</span></p>`; break; 
                        case 'double-quote': p = `<p data-verse-id="${uniqueId}">『${text}』<br><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verse="${verseNum}" data-verses="${verseNum}">(${displayBook} ${chapter}:${verseNum})</span></p>`; break;
                        case 'double-short-quote': p = `<p data-verse-id="${uniqueId}">『${text}』<span class="reference" data-book="${book}" data-chapter="${chapter}" data-verse="${verseNum}" data-verses="${verseNum}">(${displayAbbr} ${chapter}:${verseNum})</span></p>`; break; 
                        case 'sequence': p = `<p data-verse-id="${uniqueId}"><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verse="${verseNum}" data-verses="${verseNum}">${displayAbbr} ${chapter}:${verseNum}</span> ${text}</p>`; break;
                    }
                    html += p;
                });
            }
            outContent.innerHTML = html;
        });

        document.getElementById('output-wrapper').scrollTop = 0; 
        setTimeout(alignVerseHeights, 10);
    }

    function changeFontSize(size) {
        currentFontSize = size;
        selectedVersions.forEach(v => {
            const pane = document.getElementById(`output-${v}`);
            if(pane) pane.style.fontSize = size;
        });
        document.querySelectorAll('.btn-size').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.btn-size[data-size="${size}"]`).classList.add('active');
        setTimeout(alignVerseHeights, 50);
    }

    function setupEventListeners() {
        // 💡 사이드바 설정 토글
        document.getElementById('sidebar-settings-btn').addEventListener('click', () => {
            const panel = document.getElementById('sidebar-settings-panel');
            panel.classList.toggle('hidden');
        });

        document.getElementById('case-sensitive-checkbox').addEventListener('change', (e) => {
            isCaseSensitive = e.target.checked;
            if (isSearchActive && currentSearchWord) executeSearch(document.getElementById('search-input').value.trim()); 
        });

        document.querySelectorAll('.btn-size').forEach(btn => {
            btn.addEventListener('click', (e) => changeFontSize(e.target.getAttribute('data-size')));
        });

        document.getElementById('format-dropdown').addEventListener('change', (e) => changeDisplayMode(e.target.value));
        
        // 💡 검색 모드 드롭다운 이벤트
        document.getElementById('search-mode-dropdown').addEventListener('change', (e) => {
            searchMode = e.target.value;
            if (isSearchActive && currentSearchWord) executeSearch(document.getElementById('search-input').value.trim()); 
        });

        document.getElementById('search-button').addEventListener('click', () => {
            const query = document.getElementById('search-input').value.trim();
            executeSearch(query);
            document.querySelectorAll('.book-button.active, .chapter-button.active').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.chapter-container').forEach(container => container.remove());
        });
        
        document.getElementById('search-input').addEventListener('keydown', (event) => {
            if (event.key === 'Enter') document.getElementById('search-button').click();
        });

        document.getElementById('output-wrapper').addEventListener('click', function(e) {
            const ref = e.target.closest('.reference');
            if (ref) {
                const book = ref.getAttribute('data-book');
                const chapter = parseInt(ref.getAttribute('data-chapter'));
                const versesAttr = ref.getAttribute('data-verses');
                const verses = versesAttr ? versesAttr.split(',').map(v => parseInt(v)) : [];
                
                saveState();
                currentBook = book;
                currentChapter = chapter;
                currentVerse = verses.length > 0 ? verses[0] : null;
                
                document.querySelectorAll('.book-button').forEach(btn => btn.classList.remove('active'));
                const bookBtn = document.querySelector(`.book-button[data-book="${book}"]`);
                if (bookBtn) bookBtn.classList.add('active');

                document.querySelectorAll('.chapter-container').forEach(container => container.remove());
                createChapterButtons(book);

                document.querySelectorAll('.chapter-button').forEach(btn => {
                    if (parseInt(btn.getAttribute('data-chapter')) === chapter) btn.classList.add('active');
                });
                document.getElementById('navigation-buttons').classList.remove('hidden');

                displayChapter(book, chapter, verses);
            }
        });
        
        document.getElementById('prev-chapter').addEventListener('click', () => {
            if (!currentBook || !currentChapter) return;
            saveState();
            if (currentChapter > 1) { selectChapter(currentChapter - 1, true); }
            else {
                const currentBookIndex = bibleBooks.findIndex(b => b.name === currentBook);
                if (currentBookIndex > 0) {
                    const prevBook = bibleBooks[currentBookIndex - 1];
                    selectBook(prevBook.name, true, prevBook.chapters);
                }
            }
        });
        
        document.getElementById('next-chapter').addEventListener('click', () => {
            if (!currentBook || !currentChapter) return;
            saveState();
            const maxChapter = bookToChapters[currentBook];
            if (currentChapter < maxChapter) { selectChapter(currentChapter + 1, true); }
            else {
                const currentBookIndex = bibleBooks.findIndex(b => b.name === currentBook);
                if (currentBookIndex < bibleBooks.length - 1) {
                    const nextBook = bibleBooks[currentBookIndex + 1];
                    selectBook(nextBook.name, true);
                }
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (document.activeElement === document.getElementById('search-input')) return;
            if (e.key === 'ArrowLeft') {
                const prevButton = document.getElementById('prev-chapter');
                if (!prevButton.classList.contains('hidden')) prevButton.click();
            } else if (e.key === 'ArrowRight') {
                const nextButton = document.getElementById('next-chapter');
                if (!nextButton.classList.contains('hidden')) nextButton.click();
            } else if (e.ctrlKey && e.key.toLowerCase() === 'z') { e.preventDefault(); undoAction(); } 
              else if (e.ctrlKey && e.key.toLowerCase() === 'y') { e.preventDefault(); redoAction(); }
        });

        document.addEventListener('copy', (e) => {
            const selection = document.getSelection();
            if (!selection.rangeCount) return;

            let node = selection.anchorNode;
            let isInsideOutput = false;
            while (node && node !== document.body && node !== document) {
                if (node.id === 'output-wrapper' || (node.classList && node.classList.contains('output-pane'))) {
                    isInsideOutput = true;
                    break;
                }
                node = node.parentNode;
            }

            if (isInsideOutput && !isSearchActive) {
                let copiedText = selection.toString();
                copiedText = copiedText.replace(/(?:\r?\n){2,}/g, '\n');
                e.clipboardData.setData('text/plain', copiedText);
                e.preventDefault(); 
            }
        });
    }

    function saveState() {
        if (isRestoring) return;
        const htmlState = {};
        selectedVersions.forEach(v => { 
            const c = document.getElementById(`content-${v}`);
            if(c) htmlState[v] = c.innerHTML; 
        });
        
        historyStack.push({
            book: currentBook, chapter: currentChapter, verse: currentVerse,
            displayMode: displayMode, isCaseSensitive: isCaseSensitive, searchMode: searchMode,
            query: document.getElementById('search-input').value,
            selected: [...selectedVersions],
            html: htmlState
        });
        redoStack = []; 
        if (historyStack.length > 50) historyStack.shift();
    }

    function undoAction() {
        if (historyStack.length === 0) return;
        isRestoring = true;
        const htmlState = {};
        selectedVersions.forEach(v => { 
            const c = document.getElementById(`content-${v}`);
            if(c) htmlState[v] = c.innerHTML; 
        });
        redoStack.push({
            book: currentBook, chapter: currentChapter, verse: currentVerse, 
            displayMode: displayMode, isCaseSensitive: isCaseSensitive, searchMode: searchMode,
            query: document.getElementById('search-input').value,
            selected: [...selectedVersions], html: htmlState
        });
        restoreState(historyStack.pop());
        isRestoring = false;
    }

    function redoAction() {
        if (redoStack.length === 0) return;
        isRestoring = true;
        const htmlState = {};
        selectedVersions.forEach(v => { 
            const c = document.getElementById(`content-${v}`);
            if(c) htmlState[v] = c.innerHTML; 
        });
        historyStack.push({
            book: currentBook, chapter: currentChapter, verse: currentVerse, 
            displayMode: displayMode, isCaseSensitive: isCaseSensitive, searchMode: searchMode,
            query: document.getElementById('search-input').value,
            selected: [...selectedVersions], html: htmlState
        });
        restoreState(redoStack.pop());
        isRestoring = false;
    }

    function restoreState(state) {
        currentBook = state.book; currentChapter = state.chapter; currentVerse = state.verse;
        displayMode = state.displayMode; isCaseSensitive = state.isCaseSensitive || false;
        searchMode = state.searchMode || 'exact';
        
        if (JSON.stringify(selectedVersions) !== JSON.stringify(state.selected)) {
            selectedVersions = [...state.selected];
            renderDndLists();
            updateUIBySelectedVersions();
        }

        document.getElementById('search-input').value = state.query;
        document.getElementById('format-dropdown').value = displayMode;
        document.getElementById('search-mode-dropdown').value = searchMode;
        document.getElementById('case-sensitive-checkbox').checked = isCaseSensitive;

        selectedVersions.forEach(v => {
            const contentEl = document.getElementById(`content-${v}`);
            if(contentEl && state.html[v]) contentEl.innerHTML = state.html[v];
        });

        document.querySelectorAll('.book-button').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-book') === currentBook) btn.classList.add('active');
        });

        document.querySelectorAll('.chapter-container').forEach(c => c.remove());

        if (currentBook) {
            createChapterButtons(currentBook);
            if (currentChapter) {
                document.querySelectorAll('.chapter-button').forEach(btn => {
                    if (parseInt(btn.getAttribute('data-chapter')) === currentChapter) btn.classList.add('active');
                });
            }
            document.getElementById('navigation-buttons').classList.remove('hidden');
        } else {
            document.getElementById('navigation-buttons').classList.add('hidden');
        }
        setTimeout(alignVerseHeights, 10);
    }

    // 복사 기능 시 헤더 등은 무시하고 실제 텍스트 내용만 파싱
    function prepareContentForCopy(outputElement) {
        const clone = outputElement.cloneNode(true);
        clone.querySelectorAll('br').forEach(br => {
            const newline = document.createTextNode('\n');
            br.parentNode.replaceChild(newline, br);
        });
        const firstP = clone.querySelector('p');
        if (firstP && firstP.textContent.includes('구절에서 총') || (firstP && firstP.textContent.includes('검색된 구절:'))) firstP.remove();
        
        const highlights = clone.querySelectorAll('.highlight');
        highlights.forEach(h => h.outerHTML = h.textContent);
        const headings = clone.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(h => h.outerHTML = h.textContent + '\n');
        
        const paras = Array.from(clone.querySelectorAll('p'));
        if (paras.length > 0) return paras.map(p => p.innerText.trim()).join('\n\n').trim();
        return clone.innerText.trim();
    }
    
    function changeDisplayMode(mode) {
        displayMode = mode;
        document.getElementById('format-dropdown').value = mode; 
        
        if (isSearchActive) {
            clearTimeout(renderTimer); 
            renderedResultCount = 0;
            
            let summaryText = "";
            if (searchMode === 'exact') {
                const words = [currentSearchWord];
                const regexFlags = isCaseSensitive ? 'g' : 'gi';
                const exactRegex = new RegExp(escapeRegExp(words[0]), regexFlags);
                let totalOccurrences = 0;
                
                const isEnglishSearch = /[a-zA-Z]/.test(words[0]);
                const baseVersionKey = isEnglishSearch && selectedVersions.includes('en') ? 'en' : selectedVersions[0];
                const targetData = versionsMeta[baseVersionKey].data;

                currentSearchResults.forEach(r => {
                    const matchArr = targetData[r.book][r.chapter][r.verse].match(exactRegex);
                    if(matchArr) totalOccurrences += matchArr.length;
                });
                summaryText = `'${currentSearchWord}'이(가) ${currentSearchResults.length}개의 구절에서 총 ${totalOccurrences}번 등장합니다.`;
            } else {
                summaryText = `검색된 구절: 총 ${currentSearchResults.length}개`;
            }

            selectedVersions.forEach((v, idx) => {
                const style = idx === 0 ? "font-size: 1.2em; font-weight: bold;" : "font-size: 1.2em; font-weight: bold; color: transparent; user-select: none;";
                const c = document.getElementById(`content-${v}`);
                if(c) c.innerHTML = `<p class="search-header" data-verse-id="header" style="${style}">${summaryText}</p>`;
            });
            document.getElementById('output-wrapper').scrollTop = 0;
            renderNextSearchChunk();
            renderTimer = setTimeout(autoRenderRemaining, 40);
        } else {
            const query = document.getElementById('search-input').value;
            const outputHTML = document.getElementById(`content-${selectedVersions[0]}`)?.innerHTML || "";
            if (outputHTML.includes('data-verses') || outputHTML.includes('data-verse-id')) {
                if (query.trim()) executeSearch(query);
            } else if (currentBook && currentChapter) {
                displayChapter(currentBook, currentChapter, currentVerse ? [currentVerse] : []);
            }
        }
    }
    
    function loadInitialData() {
        if (bibleBooks.length > 0) selectBook(bibleBooks[0].name, true);
    }

    function showToast(message) {
        const toast = document.getElementById('toast-notification');
        toast.textContent = message;
        toast.classList.remove('hidden');
        clearTimeout(toastTimeout);
        setTimeout(() => toast.classList.add('show'), 10);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.classList.add('hidden'), 300);
        }, 2000);
    }

    function copyContent(versionKey) {
        if (isSearchActive && renderedResultCount < currentSearchResults.length) {
            clearTimeout(renderTimer); 
            renderNextSearchChunk(true); 
        }

        // 💡 실제 텍스트가 담긴 content 요소 참조
        const output = document.getElementById(`content-${versionKey}`);
        if (!output || output.innerText.trim() === '') {
            showToast('⚠️ 복사할 내용이 없습니다.');
            return;
        }

        const contentToCopy = prepareContentForCopy(output);
        const versionName = versionsMeta[versionKey].name;
        const successMessage = `✅ ${versionName} 본문이 복사되었습니다.`;
        
        navigator.clipboard.writeText(contentToCopy)
            .then(() => showToast(successMessage))
            .catch(err => {
                const tempTextArea = document.createElement('textarea');
                tempTextArea.value = contentToCopy;
                document.body.appendChild(tempTextArea);
                tempTextArea.select();
                try {
                    document.execCommand('copy');
                    showToast(successMessage);
                } catch (err) {
                    showToast('❌ 복사에 실패했습니다.');
                }
                document.body.removeChild(tempTextArea);
            });
    }
