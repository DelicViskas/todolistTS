import useSWR from "swr";
import FormToDo from "./form/FormToDo";
import List from "./list/List";
import { fetcher } from "./f";
import { MouseEventHandler, useState } from "react";
import Spinner from "./spinner/Spinner";
import React from "react";

export type Todo = {
  id: number;
  text: string | React.JSX.Element;
}


const API_URL = '/api/todos';

export default function ToDoList() {
  const
    { data, mutate } = useSWR<Todo[]>(API_URL, fetcher, { revalidateOnFocus: false }),
    [valueInput, setValueInput] = useState<string>(''),
    onClick: MouseEventHandler = async event => {
      const
        target = event.target as HTMLElement,
        action = (target.closest('[data-action]') as HTMLElement)?.dataset.action,
        id = (target.closest('[data-id]') as HTMLElement)?.dataset.id;
      if (!action) return;
      let optimisticData: Todo[] = [];
      const getPromise = () => {
        switch (action) {
          case 'del':
            optimisticData = data?.map(todo => {
              if (String(todo.id) === id) {
                return {
                  ...todo,
                  text: <Spinner />
                };
              }
              return todo;
            }) || [];
            
            return fetch(API_URL + '/' + id, { method: 'DELETE' })
              .then(res => {
                if (!res.ok)
                  throw (new Error(res.status + ' ' + res.statusText))
              });
              
          case 'add':
            if (!valueInput.trim()) {
              console.error("Input is empty, not sending request");
              return; 
            }
            const
              newTodo = { text: valueInput };
            optimisticData = data ? [...data, newTodo as Todo] : [newTodo as Todo];
            setValueInput('');
            
            return fetch(API_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(newTodo)
            }).then(res => {
              if (!res.ok)
                throw (new Error(res.status + ' ' + res.statusText));
            })
        }
      },
        promise = getPromise();
      if(promise){
        await mutate(promise.then(() => optimisticData, () => fetcher(API_URL)), { optimisticData, revalidate: true });
      }
    }
    
  return <main onClick={onClick}>
    <FormToDo valueInput={valueInput} setValueInput={setValueInput} />
    {data && <List data={data} />}
  </main>
}