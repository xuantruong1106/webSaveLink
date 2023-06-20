<template>
  <div class="column is-mobile">
    <div class="column is-11 is-offset-11">
      <button class="button">
        <Router-link :to="{ path: '/user/add' }"> Add new link </Router-link>
      </button>
    </div>
  </div>
  <div class="table-container">
    <table class="table is-hoverable">
      <tbody class="is-four-fifths">
        <tr>
          <td v-for="show in showDataDetail" :key="show.id">
            <a :href="show.link" target="_bank">
              <div class="box">
                <article class="media">
                  <div class="media-content">
                    <div class="content">
                      <strong>{{ show.title }}</strong>
                      &nbsp;
                      <small v-if="'day' in show">
                        add in: {{ show.day }}/{{ show.month }}/{{ show.year }}
                      </small>
                      <small v-if="'hour' in show"> add in before: {{ show.hour }} hours </small>
                      <small v-if="'minute' in show">
                        add in before: {{ show.minute }} minutes
                      </small>
                      <p>
                        <span class="icon-text has-text-info">
                          <span class="icon">
                            <i class="fas fa-info-circle"></i>
                          </span>
                          <span> {{ show.describe }}</span>
                        </span>
                      </p>
                    </div>
                    <nav class="level is-mobile">
                      <div class="level-left">
                        <a class="level-item" aria-label="reply">
                          <span class="icon is-small">
                            <i class="fas fa-reply" aria-hidden="true"></i>
                          </span>
                        </a>
                        <a class="level-item" aria-label="retweet">
                          <span class="icon is-small">
                            <i class="fas fa-retweet" aria-hidden="true"></i>
                          </span>
                        </a>
                        <a class="level-item" aria-label="like">
                          <span class="icon is-small">
                            <i class="fas fa-heart" aria-hidden="true"></i>
                          </span>
                        </a>
                      </div>
                    </nav>
                  </div>
                </article>
              </div>
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterView, RouterLink } from 'vue-router'
import { db } from '../../configs/firebase'
import { collection, query, where, getDocs } from '@firebase/firestore'
import { useRoute } from 'vue-router'

let showDataDetail = ref([])

onMounted(async () => {
  let arrData = []

  let dataEnd = {}
  const RouteVue = useRoute()
  const uid = RouteVue.params.uid

  const q = query(collection(db, 'data'), where('uid', '==', uid))
  const querySnap = await getDocs(q)

  querySnap.forEach((doc) => {
    const Data = {
      id: doc.id,
      title: doc.data().title,
      link: doc.data().link,
      describe: doc.data().describe,
      minute: doc.data().date.toDate().getMinutes(),
      hour: doc.data().date.toDate().getHours(),
      day: doc.data().date.toDate().getDate()
    }

    //hàm lấy thời gian theo giờ máy tính
    const timeNow = new Date()
    const minuteNow = timeNow.getMinutes()
    const hourNow = timeNow.getHours()
    const dayNow = timeNow.getDate()

    if (dayNow != Data.day) {
      dataEnd = {
        id: doc.id,
        title: doc.data().title,
        link: doc.data().link,
        describe: doc.data().describe,
        day: doc.data().date.toDate().getDate(),
        month: doc.data().date.toDate().getMonth() + 1,
        year: doc.data().date.toDate().getFullYear()
      }
    } else {
      if (hourNow != Data.hour) {
        const hours = Math.abs(hourNow - Data.hour)
        dataEnd = {
          id: doc.id,
          title: doc.data().title,
          link: doc.data().link,
          describe: doc.data().describe,
          hour: hours
        }
      } else {
        const minutes = Math.abs(minuteNow - Data.minute)
        dataEnd = {
          id: doc.id,
          title: doc.data().title,
          link: doc.data().link,
          describe: doc.data().describe,
          minute: minutes
        }
      }
    }
    arrData.push(dataEnd)
  })
  const arrData1 = arrData.slice().reverse()
  showDataDetail.value = arrData1
  console.log(showDataDetail)
})
</script>

<style>
a {
  text-decoration: none;
}

strong {
  font-size: 30px;
}

table {
  width: 100%;
  border-collapse: collapse;
}
td {
  width: calc(100% / 4);
  padding: 10px;
  border: 1px solid #ddd;
}
tr {
  display: flex;
  flex-wrap: wrap;
}
</style>
