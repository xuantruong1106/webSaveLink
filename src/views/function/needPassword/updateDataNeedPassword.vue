<template>
  <div class="container">
    <form @submit.prevent="updateLink">
      <div class="columns">
        <div class="column is-four-fifths">
          <span class="tag is-primary is-light">Link</span>
          <input class="input is-primary" type="text" :placeholder="linkPhr" v-model="link"/>
        </div>
        <div class="column">
          <span class="tag is-primary is-light">Title</span>
          <input class="input is-primary" type="text" :placeholder="titlePhr" v-model="title"/>
        </div>
      </div>

      <div class="columns">
        <div class="column is-two-thirds">
          <span class="tag is-primary is-light">Describe</span>
          <textarea class="textarea" type="text" :placeholder="describePhr" v-model="describe"></textarea>
        </div>
        <div class="column auto">
          <button class="button is-success" style="margin-top: 15%">update</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import { onMounted } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { Auth1, db } from '../../../configs/firebase'
import { collection, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

const showDataDetail = ref([])
const RouteVue = useRoute()
const routerVue = useRouter()
const uid = RouteVue.params.uid
const idLink = RouteVue.params.idLink

const link = ref('')
const title = ref('')
const describe = ref('')
const date = serverTimestamp()

const linkPhr =  ref('')
let titlePhr =  ''
let describePhr =  ''
onMounted( () => {

  onAuthStateChanged(Auth1, async (user) => {
    if (!user) {
      routerVue.push({
        path: '/'
      })
    }
    const q = doc(collection(db, 'dataNeedPassCode'), idLink.toString())
    const querySnap = await getDoc(q)
    // Người dùng đã đăng nhập
    const data = querySnap.data()
    if (data) {
      linkPhr.value = data.link
      titlePhr = data.title
      describePhr = data.describe
    }
    console.log(linkPhr)
  })
})

const updateLink = async () => {
  await setDoc(doc(db, 'dataNeedPassCode', idLink.toString()), {
    title: title.value,
    describe: describe.value,
    link: link.value,
    uid: uid, 
    date: date
  })

  
  // console.log(title.value+ '/' + describe.value + '/'+ link.value + '/' +'Update done')

  return routerVue.push({ path: '/user/showData/needPass/' + uid })
}
</script>

