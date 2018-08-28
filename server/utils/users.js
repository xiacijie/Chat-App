class Users{
    constructor(){
        this.user = [];
    }

    addUser(id, name, room){
        const user = {id,name,room};
        this.users.push(user);
        return user;
    }

    removeUser (id){

    }


    getUser (id) {

    }

    getUserList (room){
        const users = this.users.filter((user) =>{
            return user.room === room;
        });

        const nameArray = users.map((user) =>{
            return user.name 
        });

        return nameArray;
    }
}


export  {User};