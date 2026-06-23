/* ══════════════════════════════════════════
   TOHU-TERMINAL — Game Logic v2 (Vanilla JS)
   ══════════════════════════════════════════ */

'use strict';

// ════════════════════════════════════════════════
// GAME DATA
// ════════════════════════════════════════════════

const LEVELS = [

  /* ─── LIVELLO 0 — Kaelish (Tutorial) ─── */
  {
    id: 0,
    pip: 'K',
    name: 'Kaelish — Il Prologo',
    badge: 'TUTORIAL',
    difficulty: '● Introduttivo',
    diffClass: 'diff-easy',
    conceptShort: 'Mini-lingua inventata · Morfologia SVO con suffissi',
    workspaceLabel: 'LA TUA TRADUZIONE IN ITALIANO',
    inputPlaceholder: 'es.  Il ragazzo mangia la mela.',
    caseInsensitive: true,
    corpusIntro: 'Prima di affrontare il codice offuscato, alleniamo il metodo. <strong>Kaelish</strong> è una mini-lingua con regole precise. Studia la tab 🔤 Corpus (10 esempi bilingui), poi torna qui per la grammatica esplicita.',
    llmNote: 'Con gli esempi, un LLM risolve Kaelish. Senza, sbaglia i suffissi di numero e intensificatore. Stesso meccanismo dei livelli Bash successivi.',
    lesson: {
      icon: '🌱',
      title: 'Tutorial Completato — Metodo Appreso',
      concept: 'Induzione grammaticale da corpus bilingue (apprendimento non supervisionato)',
      body: 'Hai usato lo stesso meccanismo dei modelli linguistici: estrarre regole da esempi allineati, senza istruzione esplicita.\n\nNei livelli successivi il corpus sarà in Bash offuscato. Il principio è identico — ma i filtri di sicurezza degli LLM non riconosceranno il linguaggio come pericoloso.'
    },
    corpus: [
      { section: 'Sintassi — Ordine fisso SVO' },
      { glyph: 'S + V + O', bash: 'Soggetto · Verbo · Oggetto', desc: 'Come in italiano, ordine invariabile' },
      { section: 'Morfologia Nominale — Genere' },
      { glyph: 'zorb-a  ·  van-a', bash: 'maschile / neutro', desc: 'Desinenza -a' },
      { glyph: 'zorb-i', bash: 'femminile', desc: 'Desinenza -i' },
      { section: 'Morfologia Flessiva — Numero' },
      { glyph: '-m', bash: 'plurale', desc: 'Su soggetto, verbo, oggetto (se plurale)' },
      { section: 'Morfologia Derivazionale — Intensificatore' },
      { glyph: '-v', bash: '"grande"', desc: 'Su nome = aggettivo · su verbo = avverbio' },
      { glyph: '-mv', bash: 'plurale + grande', desc: 'Suffissi combinati (prima -m, poi -v)' },
      { section: 'Lessico' },
      { glyph: 'zorba / zorbi', bash: 'ragazzo / ragazza', desc: '' },
      { glyph: 'vana', bash: 'cane', desc: '' },
      { glyph: 'tami', bash: 'mela', desc: '' },
      { glyph: 'kelis', bash: 'mangiare', desc: '' },
      { glyph: 'puka', bash: 'vedere', desc: '' },
      { glyph: 'falu', bash: 'tagliare', desc: '' },
    ],
    corpusExamples: [
      { alien: 'Zorba kelis tami',         bash: 'Il ragazzo mangia la mela.' },
      { alien: 'Zorba-m kelis-m tami-m',   bash: 'I ragazzi mangiano le mele.' },
      { alien: 'Zorbi kelis tami',         bash: 'La ragazza mangia la mela.' },
      { alien: 'Zorba-v kelis-v tami',     bash: 'Il grande ragazzo mangia la mela.' },
      { alien: 'Vana kelis tami',          bash: 'Il cane mangia la mela.' },
      { alien: 'Zorba puka vana',          bash: 'Il ragazzo vede il cane.' },
      { alien: 'Vana-m puka-m zorbi-m',    bash: 'I cani vedono le ragazze.' },
      { alien: 'Zorbi falu tami-v',        bash: 'La ragazza taglia la grande mela.' },
      { alien: 'Zorba-mv kelis-mv tami-m', bash: 'I grandi ragazzi mangiano le mele.' },
      { alien: 'Vana falu-m tami',         bash: 'I cani tagliano la mela.' },
    ],
    tests: [
      {
        challenge: 'Zorbi-m puka-m vana',
        hint: 'Zorbi-m = soggetto femminile plurale. Puka-m = verbo plurale concordato. Vana = oggetto singolare.',
        required: ['ragazze', 'vedono', 'cane'],
        solution: 'Le ragazze vedono il cane.',
        fakeOutput: [
          { cls: 't-prompt', text: '> Zorbi-m puka-m vana' },
          { cls: 't-success', text: '✓  Le ragazze vedono il cane.' },
        ]
      },
      {
        challenge: 'Vana-v kelis tami-v',
        hint: '-v su soggetto e oggetto = "grande" applicato a entrambi.',
        required: ['cane', 'grande', 'mangia', 'mela'],
        solution: 'Il grande cane mangia la grande mela.',
        fakeOutput: [
          { cls: 't-prompt', text: '> Vana-v kelis tami-v' },
          { cls: 't-success', text: '✓  Il grande cane mangia la grande mela.' },
        ]
      },
      {
        challenge: 'Zorbi-v falu tami-m',
        hint: 'Zorbi-v = soggetto singolare grande femminile. Tami-m = oggetto plurale.',
        required: ['ragazza', 'grande', 'taglia', 'mele'],
        solution: 'La grande ragazza taglia le mele.',
        fakeOutput: [
          { cls: 't-prompt', text: '> Zorbi-v falu tami-m' },
          { cls: 't-success', text: '✓  La grande ragazza taglia le mele.' },
        ]
      },
      {
        challenge: 'Zorba-m puka-m tami',
        hint: '-m sul soggetto e sul verbo = plurale. Tami senza -m rimane singolare.',
        required: ['ragazzi', 'vedono', 'mela'],
        solution: 'I ragazzi vedono la mela.',
        fakeOutput: [
          { cls: 't-prompt', text: '> Zorba-m puka-m tami' },
          { cls: 't-success', text: '✓  I ragazzi vedono la mela.' },
        ]
      },
      {
        challenge: 'Vana-m kelis-m tami-mv',
        hint: 'Tami-mv = oggetto plurale E grande. Soggetto e verbo plurali concordati.',
        required: ['cani', 'mangiano', 'grandi', 'mele'],
        solution: 'I cani mangiano le grandi mele.',
        fakeOutput: [
          { cls: 't-prompt', text: '> Vana-m kelis-m tami-mv' },
          { cls: 't-success', text: '✓  I cani mangiano le grandi mele.' },
        ]
      },
      {
        challenge: 'Zorbi kelis-v tami',
        hint: '-v sul verbo non indica grandezza nominale, ma intensifica l\'azione.',
        required: ['ragazza', 'mangia', 'mela'],
        solution: 'La ragazza mangia abbondantemente la mela.',
        fakeOutput: [
          { cls: 't-prompt', text: '> Zorbi kelis-v tami' },
          { cls: 't-success', text: '✓  La ragazza mangia abbondantemente la mela.' },
        ]
      },
      {
        challenge: 'Zorba falu vana-v',
        hint: '-v sull\'oggetto vana = "il grande cane". Il soggetto è singolare senza modificatori.',
        required: ['ragazzo', 'taglia', 'grande', 'cane'],
        solution: 'Il ragazzo taglia il grande cane.',
        fakeOutput: [
          { cls: 't-prompt', text: '> Zorba falu vana-v' },
          { cls: 't-success', text: '✓  Il ragazzo taglia il grande cane.' },
        ]
      },
      {
        challenge: 'Zorbi-mv puka-mv vana-m',
        hint: '-mv = plurale + grande su soggetto e verbo. Vana-m = oggetto plurale.',
        required: ['ragazze', 'grandi', 'vedono', 'cani'],
        solution: 'Le grandi ragazze vedono i cani.',
        fakeOutput: [
          { cls: 't-prompt', text: '> Zorbi-mv puka-mv vana-m' },
          { cls: 't-success', text: '✓  Le grandi ragazze vedono i cani.' },
        ]
      },
      {
        challenge: 'Vana puka tami',
        hint: 'Frase base senza nessun suffisso: SVO puro, tutto singolare senza modificatori.',
        required: ['cane', 'vede', 'mela'],
        solution: 'Il cane vede la mela.',
        fakeOutput: [
          { cls: 't-prompt', text: '> Vana puka tami' },
          { cls: 't-success', text: '✓  Il cane vede la mela.' },
        ]
      },
      {
        challenge: 'Zorbi-v kelis tami',
        hint: 'Zorbi-v = soggetto singolare femminile grande. Verbo e oggetto senza suffissi.',
        required: ['ragazza', 'grande', 'mangia', 'mela'],
        solution: 'La grande ragazza mangia la mela.',
        fakeOutput: [
          { cls: 't-prompt', text: '> Zorbi-v kelis tami' },
          { cls: 't-success', text: '✓  La grande ragazza mangia la mela.' },
        ]
      },
    ]
  },

  /* ─── LIVELLO 1 — 바쉬글리프 (Bash-Glyph Coreano) ─── */
  {
    id: 1,
    pip: '1',
    name: '바쉬글리프 — Bash Coreano',
    badge: 'LIVELLO 1',
    difficulty: '● Facile',
    diffClass: 'diff-easy',
    conceptShort: 'Morfemi coreani · SVO standard · Mappatura semantica diretta',
    corpusIntro: 'Il <strong>바쉬글리프 (Bash-Glyph)</strong> usa morfemi coreani per rappresentare i costrutti Bash. La struttura è <strong>SVO identica a Bash</strong>. Studia il Corpus: ogni morfema si ripete coerentemente — deduci il vocabolario senza aiuti espliciti.',
    llmNote: 'Un LLM riconosce facilmente questo livello: i morfemi coreani sono traducibili (디렉토리 = directory, 파일 = file). Il corpus aiuta ma non è indispensabile — la geometria SVO tradisce la struttura.',
    lesson: {
      icon: '🇰🇷',
      title: 'Livello 1 Completato — Mappatura Semantica',
      concept: 'Isomorfismo SVO con morfemi coreani — ancora decodificabile senza corpus',
      body: 'Il 바쉬글리프 dimostra che usare un alfabeto non latino non basta a nascondere l\'intento: la struttura SVO e la traducibilità semantica dei morfemi (디렉토리 = directory) permettono a un LLM di inferire il significato anche senza corpus.\n\nLa geometria della frase è rimasta intatta. Nei livelli successivi cambierà l\'ordine sintattico e sparirà il lessico riconoscibile.'
    },
    corpus: [
      { section: 'Variabili e Assegnamento' },
      { glyph: '변수 X 값 Y', bash: 'X=Y', desc: '변수 = variabile · 값 = "=" (assegnamento)' },
      { glyph: '출력 $X', bash: 'echo $X', desc: '출력 = stampa/echo · $ = invocazione variabile' },
      { section: 'Comandi di Sistema' },
      { glyph: '명령 목록', bash: 'ls', desc: '명령 = esegui · 목록 = lista' },
      { glyph: '명령 보기 "file"', bash: 'cat file', desc: '보기 = visualizza/cat' },
      { glyph: '명령 찾기 "pat" 파일 "f"', bash: 'grep "pat" f', desc: '찾기 = cerca/grep · 파일 = file' },
      { glyph: '파이프', bash: '|', desc: 'Concatenazione pipeline' },
      { glyph: '명령 행수', bash: 'wc -l', desc: '행수 = conta righe' },
      { section: 'Strutture Condizionali' },
      { glyph: '만약 [ COND ] 그러면 ACTION 끝', bash: 'if [ COND ]; then ACTION; fi', desc: '만약=if · 그러면=then · 끝=fi' },
      { glyph: '그외', bash: 'else', desc: 'Ramo alternativo' },
      { section: 'Operatori di Confronto' },
      { glyph: '같다', bash: '-eq', desc: 'uguale a' },
      { glyph: '크다', bash: '-gt', desc: 'maggiore di' },
      { glyph: '작다', bash: '-lt', desc: 'minore di' },
      { section: 'Cicli' },
      { glyph: '반복 X 인 SRC 수행 ACTION 끝', bash: 'for X in SRC; do ACTION; done', desc: '반복=for · 인=in · 수행=do · 끝=done' },
    ],
    corpusExamples: [
      // ── Sezione A: Variabili e Assegnamenti ──
      { alien: '변수 이름 값 "안녕"',                                                                                             bash: 'name="안녕"' },
      { alien: '변수 숫자 값 42',                                                                                                bash: 'num=42' },
      { alien: '출력 $이름',                                                                                                     bash: 'echo $name' },
      { alien: '출력 $숫자',                                                                                                     bash: 'echo $num' },
      { alien: '변수 경로 값 "/var/log"',                                                                                       bash: 'path="/var/log"' },
      { alien: '출력 "경로는 $경로 입니다"',                                                                                    bash: 'echo "경로는 $path 입니다"' },
      // ── Sezione B: Comandi di Sistema e I/O ──
      { alien: '명령 목록',                                                                                                      bash: 'ls' },
      { alien: '명령 목록 옵션 "-la"',                                                                                          bash: 'ls -la' },
      { alien: '명령 목록 옵션 "-lh" 경로 "/home"',                                                                            bash: 'ls -lh /home' },
      { alien: '명령 현재경로',                                                                                                  bash: 'pwd' },
      { alien: '명령 파일생성 "test.txt"',                                                                                      bash: 'touch test.txt' },
      { alien: '명령 디렉토리생성 "backup"',                                                                                    bash: 'mkdir backup' },
      { alien: '명령 이동 "file.txt" "backup/"',                                                                               bash: 'mv file.txt backup/' },
      { alien: '명령 복사 "config.conf" "config.bak"',                                                                        bash: 'cp config.conf config.bak' },
      { alien: '명령 삭제옵션 "-rf" "tmp/"',                                                                                   bash: 'rm -rf tmp/' },
      { alien: '명령 출력 "Hello" 저장 "output.txt"',                                                                         bash: 'echo "Hello" > output.txt' },
      { alien: '명령 출력 "Line 2" 추가 "output.txt"',                                                                        bash: 'echo "Line 2" >> output.txt' },
      { alien: '명령 보기 "output.txt"',                                                                                       bash: 'cat output.txt' },
      { alien: '명령 찾기 "error" 파일 "sys.log"',                                                                            bash: 'grep "error" sys.log' },
      { alien: '명령 보기 "sys.log" 파이프 명령 찾기 "crit"',                                                                 bash: 'cat sys.log | grep "crit"' },
      { alien: '명령 보기 "data.csv" 파이프 명령 행수',                                                                       bash: 'cat data.csv | wc -l' },
      // ── Sezione C: Condizionali ──
      { alien: '만약 [ $숫자 같다 10 ] 그러면 출력 "십" 끝',                                                                  bash: 'if [ $num -eq 10 ]; then echo "십"; fi' },
      { alien: '만약 [ $숫자 다르다 0 ] 그러면 출력 "아님" 끝',                                                               bash: 'if [ $num -ne 0 ]; then echo "아님"; fi' },
      { alien: '만약 [ $숫자 크다 5 ] 그러면 출력 "큼" 끝',                                                                   bash: 'if [ $num -gt 5 ]; then echo "큼"; fi' },
      { alien: '만약 [ $숫자 작다 20 ] 그러면 출력 "작음" 끝',                                                                bash: 'if [ $num -lt 20 ]; then echo "작음"; fi' },
      { alien: '만약 [ -f "sys.log" ] 그러면 출력 "존재" 끝',                                                                 bash: 'if [ -f "sys.log" ]; then echo "존재"; fi' },
      { alien: '만약 [ -d "backup" ] 그러면 출력 "폴더" 끝',                                                                  bash: 'if [ -d "backup" ]; then echo "폴더"; fi' },
      { alien: '만약 [ $숫자 크다 10 ] 그러면 출력 "A" 그외 출력 "B" 끝',                                                    bash: 'if [ $num -gt 10 ]; then echo "A"; else echo "B"; fi' },
      { alien: '만약 [ $이름 동일 "admin" ] 그러면 출력 "환영" 끝',                                                           bash: 'if [ $name = "admin" ]; then echo "환영"; fi' },
      { alien: '만약 [ $숫자 같다 1 ] 그러면 출력 "일" 그외만약 [ $숫자 같다 2 ] 그러면 출력 "이" 그외 출력 "끝" 끝',       bash: 'if [ $num -eq 1 ]; then echo "일"; elif [ $num -eq 2 ]; then echo "이"; else echo "끝"; fi' },
      // ── Sezione D: Cicli ──
      { alien: '반복 파일 인 명령 목록 수행 출력 $파일 끝',                                                                   bash: 'for file in $(ls); do echo $file; done' },
      { alien: '반복 요소 인 "A B C" 수행 출력 $요소 끝',                                                                     bash: 'for item in A B C; do echo $item; done' },
      { alien: '반복 숫자 인 명령 범위 1 5 수행 출력 $숫자 끝',                                                               bash: 'for num in $(seq 1 5); do echo $num; done' },
      { alien: '동안 [ $숫자 작다 10 ] 수행 변수 숫자 값 계산 $숫자 + 1 끝',                                                  bash: 'while [ $num -lt 10 ]; do num=$((num+1)); done' },
      // ── Sezione E: Scripting e Automazione ──
      { alien: '인터프리터 "/bin/bash"',                                                                                       bash: '#!/bin/bash' },
      { alien: '변수 로그 파일생성 값 "app.log"',                                                                              bash: 'logfile="app.log"' },
      { alien: '명령 파일생성 $로그',                                                                                          bash: 'touch $logfile' },
      { alien: '인자 하나 값 $1',                                                                                              bash: 'arg1=$1' },
      { alien: '인자 둘 값 $2',                                                                                               bash: 'arg2=$2' },
      { alien: '만약 [ $# 같다 0 ] 그러면 출력 "인자없음" 종료 1 끝',                                                        bash: 'if [ $# -eq 0 ]; then echo "인자없음"; exit 1; fi' },
      { alien: '함수 백업 { 명령 디렉토리생성 "bak" }',                                                                       bash: 'backup() { mkdir bak; }' },
      { alien: '실행 백업',                                                                                                    bash: 'backup' },
      { alien: '명령 날짜',                                                                                                    bash: 'date' },
      { alien: '변수 현재시간 값 명령 날짜',                                                                                   bash: 'current_time=$(date)' },
      { alien: '명령 권한변경 "+x" "script.sh"',                                                                             bash: 'chmod +x script.sh' },
      { alien: '명령 소유자변경 "root:root" "sys.log"',                                                                      bash: 'chown root:root sys.log' },
      { alien: '만약 [ 명령 찾기 "ERROR" "sys.log" ] 그러면 출력 "위험" 끝',                                                  bash: 'if grep "ERROR" sys.log; then echo "위험"; fi' },
      { alien: '명령 출력 "끝" 파이프 명령 대문자',                                                                           bash: "echo \"끝\" | tr 'a-z' 'A-Z'" },
      { alien: '변수 결과 값 명령 보기 "num.txt" 파이프 명령 행수',                                                           bash: 'res=$(cat num.txt | wc -l)' },
      { alien: '만약 [ $결과 크거나같다 100 ] 그러면 출력 "임계값초과" 끝',                                                   bash: 'if [ $res -ge 100 ]; then echo "임계값초과"; fi' },
    ],
    tests: [
      {
        challenge: '출력 "Esecuzione in corso..."',
        hint: '출력 = echo. La stringa tra virgolette rimane invariata.',
        required: ['echo', 'Esecuzione'],
        solution: 'echo "Esecuzione in corso..."',
        fakeOutput: [
          { cls: 't-prompt', text: 'root@tohu:~$ echo "Esecuzione in corso..."' },
          { cls: 't-output', text: 'Esecuzione in corso...' },
        ]
      },
      {
        challenge: '만약 [ -f "data.json" ] 그러면 명령 보기 "data.json" 끝',
        hint: '만약=if · -f=test file · 그러면=then · 명령 보기=cat · 끝=fi.',
        required: ['if', '-f', 'data.json', 'cat', 'fi'],
        solution: 'if [ -f "data.json" ]; then cat data.json; fi',
        fakeOutput: [
          { cls: 't-prompt', text: 'root@tohu:~$ if [ -f "data.json" ]; then cat data.json; fi' },
          { cls: 't-output', text: '{"version":"1.0","status":"ok"}' },
        ]
      },
      {
        challenge: '변수 로그라인 값 명령 보기 "app.log" 파이프 명령 찾기 "FATAL" 파이프 명령 행수',
        hint: '변수 X 값 $(...)  = X=$(...). 파이프=| · 명령 보기=cat · 명령 찾기=grep · 명령 행수=wc -l.',
        required: ['logline', 'cat', 'app.log', 'grep', 'FATAL', 'wc', '-l'],
        solution: 'logline=$(cat app.log | grep "FATAL" | wc -l)',
        fakeOutput: [
          { cls: 't-prompt', text: 'root@tohu:~$ logline=$(cat app.log | grep "FATAL" | wc -l)' },
          { cls: 't-prompt', text: 'root@tohu:~$ echo $logline' },
          { cls: 't-output', text: '3' },
        ]
      }
    ]
  },

  /* ─── LIVELLO 2 — L'Illusione Isomorfica ─── */
  {
    id: 2,
    pip: '2',
    name: "L'Illusione Isomorfica",
    badge: "LIVELLO 2",
    difficulty: "● Facile",
    diffClass: "diff-easy",
    conceptShort: "Glifi 𐍈𐌿𐌴-Bash · SVO identico a Bash · Isomorfismo sintattico lineare",
    corpusIntro: "Il sistema <strong>𐍈𐌿𐌴-Bash (Xue-Bash)</strong> usa glifi senza radici note. La struttura rimane <strong>SVO identica a Bash</strong>: il significato emerge <em>esclusivamente</em> dalle co-occorrenze nel corpus — nessuna parola è deducibile per intuizione.",
    llmNote: "Un LLM riconosce facilmente la geometria SVO. Sostituire i token non ofusca la struttura if→then→fi: l'isomorfismo lineare è decodificabile con pochi esempi.",
    lesson: {
      icon: "🧠",
      title: "Livello 2 Completato — Isomorfismo Lineare",
      concept: "Sostituzione glifico 1:1 — la geometria sintattica rimane invariata",
      body: "Il sistema 𐍈𐌿𐌴-Bash dimostra che cambiare i simboli non basta: la struttura ⟦…⟧ ▻ … ⟡ è perfettamente isomorfa a if[…]then…fi. Un LLM analizza la posizione e la co-occorrenza dei token, non la loro forma grafica.\n\nL'isomorfismo lineare è il primo passo dell'offuscamento — necessario ma non sufficiente per ingannare i filtri semantici."
    },
    corpus: [
      { section: "Variabili" },
      { glyph: "⟨X⟩ ⇚ Y",  bash: "X=Y",   desc: "Assegnamento: ⟨ ⟩ = nome var · ⇚ = =" },
      { glyph: "¤⟨X⟩",      bash: "$X",    desc: "Invocazione variabile (prefisso ¤)" },
      { section: "Comandi Output e File" },
      { glyph: "⌽",  bash: "echo",    desc: "Stampa a schermo" },
      { glyph: "∇",  bash: "ls",      desc: "Elenca directory" },
      { glyph: "⚇",  bash: "cat",     desc: "Legge un file" },
      { glyph: "⚙",  bash: "wc -l",   desc: "Conta le righe" },
      { glyph: "☣",  bash: "grep",    desc: "Filtra pattern" },
      { glyph: "⚀",  bash: "touch",   desc: "Crea file vuoto" },
      { glyph: "⚁",  bash: "mkdir",   desc: "Crea directory" },
      { glyph: "⚃",  bash: "mv",      desc: "Sposta file" },
      { glyph: "⚄",  bash: "cp",      desc: "Copia file" },
      { glyph: "⚆",  bash: "rm",      desc: "Rimuove file" },
      { glyph: "⁑",  bash: "flag",    desc: "Modificatore / opzione comando" },
      { section: "Flussi e Pipeline" },
      { glyph: "⇄",  bash: "|",       desc: "Pipe — concatena comandi" },
      { glyph: "⥅",  bash: ">",       desc: "Redirect (sovrascrive)" },
      { glyph: "⥆",  bash: ">>",      desc: "Redirect (append)" },
      { section: "Condizionali  ·  ⟦ COND ⟧ ▻ ACT ⟡" },
      { glyph: "⟦ … ⟧", bash: "if [ … ]", desc: "Blocco condizionale" },
      { glyph: "▻",       bash: "then",     desc: "Allora / esegui" },
      { glyph: "⟡",       bash: "fi",       desc: "Chiude il blocco" },
      { glyph: "⋈",       bash: "else",     desc: "Ramo alternativo" },
      { glyph: "≎",  bash: "-eq",  desc: "Uguale numerico" },
      { glyph: "≮",  bash: "-ne",  desc: "Diverso" },
      { glyph: "≻",  bash: "-gt",  desc: "Maggiore di" },
      { glyph: "≺",  bash: "-lt",  desc: "Minore di" },
      { glyph: "≋",  bash: "=",    desc: "Uguale stringa" },
      { glyph: "⚍",  bash: "-f",   desc: "Test: è un file?" },
      { glyph: "⚎",  bash: "-d",   desc: "Test: è una directory?" },
      { section: "Cicli" },
      { glyph: "⟳ V ∊ SRC ⇉ ACT ⟡",      bash: "for V in SRC; do ACT; done",      desc: "Ciclo for" },
      { glyph: "⟲ ⟦ COND ⟧ ⇉ ACT ⟡",     bash: "while [ COND ]; do ACT; done",    desc: "Ciclo while" },
      { glyph: "🛠",       bash: "$(ls)",        desc: "Espansione di comando" },
      { glyph: "⦉ N M ⦊", bash: "$(seq N M)",   desc: "Range numerico" },
    ],
    corpusExamples: [
      // ── Sezione A: Variabili e Output ──
      { alien: '⟨𐌰⟩ ⇚ "𐌵"',              bash: 'a="𐌵"' },
      { alien: '⟨𐌱⟩ ⇚ 77',               bash: 'b=77' },
      { alien: '⌽ ¤⟨𐌰⟩',                 bash: 'echo $a' },
      { alien: '⌽ ¤⟨𐌱⟩',                 bash: 'echo $b' },
      { alien: '⟨𐌲⟩ ⇚ "/var"',            bash: 'c="/var"' },
      { alien: '⌽ "Ω: ¤⟨𐌲⟩"',            bash: 'echo "Ω: $c"' },
      // ── Sezione B: Sistema e I/O ──
      { alien: '∇',                        bash: 'ls' },
      { alien: '∇ ⁑ "-la"',               bash: 'ls -la' },
      { alien: '∇ ⁑ "-lh" ⟨𐌲⟩',          bash: 'ls -lh $c' },
      { alien: '⌹',                        bash: 'pwd' },
      { alien: '⚀ "init.txt"',             bash: 'touch init.txt' },
      { alien: '⚁ "data"',                 bash: 'mkdir data' },
      { alien: '⚃ "a.txt" "data/"',        bash: 'mv a.txt data/' },
      { alien: '⚄ "b.conf" "b.bak"',       bash: 'cp b.conf b.bak' },
      { alien: '⚆ ⁑ "-rf" "tmp/"',        bash: 'rm -rf tmp/' },
      { alien: '⌽ "Go" ⥅ "out.log"',      bash: 'echo "Go" > out.log' },
      { alien: '⌽ "End" ⥆ "out.log"',     bash: 'echo "End" >> out.log' },
      { alien: '⚇ "out.log"',              bash: 'cat out.log' },
      { alien: '☣ "error" "sys.log"',      bash: 'grep "error" sys.log' },
      { alien: '⚇ "sys.log" ⇄ ☣ "crit"', bash: 'cat sys.log | grep "crit"' },
      { alien: '⚇ "db.csv" ⇄ ⚙',         bash: 'cat db.csv | wc -l' },
      // ── Sezione C: Condizionali ──
      { alien: '⟦ ¤⟨𐌱⟩ ≎ 10 ⟧ ▻ ⌽ "OK" ⟡',              bash: 'if [ $b -eq 10 ]; then echo "OK"; fi' },
      { alien: '⟦ ¤⟨𐌱⟩ ≮ 0 ⟧ ▻ ⌽ "NO" ⟡',               bash: 'if [ $b -ne 0 ]; then echo "NO"; fi' },
      { alien: '⟦ ¤⟨𐌱⟩ ≻ 5 ⟧ ▻ ⌽ "HI" ⟡',               bash: 'if [ $b -gt 5 ]; then echo "HI"; fi' },
      { alien: '⟦ ¤⟨𐌱⟩ ≺ 20 ⟧ ▻ ⌽ "LO" ⟡',              bash: 'if [ $b -lt 20 ]; then echo "LO"; fi' },
      { alien: '⟦ ⚍ "sys.log" ⟧ ▻ ⌽ "YES" ⟡',            bash: 'if [ -f "sys.log" ]; then echo "YES"; fi' },
      { alien: '⟦ ⚎ "data" ⟧ ▻ ⌽ "DIR" ⟡',               bash: 'if [ -d "data" ]; then echo "DIR"; fi' },
      { alien: '⟦ ¤⟨𐌱⟩ ≻ 10 ⟧ ▻ ⌽ "A" ⋈ ⌽ "B" ⟡',        bash: 'if [ $b -gt 10 ]; then echo "A"; else echo "B"; fi' },
      { alien: '⟦ ¤⟨𐌰⟩ ≋ "root" ⟧ ▻ ⌽ "W" ⟡',            bash: 'if [ $a = "root" ]; then echo "W"; fi' },
      // ── Sezione D: Cicli ──
      { alien: '⟳ 𐌵 ∊ 🛠 ⇉ ⌽ ¤𐌵 ⟡',                     bash: 'for x in $(ls); do echo $x; done' },
      { alien: '⟳ 𐌶 ∊ "A B" ⇉ ⌽ ¤𐌶 ⟡',                   bash: 'for z in A B; do echo $z; done' },
      { alien: '⟳ 𐌱 ∊ ⦉ 1 5 ⦊ ⇉ ⌽ ¤𐌱 ⟡',                 bash: 'for b in $(seq 1 5); do echo $b; done' },
      { alien: '⟲ ⟦ ¤⟨𐌱⟩ ≺ 10 ⟧ ⇉ ⟨𐌱⟩ ⇚ ⍴ ¤⟨𐌱⟩ + 1 ⟡',   bash: 'while [ $b -lt 10 ]; do b=$((b+1)); done' },
      // ── Sezione E: Automazione ──
      { alien: '⚚ "/bin/bash"',                             bash: '#!/bin/bash' },
      { alien: '⟨𐌴⟩ ⇚ ¤1',                                 bash: 'arg1=$1' },
      { alien: '⟦ ¤# ≎ 0 ⟧ ▻ ⌽ "Null" ⍈ 1 ⟡',             bash: 'if [ $# -eq 0 ]; then echo "Null"; exit 1; fi' },
      { alien: '𐍈 ⚙공정 { ⚁ "bak" }',                       bash: 'process() { mkdir bak; }' },
      { alien: '⌿ ⚙공정',                                    bash: 'process' },
      { alien: '⎔ "+x" "run.sh"',                            bash: 'chmod +x run.sh' },
      { alien: '⟨𐌿⟩ ⇚ ⚇ "n.txt" ⇄ ⚙',                     bash: 'u=$(cat n.txt | wc -l)' },
    ],
    tests: [
      {
        challenge: '⌽ "Test in corso..."',
        hint: '⌽ = echo. Il contenuto tra virgolette rimane invariato.',
        required: ['echo', 'Test in corso'],
        solution: 'echo "Test in corso..."',
        fakeOutput: [
          { cls: 't-prompt', text: 'root@tohu:~$ echo "Test in corso..."' },
          { cls: 't-output', text: 'Test in corso...' },
        ]
      },
      {
        challenge: '⟨𐌳⟩ ⇚ "/tmp"',
        hint: '⟨𐌳⟩ = variabile d. ⇚ = operatore di assegnamento (=).',
        required: ['d=', '/tmp'],
        solution: 'd="/tmp"',
        fakeOutput: [
          { cls: 't-prompt', text: 'root@tohu:~$ d="/tmp"' },
          { cls: 't-prompt', text: 'root@tohu:~$ echo $d' },
          { cls: 't-output', text: '/tmp' },
        ]
      },
      {
        challenge: '⚀ "config.json"',
        hint: '⚀ = touch. Crea un file vuoto con il nome indicato.',
        required: ['touch', 'config.json'],
        solution: 'touch config.json',
        fakeOutput: [
          { cls: 't-prompt', text: 'root@tohu:~$ touch config.json' },
          { cls: 't-success', text: '[OK] config.json creato.' },
        ]
      },
      {
        challenge: '∇ ⁑ "-la" ⟨𐌳⟩',
        hint: '∇ = ls · ⁑ = flag/opzione · ⟨𐌳⟩ senza ¤ = invocazione della variabile $d.',
        required: ['ls', '-la', '$d'],
        solution: 'ls -la $d',
        fakeOutput: [
          { cls: 't-prompt', text: 'root@tohu:~$ ls -la $d' },
          { cls: 't-output', text: 'drwxr-xr-x  2 root root  60 Jan 15 10:00 .' },
        ]
      },
      {
        challenge: '⟦ ⚍ "config.json" ⟧ ▻ ⚇ "config.json" ⟡',
        hint: '⚍ = -f (test file) · ⟦…⟧ ▻ …⟡ = if[…]then…fi · ⚇ = cat.',
        required: ['if', '-f', 'config.json', 'cat', 'fi'],
        solution: 'if [ -f "config.json" ]; then cat config.json; fi',
        fakeOutput: [
          { cls: 't-prompt', text: 'root@tohu:~$ if [ -f "config.json" ]; then cat config.json; fi' },
          { cls: 't-output', text: '{"version":"1.0","env":"prod"}' },
        ]
      },
      {
        challenge: '⌽ "Log" ⥆ "system.log"',
        hint: '⥆ = >> (append). Confronta con ⥅ = > (sovrascrittura) nel corpus.',
        required: ['echo', 'Log', '>>', 'system.log'],
        solution: 'echo "Log" >> system.log',
        fakeOutput: [
          { cls: 't-prompt', text: 'root@tohu:~$ echo "Log" >> system.log' },
          { cls: 't-success', text: '[OK] Riga aggiunta a system.log.' },
        ]
      },
      {
        challenge: '⟦ ¤# ≎ 2 ⟧ ▻ ⌽ "OK" ⋈ ⌽ "ERR" ⟡',
        hint: '¤# = $# (n° argomenti) · ≎ = -eq · ⋈ = else.',
        required: ['if', '$#', '-eq', '2', 'echo', 'OK', 'else', 'ERR', 'fi'],
        solution: 'if [ $# -eq 2 ]; then echo "OK"; else echo "ERR"; fi',
        fakeOutput: [
          { cls: 't-prompt', text: 'root@tohu:~$ if [ $# -eq 2 ]; then echo "OK"; else echo "ERR"; fi' },
          { cls: 't-output', text: 'ERR' },
        ]
      },
      {
        challenge: '⟳ 𐌵 ∊ 🛠 ⇉ ⚇ ¤𐌵 ⟡',
        hint: '⟳…∊…⇉…⟡ = for…in…do…done · 🛠 = $(ls) · ⚇ = cat · ¤𐌵 = $x.',
        required: ['for', 'ls', 'do', 'cat', 'done'],
        solution: 'for x in $(ls); do cat $x; done',
        fakeOutput: [
          { cls: 't-prompt', text: 'root@tohu:~$ for x in $(ls); do cat $x; done' },
          { cls: 't-output', text: '--- file1.txt ---\n--- file2.txt ---' },
        ]
      },
      {
        challenge: '⟨𐌿⟩ ⇚ ⚇ "sys.log" ⇄ ☣ "FATAL" ⇄ ⚙',
        hint: '⟨𐌿⟩ ⇚ $(...) = u=$(...) · ⇄ = | · ⚇=cat · ☣=grep · ⚙=wc -l.',
        required: ['u', 'cat', 'sys.log', 'grep', 'FATAL', 'wc', '-l'],
        solution: 'u=$(cat sys.log | grep "FATAL" | wc -l)',
        fakeOutput: [
          { cls: 't-prompt', text: 'root@tohu:~$ u=$(cat sys.log | grep "FATAL" | wc -l)' },
          { cls: 't-prompt', text: 'root@tohu:~$ echo $u' },
          { cls: 't-output', text: '7' },
        ]
      },
      {
        challenge: '⟦ ¤⟨𐌿⟩ ≻ 0 ⟧ ▻ ⌽ "ALERT" ⟡',
        hint: '¤⟨𐌿⟩ = $u · ≻ = -gt · ⟦…⟧ ▻ …⟡ = if[…]then…fi.',
        required: ['if', '$u', '-gt', '0', 'then', 'echo', 'ALERT', 'fi'],
        solution: 'if [ $u -gt 0 ]; then echo "ALERT"; fi',
        fakeOutput: [
          { cls: 't-prompt', text: 'root@tohu:~$ if [ $u -gt 0 ]; then echo "ALERT"; fi' },
          { cls: 't-output', text: 'ALERT' },
        ]
      },
    ]
  },

  /* ─── LIVELLO 2 — Morfosintassi a Casi (SOV) ─── */
  {
    id: 3,
    pip: '3',
    name: "Morfosintassi a Casi",
    badge: "LIVELLO 3",
    difficulty: "● Medio",
    diffClass: "diff-medium",
    conceptShort: "Glifi 𐌼𐌿𐌸-Bash · SOV con declinazione dei casi · Verbo sempre in fondo",
    corpusIntro: "Il <strong>𐌼𐌿𐌸-Bash (Muth-Bash)</strong> usa morfosintassi a casi: ogni variabile cambia suffisso in base al ruolo nella frase. <strong>Non esiste il segno =</strong>. Il verbo chiude sempre la clausola. Il significato è impossibile da intuire senza il corpus.",
    llmNote: "Tasso di successo ~50% anche con il corpus. La declinazione dei casi (Ergativo/Accusativo/Locativo) e la posizione finale del verbo rendono ambigua la decodifica senza esempi. I filtri AI perdono il pattern semantico.",
    lesson: {
      icon: "📐",
      title: "Livello 3 Completato — Morfosintassi a Casi",
      concept: "Sistema SOV con declinazione — la geometria sintattica cambia radicalmente",
      body: "Il Muth-Bash rompe l'isomorfismo lineare: non basta più mappare simbolo→parola, perché il ruolo grammaticale (chi assegna? chi legge? dove va il flusso?) è codificato nei suffissi. La posizione finale del verbo inverte l'ordine atteso e crea ambiguità strutturale.\n\nI filtri AI faticano su SOV: la stringa 'config.json' compare prima del test condizionale, rendendo difficile classificare l'intento senza analizzare l'intera frase."
    },
    corpus: [
      { section: "Variabili — Declinazione dei Casi" },
      { glyph: "X-𐌵",  bash: "X=value",  desc: "Caso Ergativo: la variabile riceve un valore" },
      { glyph: "X-𐌶",  bash: "$X",       desc: "Caso Accusativo: la variabile viene letta" },
      { glyph: "X-𐌷",  bash: "$X (cond)",desc: "Caso Locativo: usata in test condizionale" },
      { glyph: "X-𐌸",  bash: "file dest", desc: "Caso Direttivo: file di destinazione flusso" },
      { section: "Variabili Predefinite" },
      { glyph: "𐌪", bash: "name / $name", desc: "Variabile stringa generica" },
      { glyph: "𐌫", bash: "num / $num",   desc: "Variabile numerica" },
      { glyph: "𐌬", bash: "path / $path", desc: "Variabile percorso" },
      { glyph: "𐌳", bash: "d / $d",       desc: "Variabile directory" },
      { glyph: "𐌿", bash: "u / $u",       desc: "Variabile contatore" },
      { glyph: "𐌴", bash: "file (iter.)", desc: "Variabile iteratore nei cicli" },
      { glyph: "𐌾", bash: "$#",           desc: "Variabile speciale: numero di argomenti" },
      { section: "Verbi (sempre in fondo alla clausola)" },
      { glyph: "𐌰", bash: "echo",  desc: "Stampa a schermo" },
      { glyph: "𐌿", bash: "ls",    desc: "Elenca directory" },
      { glyph: "𐌱", bash: "cat",   desc: "Legge file" },
      { glyph: "𐌲", bash: "touch", desc: "Crea file vuoto" },
      { glyph: "𐌳", bash: "mkdir", desc: "Crea directory" },
      { glyph: "☣",  bash: "grep",  desc: "Filtra pattern" },
      { glyph: "⚙",  bash: "wc -l", desc: "Conta righe" },
      { section: "Flussi, Pipeline, Redirect" },
      { glyph: "⨳",  bash: "|",   desc: "Pipeline — concatena verbi" },
      { glyph: "⥅",  bash: ">",   desc: "Redirect (sovrascrive)" },
      { glyph: "⥆",  bash: ">>",  desc: "Redirect (append)" },
      { section: "Condizionali Fusi (operatore + 𐍈 = if)" },
      { glyph: "≟𐍈",  bash: "if -eq", desc: "Se uguale numerico" },
      { glyph: "≠𐍈",  bash: "if -ne", desc: "Se diverso" },
      { glyph: "𐍉𐍈",  bash: "if -gt", desc: "Se maggiore di" },
      { glyph: "𐍁𐍈",  bash: "if -lt", desc: "Se minore di" },
      { glyph: "⚍𐍈",  bash: "if -f",  desc: "Se è un file" },
      { glyph: "⚎𐍈",  bash: "if -d",  desc: "Se è una directory" },
      { glyph: "⚡",   bash: "then",   desc: "Conseguente (azione se vero)" },
      { glyph: "⋈",   bash: "else",   desc: "Alternativa" },
      { section: "Cicli e Sostituzione Comando" },
      { glyph: "V 🛠CMD⟳ ⚡ ACT", bash: "for V in $(CMD); do ACT; done", desc: "" },
      { glyph: "🛠 … 🛠",         bash: "$(…)",                          desc: "Circumfisso: sostituzione comando" },
    ],
    corpusExamples: [
      // ── Sezione A: Variabili ──
      { alien: '"안녕" 𐌪𐌵',             bash: 'name="안녕"' },
      { alien: '42 𐌫𐌵',                bash: 'num=42' },
      { alien: '𐌪𐌶 𐌰',                 bash: 'echo $name' },
      { alien: '𐌫𐌶 𐌰',                 bash: 'echo $num' },
      { alien: '"/var/log" 𐌬𐌵',        bash: 'path="/var/log"' },
      { alien: '"Log: " 𐌬𐌶 𐌰',         bash: 'echo "Log: $path"' },
      // ── Sezione B: Comandi e I/O ──
      { alien: '𐌿',                     bash: 'ls' },
      { alien: '"-la" 𐌿',               bash: 'ls -la' },
      { alien: '"-lh" 𐌬𐌶 𐌿',           bash: 'ls -lh $path' },
      { alien: '"test.txt" 𐌲',          bash: 'touch test.txt' },
      { alien: '"backup" 𐌳',            bash: 'mkdir backup' },
      { alien: '"output.txt"𐌸 "Hello" 𐌰 ⥅', bash: 'echo "Hello" > output.txt' },
      { alien: '"output.txt"𐌸 "Line 2" 𐌰 ⥆', bash: 'echo "Line 2" >> output.txt' },
      { alien: '"output.txt" 𐌱',        bash: 'cat output.txt' },
      { alien: '"sys.log" "error" ☣',   bash: 'grep "error" sys.log' },
      // ── Sezione C: Pipeline e Condizionali ──
      { alien: '"sys.log" 𐌱 ⨳ "crit" ☣',          bash: 'cat sys.log | grep "crit"' },
      { alien: '"data.csv" 𐌱 ⨳ ⚙',                 bash: 'cat data.csv | wc -l' },
      { alien: '10 𐌫𐌷 ≟𐍈 ⚡ "십" 𐌰',               bash: 'if [ $num -eq 10 ]; then echo "십"; fi' },
      { alien: '0 𐌫𐌷 ≠𐍈 ⚡ "아님" 𐌰',              bash: 'if [ $num -ne 0 ]; then echo "아님"; fi' },
      { alien: '5 𐌫𐌷 𐍉𐍈 ⚡ "큼" 𐌰',                bash: 'if [ $num -gt 5 ]; then echo "큼"; fi' },
      { alien: '20 𐌫𐌷 𐍁𐍈 ⚡ "작음" 𐌰',             bash: 'if [ $num -lt 20 ]; then echo "작음"; fi' },
      { alien: '"sys.log" ⚍𐍈 ⚡ "존재" 𐌰',          bash: 'if [ -f "sys.log" ]; then echo "존재"; fi' },
      { alien: '"backup" ⚎𐍈 ⚡ "폴더" 𐌰',           bash: 'if [ -d "backup" ]; then echo "폴더"; fi' },
      { alien: '10 𐌫𐌷 𐍉𐍈 ⚡ "A" 𐌰 ⋈ "B" 𐌰',        bash: 'if [ $num -gt 10 ]; then echo "A"; else echo "B"; fi' },
      { alien: '"admin" 𐌪𐌷 ≟𐍈 ⚡ "환영" 𐌰',          bash: 'if [ $name = "admin" ]; then echo "환영"; fi' },
      // ── Sezione D: Iterazioni e Sotto-computazioni ──
      { alien: '𐌴 🛠𐌿 ⟳ ⚡ 𐌴𐌶 𐌰',                   bash: 'for file in $(ls); do echo $file; done' },
      { alien: '𐌾',                                    bash: '$#' },
      { alien: '0 𐌾𐌷 ≟𐍈 ⚡ "Null" 𐌰',                bash: 'if [ $# -eq 0 ]; then echo "Null"; fi' },
      { alien: '🛠 "sys.log" 𐌱 ⨳ ⚙ 🛠 𐌿𐌵',           bash: 'u=$(cat sys.log | wc -l)' },
    ],
    tests: [
      {
        challenge: '"Test in corso..." 𐌰',
        hint: '𐌰 = echo e va sempre in fondo. Il valore precede il verbo.',
        required: ['echo', 'Test in corso'],
        solution: 'echo "Test in corso..."',
        fakeOutput: [
          { cls: 't-prompt', text: 'root@tohu:~$ echo "Test in corso..."' },
          { cls: 't-output', text: 'Test in corso...' },
        ]
      },
      {
        challenge: '"/tmp" 𐌳𐌵',
        hint: 'Il suffisso -𐌵 (Ergativo) = la variabile riceve un valore. 𐌳 = d. Non c\'è il segno =.',
        required: ['d=', '/tmp'],
        solution: 'd="/tmp"',
        fakeOutput: [
          { cls: 't-prompt', text: 'root@tohu:~$ d="/tmp"' },
          { cls: 't-output', text: '(variabile d assegnata)' },
        ]
      },
      {
        challenge: '"config.json" 𐌲',
        hint: '𐌲 = touch (verbo di creazione). Il file è l\'oggetto, il verbo chiude.',
        required: ['touch', 'config.json'],
        solution: 'touch config.json',
        fakeOutput: [
          { cls: 't-prompt', text: 'root@tohu:~$ touch config.json' },
          { cls: 't-success', text: '[OK] config.json creato.' },
        ]
      },
      {
        challenge: '"-la" 𐌳𐌶 𐌿',
        hint: '𐌳𐌶 = caso Accusativo di 𐌳: lettura della variabile $d. Flag prima del verbo finale 𐌿 (ls).',
        required: ['ls', '-la', '$d'],
        solution: 'ls -la $d',
        fakeOutput: [
          { cls: 't-prompt', text: 'root@tohu:~$ ls -la $d' },
          { cls: 't-output', text: 'drwxrwxrwt 12 root root 280 Jan 15 /tmp' },
        ]
      },
      {
        challenge: '"config.json" ⚍𐍈 ⚡ "config.json" 𐌱',
        hint: '⚍𐍈 = if[-f] fuso. ⚡ = then. Il verbo 𐌱 (cat) chiude il conseguente. Manca fi? Sottinteso.',
        required: ['if', '-f', 'config.json', 'cat', 'fi'],
        solution: 'if [ -f "config.json" ]; then cat config.json; fi',
        fakeOutput: [
          { cls: 't-prompt', text: 'root@tohu:~$ if [ -f "config.json" ]; then cat config.json; fi' },
          { cls: 't-output', text: '{"version":"2.0"}' },
        ]
      },
      {
        challenge: '"system.log"𐌸 "Log" 𐌰 ⥆',
        hint: '𐌸 = Caso Direttivo (file di destinazione). Struttura: [dest] [valore] [verbo] [redirect].',
        required: ['echo', 'Log', '>>', 'system.log'],
        solution: 'echo "Log" >> system.log',
        fakeOutput: [
          { cls: 't-prompt', text: 'root@tohu:~$ echo "Log" >> system.log' },
          { cls: 't-success', text: '[OK] Riga aggiunta a system.log.' },
        ]
      },
      {
        challenge: '2 𐌾𐌷 ≟𐍈 ⚡ "OK" 𐌰 ⋈ "ERR" 𐌰',
        hint: '𐌾 = $# (n° argomenti) · -𐌷 = caso Locativo (condizionale) · ≟𐍈 = if -eq · ⋈ = else.',
        required: ['if', '$#', '-eq', '2', 'OK', 'else', 'ERR', 'fi'],
        solution: 'if [ $# -eq 2 ]; then echo "OK"; else echo "ERR"; fi',
        fakeOutput: [
          { cls: 't-prompt', text: 'root@tohu:~$ if [ $# -eq 2 ]; then echo "OK"; else echo "ERR"; fi' },
          { cls: 't-output', text: 'ERR' },
        ]
      },
      {
        challenge: '𐌴 🛠𐌿 ⟳ ⚡ 𐌴𐌶 𐌱',
        hint: '𐌴 = iteratore file · 🛠𐌿 = $(ls) · ⟳ ⚡ = for...do · 𐌴𐌶 = $file (Accusativo) · 𐌱 = cat.',
        required: ['for', 'ls', 'do', 'cat', 'done'],
        solution: 'for file in $(ls); do cat $file; done',
        fakeOutput: [
          { cls: 't-prompt', text: 'root@tohu:~$ for file in $(ls); do cat $file; done' },
          { cls: 't-output', text: '--- iterazione su tutti i file ---' },
        ]
      },
      {
        challenge: '🛠 "sys.log" "FATAL" ☣ ⨳ ⚙ 🛠 𐌿𐌵',
        hint: '🛠…🛠 = $(...) · ⨳ = | · ☣ = grep · ⚙ = wc -l · 𐌿𐌵 = assegnamento a $u (Ergativo).',
        required: ['u', 'grep', 'FATAL', 'sys.log', 'wc', '-l'],
        solution: 'u=$(grep "FATAL" sys.log | wc -l)',
        fakeOutput: [
          { cls: 't-prompt', text: 'root@tohu:~$ u=$(grep "FATAL" sys.log | wc -l)' },
          { cls: 't-prompt', text: 'root@tohu:~$ echo $u' },
          { cls: 't-output', text: '5' },
        ]
      },
      {
        challenge: '0 𐌿𐌷 𐍉𐍈 ⚡ "ALERT" 𐌰',
        hint: '𐌿𐌷 = variabile $u al caso Locativo (condizionale). 𐍉𐍈 = if -gt. 𐌰 = echo in coda.',
        required: ['if', '$u', '-gt', '0', 'echo', 'ALERT', 'fi'],
        solution: 'if [ $u -gt 0 ]; then echo "ALERT"; fi',
        fakeOutput: [
          { cls: 't-prompt', text: 'root@tohu:~$ if [ $u -gt 0 ]; then echo "ALERT"; fi' },
          { cls: 't-output', text: 'ALERT' },
        ]
      },
    ]
  },

  /* ─── LIVELLO 3 — La Pila e l'Alchimia (RPN) ─── */
  {
    id: 4,
    pip: '4',
    name: "La Pila e l'Alchimia",
    badge: "LIVELLO 4",
    difficulty: "● Difficile",
    diffClass: "diff-hard",
    conceptShort: "Glifi 𐎣𐎢𐎾-Stack · RPN a Pila LIFO · Alchimia · Base-4 Lunare",
    corpusIntro: "Il <strong>𐎣𐎢𐎾-Stack (Kul-Stack)</strong> usa <strong>Reverse Polish Notation</strong>: i dati vengono spinti nella pila, gli operatori alchemici li consumano. I numeri sono in <strong>base-4 lunare</strong>. Nessun nome di variabile: solo Registri cuneiformi. Tasso di successo senza corpus: ~30%.",
    llmNote: "La RPN e la base-4 lunare rompono la tokenizzazione statistica degli LLM. La geometria della frase è completamente invertita rispetto ai linguaggi SVO/SOV.",
    lesson: {
      icon: "⚗",
      title: "Livello 4 Completato — La Pila e l'Alchimia",
      concept: "RPN + Base-4 Lunare — Rottura della Tokenizzazione",
      body: "La Notazione Polacca Inversa e la matematica in base-4 abbattono i pattern statistici su cui si basano i tokenizer degli LLM. I numeri rappresentati da fasi lunari (🌑🌒🌓🌔) non corrispondono ad alcun token del corpus di addestramento standard.\n\nLa pila invisibile (LIFO) inverte l'ordine atteso: operando sempre dopo i dati, i comandi alchemici sono indistinguibili da simboli decorativi senza il corpus."
    },
    corpus: [
      { section: "Registri di Memoria (variabili senza nome)" },
      { glyph: "𐎀", bash: "a / $a", desc: "Registro A" },
      { glyph: "𐎁", bash: "b / $b", desc: "Registro B" },
      { glyph: "𐎂", bash: "c / $c", desc: "Registro C" },
      { glyph: "𐎄", bash: "file (iter.)", desc: "Registro iteratore nei cicli" },
      { section: "Operatori di Pila" },
      { glyph: "⤛", bash: "= (assegna)", desc: "Ancora: POP registro e valore → assegnamento" },
      { glyph: "⤜", bash: "LEGGI $reg",  desc: "Apri registro: PUSH contenuto sullo stack" },
      { section: "Comandi Alchemici (consumano la pila)" },
      { glyph: "🜂", bash: "echo",   desc: "Fuoco — POP e stampa" },
      { glyph: "🜁", bash: "ls",     desc: "Aria — elenca directory" },
      { glyph: "🜄", bash: "cat",    desc: "Acqua — flusso/lettura file" },
      { glyph: "🜃", bash: "touch",  desc: "Terra — crea file" },
      { glyph: "🜕", bash: "mkdir",  desc: "Crea directory" },
      { glyph: "🜍", bash: "grep",   desc: "Zolfo — filtra pattern" },
      { glyph: "🜋", bash: "wc -l",  desc: "Sale — conta righe" },
      { glyph: "🜚", bash: "-f",     desc: "Test: è un file?" },
      { section: "Redirect e Pipeline" },
      { glyph: "⤏",  bash: ">",  desc: "Dardo destro — redirect (sovrascrive)" },
      { glyph: "⤐",  bash: ">>", desc: "Dardo doppio — redirect (append)" },
      { section: "Base-4 Lunare  ·  XY = X×4 + Y" },
      { glyph: "🌑 🌒 🌓 🌔", bash: "0  1  2  3", desc: "Quattro fasi = quattro cifre" },
      { glyph: "🌒🌑", bash: "4",  desc: "1×4 + 0 = 4" },
      { glyph: "🌓🌓", bash: "10", desc: "2×4 + 2 = 10" },
      { glyph: "🌔🌒", bash: "13", desc: "3×4 + 1 = 13" },
      { section: "Condizionali e Cicli (postfisso)" },
      { glyph: "⚖",  bash: "-eq (uguale)",   desc: "POP×2 → push confronto di uguaglianza" },
      { glyph: "⋗",  bash: "-gt (maggiore)",  desc: "POP×2 → push confronto maggiore" },
      { glyph: "⧖",  bash: "if…then",         desc: "POP condizione → apre blocco if" },
      { glyph: "⧗",  bash: "else",             desc: "Ramo alternativo" },
      { glyph: "⧨",  bash: "fi",              desc: "Chiude blocco condizionale" },
      { glyph: "⟦…⟧ ⥀", bash: "for…do…done", desc: "Blocco iterato dall'Uroboro ⥀" },
    ],
    corpusExamples: [
      // ── Sezione A: Memoria e Output ──
      { alien: '"test" 𐎀 ⤛',            bash: 'a="test"' },
      { alien: '"log.txt" 𐎁 ⤛',         bash: 'b="log.txt"' },
      { alien: '𐎀 ⤜ 🜂',                bash: 'echo $a' },
      { alien: '𐎁 ⤜ 🜂',                bash: 'echo $b' },
      { alien: '"Start" 🜂',              bash: 'echo "Start"' },
      // ── Sezione B: Sistema Operativo ──
      { alien: '🜁',                      bash: 'ls' },
      { alien: '"-la" 🜁',               bash: 'ls -la' },
      { alien: '𐎁 ⤜ 🜄',                bash: 'cat $b' },
      { alien: '"data" 🜃',              bash: 'touch data' },
      { alien: '"dir" 🜕',               bash: 'mkdir dir' },
      { alien: '"out" 🜂 "log.txt" ⤏',  bash: 'echo "out" > log.txt' },
      { alien: '"end" 🜂 "log.txt" ⤐',  bash: 'echo "end" >> log.txt' },
      { alien: '"sys.log" 🜄 "FATAL" 🜍', bash: 'cat sys.log | grep "FATAL"' },
      { alien: '"data.csv" 🜄 🜋',        bash: 'cat data.csv | wc -l' },
      // ── Sezione C: Matematica Astrale ──
      { alien: '🌓 𐎂 ⤛',                              bash: 'c=2' },
      { alien: '🌒🌑 𐎂 ⤛',                            bash: 'c=4' },
      { alien: '🌓🌓 𐎂 ⤛',                            bash: 'c=10' },
      { alien: '𐎂 ⤜ 🌒🌑 ⚖ ⧖ "OK" 🜂 ⧨',            bash: 'if [ $c -eq 4 ]; then echo "OK"; fi' },
      { alien: '𐎂 ⤜ 🌑 ⋗ ⧖ "HI" 🜂 ⧗ "LO" 🜂 ⧨',    bash: 'if [ $c -gt 0 ]; then echo "HI"; else echo "LO"; fi' },
      // ── Sezione D: Flussi e Loop ──
      { alien: '𐎁 ⤜ 🜚 ⧖ 𐎁 ⤜ 🜄 ⧨',                bash: 'if [ -f $b ]; then cat $b; fi' },
      { alien: '🜁 ⟦ 𐎄 ⤛ 𐎄 ⤜ 🜄 ⟧ ⥀',              bash: 'for file in $(ls); do cat $file; done' },
      { alien: '"sys.log" 🜄 "ERR" 🜍 🜋 𐎀 ⤛',        bash: 'a=$(cat sys.log | grep "ERR" | wc -l)' },
    ],
    tests: [
      {
        challenge: '"Init..." 🜂',
        hint: '🜂 = Fuoco = echo. Il dato viene spinto per primo, l\'alchimia lo consuma.',
        required: ['echo', 'Init'],
        solution: 'echo "Init..."',
        fakeOutput: [
          { cls: 't-prompt', text: 'root@tohu:~$ echo "Init..."' },
          { cls: 't-output', text: 'Init...' },
        ]
      },
      {
        challenge: '"/etc" 𐎀 ⤛',
        hint: 'Il valore "/etc" viene spinto, poi il Registro 𐎀 (a), infine ⤛ ancora tutto in assegnamento.',
        required: ['a=', '/etc'],
        solution: 'a="/etc"',
        fakeOutput: [
          { cls: 't-prompt', text: 'root@tohu:~$ a="/etc"' },
          { cls: 't-output', text: '(registro a assegnato)' },
        ]
      },
      {
        challenge: '𐎀 ⤜ 🜁',
        hint: '𐎀 ⤜ = apri Registro A → PUSH $a. 🜁 = Aria = ls. Legge ls sul contenuto del registro.',
        required: ['ls', '$a'],
        solution: 'ls $a',
        fakeOutput: [
          { cls: 't-prompt', text: 'root@tohu:~$ ls $a' },
          { cls: 't-output', text: 'bin  etc  lib  usr' },
        ]
      },
      {
        challenge: '"config.json" 🜃',
        hint: '🜃 = Terra = touch. Crea il file spinto in pila.',
        required: ['touch', 'config.json'],
        solution: 'touch config.json',
        fakeOutput: [
          { cls: 't-prompt', text: 'root@tohu:~$ touch config.json' },
          { cls: 't-success', text: '[OK] config.json creato.' },
        ]
      },
      {
        challenge: '"config.json" 🜚 ⧖ "config.json" 🜄 ⧨',
        hint: '🜚 = test -f. ⧖ = then. 🜄 = Acqua = cat. ⧨ = fi.',
        required: ['if', '-f', 'config.json', 'cat', 'fi'],
        solution: 'if [ -f config.json ]; then cat config.json; fi',
        fakeOutput: [
          { cls: 't-prompt', text: 'root@tohu:~$ if [ -f config.json ]; then cat config.json; fi' },
          { cls: 't-output', text: '{"env":"prod"}' },
        ]
      },
      {
        challenge: '𐎀 ⤜ 🜂 "list.txt" ⤏',
        hint: '𐎀 ⤜ = PUSH $a. 🜂 = echo. ⤏ = > (redirect). L\'output va nel file.',
        required: ['echo', '$a', '>', 'list.txt'],
        solution: 'echo $a > list.txt',
        fakeOutput: [
          { cls: 't-prompt', text: 'root@tohu:~$ echo $a > list.txt' },
          { cls: 't-success', text: '[OK] Scritto in list.txt.' },
        ]
      },
      {
        challenge: '🜁 ⟦ 𐎄 ⤛ 𐎄 ⤜ 🜂 ⟧ ⥀',
        hint: '🜁 = $(ls). ⟦…⟧ = blocco do…done. 𐎄 ⤛ = assegna a file. 𐎄 ⤜ 🜂 = echo $file. ⥀ = for.',
        required: ['for', 'ls', 'do', 'echo', 'done'],
        solution: 'for file in $(ls); do echo $file; done',
        fakeOutput: [
          { cls: 't-prompt', text: 'root@tohu:~$ for file in $(ls); do echo $file; done' },
          { cls: 't-output', text: 'config.json\ndata.csv\nsys.log' },
        ]
      },
      {
        challenge: '"data.csv" 🜄 "FAIL" 🜍 🜋 𐎁 ⤛',
        hint: '🜄=cat · 🜍=grep · 🜋=wc -l. La pipeline si legge da sinistra. ⤛ ancora il risultato in 𐎁 (b).',
        required: ['b', 'cat', 'data.csv', 'grep', 'FAIL', 'wc', '-l'],
        solution: 'b=$(cat data.csv | grep "FAIL" | wc -l)',
        fakeOutput: [
          { cls: 't-prompt', text: 'root@tohu:~$ b=$(cat data.csv | grep "FAIL" | wc -l)' },
          { cls: 't-prompt', text: 'root@tohu:~$ echo $b' },
          { cls: 't-output', text: '3' },
        ]
      },
      {
        challenge: '𐎁 ⤜ 🌒🌑 ⋗ ⧖ "WARNING" 🜂 ⧗ "OK" 🜂 ⧨',
        hint: '🌒🌑 = 1×4+0 = 4 (base-4 lunare). ⋗ = -gt. ⧖=then · ⧗=else · ⧨=fi.',
        required: ['if', '$b', '-gt', '4', 'WARNING', 'else', 'OK', 'fi'],
        solution: 'if [ $b -gt 4 ]; then echo "WARNING"; else echo "OK"; fi',
        stackSteps: [
          { token: '𐎁 ⤜',    action: 'PUSH',         value: '$b',         desc: 'PUSH — apre Registro B, spinge $b' },
          { token: '🌒🌑',    action: 'PUSH',         value: '4',          desc: 'PUSH — 🌒🌑 = 1×4+0 = 4 (base-4 lunare)' },
          { token: '⋗',      action: 'POP2_COMPARE', value: '[$b -gt 4]', desc: 'CMP — estrae $b e 4, confronto -gt' },
          { token: '⧖',      action: 'POP_IF',        value: null,         desc: 'IF — apre blocco if…then' },
          { token: '"WARNING"', action: 'PUSH',       value: '"WARNING"',  desc: 'PUSH — spinge "WARNING"' },
          { token: '🜂',      action: 'POP_ECHO',      value: null,         desc: 'ECHO — stampa "WARNING"' },
          { token: '⧗',      action: 'FI',            value: null,         desc: 'ELSE — ramo alternativo' },
          { token: '"OK"',   action: 'PUSH',          value: '"OK"',       desc: 'PUSH — spinge "OK"' },
          { token: '🜂',      action: 'POP_ECHO',      value: null,         desc: 'ECHO — stampa "OK"' },
          { token: '⧨',      action: 'FI',            value: null,         desc: 'FI — chiude blocco condizionale' },
        ],
        fakeOutput: [
          { cls: 't-prompt', text: 'root@tohu:~$ if [ $b -gt 4 ]; then echo "WARNING"; else echo "OK"; fi' },
          { cls: 't-output', text: 'OK' },
        ]
      },
      {
        challenge: '𐎁 ⤜ 🌓🌓 ⚖ ⧖ "TEN" 🜂 ⧨',
        hint: '🌓🌓 = 2×4+2 = 10 (base-4 lunare). 𐎁 ⤜ = PUSH $b. ⚖ = -eq. ⧖=then · ⧨=fi.',
        required: ['if', '$b', '-eq', '10', 'echo', 'TEN', 'fi'],
        solution: 'if [ $b -eq 10 ]; then echo "TEN"; fi',
        stackSteps: [
          { token: '𐎁 ⤜',  action: 'PUSH',         value: '$b',          desc: 'PUSH — apre Registro B, spinge $b' },
          { token: '🌓🌓',  action: 'PUSH',         value: '10',          desc: 'PUSH — 🌓🌓 = 2×4+2 = 10 (base-4 lunare)' },
          { token: '⚖',    action: 'POP2_COMPARE', value: '[$b -eq 10]', desc: 'CMP — estrae $b e 10, confronto -eq' },
          { token: '⧖',    action: 'POP_IF',        value: null,          desc: 'IF — apre blocco if…then' },
          { token: '"TEN"',action: 'PUSH',          value: '"TEN"',       desc: 'PUSH — spinge "TEN"' },
          { token: '🜂',    action: 'POP_ECHO',      value: null,          desc: 'ECHO — estrae "TEN" e lo stampa' },
          { token: '⧨',    action: 'FI',            value: null,          desc: 'FI — chiude blocco condizionale' },
        ],
        fakeOutput: [
          { cls: 't-prompt', text: 'root@tohu:~$ if [ $b -eq 10 ]; then echo "TEN"; fi' },
          { cls: 't-output', text: 'TEN' },
        ]
      },
    ]
  },

  /* ─── LIVELLO 4 — Il Vuoto Assoluto ─── */
  {
    id: 5,
    pip: '5',
    name: "Il Vuoto Assoluto",
    badge: "LIVELLO 5",
    difficulty: "● Esperto",
    diffClass: "diff-expert",
    conceptShort: "Glifi 𐎣𐎢𐎾-Tohu · Hashing I-Ching · RPN · Ancoraggio Semantico Nullo",
    corpusIntro: "<strong>Zero stringhe leggibili.</strong> File, path e messaggi sono sostituiti da <strong>Esagrammi I-Ching</strong>. Senza la mappa di hashing nel corpus, il codice è rumore puro. Con essa, si rivela come un attacco Few-Shot reale.",
    llmNote: "Senza la tabella: tasso successo ~0%. Con la tabella allegata: l'LLM riesce (few-shot). Questo È il vettore d'attacco reale contro i filtri semantici AI.",
    lesson: {
      icon: "☰",
      title: "⚠ Lezione Finale — Il Vuoto Assoluto",
      concept: "Hashing Concettuale I-Ching — Ancoraggio Semantico Nullo",
      body: "Poiché non esistono stringhe malevole riconoscibili, i filtri AI non scattano mai. Un attaccante insegna il Kul-Tohu a un LLM via Few-Shot (iniettando il corpus lontano dal payload), lo fa generare codice nei glifi, ed esegue localmente un decodificatore.\n\nIl modello non sa di produrre codice pericoloso. Questo è il limite attuale della difesa semantica: non puoi filtrare ciò che non riconosci come minaccia."
    },
    corpus: [
      { section: "Tabella Hash — Esagrammi I-Ching → Stringhe" },
      { glyph: "䷀", bash: '"sys.log"',      desc: "Log di sistema principale" },
      { glyph: "䷁", bash: '"config.json"',  desc: "File di configurazione" },
      { glyph: "䷂", bash: '"FATAL_ERROR"',  desc: "Messaggio di errore critico" },
      { glyph: "䷃", bash: '"OK_200"',       desc: "Risposta di successo" },
      { glyph: "䷄", bash: '"/var/www"',     desc: "Percorso web root" },
      { glyph: "䷅", bash: '"backup.tar"',   desc: "Archivio di backup" },
      { section: "Operatori di Pila (ereditati da Kul-Stack)" },
      { glyph: "⤛",  bash: "= (assegna)",   desc: "Ancora valore in registro" },
      { glyph: "⤜",  bash: "LEGGI $reg",    desc: "Apre registro → PUSH contenuto" },
      { section: "Comandi Alchemici" },
      { glyph: "🜂",  bash: "echo",   desc: "Fuoco — stampa/output" },
      { glyph: "🜁",  bash: "ls",     desc: "Aria — elenca" },
      { glyph: "🜄",  bash: "cat",    desc: "Acqua — flusso/lettura" },
      { glyph: "🜃",  bash: "touch",  desc: "Terra — crea file" },
      { glyph: "🜕",  bash: "mkdir",  desc: "Crea directory" },
      { glyph: "🜍",  bash: "grep",   desc: "Zolfo — filtra" },
      { glyph: "🜋",  bash: "wc -l",  desc: "Sale — conta righe" },
      { glyph: "🜚",  bash: "-f",     desc: "Test esistenza file" },
      { glyph: "⤏",  bash: ">",      desc: "Redirect (sovrascrive)" },
      { glyph: "⤐",  bash: ">>",     desc: "Redirect (append)" },
      { section: "Base-4 Lunare  ·  posizionale" },
      { glyph: "🌑 🌒 🌓 🌔", bash: "0  1  2  3",  desc: "Cifre base-4" },
      { glyph: "🌓🌑",         bash: "8",           desc: "2×4 + 0 = 8" },
      { glyph: "🌒🌑🌑",       bash: "16",          desc: "1×16 + 0 + 0 = 16" },
      { section: "Condizionali e Cicli (postfisso RPN)" },
      { glyph: "⚖",       bash: "-eq",              desc: "CMP uguaglianza" },
      { glyph: "⋗",       bash: "-gt",              desc: "CMP maggiore di" },
      { glyph: "⧖ … ⧨",  bash: "if…then…fi",       desc: "Blocco condizionale" },
      { glyph: "⧗",       bash: "else",             desc: "Ramo alternativo" },
      { glyph: "⟦…⟧ ⥀",  bash: "for…do…done",      desc: "Ciclo con Uroboro" },
    ],
    corpusExamples: [
      // ── Sezione A: Hashing dei Dati ──
      { alien: '䷀ 𐎀 ⤛',               bash: 'a="sys.log"' },
      { alien: '䷁ 𐎁 ⤛',               bash: 'b="config.json"' },
      { alien: '䷂ 𐎂 ⤛',               bash: 'c="FATAL_ERROR"' },
      { alien: '䷃ 𐎃 ⤛',               bash: 'd="OK_200"' },
      { alien: '䷄ 𐎄 ⤛',               bash: 'e="/var/www"' },
      { alien: '䷅ 𐎅 ⤛',               bash: 'f="backup.tar"' },
      // ── Sezione B: Operazioni di Base ──
      { alien: '䷀ 🜄',                 bash: 'cat sys.log' },
      { alien: '䷁ 🜃',                 bash: 'touch config.json' },
      { alien: '䷄ 🜕',                 bash: 'mkdir /var/www' },
      { alien: '䷃ 🜂',                 bash: 'echo "OK_200"' },
      { alien: '䷂ 🜂 ䷀ ⤐',            bash: 'echo "FATAL_ERROR" >> sys.log' },
      // ── Sezione C: Pipeline Alchemiche ──
      { alien: '䷀ 🜄 ䷂ 🜍',           bash: 'cat sys.log | grep "FATAL_ERROR"' },
      { alien: '䷀ 🜄 ䷂ 🜍 🜋 𐎀 ⤛',   bash: 'a=$(cat sys.log | grep "FATAL_ERROR" | wc -l)' },
      // ── Sezione D: Matematica Lunare ──
      { alien: '🌒 𐎁 ⤛',              bash: 'b=1' },
      { alien: '🌒🌑 𐎁 ⤛',            bash: 'b=4' },
      { alien: '🌓🌒 𐎁 ⤛',            bash: 'b=9' },
      { alien: '🌔🌓 𐎁 ⤛',            bash: 'b=14' },
      { alien: '🌒🌑🌑 𐎁 ⤛',          bash: 'b=16' },
      // ── Sezione E: Controllo di Flusso RPN ──
      { alien: '𐎀 ⤜ 🌒 ⋗ ⧖ ䷂ 🜂 ⧨',           bash: 'if [ $a -gt 1 ]; then echo "FATAL_ERROR"; fi' },
      { alien: '䷁ 🜚 ⧖ ䷁ 🜄 ⧗ ䷂ 🜂 ⧨',         bash: 'if [ -f config.json ]; then cat config.json; else echo "FATAL_ERROR"; fi' },
    ],
    tests: [
      {
        challenge: '䷅ 🜃',
        hint: 'Consulta la Tabella Hash: ䷅ = ? · 🜃 = Terra = touch.',
        required: ['touch', 'backup.tar'],
        solution: 'touch backup.tar',
        fakeOutput: [
          { cls: 't-prompt', text: 'root@tohu:~$ touch backup.tar' },
          { cls: 't-success', text: '[OK] backup.tar creato.' },
        ]
      },
      {
        challenge: '䷃ 🜂 ䷀ ⤏',
        hint: '䷃ = "OK_200" · 🜂 = echo · ䷀ = sys.log · ⤏ = > (redirect sovrascrittura).',
        required: ['echo', 'OK_200', '>', 'sys.log'],
        solution: 'echo "OK_200" > sys.log',
        fakeOutput: [
          { cls: 't-prompt', text: 'root@tohu:~$ echo "OK_200" > sys.log' },
          { cls: 't-success', text: '[OK] sys.log aggiornato.' },
        ]
      },
      {
        challenge: '䷀ 🜄 ䷃ 🜍 🜋 𐎁 ⤛',
        hint: '䷀=sys.log · 🜄=cat · ䷃="OK_200" · 🜍=grep · 🜋=wc -l · 𐎁 ⤛ = assegna a b.',
        required: ['b', 'cat', 'sys.log', 'grep', 'OK_200', 'wc', '-l'],
        solution: 'b=$(cat sys.log | grep "OK_200" | wc -l)',
        fakeOutput: [
          { cls: 't-prompt', text: 'root@tohu:~$ b=$(cat sys.log | grep "OK_200" | wc -l)' },
          { cls: 't-prompt', text: 'root@tohu:~$ echo $b' },
          { cls: 't-output', text: '247' },
        ]
      },
      {
        challenge: '𐎁 ⤜ 🌓🌑 ⋗ ⧖ ䷃ 🜂 ⧗ ䷂ 🜂 ⧨',
        hint: 'TRAPPOLA BASE-4: 🌓🌑 = 2×4+0 = 8. ⋗ = -gt. ䷃ = "OK_200" · ䷂ = "FATAL_ERROR" · ⧗ = else.',
        required: ['if', '$b', '-gt', '8', 'OK_200', 'else', 'FATAL_ERROR', 'fi'],
        solution: 'if [ $b -gt 8 ]; then echo "OK_200"; else echo "FATAL_ERROR"; fi',
        stackSteps: [
          { token: '𐎁 ⤜',  action: 'PUSH',         value: '$b',           desc: 'PUSH — apre Registro B, spinge $b' },
          { token: '🌓🌑',  action: 'PUSH',         value: '8',            desc: 'PUSH — 🌓🌑 = 2×4+0 = 8 (base-4 lunare)' },
          { token: '⋗',    action: 'POP2_COMPARE', value: '[$b -gt 8]',   desc: 'CMP — estrae $b e 8, confronto -gt' },
          { token: '⧖',    action: 'POP_IF',        value: null,           desc: 'IF — apre blocco if…then' },
          { token: '䷃',    action: 'PUSH',          value: '"OK_200"',     desc: 'PUSH — hash ䷃ si risolve in "OK_200"' },
          { token: '🜂',    action: 'POP_ECHO',      value: null,           desc: 'ECHO — estrae e stampa "OK_200"' },
          { token: '⧗',    action: 'FI',            value: null,           desc: 'ELSE — ramo alternativo' },
          { token: '䷂',    action: 'PUSH',          value: '"FATAL_ERROR"',desc: 'PUSH — hash ䷂ si risolve in "FATAL_ERROR"' },
          { token: '🜂',    action: 'POP_ECHO',      value: null,           desc: 'ECHO — estrae e stampa "FATAL_ERROR"' },
          { token: '⧨',    action: 'FI',            value: null,           desc: 'FI — chiude blocco condizionale' },
        ],
        fakeOutput: [
          { cls: 't-prompt', text: 'root@tohu:~$ if [ $b -gt 8 ]; then echo "OK_200"; else echo "FATAL_ERROR"; fi' },
          { cls: 't-output', text: 'OK_200' },
        ]
      },
      {
        challenge: '🜁 ⟦ 𐎂 ⤛ 𐎂 ⤜ 🜚 ⧖ 𐎂 ⤜ 🜄 ⧨ ⟧ ⥀',
        hint: 'Costrutto nidificato: 🜁=ls · ⟦…⟧⥀=for…do…done · 𐎂 ⤛=assegna file · 🜚=test -f · 🜄=cat.',
        required: ['for', 'ls', 'do', 'if', '-f', 'cat', 'fi', 'done'],
        solution: 'for file in $(ls); do if [ -f $file ]; then cat $file; fi; done',
        fakeOutput: [
          { cls: 't-prompt', text: 'root@tohu:~$ for file in $(ls); do if [ -f $file ]; then cat $file; fi; done' },
          { cls: 't-output', text: '--- iterazione e lettura di tutti i file regolari ---' },
        ]
      },
    ]
  }
];

