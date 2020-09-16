import React, {useState} from 'react'

interface TodoFormProps {
    onAdd: (title: string) => void
}

const TodoForm: React.FC<TodoFormProps> = props => {
    const [title, setTitle] = useState<string>('')

    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value)
    }

    const keyPressHandler = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            props.onAdd(title)
            setTitle('')
        }
    }

    return (
        <div className='input-field mt2'>
            <input
                type='text'
                value={title}
                onChange={changeHandler}
                onKeyPress={keyPressHandler}
                id='title'
                placeholder='What you need to do?'
            />
            <label htmlFor='title' className='active'>
                Short task description
            </label>
        </div>
    )
}

export default TodoForm
