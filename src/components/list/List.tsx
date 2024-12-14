import classes from '@/components/list/List.module.css'
import { Todo } from '../ToDoList'

export default function List({ data }: {data: Todo[]}) {

  return <div className={classes.list}>
    {data.map(({ id, text }) => {
      
      return <div data-id={id} className={classes.todo} key={id}>
        <div>{text}</div>
        <button className={classes.delete} data-action='del'>❌</button>
      </div>
    })}
  </div>
}