<template>
  <router-view name="child"
  v-if="windowWidth < 750 && this.discoverySettingsGetSet != null && this.discoverySettingsGetSet.length != 0"/>

  <div
    v-show="['Profile','ProfileEdit','ProfileEditGender', 'SetGenderSide', 'Settings'].includes(routeName)"
    v-if="this.discoverySettingsGetSet != null && this.discoverySettingsGetSet.length != 0"
    class="settings__container"
  >
    <div class="settings__box bg(white)">
      <h4 class="profile__title settings__text Us(none)">DISCOVERY SETTINGS</h4>
    </div>
    <div class="settings__container--location settings__box settings__text">
      <div class="settings__box--row">
        <label for="" class="settings__text--primary">Location</label>
        <span
          class="settings__text--secondary link"
          id="settings_location--text"
          v-text="this.discoverySettingsGetSet.location"
        ></span>
      </div>
    </div>
    <div class="settings__container--distance settings__box">
      <div class="settings__box--row">
        <label class="settings__text--primary" for=""
          >Distance Preference</label
        >
        <span
          class="settings__text--secondary"
          id="settings_location--text"
          v-text="distancePref + ' km'"
        ></span>
      </div>
      <input class="slider2" type="range"
        v-model="distancePref"
        v-bind:style="'background-size: ' + (distancePref - distancePrefMin)*100/(distancePrefMax - distancePrefMin) + '% 100%'"
        v-on:mouseup="onMouseUp"
        v-bind:min="distancePrefMin" v-bind:max="distancePrefMax"
      >
      <div class="settings__box--row">
        <label class="settings__text--primary" for=""
          >Only show people in this range</label
        >
        <div class="settings__checker cursor-pointer" v-on:click="settingCheckerClick('distanceToogle', 'distancePrefCheck', !this.distancePrefCheck)">
          <input type="checkbox" class="inactive cursor-pointer select-none" name="distancePreference" id=""/>
          <div :class="{'inactive-bg': !this.distancePrefCheck}" class="rec-border select-none cursor-pointer">
            <div :class="{'inactive-item': !this.distancePrefCheck}" ref="distanceToogle" class="circle select-none cursor-pointer"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="settings__container--distance settings__box">
      <div class="settings__box--row">
        <label class="settings__text--primary" for="">Looking for</label>
        <div
          class="settings__text--secondary link D(flex) Ji(center) Al(center)"
          id="settings_location--text"
          v-on:mouseover="mouseOverEvent"
          v-on:mouseout="mouseOutEvent"
          v-on:click="onSetGenderClick()"
        >
          {{this.genderPref}}
          <img class="link fill-brandBG" style="width:10px; height:10px; margin-left:10px" src="../../public/icon/next.svg"/>
        </div>
      </div>
    </div>
    <div class="settings__container--distance settings__box">
      <div class="settings__box--row">
        <label class="settings__text--primary" for="">Age Preference</label>
        <span
          class="settings__text--secondary"
          href=""
          id="settings_location--text"
          v-text="this.agePref"
        ></span>
      </div>
      <div class="settings__box--row doubleslider__container">
        <input class="double__slider-head slider2 double__slider" type="range"
          v-model="minAgePref"
          v-on:mouseup="onMouseUp"
          v-bind:min="minAgeDefault" v-bind:max="(maxAgeDefault - minAgeDefault)/2 - 1"
          v-bind:style="'background-size: ' + ((maxAgeDefault - minAgeDefault)/2 - 1 - minAgePref)*100/((maxAgeDefault - minAgeDefault)/2 - 1 - minAgeDefault) + '% 100%'"
        >
        <input class="tail slider2 double__slider" type="range" style="right:0"
          v-model="maxAgePref"
          v-on:mouseup="onMouseUp"
          v-bind:min="(maxAgeDefault - minAgeDefault)/2" v-bind:max="maxAgeDefault"
          v-bind:style="'background-size: ' + (maxAgePref - (maxAgeDefault - minAgeDefault)/2)*100/(maxAgeDefault - (maxAgeDefault - minAgeDefault)/2) + '% 100%'"
        >
      </div>
      <div class="settings__box--row">
        <label class="settings__text--primary" for=""
          >Only show people in this range</label
        >
        <div class="settings__checker cursor-pointer" v-on:click="settingCheckerClick('ageToogle', 'agePrefCheck', !this.agePrefCheck)">
          <input type="checkbox" class="inactive cursor-pointer select-none" name="distancePreference" id=""/>
          <div :class="{'inactive-bg': !this.agePrefCheck}" class="rec-border select-none cursor-pointer">
            <div :class="{'inactive-item': !this.agePrefCheck}" ref="ageToogle" class="circle select-none cursor-pointer"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="settings__container--location settings__box settings__text">
      <div class="settings__box--row Al-s(center)">
        <label v-on:click="doLogout" class="settings__text--primary link">Logout</label>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Settings",
  inheritAttrs: false,
  setup(){
  },
  data() {
    return {
      me: {},
      isMouseDown: false,
      distancePreference: 2,
      distancePrefMin: 2,
      distancePrefMax: 100,
      genderPreference: 0,
      currentSliderName: '',
      currentStartSliderName: '',
      currentDividerName: '',
      currentTrackerName: '',
      currentIndicatorPrefName: '',
      minDeltaValue: -1,
      minIndicatorValue: -1,
      maxIndicatorValue: -1,
      minAgeDefault: 18,
      maxAgeDefault: 100,
    };
  },
  emits: [
    'onSetGenderPrefClick', 
  ],
  methods: {
    ...mapGetters({
      getDiscoverySettings: "getSettings",
      getSettings: "getSettings",
      getWindowWidth: "getWindowWidth",
    }),
    ...mapActions({
      fetchDiscoverySettings: "fetchSettings",
      setDistancePref: "setDistancePref",
      setDistancePrefCheck: "setDistancePrefCheck",
      setSettings: "setSettings",
      saveSettings: "saveSettings",
      unLoadUser: "users/unLoadUser",
    }),
    doLogout(){
      FB.api("/me/permissions", "delete", null, async () => await FB.logout());
      this.unLoadUser();
    },
    onSetGenderClick: function(){
      if(this.windowWidth < 750){
        this.$router.push({name: "SetGender"});
      }
      else{
        this.$router.push({name: "SetGenderSide"});
      }
      this.$emit('onSetGenderPrefClick')
    },
    onChange(e){
      let val = e.target.value;
      this
    },
    onMouseUp: function(e){
      let delaySecond = 1000;
      setTimeout(()=>{
        this.saveSettings();
      }, delaySecond);
    },
    mouseOverEvent: function(e){
      let me = e.target;
      me.childNodes.forEach(element => {
        if(element.nodeName == 'IMG'){
          element.style.filter = 'invert(47%) sepia(92%) saturate(2481%) hue-rotate(321deg) brightness(101%) contrast(98%)';
        }
      });
    },
    mouseOutEvent: function(e){
      let me = e.target;
      me.childNodes.forEach(element => {
        if(element.nodeName == 'IMG'){
          element.style.filter = 'invert(97%) sepia(3%) saturate(392%) hue-rotate(183deg) brightness(93%) contrast(103%)';
        }
      });
    },
    settingCheckerClick: function(elementRefName, valuePrefName, toogleValue){
      let toogleElement = this.$refs[elementRefName];
      this[valuePrefName] = toogleValue;
      if(!toogleValue){
        toogleElement.style.transform = "translateX(0px)";
      }
      else{
        toogleElement.style.transform = "translateX(20px)";
      }
    },
    initializePrefChecks: function(){
      this.settingCheckerClick('distanceToogle', 'distancePrefCheck', this.distancePrefCheck);
      this.settingCheckerClick('ageToogle', 'agePrefCheck', this.agePrefCheck);
    },
  },
  computed: {
    windowWidth: function () {
      return this.getWindowWidth();
    },
    routeValueChange: function () {
      return this.$route.name;
    },
    routeName: function () {
      return this.$route.name;
    },
    meGetSet: {
      get() {
        return this.me;
      },
      set(newVal) {
        this.me = newVal;
      },
    },
    discoverySettingsGetSet: {
      get() {
        console.log('getDiscoverySettings ')
        return this.getDiscoverySettings();
      },
      set(newVal) {
        this.discoverySettings = newVal;
      },
    },
    distancePref: {
      get(){
        if(this.getDiscoverySettings() != null){
          let temp = this.getDiscoverySettings().distancePreference;
          return temp;
        }

        return 2;
      },
      set(newVal){
        if(newVal < 2){
          newVal = 2;
        }
        else if(newVal > 100){
          newVal = 100;
        }

        this.setDistancePref(newVal);
      }
    },
    distancePrefCheck: {
      get(){
        if(this.getDiscoverySettings() != null){
          let temp = this.getDiscoverySettings().distancePreferenceCheck;
          return temp;
        }

        return false;
      },
      set(newVal){
        console.log('set distancePrefcheck: ', newVal)
        if(typeof newVal === 'boolean' && this.getDiscoverySettings().distancePreferenceCheck !== undefined){
          this.getDiscoverySettings().distancePreferenceCheck = newVal;
        }
      }
    },
    genderPref: {
      get(){
        if(this.getDiscoverySettings() != null){
          let gender = this.getDiscoverySettings().lookingForGender;
          switch(gender){
            case 0:
              return "Male";
            case 1:
              return "Female";
            case 2:
              return "Other";
            default:
                return "Everyone"
          }
        }

        return "Other";
      },
      // set(genderVal){
      //   this.genderPreference = genderVal;
      // }
    },
    minAgePref: {
      get(){
        return this.getSettings()?.minAge;
      },
      set(newVal){
        this.getSettings().minAge = newVal;
      }
    },
    maxAgePref:{
      get(){
        return this.getSettings()?.maxAge;
      },
      set(newVal){
        this.getSettings().maxAge = newVal;
      }
    },
    agePref: {
      get(){
        return this.minAgePref + ' - ' + this.maxAgePref;
      }
    },
    currentSliderNameGetSet: {
      get(){
        return this.currentSliderName;
      },
      set(newVal){
        this.currentSliderName = newVal;
      }
    },
    currentDividerNameGetSet: {
      get(){
        return this.currentDividerName;
      },
      set(newVal){
        this.currentDividerName = newVal;
      }
    },
    currentTrackerNameGetSet: {
      get(){
        return this.currentTrackerName;
      },
      set(newVal){
        this.currentTrackerName = newVal;
      }
    },
    currentAgePrefNameGetSet: {
      get(){
        return this.currentAgePrefName;
      },
      set(newVal){
        this.currentAgePrefName = newVal;
      }
    },
    agePrefCheck: {
      get(){
        if(this.getDiscoverySettings() != null){
          let temp = this.getDiscoverySettings().agePreferenceCheck;
          return temp;
        }
        return false;
      },
      set(newVal){
        if(typeof newVal !== 'boolean'){
          newVal = false;
        }
        else if(this.getDiscoverySettings().agePreferenceCheck !== undefined){
          this.getDiscoverySettings().agePreferenceCheck = newVal;
        }
      }
    },
  },
  watch: {
    windowWidth: function (newVal) {
      if (newVal >= 750) {
        this.$router.push({name: "Profile", replace: true})
      }
    },
    discoverySettingsGetSet: function (newVal) {
      if (newVal.length == 0) {
        this.fetchDiscoverySettings();
      }
    },
    distancePrefCheck: function(){
      this.saveSettings();
      this.initializePrefChecks();
    },
  },
  created: function(){
  },
  mounted: function () {
    console.log("mounted at profile");
    this.initializePrefChecks();
  },
};
</script>

