import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { makeApp } from '../../src/app';

describe('GET /notes/:id', () => {
    it('debería devolver 200 y la nota cuando existe', async () => {
        const app = makeApp(':memory:');

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

describe('PATCH /notes/:id', () => {
    let app: any;

    beforeEach(() => {
        app = makeApp(':memory:');
    });

    it('Actualiza solo el titulo, Devuelve código 200 y la nota actualizada', async () => {
        const resPost = await request(app)
            .post('/notes')
            .send({
                title: 'Titulo original',
                content: 'Contenido original',
                pinned: false
            });
            
        const notaId = resPost.body.id;

        const resPatch = await request(app)
            .patch(`/notes/${notaId}`)
            .send({
                title: 'Titulo nuevo'
            });

        expect(resPatch.status).toBe(200);
        expect(resPatch.body.id).toBe(notaId);
        expect(resPatch.body.title).toBe('Titulo nuevo');
        expect(resPatch.body.content).toBe('Contenido original');
    });

    it('Devuelve codigo 404 si la nota no existe', async () => {
        const resPatch = await request(app)
            .patch('/notes/999')
            .send({
                title: 'Intento fallido'
            });

        expect(resPatch.status).toBe(404);
    });
});