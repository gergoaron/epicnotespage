export default class NotesView {
    constructor(root, {onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete, onSearch} = {}) {
        this.root = root;
        this.onNoteSelect = onNoteSelect;
        this.onNoteAdd = onNoteAdd;
        this.onNoteEdit = onNoteEdit;
        this.onNoteDelete = onNoteDelete;
        this.onSearch = onSearch;
        this.root.innerHTML = `
                <nav class="navbar navbar-expand-lg navbar-light bg-light" style="position: fixed; width: 100%">
                    <a class="navbar-brand p-2 my-2 my-sm-0" href="#">Epic Notes Page &#128523;</a>
                    <button type="button" class="btn btn-primary py-2 px-4">New Note</button>
                    <ul class="nav navbar ms-auto justify-content-end">
                        <li><input class="form-control" id="searchField" type="search" placeholder="Search" aria-label="Search"></li>
                        <li><button class="btn btn-outline-success my-sm-0 mx-2" type="submit">Search</button></li>
                    </ul>
                </nav>
                <div class="notes__list"></div>
                <div class="notes__preview">
                   <input class="notes__title" type="text" placeholder="New Note">
                   <textarea class="notes__body">Take note...</textarea>
                </div>
        `;

        const btnAddNote = this.root.querySelector(".btn-primary");
        const inTitle = this.root.querySelector(".notes__title");
        const inBody = this.root.querySelector(".notes__body");
        const btnSearch = this.root.querySelector(".btn-outline-success");
        const searchFld = document.getElementById("searchField");

        searchFld.addEventListener("keypress", () => {
            this.onSearch();
        });

        searchFld.addEventListener("blur", () => {
            this.onSearch();
        });

        btnSearch.addEventListener("click", () => {
            this.onSearch();
        });


        btnAddNote.addEventListener("click", () => {
            this.onNoteAdd();
        });

        [inTitle, inBody].forEach(inputField => {
            inputField.addEventListener("blur", () => {
                const updatedTitle = inTitle.value.trim();
                const updatedBody = inBody.value.trim();

                this.onNoteEdit(updatedTitle, updatedBody);
            });
        })

        this.updateNotePreviewVisibility(false);
    }

    _createListItemHTML(id, title, body, updated) {
        const MAX_BODY_LENGTH = 60;

        return `
            <div class="notes__list-item" data-note-id="${id}">
                <div class="notes__small-title">${title}</div>
                <div class="notes__small-body">
                    ${body.substring(0, MAX_BODY_LENGTH)}
                    ${body.length > MAX_BODY_LENGTH ? "..." : ""}
                </div>
                <div class="notes__small-updated">
                     ${updated.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}
                </div>
            </div>
        `;
    }

    searchNote(notes) {
        const search = document.getElementById("searchField").value.trim();
        return notes.filter(note =>
            (note.title.includes(search) || note.body.includes(search))
        );
    }

    updateNotesList(notes) {
        const notesListContainer = this.root.querySelector(".notes__list");

        // Empty list
        notesListContainer.innerHTML = "";

        for (const note of notes) {
            const html = this._createListItemHTML(note.id, note.title, note.body, new Date(note.updated));
            notesListContainer.insertAdjacentHTML("beforeend", html);
        }

        // Add select/delete events for each list item
        notesListContainer.querySelectorAll(".notes__list-item").forEach(noteListItem => {
            noteListItem.addEventListener("click", () => {
                this.onNoteSelect(noteListItem.dataset.noteId);
            });

            noteListItem.addEventListener("dblclick", () => {
                const doDelete = confirm("Are you sure you want to delete this note?");

                if (doDelete) {
                    this.onNoteDelete(noteListItem.dataset.noteId);
                }
            });
        });
    }

    updateActiveNote(note) {
        this.root.querySelector(".notes__title").value = note.title;
        this.root.querySelector(".notes__body").value = note.body;

        this.root.querySelectorAll(".notes__list-item").forEach(noteListItem => {
            noteListItem.classList.remove("notes__list-item--selected");
        });

        this.root.querySelector(`.notes__list-item[data-note-id="${note.id}"]`).classList.add("notes__list-item--selected");
    }

    updateNotePreviewVisibility(visible) {
        this.root.querySelector(".notes__preview").style.visibility = visible ? "visible" : "hidden";
    }
}