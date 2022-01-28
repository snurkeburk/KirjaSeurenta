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
      status: "green",
      type: "book",
      addedAt: datum_fin,
      lastEdit: datum_fin,
      turnInDate: "",
    });
  //console.log(res);
}
