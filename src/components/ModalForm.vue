<template>
    <div class="H(100%) W(100%) D(flex) Fd(column) gray-background">
        <div class="title-bar D(flex) Al(center) Jc(center) P(relative) block-with-border Bdbc(default)">
            <span class="title Fw(bold) Tt(capitalize) Us(none)">{{ title }}</span>
            <span class="P(abs) D(flex) Jc(center) Al(center) R(0)
            Color(brandColor) Fw(bold) title-button Us(none) Fs(normal) Cur(p)"
            v-on:click="onDone()"
            >Done</span>
        </div>
        <ul class="options Pt(10px)">
            <li v-for="(option, index) in options" v-bind:key="index" 
                class="block block-with-border Bdbc(default) D(flex) P(relative) 
                Pr(5%) Pl(5%) Us(none) Cur(p) Fs(normal) Pt(10px) Pb(10px)"
                :class="{'Bdtc(default)': index == 0, 'Color(brandColor)': selectedIndex != -1 && index === selectedIndex}"
                v-on:click="onSelect(index)"
            >
                {{ options[index].value }}
                <img
                    class="icon P(abs) R(0) mr(12px) Us(none)"
                    v-if="selectedIndex != -1 && index === selectedIndex"
                    style="width: 14px; height: 14px"
                    src="../../public/icon/check.svg"
                />
            </li>
        </ul>
    </div>
</template>

<script>
import { toRef } from '@vue/reactivity';
import { ref } from 'vue';
export default {
    name: "ModalForm",
    props: {
        Title: String,
        Options: Array,
        Key: Object,
        SelectedValue: String,
        previousRouteName: String,
    },
    emits: [
        "onDone",
    ],
    setup(props) {
        const selectedValue = toRef(props, "SelectedValue");
        const key = toRef(props, "Key");
        const title = toRef(props, "Title");
        const options = toRef(props, "Options");
        const selIndex = ref(options.value.findIndex(x => x.value == selectedValue.value));
        return {
            options,
            title,
            key,
            selectedValue,
            selIndex,
        };
    },
    computed: {
        selectedIndex: {
            get(){
                return this.selIndex;
            },
            set(newValue){
                this.selIndex = newValue;
            }
        },
    },
    methods: {
        onSelect(newIndex){
            this.selIndex = newIndex;
        },
        onDone(){
            let key = this.options[this.selectedIndex].key;
            this.$emit("onDone", key);
            this.$router.back();
        }
    },
    mounted: function () {
        console.log("modal mounted");
    },
};
</script>

<style scoped>
.title{
    font-size: 0.95rem;
}
.title-button{
    width: 55px;
    height: 45px;
}
.block{
    background-color: white;
}
.title-bar{
    background-color: white;
    width: 100%;
    height: 45px;
}
.block-with-border{
    border-width: 1px;
}
ul{
    margin-block-start: 0em;
    margin-block-end: 0em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 0px;
}
</style>>