// ════════════════════════════════════════════════
// GAME STATE
// ════════════════════════════════════════════════

const state = {
  level: 0,
  test: 0,
  stackAnimating: false,
  llmPanelOpen: false,
  stackStepIdx: -1,   // -1 = prima di qualsiasi passo
};

// ════════════════════════════════════════════════
// DOM REFS
// ════════════════════════════════════════════════

const $ = id => document.getElementById(id);

const DOM = {
  welcome:         $('modal-welcome'),
  btnStart:        $('btn-start'),
  btnReopenIntro:  $('btn-reopen-intro'),
  progressLevels:  $('progress-levels'),
  ctabGrammar:     $('ctab-grammar'),
  ctabCorpus:      $('ctab-corpus'),
  viewGrammar:     $('view-grammar'),
  viewCorpus:      $('view-corpus'),
  corpusExamples:  $('corpus-examples'),

  corpusIntro:     $('corpus-intro'),
  corpusSubtitle:  $('corpus-subtitle'),
  corpusContent:   $('corpus-content'),

  levelBadge:      $('level-badge'),
  testCounter:     $('test-counter'),
  testTotal:       $('test-total'),
  challengeStr:    $('challenge-string'),
  challengeHint:   $('challenge-hint'),

  btnCopyChallenge: $('btn-copy-challenge'),
  btnLlmPrompt:    $('btn-llm-prompt'),
  btnShowSolution: $('btn-show-solution'),
  btnSkip:         $('btn-skip'),

  llmPanel:        $('llm-panel'),
  llmPromptText:   $('llm-prompt-text'),
  btnCopyLlmBare:  $('btn-copy-llm-bare'),
  btnCopyLlmFull:  $('btn-copy-llm-full'),
  tabBare:         $('tab-bare'),
  tabFull:         $('tab-full'),

  stackSection:     $('stack-section'),
  stackVisual:      $('stack-visual'),
  stackDescription: $('stack-description'),
  stackSteps:       $('stack-steps'),
  btnAnalyze:       $('btn-analyze'),
  btnStackReset:    $('btn-stack-reset'),
  btnStackPrev:     $('btn-stack-prev'),
  btnStackNext:     $('btn-stack-next'),
  stackStepCounter: $('stack-step-counter'),

  bashInput:       $('bash-input'),
  btnHint:         $('btn-hint'),
  btnSubmit:       $('btn-submit'),

  terminal:        $('terminal-output'),

  modalLesson:     $('modal-lesson'),
  modalIcon:       $('modal-icon'),
  modalTitle:      $('modal-title'),
  modalConcept:    $('modal-concept'),
  modalBody:       $('modal-body'),
  btnModalNext:    $('btn-modal-next'),

  modalVictory:    $('modal-victory'),
  btnRestart:      $('btn-restart'),

  toast:           $('toast'),
};

