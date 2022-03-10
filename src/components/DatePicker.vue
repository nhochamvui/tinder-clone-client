<template>
    <div class="date__picker-container">
        <label class="Us(none) D(flex) Fd(row)">{{ label }} <span v-if="isRequired" style="color:red">*</span>
        <span
            class="error-text"
            v-if="error || subError"
            v-text="subError ? '*' + subError : '*' + error"
        ></span>
        </label>
        <!-- <select v-bind:value="day" :disabled="month==null" v-on:change="$emit('update:day', $event.target.value)">DD
            <option v-for="i in days[parseInt(month)-1]" v-bind:key="i" v-text="i <= 9 ? '0'+i.toString() : i"></option>
        </select>
        <select v-bind:value="year" v-on:change="$emit('update:year', $event.target.value)">YYYY
            <option v-for="i in 12" v-bind:key="i" v-text="i <= 9 ? '0'+i.toString() : i"></option>
        </select> -->
        <div class="date__picker-container2">
            <input
                onkeypress="return (event.charCode == 8 || event.charCode == 0 || event.charCode == 13) ? null : event.charCode >= 48 && event.charCode <= 57"
                type="number"
                pattern="\d*"
                maxlength="2"
                placeholder="MM"
                v-bind:value="month"
                v-on:input="inputMonth"
                v-on:change="changeMonth"
            />
            <input
                onkeypress="return (event.charCode == 8 || event.charCode == 0 || event.charCode == 13) ? null : event.charCode >= 48 && event.charCode <= 57"
                :disabled="month == null || month === ''"
                type="number"
                pattern="\d*"
                maxlength="2"
                placeholder="DD"
                v-bind:value="day"
                v-on:input="inputDay"
                v-on:change="changeDay"
            />
            <input
                onkeypress="return (event.charCode == 8 || event.charCode == 0 || event.charCode == 13) ? null : event.charCode >= 48 && event.charCode <= 57"
                :disabled="day === '' || day == null"
                type="number"
                pattern="\d*"
                maxlength="4"
                placeholder="YYYY"
                v-bind:value="year"
                v-on:input="inputYear"
                v-on:change="changeYear"
            />
        </div>
    </div>
</template>

<script>
export default {
    name: "DatePicker",
    props: ["day", "month", "year", "label", "error", "isRequired"],
    emits: ["update:day", "update:month", "update:year"],
    data() {
        return {
            days: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            subError: null,
        };
    },
    watch: {
        error: function(newVal, oldVal){
        },
    },
    methods: {
        inputMonth(e) {
            let data = e.target.value;
            if (e.target.value.length > e.target.maxLength) {
                e.target.value = e.target.value.slice(0, e.target.maxLength);
            }

            if (parseInt(data) > 12) {
                e.target.value = 12;
            }
            if (data.length == e.target.maxLength && parseInt(data) <= 0) {
                e.target.value = 1;
            }
        },
        changeMonth(e) {
            if (parseInt(e.target.value) < 9) {
                e.target.value = "0" + parseInt(e.target.value);
            }

            this.$emit("update:month", e.target.value);

            if(parseInt(this.year) && parseInt(e.target.value) && parseInt(this.day)){
                if(!this.isValidDate(parseInt(this.year), parseInt(e.target.value)-1, parseInt(this.day))){
                    this.subError = "Invalid date";
                }
                else{
                    this.subError = null;
                }
            }
        },
        inputDay(e) {
            let data = e.target.value;
            if (e.target.value.length > e.target.maxLength) {
                e.target.value = e.target.value.slice(0, e.target.maxLength);
            }

            if (parseInt(data) > 31) {
                e.target.value = 31;
            }
            if (parseInt(data) <= 0) {
                e.target.value = 1;
            }

            if ((this.month != null || this.month != "") 
                && parseInt(data) > this.days[parseInt(this.month) - 1]
            ) {
                e.target.value = this.days[this.month - 1];
            }
        },
        changeDay(e) {
            if (parseInt(e.target.value) < 9) {
                e.target.value = "0" + parseInt(e.target.value);
            }
            
            this.$emit("update:day", e.target.value);

            if(parseInt(this.year) && parseInt(this.month) && parseInt(e.target.value)){
                if(!this.isValidDate(parseInt(this.year), parseInt(this.month)-1, parseInt(e.target.value))){
                    this.subError = "Invalid date";
                }
                else{
                    this.subError = null;
                }
            }
        },
        inputYear(e) {
            let data = e.target.value;
            let maxYear = new Date().getFullYear() - 18;
            let minYear = new Date().getFullYear() - 100;

            if (e.target.value.length > e.target.maxLength) {
                e.target.value = e.target.value.slice(0, e.target.maxLength);
            }
            if (data.length == 4 && parseInt(data) > maxYear) {
                e.target.value = maxYear;
            }
            if (data.length == 4 && parseInt(data) <= minYear) {
                e.target.value = minYear;
            }
        },
        changeYear(e) {
            this.$emit("update:year", e.target.value);

            if(parseInt(e.target.value) && parseInt(this.month) && parseInt(this.day)){
                if(!this.isValidDate(parseInt(e.target.value), parseInt(this.month)-1, parseInt(this.day))){
                    this.subError = "Invalid date";
                }
                else{
                    this.subError = null;
                }
            }
        },
        isValidDate(year, month, day){
            console.log(day, month, year)
            if(isNaN(day) || isNaN(month) || isNaN(year)){
                return false;
            }

            let date = new Date(year, month, day);
            if(date.getFullYear() != year || date.getMonth() != month || date.getDate() != day){
                return false;
            }

            return true;
        }
    },
};
</script>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Firefox */
input[type="number"] {
    -moz-appearance: textfield;
}
.date__picker-container {
    display: flex;
    flex-direction: column;
}
.date__picker-container2 {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    /* grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); */
}
label {
    margin-bottom: 5px;
    color: var(--primaryColor);
    font-weight: bold;
    font-size: 0.96rem;
}
input {
    width: 30%;
    border: none;
    border-radius: 5px;
    outline: none;
    background-color: var(--color--empty-background2);
    padding-bottom: 10px;
    padding-top: 10px;
    text-align: center;
    height: 32px;
}
</style>