import InputWrapper from "./InputWrapper.vue";

export default {
    title: "InputWrapper",
    component: InputWrapper,
}

export const Number = () => ({
    components: { InputWrapper },
    template: '<InputWrapper type="number" placeholder="14"/>'
})

export const Text = () => ({
    components: { InputWrapper },
    template: '<InputWrapper type="text" placeholder="Enter Text"/>'
})