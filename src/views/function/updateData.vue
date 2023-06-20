<template>
  <div class="container">
    <form>
        <div class="columns">
            <div class="column is-four-fifths">
                <input class="input is-primary" type="text" placeholder="Link">    
             </div>
            <div class="column">
                <input class="input is-primary" type="text" placeholder="Title">
            </div>
          </div>
          
          <div class="columns">
            <div class="column is-two-thirds">
                <textarea class="textarea" type="text" placeholder="describe"></textarea>
            </div>
            <div class="column auto">
                <Router-link :to="{path: '/'}">
                    <button class="button is-success" > Update </button>
                </Router-link>
            </div>
          </div>
    </form>
  </div>
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