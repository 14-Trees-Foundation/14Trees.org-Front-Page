<template>
    <div class="absolute left-0 top-0 max-h-20 w-40 -ml-20 text-center z-50">
        <div class="relative bg-white border border-gray-50 shadow-md px-4 py-2 rounded mt-5">
            <svg class="absolute top-0 -mt-1 w-full right-0 left-0 text-gray-900" width="16px" height="8px" viewBox="0 0 16 8" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="Progress-Bars" transform="translate(-322.000000, -198.000000)" fill="#FFFFFF">
                        <g id="Group-4" transform="translate(310.000000, 198.000000)">
                            <polygon id="Triangle" points="20 0 28 8 12 8"></polygon>
                        </g>
                    </g>
                </g>
            </svg>
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
}
</script>