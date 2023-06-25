<template>
  <div class="column is-mobile">
    <div class="column is-11 is-offset-11">
      <button class="button">
        <Router-link :to="{ path: '/user/add/' + uid }"> Add new link </Router-link>
      </button>
    </div>
  </div>
  <div class="table-container">
    <table class="table is-hoverable">
      <tbody class="is-four-fifths">
        <tr>
          <td v-for="show in showDataDetail" :key="show.id">
            <div class="box">
              <div class="box-content">
                <!-- Add a container for box content -->
                <!-- Box content here -->
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
                      <a :href="show.link" target="_bank" style="text-decoration: none">
                        <p>
                          <span class="icon-text has-text-info">
                            <span class="icon">
                              <i class="fas fa-info-circle"></i>
                            </span>
                            <span> {{ show.describe }}</span>
                          </span>
                        </p>
                      </a>
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
              <button class="button is-danger" @click="deleteLink(show.id)">xóa</button>
              <button class="button is-link is-light" style="margin-left: 3%">
                <Router-link :to="{ path: '/user/update/' + uid + '/' + show.id }">
                  sửa
                </Router-link>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { db, Auth1 } from '../../configs/firebase'
import { collection, query, where, getDocs, doc, deleteDoc } from '@firebase/firestore'
import { useRoute, useRouter } from 'vue-router'
import { onAuthStateChanged } from 'firebase/auth'

let showDataDetail = ref([])
const routeVue = useRoute()
const uid = routeVue.params.uid
const routerVue = useRouter()

onMounted(async () => {
  let arrData = []
  let dataEnd = {}

  const q = query(collection(db, 'data'), where('uid', '==', uid))
  const querySnap = await getDocs(q)

  onAuthStateChanged(Auth1, (user) => {
    if (user) {
      if (user.uid == uid) {
        // Người dùng đã đăng nhập
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
        arrData.sort((a, b) => {
          const timeA = a.hour || a.minute || a.day
          const timeB = b.hour || b.minute || b.day
          return timeA - timeB
        })
        // const arrData1 = arrData
        showDataDetail.value = arrData
      } else {
        // Đường link không chứa param 'userId'
        console.log('Đường dẫn bạn vừa nhập không đúng với ID của bạn, nhấn ok để tải lại trang')
        let reLoadIDUser = confirm(
          'Đường dẫn bạn vừa nhập không đúng với ID của bạn, nhấn ok để tải lại trang'
        )

        while (reLoadIDUser == false) {
          reLoadIDUser = confirm(
            'Đường dẫn bạn vừa nhập không đúng với ID của bạn, nhấn ok để tải lại trang'
          )
        }

        const linkKnow = '/' + user.uid
        return routerVue.push(linkKnow).then(() => {
          location.href = linkKnow
        })
      }
    } else {
      // Người dùng chưa đăng nhập

      routerVue.push({
        path: '/logIn'
      })
    }
  })
})

const deleteLink = async (id) => {
  await deleteDoc(doc(db, 'data', id))
  location.reload()
}

const updateLink = async (id) => {}
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

small {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Responsive styles for small screens */
@media (max-width: 768px) {
  td {
    width: 100%;
  }

  .is-four-fifths {
    display: block;
  }

  .box {
    margin-bottom: 10px;
  }

  .media-content {
    padding: 10px;
  }
}

/* Responsive styles for extra small screens */
@media (max-width: 576px) {
  .media-content {
    padding: 5px;
  }
}
</style>
