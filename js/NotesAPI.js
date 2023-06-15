export default class NotesAPI {
    static getAllNotes() {
        const notes = JSON.parse(localStorage.getItem("notesapp-notes") || "[]");
        return notes.sort((a,b) => {
            return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
        } );
    }

    static saveNote(newNote) {
        const notes = NotesAPI.getAllNotes();
        const existing = notes.find(note => note.id === newNote.id);

        // Update
        if( existing) {
            existing.title = newNote.title;
            existing.body = newNote.body;
            existing.updated = new Date().toISOString();
        }
        else {
            newNote.id = Math.floor(Math.random() * 100000);
            newNote.updated = new Date().toISOString();
            notes.push(newNote);
        }
        localStorage.setItem("notesapp-notes", JSON.stringify(notes));
    }

    static deleteNote(id) {
        const notes = NotesAPI.getAllNotes();
        const newNotes = notes.filter(note => note.id !== id);

        localStorage.setItem("notesapp-notes", JSON.stringify(newNotes));
    }
}