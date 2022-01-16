import {db, FieldValue} from './App';

export async function RemoveClassFromTeacher(teacher, className){

    const readCollection = db.collection("users").doc("teachers").collection("data");
    const snapshot = await readCollection.get();
    let arr = [];

    snapshot.forEach(doc => {
        arr.push({
            'id': doc.id,
            'data': doc.data()
        })
    });


    var indexToBeDeleted;
    var teacherId;

    arr.forEach((item, index) =>{
        if(item.data.name == teacher) {
           indexToBeDeleted = index;
        }
    })

    teacherId = arr[indexToBeDeleted].id
    console.log(teacherId);


    const teacherRef = db.collection('users').doc("teachers").collection("data").doc(teacherId);
    const ref = await teacherRef.update({
        classes: FieldValue.arrayRemove(className)
    });

}
