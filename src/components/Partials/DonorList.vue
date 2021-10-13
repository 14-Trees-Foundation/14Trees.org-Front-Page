<template>
    <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div class="overflow-hidden">
            <table class="min-w-full floating-rows-table text-center table-auto">
                <thead>
                    <tr class="font-sm font-light text-gray-700 capitalise truncate">
                        <th class="pl-3 py-2 whitespace-nowrap">#</th>
                        <th class="px-6 py-2 whitespace-nowrap">Name</th>
                        <th class="px-6 py-2 whitespace-nowrap">Type</th>
                        <th class="px-6 py-2 whitespace-nowrap">Sapling Id</th>
                        <th class="px-6 py-2 whitespace-nowrap">Gut Id</th>
                        <th class="px-6 py-2 whitespace-nowrap">Date</th>
                    </tr>
                </thead>
                <tbody class="bg-gray-700">
                    <tr class="bg-white p-4" v-for="(tree, sr) in trees" :key="sr">
                        <td class="pl-3 py-2 whitespace-nowrap">{{sr}}</td>
                        <td class="px-6 py-2 whitespace-nowrap">{{tree.name}}</td>
                        <td class="px-6 py-2 whitespace-nowrap">{{tree.tree}}</td>
                        <td class="px-6 py-2 whitespace-nowrap">{{tree.saplingId}}</td>
                        <td class="px-6 py-2 whitespace-nowrap">{{tree.gutId}}</td>
                        <td class="px-6 py-2 whitespace-nowrap">
                            {{tree.date.toLocaleDateString("en-IN")}}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
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