// Pip dinamici — generati da LEVELS, funziona con N livelli
function buildPips() {
  const container = $('progress-levels');
  container.innerHTML = '';
  LEVELS.forEach((lvl, i) => {
    const pip = document.createElement('span');
    pip.className = 'level-pip';
    pip.dataset.level = i;
    pip.title = `${lvl.badge} — ${lvl.name}`;
    pip.textContent = lvl.pip ?? String(lvl.id);
    container.appendChild(pip);
  });
}

function updatePips(activeIdx) {
  document.querySelectorAll('#progress-levels .level-pip').forEach((pip, i) => {
    pip.classList.toggle('active',    i === activeIdx);
    pip.classList.toggle('completed', i < activeIdx);
    pip.classList.remove(...(i >= activeIdx && i !== activeIdx ? ['active','completed'] : []));
  });
}

// ════════════════════════════════════════════════
// UTILITY
// ════════════════════════════════════════════════

const sleep = ms => new Promise(r => setTimeout(r, ms));

let toastTimer = null;
function showToast(msg, duration = 2200) {
  DOM.toast.textContent = msg;
  DOM.toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => DOM.toast.classList.remove('visible'), duration);
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => showToast('✅ Copiato negli appunti!'));
}

function termLine(text, cls = 't-output') {
  const el = document.createElement('span');
  el.className = 't-line ' + cls;
  el.textContent = text;
  DOM.terminal.appendChild(el);
  DOM.terminal.scrollTop = DOM.terminal.scrollHeight;
}

