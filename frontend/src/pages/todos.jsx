import { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import getAxiosClient from "../axios-instance";

export default function Todos() {
  const modalRef = useRef(null);
  const queryClient = useQueryClient();

  // form handler
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { name: "", description: "" },
  });

  // FETCH todos
  const { data, isLoading, isError } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const axios = await getAxiosClient();
      const { data } = await axios.get("/todos");
      return data; // { success, todos: [...] }
    },
  });

  // CREATE todo
  const { mutate: createNewTodo, isPending: isCreating } = useMutation({
    mutationKey: ["newTodo"],
    mutationFn: async (newTodo) => {
      const axios = await getAxiosClient();
      const { data } = await axios.post("/todos", newTodo);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      reset();
      toggleNewTodoModal(false);
    },
  });

  const { mutate: markAsCompleted } = useMutation({
    mutationKey: ["markAsCompleted"],
    mutationFn: async (todoId) => {
      const axios = await getAxiosClient();
      const { data } = await axios.put(`/todos/${todoId}/completed`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });


  const { mutate: deleteTodo, isPending: isDeleting } = useMutation({
    mutationKey: ["deleteTodo"],
    mutationFn: async (todoId) => {
      const axios = await getAxiosClient();
      const { data } = await axios.delete(`/todos/${todoId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });


  const toggleNewTodoModal = (forceOpen) => {
    const dialog = modalRef.current;
    if (!dialog) return;
    if (typeof forceOpen === "boolean") {
      forceOpen ? dialog.showModal() : dialog.close();
      return;
    }
    dialog.open ? dialog.close() : dialog.showModal();
  };

  const onSubmit = (values) => createNewTodo(values);

  if (isLoading) return <div className="p-6">Loading Todos...</div>;
  if (isError) return <div className="p-6 text-error">There was an error.</div>;

  const todos = data?.todos ?? [];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Your Todos</h2>
        <button className="btn btn-primary" onClick={() => toggleNewTodoModal(true)}>
          New Todo
        </button>
      </div>

      <div className="bg-base-300 rounded px-6 py-8">
        {data?.success && todos.length > 0 ? (
          <ul className="flex flex-col gap-4">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between bg-base-200 rounded px-4 py-3"
              >
                <div className="pr-4">
                  <h3 className="text-lg font-semibold">
                    <span className={todo.completed ? "line-through text-gray-400" : ""}>
                      {todo.name}
                    </span>
                  </h3>
                  {todo.description && (
                    <p
                      className={`text-sm ${
                        todo.completed ? "line-through text-gray-400" : "text-gray-400"
                      }`}
                    >
                      {todo.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm">Completed?</span>
                  <label className="swap">
                    <input
                      type="checkbox"
                      checked={!!todo.completed}
                      onChange={() => markAsCompleted(todo.id)}
                    />
                    <div className="swap-on">Yes</div>
                    <div className="swap-off">No</div>
                  </label>

                  <button
                    className={`btn btn-error btn-sm ${!todo.completed ? "btn-disabled" : ""}`}
                    title={todo.completed ? "Delete todo" : "Mark complete first"}
                    onClick={() => deleteTodo(todo.id)}
                    disabled={!todo.completed || isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-sm opacity-70">
            No todos yet. Click <span className="font-medium">“New Todo”</span> to add one.
          </div>
        )}
      </div>

      {/* Modal */}
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">New Todo</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Name of Todo</span>
              </div>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
                {...register("name", { required: true })}
              />
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Description</span>
              </div>
              <input
                type="text"
                placeholder="Optional"
                className="input input-bordered w-full"
                {...register("description")}
              />
            </label>

            <div className="modal-action">
              <button type="submit" className={`btn btn-primary ${isCreating ? "btn-disabled" : ""}`}>
                {isCreating ? "Creating..." : "Create Todo"}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => toggleNewTodoModal(false)}>
                Close
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => toggleNewTodoModal(false)}>close</button>
        </form>
      </dialog>
    </div>
  );
}
