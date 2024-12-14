import classes from '@/components/form/FormToDo.module.css'

export default function FormToDo({ valueInput, setValueInput }: {valueInput: string, setValueInput: (value: string)=> void}) {
  return <>
    <input className={classes.todoInput} type="text" value={valueInput} onChange={event => setValueInput(event.target.value)} />
    <button className={classes.btn} data-action='add'>Добавить</button>
  </>
}