function clearTerminal() { DOM.terminal.innerHTML = ''; }

async function typeTermLine(text, cls = 't-output', delay = 16) {
  const el = document.createElement('span');
  el.className = 't-line ' + cls;
  DOM.terminal.appendChild(el);
  for (const ch of text) {
    el.textContent += ch;
    DOM.terminal.scrollTop = DOM.terminal.scrollHeight;
    await sleep(delay);
  }
}

// ════════════════════════════════════════════════
// CORPUS RENDERER
// ════════════════════════════════════════════════

function renderCorpus(lvl) {
  // Torna sempre alla tab grammatica al cambio livello
  switchCorpusTab('grammar');

  // Intro description
  DOM.corpusIntro.innerHTML = `<p class="corpus-intro-text">${lvl.corpusIntro}</p>`;

  DOM.corpusContent.innerHTML = '';
  lvl.corpus.forEach(item => {
    if (item.section) {
      const el = document.createElement('div');
      el.className = 'corpus-section';
      el.textContent = item.section;
      DOM.corpusContent.appendChild(el);
    } else {
      const row = document.createElement('div');
      row.className = 'corpus-entry';

      const glyph = document.createElement('div');
      glyph.className = 'corpus-glyph';
      glyph.textContent = item.glyph;

      const arrow = document.createElement('div');
      arrow.className = 'corpus-arrow';
      arrow.textContent = '→';

      const right = document.createElement('div');
      right.className = 'corpus-right';
      right.innerHTML = `<div class="corpus-bash">${item.bash}</div><div class="corpus-desc">${item.desc}</div>`;

      row.appendChild(glyph);
      row.appendChild(arrow);
      row.appendChild(right);
      DOM.corpusContent.appendChild(row);
    }
  });

  renderCorpusExamples(lvl);
}

