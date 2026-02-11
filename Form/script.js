document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('editor');
    const toolbarButtons = document.querySelectorAll('.tool-btn');
    const statusBar = document.getElementById('status-bar');
    const wordCountDisplay = document.querySelector('.word-count');
    const charCountDisplay = document.querySelector('.char-count');

    const STORAGE_KEY = 'flow_editor_content';

    // 初期化：保存されたコンテンツを読み込む
    loadContent();

    // ツールバーのクリックハンドラ
    toolbarButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const command = btn.dataset.command;

            if (command === 'createLink') {
                // 将来的なリンク作成機能の拡張用
                // const url = prompt('リンクURLを入力してください:');
                // if (url) document.execCommand(command, false, url);
            } else {
                document.execCommand(command, false, null);
            }

            editor.focus();
            updateToolbarState();
        });
    });

    // エディタの入力/操作ハンドラ
    editor.addEventListener('input', () => {
        saveContent();
        updateStats();
    });

    editor.addEventListener('keyup', () => {
        updateToolbarState();
        updateStats();
    });

    editor.addEventListener('mouseup', () => {
        updateToolbarState();
    });

    editor.addEventListener('click', () => {
        updateToolbarState();
    });

    // コンテンツをLocalStorageに保存
    function saveContent() {
        const content = editor.innerHTML;
        localStorage.setItem(STORAGE_KEY, content);
        showStatus('保存しました');
    }

    // LocalStorageからコンテンツを読み込む
    function loadContent() {
        const savedContent = localStorage.getItem(STORAGE_KEY);
        if (savedContent) {
            editor.innerHTML = savedContent;
            updateStats();
        }
    }

    // 一時的なステータスメッセージを表示
    let statusTimeout;
    function showStatus(msg) {
        statusBar.textContent = msg;
        statusBar.classList.add('visible');

        clearTimeout(statusTimeout);
        statusTimeout = setTimeout(() => {
            statusBar.classList.remove('visible');
        }, 2000);
    }

    // ツールバーボタンのアクティブ状態を更新
    function updateToolbarState() {
        toolbarButtons.forEach(btn => {
            const command = btn.dataset.command;
            if (!['undo', 'redo'].includes(command)) {
                if (document.queryCommandState(command)) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            }
        });
    }

    // 単語数/文字数を更新
    function updateStats() {
        const text = editor.innerText || '';
        const charCount = text.length;
        const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

        charCountDisplay.textContent = `${charCount} 文字`;
        wordCountDisplay.textContent = `${wordCount} 単語`;
    }

    // ロード時にエディタに自動フォーカス
    editor.focus();
});
