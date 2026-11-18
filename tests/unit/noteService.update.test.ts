import { describe, it, expect, beforeEach } from "vitest";
import { NoteServiceImpl } from "../../src/services/NoteService";
import { SqliteNoteRepository } from "../../src/repositories/NoteRepository"; 
import { createDb } from "../../src/db/connection"; 

describe('NoteService.updateNote (Ejercicio 4)', () => {
    let service: NoteServiceImpl;

    beforeEach(() => {
        const db = createDb(':memory:');
        const repo = new SqliteNoteRepository(db);
        service = new NoteServiceImpl(repo);
    });

    it('actualiza solo el título y mantiene el resto intacto', () => {
        const notaOriginal = service.createNote({
            title: 'Titulo original',
            content: 'Contenido original',
            pinned: false
        });

        const notaActualizada = service.updateNote(notaOriginal.id, {
            title: 'Titulo nuevo'
        });

        expect(notaActualizada).toBeDefined();
        expect(notaActualizada?.id).toBe(notaOriginal.id);
        expect(notaActualizada?.title).toBe('Titulo nuevo'); 
        expect(notaActualizada?.content).toBe('Contenido original'); 
    });

    it('devuelve undefined si la nota no existe', () => {
        const notaActualizada = service.updateNote(999, { title: 'Titulo nuevo' });
        expect(notaActualizada).toBeUndefined();
    });
});