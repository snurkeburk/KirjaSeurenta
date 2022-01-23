import { db } from "./App";
export async function AddBookToStudent(book, id, className, student, datum) {
  console.log(book, id, className, student);

  const res = await db
    .collection("users")
    .doc("students")
    .collection(className)
    .doc(student)
    .collection("items")
    .add({
      nr: id,
      name: book,
      status: "green",
      type: "book",
      addedAt: datum,
    });
  //console.log(res);
}
