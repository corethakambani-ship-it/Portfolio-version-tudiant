        const journalKey = 'journalTextContent';
        const journalText = document.getElementById('journalText');
        const saveButton = document.getElementById('saveButton');
        const deleteButton = document.getElementById('deleteButton');

        function loadJournal() {
            const savedText = localStorage.getItem(journalKey);
            if (savedText !== null) {
                journalText.innerHTML = savedText;
            }
        }

        function saveJournal() {
            localStorage.setItem(journalKey, journalText.innerHTML);
            alert('Le texte du journal a bien été sauvegardé.');
        }

        function deleteJournal() {
            localStorage.removeItem(journalKey);
            journalText.innerHTML = 'Raconte moi !';
            alert('Le texte du journal a été supprimé.');
        }

        saveButton.addEventListener('click', saveJournal);
        deleteButton.addEventListener('click', deleteJournal);

        journalText.addEventListener('input', () => {
            localStorage.setItem(journalKey, journalText.innerHTML);
        });

        loadJournal();
