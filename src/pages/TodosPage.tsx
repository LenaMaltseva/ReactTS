import React, {useEffect, useState} from 'react'
import TodoForm from '../components/TodoForm'
import TodoList from '../components/TodoList'
import {ITodo} from '../interfaces'

declare var confirm: (question: string) => boolean

const TodosPage: React.FC = () => {
    const [todos, setTodos] = useState<ITodo[]>([])

    useEffect(() => {
        const saved = JSON.parse(
            localStorage.getItem('todos') || '[]'
        ) as ITodo[]
        setTodos(saved)
    }, [])

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos))
    }, [todos])

    const addHandler = (title: string) => {
        const newTodo: ITodo = {
            title,
            id: Date.now(),
            completed: false,
        }
        setTodos(prevTodos => [newTodo, ...prevTodos])
    }

    const toggleHandler = (id: number) => {
        setTodos(prevTodos =>
            prevTodos.map(todo => {
                if (todo.id === id) {
                    todo.completed = !todo.completed
                }
                return todo
            })
        )
    }

    const removeHandler = (id: number) => {
        if (confirm('Please confirm deleting the task')) {
            setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id))
        }
    }
    return (
        <>
            <TodoForm onAdd={addHandler} />
            <TodoList
                todos={todos}
                onToggle={toggleHandler}
                onRemove={removeHandler}
            />
        </>
    )
}

export default TodosPage
