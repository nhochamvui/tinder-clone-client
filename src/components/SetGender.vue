<template>
    <section>
        <div v-for="genderItem in genders" v-bind:key="genders.indexOf(genderItem)" 
            class="settings__box gender__item row link"
            v-on:click="setGenderClick(genders.indexOf(genderItem))">
            <div class="settings__box--row">
                <label for="" class="settings__text--primary link">{{ genderItem }}</label>
            <span v-if="gender == genders.indexOf(genderItem)" 
                class="settings__text--secondary link">
                <svg class="square fill__brand--color" viewBox="0 0 24 24" width="24px" height="24px" focusable="false" aria-hidden="false" aria-labelledby="e71675dcbf8dea3a" role="img"><path d="M21.33 4.783C20.883 4.223 20.212 4 19.542 4c-.67 0-1.34.224-1.788.783l-8.156 7.832-3.352-2.797c-.335-.56-1.006-.783-1.453-.783-.67 0-1.34.224-1.787.783-.783.56-1.006 1.12-1.006 1.679 0 .783.223 1.454.782 1.902l4.916 5.93c.559.447 1.118.671 1.9.671.67 0 1.117-.224 1.787-.783L21.218 8.14c.559-.448.782-1.119.782-1.79 0-.672-.223-1.343-.782-1.79l.112.223z" fill="" fill-rule="evenodd"></path><title id="e71675dcbf8dea3a">Checked</title></svg>
            </span>
      </div>
        </div>
        <div class="settings__text">{{ tipText }}</div>
    </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
    name: "SetGender",
    setup(){
        console.log('setgender here');
    },
    data() {
        return {
            genders: ["men", "women", "other", "everyone"],
            firstPhrase: "You will ",
            lastPhrase: " in discovery.",
        };
    },
    computed: {
        tipText: function () {
            let middlePhrase = 'only ';
            if(this.gender == this.genders.indexOf('everyone')){
                middlePhrase = '';
            }
            return this.firstPhrase + middlePhrase + 'see ' + this.genders[this.gender] + this.lastPhrase;
        },
        gender: {
            get() {
                if(this.getDiscoverySettings() != null){
                    let gender = this.getDiscoverySettings().lookingForGender;
                    return gender;
                }
                return undefined;
            },
            set(genderVal){
                this.setGender(genderVal)
            }
        },
    },
    watch: {
        gender: function(){
            console.log('gender changed');
            this.saveSettings();
        }
    },
    methods: {
        ...mapActions({
            setGender: "setGender",
            saveSettings: "saveSettings",
        }),
        ...mapGetters({
            getDiscoverySettings: "getSettings",
        }),
        setGenderClick: function(gender){
            debugger
            this.gender = gender;
            console.log('gender: ', this.gender);
        }
    },
    mounted: function () {
        console.log('mounted setgender')
    },
};
</script>

<style scoped>
.link{
  cursor: pointer;
  transition-property: color;
  transition-duration: .2s;
}
.link:hover {
  color: #fd546c;
  filter: none;
}
section {
    margin-top: 15px;
}
.settings__box {
  display: flex;
  flex-direction: column;
  padding-left: 5%;
  padding-right: 5%;
  padding-top: 5%;
  padding-bottom: 5%;
  border-bottom: #e6eaf0 solid 1px;
  background-color: #fff;
}
.settings__box--row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.settings__text{
    color: #667180;
    padding-left: 5%;
    padding-top: 5%;
    padding-bottom: 5%;
    user-select: none;
}
.settings__text--primary{
    text-transform: capitalize;
}
.settings__text--secondary {
  max-width: 70%;
  text-align: right;
  text-decoration: none;
  color: #667180;
  text-overflow: ellipsis;
  user-select: none;
}
.fill__brand--color{
    fill: #fd546c;
}
.square{
    height: 17px;
    width: 17px;
}
svg{
    vertical-align: middle;
}
.row{
    user-select: none;
}
</style>