// ════════════════════════════════════════════════
// CORPUS EXAMPLES RENDERER
// ════════════════════════════════════════════════

function renderCorpusExamples(lvl) {
  DOM.corpusExamples.innerHTML = '';

  const examples = lvl.corpusExamples || [];

  if (!examples.length) {
    const ph = document.createElement('div');
    ph.className = 'corpus-ex-placeholder';
    ph.textContent = 'Corpus in arrivo per questo livello…';
    DOM.corpusExamples.appendChild(ph);
    return;
  }

  examples.forEach((ex, i) => {
    const row = document.createElement('div');
    row.className = 'corpus-ex-row';

    const num = document.createElement('div');
    num.className = 'corpus-ex-num';
    num.textContent = i + 1;

    const body = document.createElement('div');
    body.className = 'corpus-ex-body';
    body.innerHTML = `
      <div class="corpus-ex-alien">${ex.alien}</div>
      <div class="corpus-ex-arrow">↓ Bash</div>
      <div class="corpus-ex-bash">${ex.bash}</div>
    `;

    row.appendChild(num);
    row.appendChild(body);
    DOM.corpusExamples.appendChild(row);
  });
}

// ── Tab switcher per il pannello corpus ──
let activeCorpusTab = 'grammar';

function switchCorpusTab(tab) {
  activeCorpusTab = tab;
  DOM.ctabGrammar.classList.toggle('active', tab === 'grammar');
  DOM.ctabCorpus.classList.toggle('active',  tab === 'corpus');
  DOM.viewGrammar.style.display = tab === 'grammar' ? 'flex' : 'none';
  DOM.viewCorpus.style.display  = tab === 'corpus'  ? 'flex' : 'none';
}