<style>
.fill-brandBG{
  filter: invert(97%) sepia(3%) saturate(392%) hue-rotate(183deg) brightness(93%) contrast(103%);
}
.fill-brandBG:focus{
  filter: invert(40%) sepia(86%) saturate(1204%) hue-rotate(322deg) brightness(104%) contrast(98%);
}
.select-none{
  user-select: none;
}
.cursor-pointer{
  cursor: pointer;
}
.settings__checker input{
  position: absolute;
}
.rec-border {
  width: 50px;
  height: 30px;
  background-color: #fd546c;
  border-radius: 50px;
}
.circle {
  background-color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: #fd546c solid 1px;
  transition-timing-function: ease-in-out;
  transition-duration: 0.2s;
}
.inactive{
  opacity: 0;
}
.inactive-item{
  /* opacity: 0; */
  background-color: white;
  border: var(--gray40) solid 1px;
}
.inactive-bg{
  background-color: var(--gray40);
}
.margin-top-bottom {
  padding-top: 8%;
  padding-bottom: 8%;
  padding-left: 4%;
  padding-right: 4%;
}
.slider2{
  margin-top: 6%;
  margin-bottom: 6%;
  -webkit-appearance: none;
  height: 2px;
  border-radius: 5px;
  background: #d3d3d3;
  outline: none;
  background-repeat: no-repeat;
  background-image: linear-gradient(#ff4500, #ff4500);
  background-size: 70% 100%;
}
.slider2::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: var(--gray40) solid 1.2px;
  background-color: #fff;
  box-shadow: 0 2px 6px 0 rgb(102 113 128 / 14%);
  cursor: grab;
}

