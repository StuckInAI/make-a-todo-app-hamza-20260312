import 'reflect-metadata';
import { NextResponse } from 'next/server';
import { getDataSource } from '../../../../lib/database';
import { Todo } from '../../../../entities/Todo';

interface RouteParams {
  params: { id: string };
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();
    const dataSource = await getDataSource();
    const todoRepository = dataSource.getRepository(Todo);

    const todo = await todoRepository.findOne({ where: { id } });
    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    if (typeof body.completed === 'boolean') {
      todo.completed = body.completed;
    }
    if (typeof body.title === 'string' && body.title.trim()) {
      todo.title = body.title.trim();
    }
    if (body.description !== undefined) {
      todo.description = body.description?.trim() || null;
    }

    const updated = await todoRepository.save(todo);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/todos/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update todo' },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const dataSource = await getDataSource();
    const todoRepository = dataSource.getRepository(Todo);

    const todo = await todoRepository.findOne({ where: { id } });
    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    await todoRepository.remove(todo);
    return NextResponse.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/todos/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    );
  }
}
