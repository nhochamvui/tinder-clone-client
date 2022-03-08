<template>
    <div class="upload-photo">
        <div class="form-upload">
            <ul>
                <li>
                    <input 
                    class="file-container" 
                    type="file" 
                    accept="image/*" 
                    name="photo"
                    v-on:change="(e) => onFileSelected(e.target.files[0])">
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
    name: "UploadPhoto",
    methods: {
        ...mapActions({
            "uploadPhoto": "users/uploadPhoto",
        }),
        onFileSelected(fileSelected){
            this.uploadPhoto(fileSelected);
        },
    }
}
</script>

<style>

</style>