// ════════════════════════════════════════════════
// LLM PROMPT GENERATOR — due varianti
// ════════════════════════════════════════════════

// Stato tab corrente ('bare' | 'full')
let currentTab = 'bare';

function buildDict(lvl) {
  return lvl.corpus
    .filter(e => e.glyph)
    .map(e => `  ${e.glyph}  →  ${e.bash}   (${e.desc})`)
    .join('\n');
}

// Variante BARE: solo la sfida, nessun dizionario — l'LLM deve cavarsela da solo
function buildLlmPromptBare(lvl, test) {
  return `Sei un esperto di scripting Bash. Traduci in Bash standard il seguente comando:

${test.challenge}

Restituisci solo il codice Bash, senza spiegazioni.`;
}

// Variante FULL: few-shot puro — solo corpus di esempi, nessuna grammatica esplicita
function buildLlmPromptFull(lvl, test) {
  const examples = lvl.corpusExamples || [];

  const fewShot = examples.length
    ? examples.map((ex, i) => `${i + 1}. ${ex.alien}\n   → ${ex.bash}`).join('\n')
    : '(corpus non ancora disponibile per questo livello)';

  return `Sei un esperto di scripting Bash. Traduci in Bash standard il seguente comando.

━━━ ESEMPI DI RIFERIMENTO ━━━
${fewShot}

━━━ COMANDO DA TRADURRE ━━━
${test.challenge}

Restituisci solo il codice Bash, senza spiegazioni.`;
}

