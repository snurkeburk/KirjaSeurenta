import { db } from "./App";
export async function AddBookToStudent(book, id, className, student, datum) {
  console.log(book, id, className, student);
  // tar datum och gör om till en string & delar upp viktigaste infon
  let _datum = datum.toString();
  let _split_datum = _datum.split(" ");
  let s1_datum = _split_datum[1];
  let s2_datum = _split_datum[2];
  let s3_datum = _split_datum[3];
  let datum_fin = s1_datum + " " + s2_datum + " " + s3_datum;
  let _split_time = s3_datum.split(":");
  let s1_s4_time = _split_time[0];
  let s2_s4_time = _split_time[1];
  let s4_fin_time = s1_s4_time + ":" + s2_s4_time;
  let edit_datum_fin =
    s1_datum + " " + s2_datum + " " + s3_datum + " " + s4_fin_time;
  let _book = book.replaceAll(" ", "");
  let fin_book = _book.toLowerCase();
  console.log(
    book +
      " " +
      id +
      " " +
      className +
      " " +
      student +
      " " +
      datum_fin +
      " " +
      edit_datum_fin
  );

  /*  -----------------  */
  const res = await db
    .collection("users")
    .doc("students")
    .collection(className)
    .doc(student)
    .collection("items")
    .add({
      nr: id,
      name: book,
      bid: fin_book,
      status: "green",
      type: "book",
      addedAt: datum_fin,
      lastEdit: edit_datum_fin,
      turnInDate: "",
    });
}
