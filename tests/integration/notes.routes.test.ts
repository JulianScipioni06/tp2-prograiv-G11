import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { makeApp } from '../../src/app';

describe('GET /notes/:id', () => {
    it('debería devolver 200 y la nota cuando existe', async () => {
        const app = makeApp(':memory:');

        // Creamos una nota primero (requiere que createNote del Ejercicio 1 esté implementado)
        const createdRes = await request(app)
        .post('/notes')
        .send({ title: 'Test integración', content: 'Contenido de prueba' });

        const id = createdRes.body.id;

        const res = await request(app).get(`/notes/${id}`);

        expect(res.status).toBe(200);
        expect(res.body.id).toBe(id);
        expect(res.body.title).toBe('Test integración');
        expect(res.body.content).toBe('Contenido de prueba');
    });

    it('debería devolver 404 cuando el id no existe', async () => {
        const app = makeApp(':memory:');

        const res = await request(app).get('/notes/9999');

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ error: 'NotFound' });
    });
});