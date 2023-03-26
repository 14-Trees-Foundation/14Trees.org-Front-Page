<template>
    <div class="input-wrapper relative pt-5">
        <!-- <input type="email" v-model="formData.donor.email_id" name="email_address" -->
        <input v-bind="$attrs" :value="value"
            v-on="{ ...$listeners, input: event => $emit('input', event.target.value) }" class="input-field peer placeholder-transparent" :placeholder="placeholder"/>
        <label :for="id" class="absolute top-0 left-0 text-sm font-medium text-gray-700 transition-all
            peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-7.5 peer-placeholder-shown:left-2
            peer-focus:top-0 peer-focus:left-0 peer-focus:text-gray-600 peer-focus:text-sm select-none pointer-events-none">
                {{ placeholder }}
        </label>
    </div>
</template>

<script>
export default {
  name: "InputWrapper",
  inheritAttrs: false,
  props: ["value", "placeholder", "id"],    
};
</script>
