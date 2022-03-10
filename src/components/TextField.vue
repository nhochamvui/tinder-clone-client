<template>
    <div class="texfield__container">
        <label class="Us(none) D(flex) Fd(row)">{{ label }} <span v-if="isRequired" style="color:red">*</span>
        <span
            class="error-text"
            v-if="error || subError"
            v-text="subError ? '*' + subError : '*' + error"
        ></span>
        </label>
        <div class="wrapper">
            <img
                class="Us(none)"
                v-bind:src="imageSrc"
                style="height: 16px; width: 16px"
                alt=""
            />
            <input
                type="text"
                v-bind:placeholder="hint"
                v-bind:value="value"
                v-on:input="onInput"
                v-on:change="onChange"
            />
        </div>
    </div>
    <!-- <div>{{ input }}</div> -->
</template>

<script>
import { mapActions } from "vuex";
export default {
    name: "TextField",
    props: {
        input: String,
        label: String,
        value: String,
        imageSrc: String,
        hint: String,
        error: String,
        verifyURL: String,
        verifyFunction: Function,
        verifyName: String,
        isRequired: Boolean,
    },
    emits: ["update:value"],
    data() {
        return {
            subError: null,
        };
    },
    methods: {
        ...mapActions({
            doPost: "doPost",
        }),
        onInput(e) {
            this.$emit("update:value", e.target.value);
        },
        async onChange(e) {
            let body = {};
            body[this.verifyName] = e.target.value;

            if (this.verifyFunction && this.verifyFunction(e.target.value)) {
                let response = await this.doPost({
                    url: this.verifyURL,
                    body
                });
                if (response) {
                    switch (response.status) {
                        case 200:
                            this.subError = null;
                            break;
                        case 422:
                            this.subError = "This email has been used";
                            break;
                        case 400:
                            this.subError = "Email is invalid";
                            break;
                    }
                }
            }
        },
    },
};
</script>

<style scoped>
.texfield__container {
    display: flex;
    flex-direction: column;
}
.wrapper {
    height: 32px;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 5px;
    background-color: var(--color--empty-background2);
    padding-bottom: 10px;
    padding-top: 10px;
    padding-left: 7px;
    padding-right: 10px;
}
label {
    margin-bottom: 5px;
    color: var(--primaryColor);
    font-weight: bold;
    font-size: 0.96rem;
}
input {
    border: none;
    outline: none;
    background-color: var(--color--empty-background2);
    padding-left: 20px;
    width: 100%;
}
img {
    filter: invert(98%) sepia(1%) saturate(2580%) hue-rotate(181deg)
        brightness(88%) contrast(97%);
}
</style>
