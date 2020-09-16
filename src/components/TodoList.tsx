import React from 'react'
import {ITodo} from '../interfaces'

type TodoListProps = {
    todos: ITodo[]
    onToggle: (item: number) => void
    onRemove: (item: number) => void
}

const TodoList: React.FC<TodoListProps> = ({todos, onRemove, onToggle}) => {
    const removeHandler = (event: React.MouseEvent, id: number) => {
        event.preventDefault()
        onRemove(id)
    }

    if (todos.length === 0) {
        return <p className='center'>No tasks for today or all are done!</p>
    }

    return (
        <ul>
            {todos.map(todo => (
                <li
                    className={`todo ${todo.completed && 'completed'}`}
                    key={todo.id}
                >
                    <label>
                        <input
                            type='checkbox'
                            checked={todo.completed}
                            onChange={() => onToggle(todo.id)}
                        />
                        <span>{todo.title}</span>
                        <i
                            className='material-icons brown-text'
                            onClick={e => removeHandler(e, todo.id)}
                        >
                            delete
                        </i>
                    </label>
                </li>
            ))}
        </ul>
    )
}

export default TodoList