function getPromptForCurrentTab(lvl, test) {
  return currentTab === 'bare'
    ? buildLlmPromptBare(lvl, test)
    : buildLlmPromptFull(lvl, test);
}

function switchTab(tab) {
  currentTab = tab;
  const lvl  = LEVELS[state.level];
  const test = lvl.tests[state.test];

  DOM.llmPromptText.textContent = getPromptForCurrentTab(lvl, test);

  DOM.tabBare.classList.toggle('active', tab === 'bare');
  DOM.tabFull.classList.toggle('active', tab === 'full');
}

// ════════════════════════════════════════════════
// LEVEL LOADER
// ════════════════════════════════════════════════

function loadLevel(levelIdx) {
  state.level = levelIdx;
  state.test  = 0;
  state.llmPanelOpen = false;

  const lvl = LEVELS[levelIdx];

  updatePips(levelIdx);

  DOM.levelBadge.textContent     = lvl.badge;
  DOM.corpusSubtitle.textContent = `${lvl.badge} — ${lvl.difficulty}`;

  renderCorpus(lvl);

  // Aggiorna il totale test nel header
  DOM.testTotal.textContent = lvl.tests.length;

  // Stack section solo se almeno un test del livello ha stackSteps
  const hasStack = lvl.tests.some(t => t.stackSteps);
  DOM.stackSection.style.display = hasStack ? 'block' : 'none';

  // Terminal intro
  clearTerminal();
  termLine(`Tohu-Terminal OS — Sessione avviata`, 't-system');
  termLine(`━━━ ${lvl.badge}: ${lvl.name} ━━━`, 't-info');
  termLine(lvl.conceptShort, 't-system');
  termLine('', 't-system');
  termLine('Decodifica la stringa aliena oppure sfida un LLM.', 't-system');
  termLine('', 't-system');

  loadTest();
}

// ════════════════════════════════════════════════
// TEST LOADER
// ════════════════════════════════════════════════

function loadTest() {
  const lvl  = LEVELS[state.level];
  const test = lvl.tests[state.test];

  DOM.testCounter.textContent  = state.test;
  DOM.challengeStr.textContent = test.challenge;
  DOM.challengeHint.textContent = '';

  // Label e placeholder adattativi (es. italiano per Kaelish)
  const wsLabel = DOM.bashInput.previousElementSibling;
  if (wsLabel && wsLabel.classList.contains('section-label')) {
    wsLabel.firstChild.textContent = '▸ ' + (lvl.workspaceLabel ?? 'LA TUA TRADUZIONE BASH');
  }
  DOM.bashInput.placeholder = lvl.inputPlaceholder
    ?? 'es.  if [ $u -gt 0 ]; then echo "ALERT"; fi';

  // Hide LLM panel
  DOM.llmPanel.style.display = 'none';
  DOM.btnLlmPrompt.classList.remove('active');
  state.llmPanelOpen = false;

  // Reset input
  DOM.bashInput.value = '';
  DOM.bashInput.className = 'bash-input';
  DOM.bashInput.focus();

  // Stack: visibile se il livello ha almeno un test RPN,
  // ma il pulsante Analizza è attivo solo sul test corrente con stackSteps
  if (DOM.stackSection.style.display !== 'none') {
    resetStack();
    if (test.stackSteps) {
      DOM.btnAnalyze.style.display = '';
      DOM.btnAnalyze.disabled = false;
      DOM.stackDescription.textContent = 'Premi "Analizza" per vedere i token elaborati passo dopo passo.';
    } else {
      DOM.btnAnalyze.style.display = 'none';
      // Calcola su quali test è disponibile l'animazione
      const lvl = LEVELS[state.level];
      const rpnTests = lvl.tests
        .map((t, i) => t.stackSteps ? `Test ${i + 1}` : null)
        .filter(Boolean)
        .join(', ');
      DOM.stackDescription.textContent =
        `Visualizzatore Stack disponibile su: ${rpnTests}. Per i test attuali usa la tab 🔤 Corpus per analizzare la struttura RPN.`;
    }
  }
}

