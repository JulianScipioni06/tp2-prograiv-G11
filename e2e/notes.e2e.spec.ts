import { test, expect } from '@playwright/test';
import { resetAndSeed } from './helpers';

test.describe('Notes API - Flujos E2E (Ejercicio 7)', () => {
  test.beforeEach(async ({ baseURL }) => {
    await resetAndSeed(baseURL!);
  });

  test('Happy path: flujo completo crear, listar, obtener, actualizar y eliminar nota', async ({ request }) => {
    const resInicial = await request.get('/notes');
    expect(resInicial.status()).toBe(200);
    const notasIniciales = await resInicial.json();
    expect(notasIniciales).toHaveLength(999); // <-- Falla intencional para commit ROJO (cambiar a 2 en verde)

    const resCrear = await request.post('/notes', {
      data: {
        title: 'Nota E2E',
        content: 'Contenido inicial de prueba',
        pinned: true,
      },
    });
    expect(resCrear.status()).toBe(201);
    const notaCreada = await resCrear.json();
    expect(notaCreada.id).toBeDefined();
    expect(notaCreada.title).toBe('Nota E2E');
    expect(notaCreada.pinned).toBe(true);

    const resObtener = await request.get(`/notes/${notaCreada.id}`);
    expect(resObtener.status()).toBe(200);
    const notaObtenida = await resObtener.json();
    expect(notaObtenida.content).toBe('Contenido inicial de prueba');

    const resActualizar = await request.patch(`/notes/${notaCreada.id}`, {
      data: {
        content: 'Contenido actualizado',
      },
    });
    expect(resActualizar.status()).toBe(200);
    const notaActualizada = await resActualizar.json();
    expect(notaActualizada.title).toBe('Nota E2E');
    expect(notaActualizada.content).toBe('Contenido actualizado');

    const resEliminar = await request.delete(`/notes/${notaCreada.id}`);
    expect([200, 204]).toContain(resEliminar.status());

    const resPostEliminar = await request.get(`/notes/${notaCreada.id}`);
    expect(resPostEliminar.status()).toBe(404);
  });

  test('Caso de error: devuelve 404 al operar sobre un ID inexistente y 400 con payload inválido', async ({ request }) => {
    const resNoExiste = await request.get('/notes/99999');
    expect(resNoExiste.status()).toBe(999); // <-- Falla intencional para commit ROJO (cambiar a 404 en verde)

    const resInvalida = await request.post('/notes', {
      data: {
        title: '',
      },
    });
    expect(resInvalida.status()).toBe(400);
  });
});