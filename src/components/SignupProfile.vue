<template>
<div class="signup-container W(100%) H(100%)">
    <h1 class="heading">CREATE ACCOUNT</h1>
    <form class="container" v-on:submit="submit" method="post" v-bind:action="host">
        <TextField
            :label="'Full Name'"
            :hint="'Type your name'"
            :imageSrc="'/icon/user.png'"
            v-bind:is-required="true"
            v-model:value.trim="name"
            v-model:error="errors.name"
        />
        <div class="select__box">
            <label class="select__box-label Us(none) D(flex) Fd(row)" for="">Gender <span style="color:red">*</span>
                <span v-if="errors.gender" class="error-text" v-text="'*' + errors.gender"></span>
            </label>
            <select v-model="gender">
                <option disabled value="">Choose gender</option>
                <option value="0">Male</option>
                <option value="1">Female</option>
                <option value="2">Other</option>
            </select>
        </div>
        <TextField
            :label="'Email Address'"
            :hint="'abc@example.com'"
            :imageSrc="'/icon/email.png'"
            v-model:value.trim="email"
            v-model:error="errors.email"
            v-bind:is-required="true"
            v-bind:verifyURL="host+'api/users/check/email'"
            v-bind:verifyFunction="isValidEmail"
            v-bind:verifyName="'Email'"
        />
        <DatePicker
            v-model:day.trim="birthDay.day"
            v-model:month.trim="birthDay.month"
            v-model:year.trim="birthDay.year"
            v-bind:label="'Birthday'"
            v-bind:is-required="true"
            v-model:error="errors.birthDay"
        />
        <div class="select__box">
            <label class="select__box-label Us(none) D(flex) Fd(row)" for="">Profile Photo <span style="color:red">*</span>
                <span v-if="errors.profilePhoto" class="error-text" v-text="'*' + errors.profilePhoto"></span>
            </label>
            <div class="W(100%) Bdr(5px) D(flex) Al-s(center) Jc(space-between)">
                <label class="container__input Cur(p)">
                    <input class="input__photo" 
                    v-on:change="photoInputChange" 
                    type="file" accept="image/png, image/jpeg"
                    ref="fileInput"
                    alt="input_photo">
                    Upload Photo
                </label>
                <img v-bind:src="profileThumbnail"
                class="Cur(p) Bdr(5px) img__add-photo Al-s(center)"
                style="object-fit:cover"
                v-on:click="$refs.fileInput.click()"
                alt="profile_photo">
            </div>
        </div>
        <button class="button Cur(p) Al-s(center)">
            <input class="" type="submit" >
        </button>
    </form>
</div>
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
        return{
            name: this.signupData?.name ?? '',
            email: this.signupData?.email ?? '',
            gender: this.signupData?.gender ? this.convertToGenderCode(this.signupData.gender) : '',
            birthDay: this.convertToBirthday(this.signupData?.birthday),
            profilePhoto: null,
            profileThumbnail: '/img/default-photo.jpg',
            errors: {
                name: null,
                gender: null,
                email: null,
                profile: null,
                birthDay: null,
                profilePhoto: null,
            },
            host: this.getHostURL(),
            isSubmitting: false,
        }
    },
    methods:{
        ...mapGetters({
            getHostURL: "getHostURL"
        }),
        ...mapActions({
            signup: "users/signup",
        }),
        submit(e){
            e.preventDefault();
            this.clearAllErrors();
            if(!this.isRequiredFieldsEmpty()){
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
            
            if(this.gender === ''){
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
            let birthDay = {day:'', month:'', year:''};
            console.log('data: ',data)
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
    font-weight: normal;
    font-size: small;
    margin-left: auto;
}
</style>
<style scoped>
    .heading{
        margin-top: 30px;
        text-align: center;
        font-style: italic;
    }
    .button{
        width: 100px;
        min-height: 40px;
        border-radius: 100px;
        background-color: white;
        margin-top: 5px;
        margin-bottom: 10px;
        border: gray 1px solid;
        color: gray;
        font-size: 0.9rem;
    }

    .button:hover{
        border: black 1px solid;
        color: black;
    }

    .button > input{
        border: none;
        background: transparent;
    }

    .container{
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 80%;
        max-width: 500px;
        margin-top: 30px;
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

    .img__add-photo{
        width: 50px;
        height: 50px;
    }

    .img__add-photo:hover{
        border: black 1px solid;
    }

    .container__input{
        display: flex;
        justify-content: center;
        align-items: center;
        align-self: center;
        border-radius: 5px;
        background-color: blue;
        width: 100%;
        height: 48px;
        margin-right: 10px;
        background-color: white;
        border: gray 2px solid;
        font-size: 1rem;
    }

    .container__input:hover{
        border: black 2px solid;
    }

    .input__photo{
        display: inline;
        opacity: 0;
        width: 0;
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
        max-width: 100px;
    }
@media screen and (max-width: 749px){
    .signup-container{
        overflow-y: auto;
    }
}
</style>