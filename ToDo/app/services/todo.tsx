import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDoc,
    getDocs,
    query,
    where,
    Timestamp,
    orderBy,
} from 'firebase/firestore';
import { db } from './FirebaseConfig';

export interface ToDo{
    id?: string;
    title: string;
    description: string;
    completed: boolean;
    dueDate: Timestamp; 
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

// Create a new todo
export const createTodo = async (todo: Omit<ToDo, "id" | "createdAt">): Promise<string> => {
    try {
        const toDoWithTimestamps = {
            ...todo,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        };

        const docRef = await addDoc(collection(db, "todos"), toDoWithTimestamps);
        console.log("Document written with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error adding document:", error);
        throw error;
    }
};


// Get all todos
export const getTodos = async (userId: string): Promise<ToDo[]> => {  
    const todoQuery = query(collection(db, 'todos'), where('userId', '==', userId), orderBy('dueDate', 'asc'));
    const querySnapshot = await getDocs(todoQuery);

    return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as ToDo[];
};


//update a todo
export const updateTodo = async (todoId: string, todo: Partial<ToDo>): Promise<void> => {
    const todoRef = doc(db, 'todos', todoId);
    return await updateDoc(todoRef, {
        ...todo,
        updatedAt: Timestamp.now(),
    });
};



//delete a todo
export const deleteTodo = async (todoId: string): Promise<void> => {
    const todoRef = doc(db, 'todos', todoId);
    return await deleteDoc(todoRef);
}

