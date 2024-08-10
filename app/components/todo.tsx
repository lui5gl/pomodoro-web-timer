export default function Todo() {
  // const todos = [
  //   ["Hello", false],
  //   ["Hello", false],
  //   ["Hello", false],
  // ];

  // localStorage.setItem("todo_list", JSON.stringify(todos));

  return (
    <section className="flex min-h-screen select-none flex-col items-center justify-center bg-neutral-100">
      <h2 className="text-center text-3xl font-bold">TODO!</h2>
      <div className="bg-white p-5">
        <form>
          <input type="text" name="" id="" />
          <button className="bg-blue-500">Enviar</button>
        </form>
      </div>
    </section>
  );
}
