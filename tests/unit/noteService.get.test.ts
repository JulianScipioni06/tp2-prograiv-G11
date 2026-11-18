import { describe, it, expect, beforeEach } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { createDb } from '../../src/db/connection';

describe('NoteService - getNote', () => {
    let repo: SqliteNoteRepository;
    let service: NoteServiceImpl;

    beforeEach(() => {
        const db = createDb(':memory:');
        repo = new SqliteNoteRepository(db);
        service = new NoteServiceImpl(repo);
    });

    it('debería devolver la nota correspondiente cuando el id existe', () => {
        // Arrange
        const created = repo.create({
        title: 'Comprar pan',
        content: 'Antes de las 20hs',
        });

        // Act
        const found = service.getNote(created.id);

        // Assert
        expect(found).toEqual(created);
    });

    it('debería devolver undefined cuando el id no existe', () => {
        // Act
        const found = service.getNote(9999);

        // Assert
        expect(found).toBeUndefined();
    });
});