import NotesView from "./notesView.js";
import NotesAPI from "./NotesAPI.js";

export default class App {
    constructor(root) {
        this.notes = [];
        this.activeNode = null;
        this.view = new NotesView(root, this._handlers());

        this._refreshNotes();
    }

    _refreshNotes() {
        const notes = NotesAPI.getAllNotes();

        this._setNotes(notes);

        if(notes.length > 0) {
            this._setActiveNote(notes[0]);
        }
    }

    _setNotes(notes) {
        this.notes = notes;
        this.view.updateNotesList(notes);
        this.view.updateNotePreviewVisibility(notes.length > 0);
    }
1
    _setActiveNote(note) {
        this.activeNode = note;
        this.view.updateActiveNote(note);
    }


    _handlers() {
        return {
            onNoteSelect: noteId => {
                const selectedNote = this.notes.find(note => note.id === Number(noteId) );
                this._setActiveNote(selectedNote);
            },
            onNoteAdd: () => {
                const newNote = {
                    title: "New Note",
                    body: "Take note..."
                }

                NotesAPI.saveNote(newNote);
                this._refreshNotes();
            },
            onNoteEdit: (title, body) => {
                NotesAPI.saveNote({
                    id: this.activeNode.id,
                    title: title,
                    body: body,
                    updated: new Date().toISOString()
                });

                this._refreshNotes();
            },
            onNoteDelete: noteId => {
                NotesAPI.deleteNote(Number(noteId));
                this._refreshNotes();
            },
            onSearch: () => {
                const searchedNotes = this.view.searchNote(this.notes);
                this.view.updateNotesList(searchedNotes);
                if(searchedNotes.length > 0)
                    this.view.updateActiveNote(searchedNotes[0]);
                this.view.updateNotePreviewVisibility(searchedNotes.length > 0);
            }
        };
    }
}