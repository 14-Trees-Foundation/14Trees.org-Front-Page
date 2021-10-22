<template>
    <div class="py-2 px-6 lg:px-8 overflow-x-auto block">
        <table class="min-w-full floating-rows-table text-center">
            <thead>
                <tr class="bg-gray-800 bg-opacity-10 font-sm font-light text-gray-200 capitalise truncate">
                    <th>#</th>
                    <th>Name</th>
                    <th>Tree</th>
                    <th>Sapling Id</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody class="bg-gray-700">
                <tr class="bg-white shadow-md" v-for="(tree, sr) in trees" :key="sr">
                    <td>{{sr}}</td>
                    <td>{{tree.name}}</td>
                    <td>{{tree.tree}}</td>
                    <td>{{tree.saplingId}}</td>
                    <td> {{tree.date.toLocaleDateString("en-IN")}} </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    props: {
        trees: {
            type: Array,
            default: null
        }
    },
}
</script>