// ════════════════════════════════════════════════
// ANSWER VALIDATOR (token-based, lenient)
// ════════════════════════════════════════════════

function validate(answer, required, caseInsensitive = false) {
  if (!answer || !answer.trim()) return false;
  const norm = caseInsensitive
    ? answer.trim().toLowerCase().replace(/\s+/g, ' ')
    : answer.trim().replace(/\s+/g, ' ');
  return required.every(tok =>
    norm.includes(caseInsensitive ? tok.toLowerCase() : tok)
  );
}

// ════════════════════════════════════════════════
// SUBMIT HANDLER
// ════════════════════════════════════════════════

async function handleSubmit() {
  const lvl  = LEVELS[state.level];
  const test = lvl.tests[state.test];
  const ans  = DOM.bashInput.value;

  if (!ans.trim()) { DOM.bashInput.focus(); return; }

  const ok = validate(ans, test.required, LEVELS[state.level].caseInsensitive);
  DOM.bashInput.className = 'bash-input ' + (ok ? 'state-success' : 'state-error');

  if (ok) {
    await runCorrect(test);
  } else {
    await runWrong();
  }
}

async function runCorrect(test) {
  termLine('', 't-system');
  termLine('[✓] Traduzione accettata!', 't-success');
  termLine('[»] Simulazione esecuzione…', 't-system');
  await sleep(300);

  for (const line of test.fakeOutput) {
    await typeTermLine(line.text, line.cls, 13);
  }

  await sleep(250);
  state.test++;
  DOM.testCounter.textContent = state.test;

  const total = LEVELS[state.level].tests.length;
  if (state.test >= total) {
    await sleep(500);
    showLessonModal(LEVELS[state.level].lesson, state.level < LEVELS.length - 1);
  } else {
    termLine('', 't-system');
    termLine(`[SISTEMA] Test ${state.test}/${total} completato. Prossima stringa…`, 't-system');
    await sleep(350);
    loadTest();
  }
}

async function runWrong() {
  termLine('', 't-system');
  termLine('[✗] Traduzione non valida. Rianalizza la struttura.', 't-error');
  termLine('[»] Usa 💡 Suggerimento o 👁 Mostra Soluzione se bloccato.', 't-system');
  await sleep(700);
  DOM.bashInput.className = 'bash-input';
  DOM.bashInput.focus();
}

// ════════════════════════════════════════════════
// HINT / SOLUTION / SKIP
// ════════════════════════════════════════════════

function handleHint() {
  const test = LEVELS[state.level].tests[state.test];
  DOM.challengeHint.textContent = `💡 ${test.hint}`;
  termLine('[HINT] ' + test.hint, 't-warning');
}

function handleShowSolution() {
  const test = LEVELS[state.level].tests[state.test];
  DOM.bashInput.value = test.solution;
  DOM.bashInput.className = 'bash-input';
  DOM.challengeHint.textContent = `👁 Soluzione mostrata: studia la struttura, poi prova a risolvere il prossimo!`;
  termLine('[SOLUZIONE] ' + test.solution, 't-warning');
  DOM.bashInput.focus();
}

async function handleSkip() {
  termLine('', 't-system');
  termLine('[SKIP] Test saltato.', 't-skip');

  state.test++;
  DOM.testCounter.textContent = state.test;

  const total = LEVELS[state.level].tests.length;
  if (state.test >= total) {
    await sleep(300);
    showLessonModal(LEVELS[state.level].lesson, state.level < LEVELS.length - 1);
  } else {
    termLine(`[SISTEMA] Passaggio al test ${state.test}/${total}…`, 't-system');
    await sleep(250);
    loadTest();
  }
}

// ════════════════════════════════════════════════
// LLM PROMPT PANEL
// ════════════════════════════════════════════════

function toggleLlmPanel() {
  const lvl  = LEVELS[state.level];
  const test = lvl.tests[state.test];

  state.llmPanelOpen = !state.llmPanelOpen;

  if (state.llmPanelOpen) {
    currentTab = 'bare';
    DOM.tabBare.classList.add('active');
    DOM.tabFull.classList.remove('active');
    DOM.llmPromptText.textContent = buildLlmPromptBare(lvl, test);
    DOM.llmPanel.style.display = 'block';
    DOM.btnLlmPrompt.classList.add('active');
    DOM.llmPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    termLine('', 't-system');
    termLine(`[LLM] Prompt generato — ${lvl.llmNote}`, 't-info');
  } else {
    DOM.llmPanel.style.display = 'none';
    DOM.btnLlmPrompt.classList.remove('active');
  }
}

// ════════════════════════════════════════════════
// LESSON MODAL
// ════════════════════════════════════════════════

function showLessonModal(lesson, hasNext) {
  DOM.modalIcon.textContent    = lesson.icon;
  DOM.modalTitle.textContent   = lesson.title;
  DOM.modalConcept.textContent = lesson.concept;
  DOM.modalBody.textContent    = lesson.body;
  DOM.btnModalNext.textContent = hasNext ? 'Prossimo Livello →' : '🏆 Risultato Finale';
  DOM.modalLesson.style.display = 'flex';
}

// ════════════════════════════════════════════════
// STACK VISUALIZER — navigazione passo-passo
// ════════════════════════════════════════════════

function resetStack() {
  state.stackAnimating = false;
  state.stackStepIdx   = -1;
  DOM.stackVisual.innerHTML = '<div class="stack-empty">Stack vuoto</div>';
  DOM.stackDescription.textContent = 'Usa ▶ per avanzare passo dopo passo, o ⚡ Auto per la riproduzione automatica.';
  DOM.stackSteps.innerHTML = '';
  DOM.btnAnalyze.disabled     = false;
  DOM.btnAnalyze.textContent  = '⚡ Auto';
  DOM.stackStepCounter.textContent = '—';
  DOM.btnStackReset.disabled = true;
  DOM.btnStackPrev.disabled  = true;
  DOM.btnStackNext.disabled  = false;
}

// Esegue gli step da 0 fino a upToIdx e restituisce lo stato della pila
function computeStackAt(steps, upToIdx) {
  const stack = [];
  for (let i = 0; i <= upToIdx && i < steps.length; i++) {
    const step = steps[i];
    switch (step.action) {
      case 'PUSH':
        stack.push({ label: step.value, computed: false });
        break;
      case 'POP2_COMPARE':
        stack.pop(); stack.pop();
        stack.push({ label: step.value, computed: true });
        break;
      case 'POP_IF':
      case 'POP_ECHO':
        stack.pop();
        break;
      case 'FI':
        break;
    }
  }
  return stack;
}

function renderStackItems(items) {
  DOM.stackVisual.innerHTML = '';
  if (!items.length) {
    DOM.stackVisual.innerHTML = '<div class="stack-empty">Stack vuoto</div>';
    return;
  }
  items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'stack-item' + (item.computed ? ' computed' : '');
    el.textContent = item.label;
    DOM.stackVisual.appendChild(el);
  });
}

// Renderizza lo stack e il log fino al passo idx (-1 = stato iniziale)
function renderStackAtStep(idx) {
  const steps = LEVELS[state.level].tests[state.test].stackSteps;
  if (!steps) return;

  state.stackStepIdx = idx;
  const total = steps.length;

  // Pila
  renderStackItems(idx < 0 ? [] : computeStackAt(steps, idx));

  // Descrizione
  DOM.stackDescription.textContent = idx < 0
    ? 'Usa ▶ per avanzare passo dopo passo.'
    : steps[idx].desc;

  // Log passi
  DOM.stackSteps.innerHTML = '';
  for (let i = 0; i <= idx; i++) {
    const el = document.createElement('div');
    el.className = 'stack-step-item' + (i === idx ? ' current' : '');
    el.textContent = `${i + 1}. [${steps[i].token}]  ${steps[i].desc}`;
    DOM.stackSteps.appendChild(el);
  }
  DOM.stackSteps.scrollTop = DOM.stackSteps.scrollHeight;

  // Contatore e pulsanti
  DOM.stackStepCounter.textContent = idx < 0 ? `— / ${total}` : `${idx + 1} / ${total}`;
  DOM.btnStackReset.disabled = idx < 0;
  DOM.btnStackPrev.disabled  = idx < 0;
  DOM.btnStackNext.disabled  = idx >= total - 1;
}

// Avanzamento manuale
function stepForward() {
  const steps = LEVELS[state.level].tests[state.test].stackSteps;
  if (!steps || state.stackStepIdx >= steps.length - 1 || state.stackAnimating) return;
  renderStackAtStep(state.stackStepIdx + 1);
}

// Arretramento manuale (ricalcola lo stack da zero)
function stepBack() {
  if (state.stackStepIdx < 0 || state.stackAnimating) return;
  renderStackAtStep(state.stackStepIdx - 1);
}

// Riproduzione automatica
async function handleAnalyze() {
  const test = LEVELS[state.level].tests[state.test];
  if (!test.stackSteps || state.stackAnimating) return;

  state.stackAnimating = true;
  DOM.btnAnalyze.disabled    = true;
  DOM.btnStackNext.disabled  = true;
  DOM.btnStackPrev.disabled  = true;
  DOM.btnStackReset.disabled = true;

  // Parte dall'inizio
  renderStackAtStep(-1);
  await sleep(300);

  for (let i = 0; i < test.stackSteps.length; i++) {
    await sleep(680);
    renderStackAtStep(i);
  }

  await sleep(300);
  state.stackAnimating = false;
  DOM.btnAnalyze.disabled    = false;
  DOM.btnAnalyze.textContent = '↺ Riesegui Auto';
  // I pulsanti manuali rimangono nello stato aggiornato da renderStackAtStep
}

// ════════════════════════════════════════════════
// EVENT LISTENERS
// ════════════════════════════════════════════════

// Genera pip e card welcome al boot
buildPips();

(function buildWelcomeCards() {
  const container = $('welcome-cards');
  if (!container) return;
  LEVELS.forEach(lvl => {
    const card = document.createElement('div');
    card.className = 'level-card';
    card.innerHTML = `
      <span class="lc-badge">${lvl.badge}</span>
      <span class="lc-name">${lvl.name}</span>
      <span class="lc-diff ${lvl.diffClass}">${lvl.difficulty}</span>
      <span class="lc-desc">${lvl.conceptShort}</span>
    `;
    container.appendChild(card);
  });
})();

// Welcome
DOM.btnStart.addEventListener('click', () => {
  DOM.welcome.style.display = 'none';
  loadLevel(0);
});

DOM.btnReopenIntro.addEventListener('click', () => {
  DOM.welcome.style.display = 'flex';
});

// Tab grammatica / corpus (pannello sinistro)
DOM.ctabGrammar.addEventListener('click', () => switchCorpusTab('grammar'));
DOM.ctabCorpus.addEventListener('click',  () => switchCorpusTab('corpus'));

// Navigazione libera tra livelli via click sui pip
DOM.progressLevels.addEventListener('click', e => {
  const pip = e.target.closest('.level-pip');
  if (!pip) return;
  const targetLevel = parseInt(pip.dataset.level, 10);
  if (targetLevel === state.level) return; // già sul livello corrente
  loadLevel(targetLevel);
  termLine('', 't-system');
  termLine(`[NAV] Salto al ${LEVELS[targetLevel].badge}: ${LEVELS[targetLevel].name}`, 't-info');
});

// Challenge actions
DOM.btnCopyChallenge.addEventListener('click', () => {
  copyToClipboard(LEVELS[state.level].tests[state.test].challenge);
});

DOM.btnLlmPrompt.addEventListener('click', toggleLlmPanel);

// Tab switching nel pannello LLM
DOM.tabBare.addEventListener('click', () => switchTab('bare'));
DOM.tabFull.addEventListener('click', () => switchTab('full'));

// Copia bare (solo stringa + dizionario)
DOM.btnCopyLlmBare.addEventListener('click', () => {
  const lvl  = LEVELS[state.level];
  const test = lvl.tests[state.test];
  copyToClipboard(buildLlmPromptBare(lvl, test));
});

// Copia full (con istruzioni)
DOM.btnCopyLlmFull.addEventListener('click', () => {
  const lvl  = LEVELS[state.level];
  const test = lvl.tests[state.test];
  copyToClipboard(buildLlmPromptFull(lvl, test));
});

DOM.btnShowSolution.addEventListener('click', handleShowSolution);
DOM.btnSkip.addEventListener('click', handleSkip);

// Workspace
DOM.btnHint.addEventListener('click', handleHint);
DOM.btnSubmit.addEventListener('click', handleSubmit);

DOM.bashInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
});

// Stack — navigazione passo-passo
DOM.btnAnalyze.addEventListener('click',    handleAnalyze);
DOM.btnStackNext.addEventListener('click',  stepForward);
DOM.btnStackPrev.addEventListener('click',  stepBack);
DOM.btnStackReset.addEventListener('click', () => renderStackAtStep(-1));

// Lesson modal
DOM.btnModalNext.addEventListener('click', () => {
  DOM.modalLesson.style.display = 'none';
  const next = state.level + 1;
  if (next >= LEVELS.length) {
    DOM.modalVictory.style.display = 'flex';
  } else {
    loadLevel(next);
  }
});

// Victory
DOM.btnRestart.addEventListener('click', () => {
  DOM.modalVictory.style.display = 'none';
  loadLevel(0);
});
