<template>
    <div class="relative z-100 inline-flex">
        <div @mouseover="tooltip = true" @mouseleave="tooltip = false" class="px-2">
            <slot name="button"/>
        </div>
        <div class="relative">
            <div class="absolute bg-gray-50 top-0 z-100 w-64 h-32 p-2 -mt-2 text-sm leading-tight transform -translate-x-1/4 -translate-y-full rounded-lg shadow-lg">
                <slot name="display"/>
            </div>
            <svg class="text-gray-50 absolute z-50 w-6 h-6 transform -translate-y-4 -translate-x-8 fill-current stroke-current"
                width="8" height="8">
                <rect x="12" y="-10" width="8" height="8" transform="rotate(45)" />
            </svg>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tooltip: false
        }
    }
}
</script>