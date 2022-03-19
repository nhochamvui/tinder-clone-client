<template>
    <img v-if="width === '' && height === ''"
        v-bind:src="imageSrc"
        v-bind:alt="altString"
        v-on:error="onError"
        v-on:load="onLoad"
        v-on:complete="onComplete"
    />
    <img v-else
        v-bind:src="imageSrc"
        v-bind:alt="altString"
        v-on:error="onError"
        v-on:load="onLoad"
        v-on:complete="onComplete"
        v-bind:style="'width: ' + width + '; height: ' + height"
    />
</template>

<script>
export default {
    name: "Image",
    props: {
        imgSrc: String,
        altString: String,
        width: String,
        height: String,
    },
    data(){
        return {
            dataSrc: this.imgSrc,
        };
    },
    computed: {
        imageSrc: {
            get(){

                if(!this.dataSrc || this.dataSrc === ''){
                    console.log('getting imageSrc: ', this.dataSrc)
                    return "/img/default_profile_picture.jpg";
                }
                return this.dataSrc;
            },
            set(newValue){
                this.dataSrc = newValue;
            }
        }
    },
    watch: {
        dataSrc: function(newValue, oldValue){
            // console.log('Image, newValue: ', newValue, ' | oldValue: ', oldValue);
        }
    },
    methods: {
        onError(e) {
            let defaultImage = "/img/default_profile_picture.jpg";
            if (e.target) {
                e.target.src = defaultImage;
                console.log('onerror: ', this.imgSrc)
            }
            return true;
        },
        onLoad(e) {
        },
        onComplete(e) {
            console.log("onComplete: ", this.imgSrc);
        },
        setImageSrc(src){
            this.imageSrc = src;
        },
        getDataSrc(){
            return this.dataSrc;
        }
    },
    mounted: function(){
        if(this.imageSrc || this.imageSrc === ''){
            // this.$refs['img'].src = '/img/default_profile_picture.jpg';
            // console.log('data: ', this.dataSrc);
        }
    },
};
</script>

<style scoped>
img{
    width: 100%;
    height: 100%;
}
</style>