export class User {
    constructor(info) {
            this.username = info.UserName;
            this.name = info.Name;
            this.dob = info.DateOfBirth;
            this.gender = info.Gender;
            this.email = info.Email;
        }
        // Getter
    get username() {
        return this.username;
    }
    get name() {
        return this.name;
    }
    get dob() {
        return this.dob;
    }
    get gender() {
        return this.gender;
    }
    get email() {
            return this.email;
        }
        // Method
    calcArea() {
        return this.height * this.width;
    }
}