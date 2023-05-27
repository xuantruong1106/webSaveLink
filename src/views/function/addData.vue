<template>
    <router-view name="headerVue1"/>
    <div class="container">
      
        <h1>add</h1>
        <table>
            <th>
                <td>
                    1
                </td>
            </th>
            <th>
                <td>
                    2
                </td>
            </th>
           
        </table>
    </div>
    <router-view name="footerVue1"/>
</template>

<script  lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    components: {
        
    }
})
</script>

<style>

</style>