.slider2::-moz-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: var(--gray40) solid 1.2px;
  background-color: #fff;
  box-shadow: 0 2px 6px 0 rgb(102 113 128 / 14%);
  cursor: grab;
}

.slider2::-webkit-slider-thumb:hover{
  border: #fd546c solid 1px;
}

.slider2::-moz-slider-thumb:hover{
  border: #fd546c solid 1px;
}

.slider2::-webkit-slider-runnable-track{
  -webkit-appearance: none;
  box-shadow: none;
  border: none;
  background: transparent;
}

.slider2::-moz-range-track{
  -webkit-appearance: none;
  box-shadow: none;
  border: none;
  background: transparent;
}

.slider {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  border: var(--gray20) solid 1.2px;
  background-color: #fff;
  z-index: 1;
  cursor: grab;
  position: absolute;
  box-shadow: 0 2px 6px 0 rgb(102 113 128 / 14%);
}
.slider:hover {
  border: #fd546c solid 1px;
}

.doubleslider__container{
  width: 100%;
  position: relative;
  margin-bottom: 10%;
  margin-top: 10%;
}

.double__slider{
  position: absolute;
  width: 50%;
}
.double__slider-head{
  background-position-x: right;
}
.tracker {
  height: 2px;
  border-radius: 4px;
  background-color: #fd546c;
  position: absolute;
}
.settings__distance--slider {
  position: relative;
  height: 2px;
}
.settings__distance--divider {
  border-radius: 4px;
  background-color: #e6eaf0;
  height: 2px;
  width: 100%;
  position: absolute;
}
.sidebar-content {
  background-color: #f5f7fa;
}
.settings__container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

