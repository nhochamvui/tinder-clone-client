<template>
    <form class="container" v-on:submit="submit" method="post" v-bind:action="host">
        <TextField
            :label="'Full Name'"
            :hint="'Type your name'"
            :imageSrc="'/icon/user.png'"
            v-model:value.trim="name"
            v-model:error="errors.name"
        />
        <div class="select__box">
            <label class="select__box-label Us(none)" for="">Gender</label>
            <select v-model="gender">
                <option disabled value="">Choose gender</option>
                <option value="0">Male</option>
                <option value="1">Female</option>
                <option value="2">Other</option>
            </select>
            <p v-if="errors.gender" class="error-text" v-text="'*' + errors.gender"></p>
        </div>
        <TextField
            :label="'Email Address'"
            :hint="'abc@example.com'"
            :imageSrc="'/icon/email.png'"
            v-model:value.trim="email"
            v-model:error="errors.email"
            v-bind:verifyURL="host+'api/users/check/email'"
            v-bind:verifyFunction="isValidEmail"
            v-bind:verifyName="'Email'"
        />
        <DatePicker
            v-model:day.trim="birthDay.day"
            v-model:month.trim="birthDay.month"
            v-model:year.trim="birthDay.year"
            v-bind:label="'Birthday'"
            v-model:error="errors.birthDay"
        />
        <div class="select__box">
            <label class="select__box-label Us(none)" for="">Profile Photo</label>
            <div class="img__container Bdr(5px) D(flex) Al-s(center)">
                <input class="input__photo" 
                v-on:change="photoInputChange" 
                type="file" accept="image/png, image/jpeg"
                ref="fileInput"
                alt="input_photo">

                <img v-bind:src="profileThumbnail"
                class="Cur(p) Bdr(5px) img__add-photo Al-s(center)"
                style="object-fit:cover"
                v-on:click="$refs.fileInput.click()"
                alt="profile_photo">
            </div>
            <p v-if="errors.profilePhoto" class="error-text" v-text="'*' + errors.profilePhoto"></p>
        </div>
        <p>
            <input type="submit" >
        </p>
    </form>
</template>

<script>
import TextField from './TextField.vue';
import DatePicker from './DatePicker.vue'
import { mapActions, mapGetters } from 'vuex';
export default {
    name: "SignupProfile",
    props: ['signupData'],
    emits: ['submit'],
    components: {
        TextField,
        DatePicker,
    },
    data(){
        console.log('props', this.signupData);
        return{
            name: this.signupData.name ?? '',
            email: this.signupData.email ?? '',
            gender: this.signupData.gender ? this.convertToGenderCode(this.signupData.gender) : '',
            birthDay: this.convertToBirthday(this.signupData.birthday),
            profilePhoto: null,
            profileThumbnail: '/icon/add.svg',
            errors: {
                name: null,
                gender: null,
                email: null,
                profile: null,
                birthDay: null,
                profilePhoto: null,
            },
            host: this.getHostURL(),
        }
    },
    methods:{
        ...mapGetters({
            getHostURL: "getHostURL"
        }),
        ...mapActions({
            uploadPhoto: "users/uploadPhoto",
            signup: "users/signup",
        }),
        submit(e){
            e.preventDefault();
            this.clearAllErrors();
            console.log(
                new Date(
                    parseInt(this.birthDay.year).toString(), 
                    (parseInt(this.birthDay.month)-1).toString(), 
                    parseInt(this.birthDay.day).toString(), 12, 0));
            if(!this.isRequiredFieldsEmpty()){
                this.uploadPhoto({
                    photo: this.profilePhoto,
                    index: 0,
                });
                this.$emit('submit', {
                    Name: this.name,
                    Birthday: this.birthDay.month.toString() + "/" +
                    this.birthDay.day.toString() + "/" +
                    this.birthDay.year.toString(), 
                    Gender: this.convertToGenderString(this.gender),
                    Email: this.email,
                    photo: this.profilePhoto,
                })
            }
        },
        clearAllErrors(){
            for(const property in this.errors){
                this.errors[property] = null;
            }
        },
        isRequiredFieldsEmpty(){
            let isRequiredFieldsEmpty = false;

            if(!this.name){
                this.errors.name = "Name is required";
                isRequiredFieldsEmpty = true;
            }

            if(!this.gender || this.gender === ''){
                this.errors.gender = "Gender is required";
                isRequiredFieldsEmpty = true;
            }

            if(!this.email){
                this.errors.email = "Email is required";
                isRequiredFieldsEmpty = true;
            }

            if(!this.birthDay.day || !this.birthDay.month || !this.birthDay.year){
                this.errors.birthDay = "Birthday is required";
                isRequiredFieldsEmpty = true;
            }

            if(!this.profilePhoto){
                this.errors.profilePhoto = "Profile photo is required";
                isRequiredFieldsEmpty = true;
            }
            
            return isRequiredFieldsEmpty;
        },
        isValidEmail(email) {
            var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            console.log('check', email)
            if(email.match(validRegex)){
                return true;
            }
            return false;
        },
        photoInputChange(e){
            if(e.target.files[0]){
                let file = e.target.files[0];
                this.profileThumbnail = URL.createObjectURL(file);
                this.profilePhoto = file;
            }
        },
        convertToBirthday(data){
            console.log(data)
            let birthDay = { day: String, month: String, year: String };
            if(!data){
                return birthDay;
            }

            if(data.length == 5){
                birthDay.month = data.split('/')[0];
                birthDay.day = data.split('/')[1];
            }
            else if(data.length == 4){
                birthDay.year = data;
            }
            else{
                birthDay.month = data.split('/')[0];
                birthDay.day = data.split('/')[1];
                birthDay.year = data.split('/')[2];
            }

            return birthDay;
        },
        convertToGenderString(data){
            switch(parseInt(data)){
                case 0:
                    return 'Male';
                case 1:
                    return 'Female';
                default:
                    return 'Other';
            }
        },
        convertToGenderCode(data){
            switch(data.toLowerCase()){
                case "male":
                    return 0;
                case "female":
                    return 1;
                default:
                    return 2;
            }
        }
    },
    mounted: function(){
        console.log('mounted', this.signupData);
    }
}
</script>
<style>
.error-text{
    color: red;
    text-align: right;
}
</style>
<style scoped>
    .container{
        display: flex;
        flex-direction: column;
        gap: 50px;
        width: 80%;
        max-width: 500px;
        margin-top: 50px;
    }
    .select__box{
        display: flex;
        flex-direction: column;
    }
    .select__box > select {
        height: 32px;
        padding-top: 10px;
        padding-bottom: 10px;
        box-sizing: content-box;
        border-width: 2px;
        border-radius: 4px;
    }
    .select__box > label{
        margin-bottom: 5px;
        color: var(--primaryColor);
        font-weight: bold;
        font-size: 0.96rem;
    }
    .input__photo{
        display: inline;
    }
    .Bdr\(5px\){
        border-radius: 5px;
    }
    .img__container{
        width: 100%;
        height: 100px;
        padding-left: 10px;
        padding-right: 10px;
        box-sizing: border-box;
        background-color: var(--color--empty-background2);
    }
    .img__container > img{
        height: 80%;
        min-width: 100px;
    }
</style>