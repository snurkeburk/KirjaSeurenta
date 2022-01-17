import { db } from "./App";
export async function AddBookToStudent(book, id, className, student) {
  let amountSel = 0;
  console.log(book, id, className, student);
  const citiesRef = db.collection("users").doc("students").collection(className);
  const snapshots = await citiesRef.where("selected", "==", true).get();
  snapshots.forEach((selDoc) => {
    const res = db
      .collection("users")
      .doc("students")
      .collection(className)
      .doc(selDoc.data().name)
      .collection("items")
      .add({
        nr: id,
        name: book,
        status: "green",
        type: "book",
      });
    db.collection("users")
      .doc("students")
      .collection(className)
      .doc(selDoc.data().name)
      .update({
        selected: false,
      });
    console.log("USER NOT SELECTED ANYMORE");
  });
  /*const res = await db
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
    });

  //console.log(res);*/
}
