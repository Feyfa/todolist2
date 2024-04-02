import { useEffect, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";

import Heading from "./components/Heading";
import Input from "./components/Input";
import Column from "./components/Column";
import Task from "./components/Task";

function App() {
    const [tasks, setTasks] = useState(JSON.parse(localStorage.getItem('tasks')) || []);

    useEffect(() => {
        if(!localStorage.getItem('tasks')) {
            localStorage.setItem('tasks', '[]');
        }
    }, []);

    function handleDragEnd(event) {
        const { active, over } = event;

        if(active.id !== over.id) {
            const activeIndex = tasks.findIndex(item => item.id === active.id);
            const overIndex = tasks.findIndex(item => item.id === over.id);
            const tasksAfterMove = arrayMove(tasks, activeIndex, overIndex);

            localStorage.setItem('tasks', JSON.stringify(tasksAfterMove));
            setTasks(tasksAfterMove);
        }
    }

    function handleOnButtonSubmit(newTask) {
        const tasksLocalStorage = JSON.parse(localStorage.getItem('tasks'));
        tasksLocalStorage.push({
            id: Date.now(),
            task: newTask
        });

        localStorage.setItem('tasks', JSON.stringify(tasksLocalStorage));
        setTasks(tasksLocalStorage);
    }

    function handleOnSpanClick(id) {
        const newTasks = tasks.filter(item => item.id !== id);

        localStorage.setItem('tasks', JSON.stringify(newTasks));
        setTasks(newTasks);
    }

    function handleOnTextAreaChange(id, newTask) {
        const newTasks = tasks.map(item => 
            item.id === id ?  
            {...item, task: newTask} : 
            item 
        );

        localStorage.setItem('tasks', JSON.stringify(newTasks));
        setTasks(newTasks);
    }

    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <Heading />
            <Input onButtonSubmit={handleOnButtonSubmit} />

            <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
                <Column>
                    {tasks.length === 0 ? 'Task Empty' : tasks.map((item) => 
                        <Task key={item.id} id={item.id} value={item.task} onSpanCLick={handleOnSpanClick} onTextAreaChange={handleOnTextAreaChange} />
                    )}
                </Column>
            </SortableContext>
        </DndContext>
    )
}

export default App
