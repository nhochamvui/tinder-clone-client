<template>
<transition name="modal-fade">
    <div class="modal-backdrop">
        <div class="modal">
            <!-- <header class="modal-header">
                <div class="modal__header-label">
                    <slot name="header"> This is the default title! </slot>
                </div>
            </header> -->
            <div class="modal-body">
                <slot name="body"> </slot>
            </div>
            
            <div class="modal-footer">
                <slot name="footer"> </slot>
                
                <button type="button" class="btn-close" @click="close">
                    Close
                </button>
            </div>
        </div>
    </div>
</transition>
</template>

<script>
export default {
    name: "Modal",
    methods: {
        close() {
            this.$emit("close");
        },
    },
};
</script>

<style scoped>
.modal-enter-from,
  .modal-leave-to {
    transform: scale(1.5);
  }

  .modal-enter-active,
  .modal-leave-active {
    transition: all .5s linear;
  }
.modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
}

@keyframes example {
  from {transform: scale(0.1);}
  to {transform: scale(1);}
}
.modal {
    background: #ffffff;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    width: 300px;
    height: 300px;
    animation-name: example;
    animation-duration: 0.3s;
    animation-timing-function: ease-out;
}

.modal-header,
.modal-footer {
    padding: 15px;
    display: flex;
}

.modal-header {
    position: relative;
    border-bottom: 1px solid #eeeeee;
    justify-content: space-between;
    display: flex;
    flex-direction: row;
}

.modal-footer {
    border-top: 1px solid #eeeeee;
    flex-direction: row;
    justify-content: space-around;
}

.modal-body {
    position: relative;
    padding: 20px 10px;
    display: flex;
    justify-content: center;
    height: -webkit-fill-available;
}

.modal__header-label{
    width: 100%;
    text-align: center;
}

button{
    width: 100px;
    min-height: 40px;
    border-radius: 100px;
    background-color: white;
    border: gray 1px solid;
    color: gray;
    font-size: 0.9rem;
    cursor: pointer;
    align-self: center;
}
.button__message{
    background: linear-gradient(262deg, #ff7854, #fd267d);
    color: white;
    border: none;
}
.button__message:hover{
    background: white;
    color: black;
}
button:hover{
    border: black 1px solid;
    color: black;
}

</style>