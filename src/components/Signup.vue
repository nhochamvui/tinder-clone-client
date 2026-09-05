<template>
    <div class="signup-container">
        <div class="signup__section">
            <h1 class="heading">CREATE ACCOUNT</h1>
            <form class="signup__form" v-on:submit.stop.prevent="onSubmit">
                <div class="signup__field">
                    <label>Username <span>*</span></label>
                    <input type="text" v-model.trim="form.username" placeholder="Choose a username" />
                </div>
                <div class="signup__field">
                    <label>Full Name <span>*</span></label>
                    <input type="text" v-model.trim="form.name" placeholder="Your name" />
                </div>
                <div class="signup__field">
                    <label>Email <span class="optional">(optional)</span></label>
                    <input type="email" v-model.trim="form.email" placeholder="you@example.com" />
                </div>
                <div class="signup__field">
                    <label>Password <span>*</span></label>
                    <input type="password" v-model="form.password" placeholder="Password" />
                </div>
                <div class="signup__field">
                    <label>Gender <span>*</span></label>
                    <select v-model="form.gender">
                        <option disabled value="">Choose gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div class="signup__field">
                    <label>Birthday <span>*</span></label>
                    <input type="date" v-model="form.birthday" />
                </div>
                <div class="signup__field">
                    <label>Profile Photo <span>*</span></label>
                    <input type="file" accept="image/png, image/jpeg" v-on:change="onPhotoChange" />
                </div>

                <div v-if="errorText" class="error-text">{{ errorText }}</div>

                <button type="submit" class="signup__submit" v-bind:disabled="isSubmitting">
                    {{ isSubmitting ? 'CREATING...' : 'SIGN UP' }}
                </button>
            </form>
            <p class="signup__footer">
                Already have an account?
                <a class="signup__link" v-on:click="goToLogin">Log in</a>
            </p>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";

export default {
    name: "Signup",
    data() {
        return {
            form: {
                username: "",
                name: "",
                email: "",
                password: "",
                gender: "",
                birthday: "",
            },
            photo: null,
            isSubmitting: false,
            errorText: "",
        };
    },
    methods: {
        ...mapActions({
            setToken: "users/setToken",
        }),
        onPhotoChange(e) {
            this.photo = e.target.files[0] || null;
        },
        goToLogin() {
            this.$router.push({ name: "Authenticate", params: { action: "login" } });
        },
        async onSubmit(e) {
            e.preventDefault();
            if (this.isSubmitting) return;

            this.errorText = "";
            if (!this.form.username || !this.form.name || !this.form.password || !this.form.gender || !this.form.birthday || !this.photo) {
                this.errorText = "Please fill in all required fields (username, name, password, gender, birthday, photo).";
                return;
            }

            this.isSubmitting = true;

            const bodyFormData = new FormData();
            bodyFormData.append("UserName", this.form.username);
            bodyFormData.append("Name", this.form.name);
            bodyFormData.append("Email", this.form.email);
            bodyFormData.append("Password", this.form.password);
            bodyFormData.append("Gender", this.form.gender);
            bodyFormData.append("Birthday", this.formatBirthday(this.form.birthday));
            bodyFormData.append("Photo", this.photo);

            try {
                const response = await axios.post(
                    process.env.VUE_APP_HOST_URL + "/api/users/signup",
                    bodyFormData,
                );
                this.setToken(response.data.accessToken);
                this.$router.push({ name: "MakeFriends" });
            } catch (err) {
                console.log("signup error: ", err);
                this.errorText = err.response && err.response.data && err.response.data.message
                    ? err.response.data.message
                    : "Signup failed. Please try again.";
            } finally {
                this.isSubmitting = false;
            }
        },
        formatBirthday(dateStr) {
            if (!dateStr) return "";
            const parts = dateStr.split("-");
            if (parts.length !== 3) return dateStr;
            return parts[1] + "/" + parts[2] + "/" + parts[0];
        },
    },
};
</script>

<style scoped>
.signup-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    overflow-y: auto;
}

.signup__section {
    margin-top: 20px;
    width: 60%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.heading {
    margin-top: 30px;
    text-align: center;
    font-style: italic;
}

.signup__form {
    display: flex;
    flex-direction: column;
    gap: 14px;
    width: 100%;
    margin-top: 20px;
}

.signup__field {
    display: flex;
    flex-direction: column;
}

.signup__field > label {
    margin-bottom: 5px;
    color: var(--primaryColor);
    font-weight: bold;
    font-size: 0.96rem;
}

.signup__field > label span {
    color: red;
}

.signup__field > label span.optional {
    color: gray;
    font-weight: normal;
}

.signup__field > input,
.signup__field > select {
    height: 40px;
    padding-left: 10px;
    padding-right: 10px;
    border: gray 2px solid;
    border-radius: 4px;
    font-size: 1rem;
    box-sizing: border-box;
}

.signup__field > input:hover,
.signup__field > select:hover {
    border-color: black;
}

.signup__submit {
    width: 100%;
    min-height: 44px;
    border-radius: 100px;
    background-color: white;
    margin-top: 5px;
    margin-bottom: 10px;
    border: gray 1px solid;
    color: gray;
    font-size: 0.95rem;
    cursor: pointer;
}

.signup__submit:hover:not(:disabled) {
    border: black 1px solid;
    color: black;
}

.signup__submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.signup__footer {
    text-align: center;
}

.signup__link {
    color: var(--primaryColor);
    font-weight: bold;
    cursor: pointer;
}
</style>
