// 전역 변수
    const bibleData = {}; 
    const bibleDataEn = {}; 
    let currentBook = null; 
    let currentChapter = null; 
    let currentVerse = null; 
    let displayMode = "standard"; 
    let languageMode = "kr"; 
    let isCaseSensitive = false; 
    let currentFontSize = "16px"; // 💡 글자 크기 상태 추가
    let toastTimeout; 

    // 타임 로딩 변수
    let currentSearchResults = [];
    let currentSearchWord = "";
    let currentSearchOccurrences = 0;
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
        { name: "요한복음", abbr: "요", enName: "John", enAbbr: "John", chapters: 21, testament: "new" },
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
    bibleBooks.forEach(book => abbrToName[book.abbr] = book.name);
    const nameToAbbr = {};
    bibleBooks.forEach(book => nameToAbbr[book.name] = book.abbr);
    const bookToChapters = {};
    bibleBooks.forEach(book => {
        bookToChapters[book.name] = book.chapters;
        bookToChapters[book.abbr] = book.chapters;
    });

    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('output-kr').innerHTML = '<p data-verse-id="header">데이터를 불러오는 중입니다...</p>';

        Promise.all([
            fetch('bible_data.json').then(res => res.json()),
            fetch('bible_data_en.json').then(res => res.json())
        ])
        .then(([krData, enData]) => {
            krData.forEach(item => {
                const book = item.book;
                if (!bibleData[book]) bibleData[book] = {};
                if (!bibleData[book][item.chapter]) bibleData[book][item.chapter] = {};
                bibleData[book][item.chapter][item.verse] = item.text;
            });

            enData.forEach(item => {
                const enName = item.book;
                const bookObj = bibleBooks.find(b => b.enName.toLowerCase() === enName.toLowerCase() || b.name === enName);
                const bookName = bookObj ? bookObj.name : enName;
                
                if (!bibleDataEn[bookName]) bibleDataEn[bookName] = {};
                if (!bibleDataEn[bookName][item.chapter]) bibleDataEn[bookName][item.chapter] = {};
                bibleDataEn[bookName][item.chapter][item.verse] = item.text;
            });

            document.getElementById('output-kr').innerHTML = ''; 
            createBookButtons();
            setupEventListeners();
            loadInitialData();
            document.getElementById('format-dropdown').value = displayMode;
        })
        .catch(error => {
            console.error('데이터를 불러오는데 실패했습니다:', error);
            document.getElementById('output-kr').innerHTML = '<p class="error" data-verse-id="header">데이터를 불러오지 못했습니다. 파일 위치를 확인해주세요.</p>';
        });
    });

    function alignVerseHeights() {
        const krElements = document.querySelectorAll('#output-kr [data-verse-id]');
        const enElements = document.querySelectorAll('#output-en [data-verse-id]');
        
        if (languageMode !== 'kren') {
            krElements.forEach(el => el.style.minHeight = 'auto');
            enElements.forEach(el => el.style.minHeight = 'auto');
            return;
        }

        krElements.forEach(el => el.style.minHeight = 'auto');
        enElements.forEach(el => el.style.minHeight = 'auto');

        const maxHeights = [];
        for (let i = 0; i < krElements.length; i++) {
            const krEl = krElements[i];
            const enEl = enElements[i]; 
            
            if (krEl && enEl) {
                const krHeight = krEl.getBoundingClientRect().height;
                const enHeight = enEl.getBoundingClientRect().height;
                maxHeights.push(Math.max(krHeight, enHeight));
            } else {
                maxHeights.push(0);
            }
        }

        for (let i = 0; i < krElements.length; i++) {
            if (maxHeights[i] > 0) {
                krElements[i].style.minHeight = `${maxHeights[i]}px`;
                if (enElements[i]) {
                    enElements[i].style.minHeight = `${maxHeights[i]}px`;
                }
            }
        }
    }

    window.addEventListener('resize', () => {
        setTimeout(alignVerseHeights, 100);
    });

    function createBookButtons() {
        const sidebar = document.getElementById('sidebar');
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

    // 💡 읽기 모드의 구절 양식은 업로드하신 원본 파일과 똑같이 ${verseNum}만 나오게 되돌렸습니다.
    function displayChapter(bookName, chapter, highlightVerses = []) {
        isSearchActive = false; 
        clearTimeout(renderTimer);
        
        if (!bibleData[bookName] || !bibleData[bookName][chapter]) {
            document.getElementById('output-kr').innerHTML = `<p class="error" data-verse-id="header">${bookName} ${chapter}장 데이터가 없습니다.</p>`;
            document.getElementById('output-en').innerHTML = '<p class="error" data-verse-id="header"></p>';
            return;
        }
        
        const verses = bibleData[bookName][chapter];
        const versesEn = (bibleDataEn[bookName] && bibleDataEn[bookName][chapter]) ? bibleDataEn[bookName][chapter] : {};
        const enBookName = bibleBooks.find(b => b.name === bookName)?.enName || bookName;
        
        let outputKr = `<h2 class="chapter-title" data-verse-id="header">${bookName} ${chapter}${bookName==="시편"?"편":"장"}</h2>`;
        let outputEn = `<h2 class="chapter-title" data-verse-id="header">${enBookName} ${chapter}</h2>`;
        
        const verseNums = Object.keys(verses).map(Number).sort((a, b) => a - b);
        for (const verseNum of verseNums) {
            const verseTextKr = verses[verseNum];
            const verseTextEn = versesEn[verseNum] || "";
            const isHighlighted = highlightVerses.includes(verseNum);
            const verseNumClass = isHighlighted ? 'verse-number verse-highlight' : 'verse-number';
            const uniqueId = `verse-${bookName}-${chapter}-${verseNum}`;
            
            outputKr += `<p data-verse-id="${uniqueId}"><span class="${verseNumClass}" style="cursor: pointer;" onclick="executeSearch('${bookName} ${chapter}:${verseNum}')" title="${bookName} ${chapter}:${verseNum} 출력 모드로 보기">${verseNum}</span> ${verseTextKr}</p>`;
            outputEn += `<p data-verse-id="${uniqueId}"><span class="${verseNumClass}" style="cursor: pointer;" onclick="executeSearch('${enBookName} ${chapter}:${verseNum}')" title="${enBookName} ${chapter}:${verseNum} View">${verseNum}</span> ${verseTextEn}</p>`;
        }
        
        document.getElementById('output-kr').innerHTML = outputKr;
        document.getElementById('output-en').innerHTML = outputEn;
        document.getElementById('output-wrapper').scrollTop = 0;
        
        setTimeout(() => {
            alignVerseHeights();
            if (highlightVerses.length > 0) {
                const firstHighlight = document.querySelector('.verse-highlight');
                if (firstHighlight) {
                    firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }, 50);
    }

    function searchWord(word) {
        saveState();
        clearTimeout(renderTimer); 
        
        let results = [];
        let totalOccurrences = 0;
        
        const isEnglishSearch = /[a-zA-Z]/.test(word);
        const targetData = isEnglishSearch ? bibleDataEn : bibleData;
        
        for (const book in targetData) {
            for (const chapter in targetData[book]) {
                for (const verse in targetData[book][chapter]) {
                    const textTarget = targetData[book][chapter][verse];
                    const regexFlags = isCaseSensitive ? 'g' : 'gi';
                    const regex = new RegExp(word, regexFlags);
                    const matches = textTarget.match(regex);
                    if (matches) {
                        totalOccurrences += matches.length;
                        results.push({
                            book, chapter: parseInt(chapter), verse: parseInt(verse),
                            textKr: bibleData[book]?.[chapter]?.[verse] || "",
                            textEn: bibleDataEn[book]?.[chapter]?.[verse] || ""
                        });
                    }
                }
            }
        }
        
        currentSearchResults = results;
        currentSearchWord = word;
        currentSearchOccurrences = totalOccurrences;
        renderedResultCount = 0;
        isSearchActive = true;
        
        const outputKrDiv = document.getElementById('output-kr');
        const outputEnDiv = document.getElementById('output-en');
        
        if (results.length === 0) {
            outputKrDiv.innerHTML = `<p class="error" data-verse-id="header">'${word}'에 대한 검색 결과가 없습니다.</p>`;
            outputEnDiv.innerHTML = '<p class="error" data-verse-id="header"></p>';
            return;
        }
        
        outputKrDiv.innerHTML = `<p class="search-header" data-verse-id="header" style="font-size: 1.2em; font-weight: bold;">'${word}'이(가) ${results.length}개의 구절에서 총 ${totalOccurrences}번 등장합니다.</p>`;
        outputEnDiv.innerHTML = `<p class="search-header" data-verse-id="header" style="font-size: 1.2em; font-weight: bold; color: transparent; user-select: none;">'${word}'이(가) ${results.length}개의 구절에서 총 ${totalOccurrences}번 등장합니다.</p>`;
        
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
        
        const outputKrDiv = document.getElementById('output-kr');
        const outputEnDiv = document.getElementById('output-en');
        
        let outputKr = "";
        let outputEn = "";
        
        const chunkEnd = renderAll ? currentSearchResults.length : Math.min(renderedResultCount + RENDER_CHUNK_SIZE, currentSearchResults.length);
        
        const regexFlags = isCaseSensitive ? 'g' : 'gi';
        
        for (let idx = renderedResultCount; idx < chunkEnd; idx++) {
            const result = currentSearchResults[idx];
            const { book, chapter, verse, textKr, textEn } = result;
            const regex = new RegExp(currentSearchWord, regexFlags);
            const highlightedKr = textKr.replace(regex, match => `<span class="highlight">${match}</span>`);
            const highlightedEn = textEn.replace(regex, match => `<span class="highlight">${match}</span>`);
            
            const bookObj = bibleBooks.find(b => b.name === book);
            const enBookName = bookObj?.enName || book;
            const enAbbr = bookObj?.enAbbr || book;
            const abbr = nameToAbbr[book] || book;
            const uniqueId = `search-${idx}`;

            let pKr = "", pEn = "";

            switch (displayMode) {
                case 'standard':
                    pKr = `<p data-verse-id="${uniqueId}"><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verse}">${book} ${chapter}:${verse}</span><br>${highlightedKr}</p>`;
                    pEn = `<p data-verse-id="${uniqueId}"><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verse}">${enBookName} ${chapter}:${verse}</span><br>${highlightedEn}</p>`;
                    break;
                case 'abbr':
                    pKr = `<p data-verse-id="${uniqueId}"><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verse}">${abbr} ${chapter}:${verse}</span> ${highlightedKr}</p>`;
                    pEn = `<p data-verse-id="${uniqueId}"><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verse}">${enAbbr} ${chapter}:${verse}</span> ${highlightedEn}</p>`;
                    break;
                case 'quote':
                    pKr = `<p data-verse-id="${uniqueId}">「${highlightedKr}」<br><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verse}">(${book} ${chapter}:${verse})</span></p>`;
                    pEn = `<p data-verse-id="${uniqueId}">「${highlightedEn}」<br><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verse}">(${enBookName} ${chapter}:${verse})</span></p>`;
                    break;
                case 'short-quote': 
                    pKr = `<p data-verse-id="${uniqueId}">「${highlightedKr}」<span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verse}">(${abbr} ${chapter}:${verse})</span></p>`;
                    pEn = `<p data-verse-id="${uniqueId}">「${highlightedEn}」<span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verse}">(${enAbbr} ${chapter}:${verse})</span></p>`;
                    break; 
                case 'double-quote':
                    pKr = `<p data-verse-id="${uniqueId}">『${highlightedKr}』<br><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verse}">(${book} ${chapter}:${verse})</span></p>`;
                    pEn = `<p data-verse-id="${uniqueId}">『${highlightedEn}』<br><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verse}">(${enBookName} ${chapter}:${verse})</span></p>`;
                    break;
                case 'double-short-quote':
                    pKr = `<p data-verse-id="${uniqueId}">『${highlightedKr}』<span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verse}">(${abbr} ${chapter}:${verse})</span></p>`;
                    pEn = `<p data-verse-id="${uniqueId}">『${highlightedEn}』<span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verse}">(${enAbbr} ${chapter}:${verse})</span></p>`;
                    break;
                case 'sequence':
                    pKr = `<p data-verse-id="${uniqueId}"><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verse}">${abbr} ${chapter}:${verse}</span> ${highlightedKr}</p>`;
                    pEn = `<p data-verse-id="${uniqueId}"><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verse}">${enAbbr} ${chapter}:${verse}</span> ${highlightedEn}</p>`;
                    break;
            }
            outputKr += pKr;
            outputEn += pEn;
        }
        
        outputKrDiv.insertAdjacentHTML('beforeend', outputKr);
        outputEnDiv.insertAdjacentHTML('beforeend', outputEn);
        
        renderedResultCount = chunkEnd;
        setTimeout(alignVerseHeights, 10);
    }

    function executeSearch(rawQuery) {
        document.getElementById('search-input').value = rawQuery;
        let query = rawQuery.trim();
        if (!query) {
            document.getElementById('output-kr').innerHTML = `<p class="error" data-verse-id="header">검색할 단어나 구절을 입력해주세요.</p>`;
            document.getElementById('output-en').innerHTML = '<p class="error" data-verse-id="header"></p>';
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
            let bookObj = null;

            bookObj = bibleBooks.find(b => clean(b.name) === cleanBookRaw || clean(b.abbr) === cleanBookRaw);
            if (!bookObj) {
                bookObj = bibleBooks.find(b => {
                    let n1 = clean(b.enName);
                    let n2 = clean(b.enAbbr);
                    return n1 === cleanBookRaw || n2 === cleanBookRaw || n1.startsWith(cleanBookRaw);
                });
            }
            
            if (!bookObj) {
                document.getElementById('output-kr').innerHTML = `<p class="error" data-verse-id="header">잘못된 책 이름입니다: ${bookRaw}</p>`;
                document.getElementById('output-en').innerHTML = '<p class="error" data-verse-id="header"></p>';
                return;
            }

            const book = bookObj.name;
            const chapterData = bibleData[book]?.[chapter];
            if (!chapterData) {
                document.getElementById('output-kr').innerHTML = `<p class="error" data-verse-id="header">존재하지 않는 장: ${bookObj.name} ${chapter}장</p>`;
                document.getElementById('output-en').innerHTML = '<p class="error" data-verse-id="header"></p>';
                return;
            }

            const verses = [];
            const parts = versePart.split(',');
            for (const part of parts) {
                if (part.includes('-')) {
                    const [start, end] = part.split('-').map(Number);
                    if (start > end) {
                        document.getElementById('output-kr').innerHTML = `<p class="error" data-verse-id="header">절 순서 오류: ${part}</p>`;
                        document.getElementById('output-en').innerHTML = '<p class="error" data-verse-id="header"></p>';
                        return;
                    }
                    for (let v = start; v <= end; v++) {
                        if (!chapterData[v]) {
                            document.getElementById('output-kr').innerHTML = `<p class="error" data-verse-id="header">존재하지 않는 절: ${bookObj.name} ${chapter}:${v}</p>`;
                            document.getElementById('output-en').innerHTML = '<p class="error" data-verse-id="header"></p>';
                            return;
                        }
                        verses.push({ book, chapter, verse: v });
                    }
                } else {
                    const v = Number(part);
                    if (!chapterData[v]) {
                        document.getElementById('output-kr').innerHTML = `<p class="error" data-verse-id="header">존재하지 않는 절: ${bookObj.name} ${chapter}:${v}</p>`;
                        document.getElementById('output-en').innerHTML = '<p class="error" data-verse-id="header"></p>';
                        return;
                    }
                    verses.push({ book, chapter, verse: v });
                }
            }

            const verseNumbers = verses.map(v => v.verse);
            const dupCheck = new Set(verseNumbers);
            if (dupCheck.size !== verseNumbers.length) {
                document.getElementById('output-kr').innerHTML = `<p class="error" data-verse-id="header">중복된 절 포함</p>`;
                document.getElementById('output-en').innerHTML = '<p class="error" data-verse-id="header"></p>';
                return;
            }

            allGroups.push({ book, chapter: parseInt(chapter), verses });
        }

        const allVerses = allGroups.flatMap(g => g.verses);
        displayVerseResults(allVerses, allGroups);
    }

    function displayVerseResults(verses, verseGroups = null) {
        if (!verses || verses.length === 0) {
            document.getElementById('output-kr').innerHTML = '<p class="error" data-verse-id="header">검색 결과가 없습니다.</p>';
            document.getElementById('output-en').innerHTML = '<p class="error" data-verse-id="header"></p>';
            return;
        }

        let outputKr = "";
        let outputEn = "";

        if (verseGroups) {
            verseGroups.forEach((group, groupIndex) => {
                const { book, chapter, verses: groupVerses } = group;
                if (groupVerses.length === 0) return;

                const bookObj = bibleBooks.find(b => b.name === book);
                const enBookName = bookObj?.enName || book;
                const enAbbr = bookObj?.enAbbr || book;
                const abbr = nameToAbbr[book] || book;
                const verseNums = groupVerses.map(v => v.verse).sort((a, b) => a - b);
                
                let ranges = [], currentRange = [verseNums[0]];
                for (let i = 1; i < verseNums.length; i++) {
                    if (verseNums[i] === verseNums[i-1] + 1) currentRange.push(verseNums[i]);
                    else { ranges.push(currentRange); currentRange = [verseNums[i]]; }
                }
                ranges.push(currentRange);

                const verseRef = ranges.map(range => range.length === 1 ? range[0] : `${range[0]}-${range[range.length - 1]}`).join(',');
                const combinedKr = groupVerses.sort((a, b) => a.verse - b.verse).map(v => bibleData[book]?.[chapter]?.[v.verse] || "").join(' ');
                const combinedEn = groupVerses.sort((a, b) => a.verse - b.verse).map(v => bibleDataEn[book]?.[chapter]?.[v.verse] || "").join(' ');

                const uniqueId = `vsearch-${groupIndex}`;
                let pKr = "", pEn = "";

                switch (displayMode) {
                    case 'standard':
                        pKr = `<p data-verse-id="${uniqueId}"><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verseNums.join(',')}">${book} ${chapter}:${verseRef}</span><br>${combinedKr}</p>`;
                        pEn = `<p data-verse-id="${uniqueId}"><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verseNums.join(',')}">${enBookName} ${chapter}:${verseRef}</span><br>${combinedEn}</p>`;
                        break;
                    case 'abbr':
                        pKr = `<p data-verse-id="${uniqueId}"><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verseNums.join(',')}">${abbr} ${chapter}:${verseRef}</span> ${combinedKr}</p>`;
                        pEn = `<p data-verse-id="${uniqueId}"><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verseNums.join(',')}">${enAbbr} ${chapter}:${verseRef}</span> ${combinedEn}</p>`;
                        break;
                    case 'quote':
                        pKr = `<p data-verse-id="${uniqueId}">「${combinedKr}」<br><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verseNums.join(',')}">(${book} ${chapter}:${verseRef})</span></p>`;
                        pEn = `<p data-verse-id="${uniqueId}">「${combinedEn}」<br><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verseNums.join(',')}">(${enBookName} ${chapter}:${verseRef})</span></p>`;
                        break;
                    case 'short-quote': 
                        pKr = `<p data-verse-id="${uniqueId}">「${combinedKr}」<span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verseNums.join(',')}">(${abbr} ${chapter}:${verseRef})</span></p>`;
                        pEn = `<p data-verse-id="${uniqueId}">「${combinedEn}」<span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verseNums.join(',')}">(${enAbbr} ${chapter}:${verseRef})</span></p>`;
                        break; 
                    case 'double-quote':
                        pKr = `<p data-verse-id="${uniqueId}">『${combinedKr}』<br><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verseNums.join(',')}">(${book} ${chapter}:${verseRef})</span></p>`;
                        pEn = `<p data-verse-id="${uniqueId}">『${combinedEn}』<br><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verseNums.join(',')}">(${enBookName} ${chapter}:${verseRef})</span></p>`;
                        break;
                    case 'double-short-quote': 
                        pKr = `<p data-verse-id="${uniqueId}">『${combinedKr}』<span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verseNums.join(',')}">(${abbr} ${chapter}:${verseRef})</span></p>`;
                        pEn = `<p data-verse-id="${uniqueId}">『${combinedEn}』<span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${verseNums.join(',')}">(${enAbbr} ${chapter}:${verseRef})</span></p>`;
                        break; 
                    case 'sequence': {
                        let krSeq = "";
                        let enSeq = "";
                        groupVerses.sort((a, b) => a.verse - b.verse).forEach((v, vIdx) => {
                            const tKr = bibleData[book]?.[chapter]?.[v.verse] || "";
                            const tEn = bibleDataEn[book]?.[chapter]?.[v.verse] || "";
                            if (vIdx === 0) {
                                krSeq += `<span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${v.verse}">${abbr} ${chapter}:${v.verse}</span> ${tKr}`;
                                enSeq += `<span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${v.verse}">${enAbbr} ${chapter}:${v.verse}</span> ${tEn}`;
                            } else {
                                krSeq += `<br><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${v.verse}">${chapter}:${v.verse}</span> ${tKr}`;
                                enSeq += `<br><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verses="${v.verse}">${chapter}:${v.verse}</span> ${tEn}`;
                            }
                        });
                        pKr = `<p data-verse-id="${uniqueId}">${krSeq}</p>`;
                        pEn = `<p data-verse-id="${uniqueId}">${enSeq}</p>`;
                        break;
                    }
                }
                outputKr += pKr;
                outputEn += pEn;

                if (verseGroups.length > 1 && groupIndex < verseGroups.length - 1) {
                    outputKr += `<div style="margin: 10px 0;" data-verse-id="spacer-${groupIndex}"></div>`;
                    outputEn += `<div style="margin: 10px 0;" data-verse-id="spacer-${groupIndex}"></div>`;
                }
            });

        } else {
            verses.forEach((verseObj, idx) => {
                const { book, chapter, verse: verseNum } = verseObj;
                const textKr = bibleData[book]?.[chapter]?.[verseNum] || "";
                const textEn = bibleDataEn[book]?.[chapter]?.[verseNum] || "";
                const bookObj = bibleBooks.find(b => b.name === book);
                const enBookName = bookObj?.enName || book;
                const enAbbr = bookObj?.enAbbr || book;
                const abbr = nameToAbbr[book] || book;
                const uniqueId = `vs-${idx}`;
                
                let pKr = "", pEn = "";

                switch (displayMode) {
                    case 'standard':
                        pKr = `<p data-verse-id="${uniqueId}"><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verse="${verseNum}" data-verses="${verseNum}">${book} ${chapter}:${verseNum}</span><br>${textKr}</p>`;
                        pEn = `<p data-verse-id="${uniqueId}"><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verse="${verseNum}" data-verses="${verseNum}">${enBookName} ${chapter}:${verseNum}</span><br>${textEn}</p>`;
                        break;
                    case 'abbr':
                        pKr = `<p data-verse-id="${uniqueId}"><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verse="${verseNum}" data-verses="${verseNum}">${abbr} ${chapter}:${verseNum}</span> ${textKr}</p>`;
                        pEn = `<p data-verse-id="${uniqueId}"><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verse="${verseNum}" data-verses="${verseNum}">${enAbbr} ${chapter}:${verseNum}</span> ${textEn}</p>`;
                        break;
                    case 'quote':
                        pKr = `<p data-verse-id="${uniqueId}">「${textKr}」<br><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verse="${verseNum}" data-verses="${verseNum}">(${book} ${chapter}:${verseNum})</span></p>`;
                        pEn = `<p data-verse-id="${uniqueId}">「${textEn}」<br><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verse="${verseNum}" data-verses="${verseNum}">(${enBookName} ${chapter}:${verseNum})</span></p>`;
                        break;
                    case 'short-quote': 
                        pKr = `<p data-verse-id="${uniqueId}">「${textKr}」<span class="reference" data-book="${book}" data-chapter="${chapter}" data-verse="${verseNum}" data-verses="${verseNum}">(${abbr} ${chapter}:${verseNum})</span></p>`;
                        pEn = `<p data-verse-id="${uniqueId}">「${textEn}」<span class="reference" data-book="${book}" data-chapter="${chapter}" data-verse="${verseNum}" data-verses="${verseNum}">(${enAbbr} ${chapter}:${verseNum})</span></p>`;
                        break; 
                    case 'double-quote':
                        pKr = `<p data-verse-id="${uniqueId}">『${textKr}』<br><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verse="${verseNum}" data-verses="${verseNum}">(${book} ${chapter}:${verseNum})</span></p>`;
                        pEn = `<p data-verse-id="${uniqueId}">『${textEn}』<br><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verse="${verseNum}" data-verses="${verseNum}">(${enBookName} ${chapter}:${verseNum})</span></p>`;
                        break;
                    case 'double-short-quote': 
                        pKr = `<p data-verse-id="${uniqueId}">『${textKr}』<span class="reference" data-book="${book}" data-chapter="${chapter}" data-verse="${verseNum}" data-verses="${verseNum}">(${abbr} ${chapter}:${verseNum})</span></p>`;
                        pEn = `<p data-verse-id="${uniqueId}">『${textEn}』<span class="reference" data-book="${book}" data-chapter="${chapter}" data-verse="${verseNum}" data-verses="${verseNum}">(${enAbbr} ${chapter}:${verseNum})</span></p>`;
                        break; 
                    case 'sequence':
                        pKr = `<p data-verse-id="${uniqueId}"><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verse="${verseNum}" data-verses="${verseNum}">${abbr} ${chapter}:${verseNum}</span> ${textKr}</p>`;
                        pEn = `<p data-verse-id="${uniqueId}"><span class="reference" data-book="${book}" data-chapter="${chapter}" data-verse="${verseNum}" data-verses="${verseNum}">${enAbbr} ${chapter}:${verseNum}</span> ${textEn}</p>`;
                        break;
                }
                outputKr += pKr;
                outputEn += pEn;
            });
        }

        document.getElementById('output-kr').innerHTML = outputKr;
        document.getElementById('output-en').innerHTML = outputEn;
        document.getElementById('output-wrapper').scrollTop = 0; 
        setTimeout(alignVerseHeights, 10);
    }

    function changeLanguageMode(mode) {
        languageMode = mode;
        const toggleBtn = document.getElementById('lang-toggle-button');
        const copyEnBtn = document.getElementById('copy-en-button');

        if (mode === 'kr') {
            toggleBtn.textContent = '한글 모드';
            document.getElementById('output-en').classList.add('hidden');
            copyEnBtn.classList.add('hidden'); 
        } else {
            toggleBtn.textContent = '한영 모드';
            document.getElementById('output-en').classList.remove('hidden');
            copyEnBtn.classList.remove('hidden'); 
        }
        
        setTimeout(alignVerseHeights, 10);
    }

    // 💡 글자 크기 변경 함수 추가
    function changeFontSize(size) {
        currentFontSize = size;
        document.getElementById('output-kr').style.fontSize = size;
        document.getElementById('output-en').style.fontSize = size;
        
        document.querySelectorAll('.btn-size').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.btn-size[data-size="${size}"]`).classList.add('active');
        
        setTimeout(alignVerseHeights, 50);
    }

    function setupEventListeners() {
        // 모달창 여닫기 로직
        const settingsModal = document.getElementById('settings-modal');
        const openBtn = document.getElementById('settings-open-btn');
        const closeBtn = document.getElementById('settings-close-btn');
    
        if (openBtn) {
            openBtn.addEventListener('click', () => {
                settingsModal.classList.remove('hidden'); // hidden 클래스를 제거하여 화면에 표시
            });
        }
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                settingsModal.classList.add('hidden'); // 다시 hidden을 넣어 숨김
            });
        }
        // 창 바깥쪽을 클릭하면 닫히는 기능
        window.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                settingsModal.classList.add('hidden');
            }
        });
        document.getElementById('settings-open-btn').addEventListener('click', () => {
            document.getElementById('settings-modal').classList.remove('hidden');
        });
        document.getElementById('settings-close-btn').addEventListener('click', () => {
            document.getElementById('settings-modal').classList.add('hidden');
        });
        window.addEventListener('click', (e) => {
            if (e.target === document.getElementById('settings-modal')) {
                document.getElementById('settings-modal').classList.add('hidden');
            }
        });

        // 💡 체크박스로 변경된 대소문자 구분 로직
        document.getElementById('case-sensitive-checkbox').addEventListener('change', (e) => {
            isCaseSensitive = e.target.checked;
            if (isSearchActive && currentSearchWord) {
                executeSearch(document.getElementById('search-input').value.trim()); 
            }
        });

        // 💡 글자 크기 버튼 이벤트
        document.querySelectorAll('.btn-size').forEach(btn => {
            btn.addEventListener('click', (e) => {
                changeFontSize(e.target.getAttribute('data-size'));
            });
        });

        document.getElementById('lang-toggle-button').addEventListener('click', () => {
            const newMode = languageMode === 'kr' ? 'kren' : 'kr';
            changeLanguageMode(newMode);
        });

        document.getElementById('format-dropdown').addEventListener('change', (e) => {
            changeDisplayMode(e.target.value);
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
        
        document.getElementById('copy-kr-button').addEventListener('click', () => copyContent('kr'));
        document.getElementById('copy-en-button').addEventListener('click', () => copyContent('en'));

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
            if (currentChapter > 1) {
                selectChapter(currentChapter - 1, true);
            } else {
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
            if (currentChapter < maxChapter) {
                selectChapter(currentChapter + 1, true);
            } else {
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
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key.toLowerCase() === 'z') { e.preventDefault(); undoAction(); } 
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
        historyStack.push({
            book: currentBook, chapter: currentChapter, verse: currentVerse,
            displayMode: displayMode, languageMode: languageMode, isCaseSensitive: isCaseSensitive,
            query: document.getElementById('search-input').value,
            outputKr: document.getElementById('output-kr').innerHTML,
            outputEn: document.getElementById('output-en').innerHTML
        });
        redoStack = []; 
        if (historyStack.length > 50) historyStack.shift();
    }

    function undoAction() {
        if (historyStack.length === 0) return;
        isRestoring = true;
        redoStack.push({
            book: currentBook, chapter: currentChapter, verse: currentVerse, 
            displayMode: displayMode, languageMode: languageMode, isCaseSensitive: isCaseSensitive,
            query: document.getElementById('search-input').value,
            outputKr: document.getElementById('output-kr').innerHTML,
            outputEn: document.getElementById('output-en').innerHTML
        });
        const prevState = historyStack.pop();
        restoreState(prevState);
        isRestoring = false;
    }

    function redoAction() {
        if (redoStack.length === 0) return;
        isRestoring = true;
        historyStack.push({
            book: currentBook, chapter: currentChapter, verse: currentVerse, 
            displayMode: displayMode, languageMode: languageMode, isCaseSensitive: isCaseSensitive,
            query: document.getElementById('search-input').value,
            outputKr: document.getElementById('output-kr').innerHTML,
            outputEn: document.getElementById('output-en').innerHTML
        });
        const nextState = redoStack.pop();
        restoreState(nextState);
        isRestoring = false;
    }

    function restoreState(state) {
        currentBook = state.book;
        currentChapter = state.chapter;
        currentVerse = state.verse;
        displayMode = state.displayMode;
        languageMode = state.languageMode || 'kr';
        isCaseSensitive = state.isCaseSensitive || false;

        document.getElementById('search-input').value = state.query;
        document.getElementById('output-kr').innerHTML = state.outputKr;
        document.getElementById('output-en').innerHTML = state.outputEn || '';

        document.getElementById('format-dropdown').value = displayMode;
        document.getElementById('case-sensitive-checkbox').checked = isCaseSensitive;

        const toggleBtn = document.getElementById('lang-toggle-button');
        const copyEnBtn = document.getElementById('copy-en-button');
        if (languageMode === 'kr') {
            toggleBtn.textContent = '한글 모드';
            document.getElementById('output-en').classList.add('hidden');
            copyEnBtn.classList.add('hidden');
        } else {
            toggleBtn.textContent = '한영 모드';
            document.getElementById('output-en').classList.remove('hidden');
            copyEnBtn.classList.remove('hidden');
        }

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

    // 💡 올려주신 원본 코드 양식(\n\n) 그대로 복구
    function prepareContentForCopy(outputElement) {
        const clone = outputElement.cloneNode(true);
        clone.querySelectorAll('br').forEach(br => {
            const newline = document.createTextNode('\n');
            br.parentNode.replaceChild(newline, br);
        });
        const firstP = clone.querySelector('p');
        if (firstP && firstP.textContent.includes('구절에서 총') && firstP.textContent.includes('등장')) firstP.remove();
        
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
            document.getElementById('output-kr').innerHTML = `<p class="search-header" data-verse-id="header" style="font-size: 1.2em; font-weight: bold;">'${currentSearchWord}'이(가) ${currentSearchResults.length}개의 구절에서 총 ${currentSearchOccurrences}번 등장합니다.</p>`;
            document.getElementById('output-en').innerHTML = `<p class="search-header" data-verse-id="header" style="font-size: 1.2em; font-weight: bold; color: transparent; user-select: none;">'${currentSearchWord}'이(가) ${currentSearchResults.length}개의 구절에서 총 ${currentSearchOccurrences}번 등장합니다.</p>`;
            document.getElementById('output-wrapper').scrollTop = 0;
            
            renderNextSearchChunk();
            renderTimer = setTimeout(autoRenderRemaining, 40);
        } else {
            const query = document.getElementById('search-input').value;
            const outputHTML = document.getElementById('output-kr').innerHTML;
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

    function copyContent(lang) {
        if (lang === 'en' && languageMode === 'kr') {
            showToast('⚠️ 한영 모드에서만 영어를 복사할 수 있습니다.');
            return;
        }

        if (isSearchActive && renderedResultCount < currentSearchResults.length) {
            clearTimeout(renderTimer); 
            renderNextSearchChunk(true); 
        }

        const outputId = lang === 'kr' ? 'output-kr' : 'output-en';
        const output = document.getElementById(outputId);
        
        if (!output || output.innerText.trim() === '') {
            showToast('⚠️ 복사할 내용이 없습니다.');
            return;
        }

        const contentToCopy = prepareContentForCopy(output);
        const successMessage = lang === 'kr' ? '✅ 한글 본문이 복사되었습니다.' : '✅ 영어 본문이 복사되었습니다.';
        
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

