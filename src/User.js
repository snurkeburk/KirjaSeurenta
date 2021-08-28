import { add, update, remove, read, readWhere } from './Crud'

export class User {

    constructor(name, id, email) {
        this.name = name;
        this.id = id;
        this.email = email;     
        this.userExists();
    }

    addUser() { // Adds user to database
        //TODO Merge function with userExists() ???
        add(
            'users',
            this.name,
            {
                id: this.id,
                email: this.email,
                name: this.name
            }
        )
    }

    async userExists() { // Checks if user is in database, calls addUser() if not 
        const read = await readWhere('users', 'id', this.id);

        if (read.length == 0) {
            this.addUser();
        } 
    }        

}