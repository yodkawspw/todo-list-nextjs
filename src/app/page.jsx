"use client";
import { useState, useEffect } from "react";

export default function TodoPage() {
  const [todos, setTodos] = useState([]); // รายการ task ทั้งหมด
  const [taskinput, setTaskInput] = useState("");   // ข้อความในช่อง input
  const [error, setError] = useState(""); // ข้อความเตือน

  // โหลดข้อมูลจาก localStorage ตอนเปิดเว็บ
  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    setTodos(savedTodos);
  }, []);

  // บันทึกข้อมูลลง localStorage ทุกครั้งที่ todos เปลี่ยน
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("todos")) || [];
      setTodos(saved);
    } catch (err) {
      console.error("Invalid todos in localStorage", err);
      setTodos([]);
    }
  }, []);

  // เพิ่ม task ใหม่
  const addTodo = () => {
    if (taskinput.trim() === ""){
      setError("⚠️ Please add your task.");
      return;
    }

    const newTodo = {
      id: Date.now(),
      text: taskinput,
      completed: false,
      date: new Date().toLocaleDateString(),
    };
    setTodos([...todos, newTodo]);
    setTaskInput("");
    setError(""); // เคลียร์ข้อความเตือนถ้ามี
  };

  // ลบ task
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // เปลี่ยนสถานะงาน (เสร็จ/ไม่เสร็จ)
  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <main className="min-h-screen flex flex-col items-center pt-35 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-8 text-shadow-lg text-blue">To-Do List 📝</h1>

        {/* Input และปุ่มเพิ่มงาน */}
        <div className="flex gap-2 mb-4">
          <input
            value={taskinput}
            onKeyDown={(k) => { if (k.key === "Enter") addTodo(); }}
            onChange={(e) => {
              setTaskInput(e.target.value)
              setError(""); // เคลียร์ข้อความเตือนเมื่อเริ่มพิมพ์
            }}
            placeholder="Add new task..."
            className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"/>
          <button
            onClick={addTodo}
            className="bg-blue-500 text-white px-4 rounded-lg hover:bg-blue-900 transition">
            Add
          </button>
        </div>

        {/* แสดงข้อความเตือน */}
        {error && <p className="text-red-500 text-sm mb-3 animate-pulse">{error}</p>}

        {/* แสดงรายการงาน */}
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              onClick={() => toggleComplete(todo.id)}
              className={`flex justify-between items-center p-3 rounded-lg border cursor-pointer transition my-6 ${
                todo.completed ? "bg-green-100 line-through text-gray-500" : "bg-gray-50 hover:bg-gray-100"
              }`} >
              <div className="flex items-center gap-2">
                <span>{todo.text}</span>
                <span className="text-sm text-gray-400">
                  ({new Date(todo.id).toLocaleDateString()})
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // ป้องกันการ toggle complete ตอนกดลบ
                  deleteTodo(todo.id);
                }}
                className="text-red-500 hover:text-red-700">
                ❌
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
