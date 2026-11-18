import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { notify } from '../../src/services/notificationService';
import { NoteRepository } from '../../src/repositories/NoteRepository';
import { Note } from '../../src/models/Note';

// Interceptamos el módulo de notificaciones 
vi.mock('../../src/services/notificationService', () => ({
    notify: vi.fn(),
}));

describe('NoteService - Notificaciones (Ejercicio 6)', () => {
    let mockRepo: NoteRepository;
    let service: NoteServiceImpl;

beforeEach(() => {
    vi.clearAllMocks();

    // Repositorio simulado
    mockRepo = {
        create: vi.fn((data) => ({
        id: 1,
        title: data.title,
        content: data.content,
        pinned: data.pinned ?? false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    } as Note)),
    findAll: vi.fn(),
    findById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    clear: vi.fn(),
    };

    service = new NoteServiceImpl(mockRepo);
});

it('debe llamar a notify cuando pinned es true', () => {
    const notaCreada = service.createNote({
        title: 'Importante',
        content: 'Recordar entrega',
        pinned: true,
    });

    expect(notify).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledWith(notaCreada);
});

it('NO debe llamar a notify cuando pinned es false', () => {
    service.createNote({
        title: 'Normal',
        content: 'Nota común',
        pinned: false,
    });

    expect(notify).not.toHaveBeenCalled();
});

});