import { describe, it, expect, beforeEach } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { createDb } from '../../src/db/connection';

describe('NoteService - deleteNote', () => {
    let repo: SqliteNoteRepository;
    let service: NoteServiceImpl;

    beforeEach(() => {
        const db = createDb(':memory:');
        repo = new SqliteNoteRepository(db);
        service = new NoteServiceImpl(repo);
    });

    it('debería eliminar la nota y devolver true cuando el id existe', () => {
        const created = repo.create({
        title: 'Nota a borrar',
        content: 'Contenido temporal',
        });

        const deleted = service.deleteNote(created.id);

        expect(deleted).toBe(true);
        expect(repo.findById(created.id)).toBeUndefined();
    });

    it('debería devolver false cuando el id no existe', () => {
        const deleted = service.deleteNote(9999);

        expect(deleted).toBe(false);
    });
});