@media screen and (max-width: 749px){
  .settings__container{
    overflow-y: auto;
  }
}

.profile__title{
  font-size: 0.75rem;
  font-weight: 600;
  color: #667180;
}
.settings__text--secondary:visited {
  color: #667180;
}

.link{
  cursor: pointer;
  transition-property: color;
  transition-duration: .2s;
}
.link:hover {
  color: #fd546c;
  filter: invert(47%) sepia(92%) saturate(2481%) hue-rotate(321deg) brightness(101%) contrast(98%);
}

.link::after:hover{
  content: '';
  position: absolute;
  background-image: url('../../public/icon/next3.svg');
  filter: invert(47%) sepia(92%) saturate(2481%) hue-rotate(321deg) brightness(101%) contrast(98%);
  width: 12px;
  height: 12px;
}
.settings__text--primary {
  max-width: 80%;
  color: #667180;
  text-decoration: none;
  user-select: none;
  font-weight: 400;
}
.settings__text--secondary {
  max-width: 70%;
  text-align: right;
  text-decoration: none;
  color: #667180;
  text-overflow: ellipsis;
  user-select: none;
}
.settings__text {
  color: #667180;
  margin-block-start: 0px;
  margin-block-end: 0px;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
}
.settings__box {
  display: flex;
  flex-direction: column;
  padding-left: 5%;
  padding-right: 5%;
  padding-top: 5%;
  padding-bottom: 5%;
  border-bottom: var(--gray30) solid 1px;
  background-color: #fff;
}
.settings__box--row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.bg\(white\){
  background-color: transparent;
}
.Us\(none\){
  user-select: none;
}
</style>