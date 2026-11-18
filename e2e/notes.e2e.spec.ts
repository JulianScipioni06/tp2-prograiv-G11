import { test, expect } from '@playwright/test';
import { resetAndSeed } from './helpers';

test.describe('Notes API - Flujos E2E (Ejercicio 7)', () => {
  test.beforeEach(async ({ baseURL }) => {
    // Limpia la base de datos y siembra 2 notas fijas antes de cada test
    await resetAndSeed(baseURL!);
  });

  test('Happy path: flujo completo crear, listar, obtener, actualizar y eliminar nota', async ({ request }) => {
    // 1. Verificar las 2 notas iniciales sembradas por resetAndSeed
    const resInicial = await request.get('/notes');
    expect(resInicial.status()).toBe(200);
    const notasIniciales = await resInicial.json();
    expect(notasIniciales).toHaveLength(2);

    // 2. Crear una nueva nota (POST /notes)
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

    // 3. Obtener la nota por ID (GET /notes/:id)
    const resObtener = await request.get(`/notes/${notaCreada.id}`);
    expect(resObtener.status()).toBe(200);
    const notaObtenida = await resObtener.json();
    expect(notaObtenida.content).toBe('Contenido inicial de prueba');

    // 4. Actualizar parcialmente la nota (PATCH /notes/:id)
    const resActualizar = await request.patch(`/notes/${notaCreada.id}`, {
      data: {
        content: 'Contenido actualizado',
      },
    });
    expect(resActualizar.status()).toBe(200);
    const notaActualizada = await resActualizar.json();
    expect(notaActualizada.title).toBe('Nota E2E'); // No debe cambiar
    expect(notaActualizada.content).toBe('Contenido actualizado');

    // 5. Eliminar la nota (DELETE /notes/:id)
    const resEliminar = await request.delete(`/notes/${notaCreada.id}`);
    expect([200, 204]).toContain(resEliminar.status());

    // 6. Confirmar que ya no existe (GET /notes/:id -> 404)
    const resPostEliminar = await request.get(`/notes/${notaCreada.id}`);
    expect(resPostEliminar.status()).toBe(404);
  });

  test('Caso de error: devuelve 404 al operar sobre un ID inexistente y 400 con payload inválido', async ({ request }) => {
    // Error 404: consultar una nota que no existe
    const resNoExiste = await request.get('/notes/99999');
    expect(resNoExiste.status()).toBe(404);

    // Error 400: crear una nota sin los campos requeridos (validación Zod)
    const resInvalida = await request.post('/notes', {
      data: {
        title: '',
      },
    });
    expect(resInvalida.status()).toBe(400);
  });
});