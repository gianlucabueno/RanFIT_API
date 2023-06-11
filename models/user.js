class User {
    constructor(id, name, email, password, level) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.level = level;
            this.password = password;
    }
}

module.exports = User;