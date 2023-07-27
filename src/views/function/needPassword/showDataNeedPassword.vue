<template>
  <div class="columns is-mobile">
    <h1 class="column is-4 title is-2 is-warning is-light button" > PRIVACY SPACE</h1>
    <div id="btn" class="column is-4" v-if="emailVerified == true">
      <button class="button">
        <Router-link :to="{ path: '/user/add/needPassword/' + uid }"> Add new link </Router-link>
      </button>
    </div>
    <div class="column is-offset-11" v-if="emailVerified == false">
      <p>Please confirm your email to use the site's features</p>
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
                      <small>
                        add in: {{show.hour}}h{{show.minute}}' {{ show.day }}/{{ show.month }}/{{ show.year }}
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
              <button class="button is-danger" @click.prevent="run(show.id)">delete</button>
              <div
                class="modal"
                :class="{ 'is-active': statusModalDeleteLink }"
                v-if="statusModalDeleteLink == true"
              >
                <div class="modal-background"></div>
                <div class="modal-content">
                  <div class="box">
                    <div class="field">
                      <label class="notification label is-danger">CONFIRM DELETE LINK</label>
                    </div>
                    <div class="field is-grouped">
                      <div class="control">
                        <button class="button is-danger" @click.prevent="deleteLink(saveIdDeleteLink)">Confirm</button>
                      </div>
                      <div class="control">
                        <button class="button" @click.prevent="offModelDeleteLink">CLOSE</button>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  class="modal-close is-large"
                  aria-label="close"
                  @click.prevent="offModelDeleteLink"
                ></button>
              </div>
              <button class="button is-link is-light" style="margin-left: 3%">
                <Router-link :to="{ path: '/user/update/needPass/' + uid + '/' + show.id }">
                  edit
                </Router-link>
              </button>
              <button class="button is-primary" style="margin-left: 3%" @click.prevent="unPrivacySpace(show.id, show.title, show.link, show.describe)"> unprivacy</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { db, Auth1 } from '../../../configs/firebase'
import { collection, query, where, getDocs, doc, deleteDoc, setDoc, serverTimestamp } from '@firebase/firestore'
import { useRoute, useRouter } from 'vue-router'
import { onAuthStateChanged } from 'firebase/auth'

interface ShowData {
  id: string
  title: string
  link: string
  describe: string
  minute?: number
  hour?: number
  day?: number
  month?: number
  year?: number
}
const statusModalDeleteLink = ref(false)
let showDataDetail = ref<ShowData[]>([])
const routeVue = useRoute()
const uid = routeVue.params.uid
const routerVue = useRouter()
const emailVerified = ref(false)
const date = serverTimestamp()
const saveIdDeleteLink = ref('')
console.log(emailVerified)
onMounted(async () => {
  let arrData: ShowData[] = []
 

  const q = query(collection(db, 'dataNeedPassCode'), where('uid', '==', uid))
  const querySnap = await getDocs(q)

  onAuthStateChanged(Auth1, (user) => {
    if (user) {
      if (user.uid == uid) {
        // Người dùng đã đăng nhập
        emailVerified.value = user.emailVerified ?? false
        querySnap.forEach((doc) => {
          const Data: ShowData = {
            id: doc.id,
            title: doc.data().title,
            link: doc.data().link,
            describe: doc.data().describe,
            minute: doc.data().date.toDate().getMinutes(),
            hour: doc.data().date.toDate().getHours(),
            day: doc.data().date.toDate().getDate(),
            month: doc.data().date.toDate().getMonth() + 1,
            year: doc.data().date.toDate().getFullYear()
          }

          //hàm lấy thời gian theo giờ máy tính
          const timeNow = new Date()
          const minuteNow = timeNow.getMinutes()
          const hourNow = timeNow.getHours()
          const dayNow = timeNow.getDate()

          arrData.push(Data)
        })
        arrData.sort((a, b) => {
          // Kiểm tra các thông tin ngày, tháng, năm, giờ và phút trước khi sử dụng
          const yearA = a.year !== undefined ? a.year : 0;
          const monthA = a.month !== undefined ? a.month - 1 : 0;
          const dayA = a.day !== undefined ? a.day : 1;
          const hourA = a.hour !== undefined ? a.hour : 0;
          const minuteA = a.minute !== undefined ? a.minute : 0;

          const yearB = b.year !== undefined ? b.year : 0;
          const monthB = b.month !== undefined ? b.month - 1 : 0;
          const dayB = b.day !== undefined ? b.day : 1;
          const hourB = b.hour !== undefined ? b.hour : 0;
          const minuteB = b.minute !== undefined ? b.minute : 0;
          // Chuyển các thông tin ngày, tháng, năm, giờ và phút sang dạng timestamp để so sánh
          const timestampA = new Date(yearA, monthA, dayA, hourA, minuteA).getTime();
          const timestampB = new Date(yearB, monthB, dayB, hourB, minuteB).getTime();


          // Nếu có cùng ngày, tháng, năm
          if (timestampA === timestampB) {
            // Tiếp tục so sánh theo phút
            const minuteA = a.minute !== undefined ? a.minute : 0;
            const minuteB = b.minute !== undefined ? b.minute : 0;
            if (minuteA !== minuteB) {
              // Sắp xếp theo phút tăng dần (nhỏ nhất trước)
              return minuteA - minuteB;
            }

            // Tiếp tục so sánh theo giờ
            const hourA = a.hour !== undefined ? a.hour : 0;
            const hourB = b.hour !== undefined ? b.hour : 0;
            return hourA - hourB;
          }

          // Nếu khác ngày, tháng, năm, sắp xếp theo ngày, tháng, năm giảm dần
          return timestampB - timestampA;
        });
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

        const linkKnow = '/home/' + user.uid
        return routerVue.push(linkKnow).then(() => {
          location.href = linkKnow
        })
      }
    } else {
      // Người dùng chưa đăng nhập

      routerVue.push({
        path: '/'
      })
    }
  })
})
const onModelDeleteLink =  ()  => {
  statusModalDeleteLink.value = true
}

const offModelDeleteLink = () => {
  statusModalDeleteLink.value = false
}

async function run(id: string) {
  onModelDeleteLink();
  saveIdDeleteLink.value = id
}
const deleteLink = async (id: string) => {
  await deleteDoc(doc(db, 'dataNeedPassCode', id))
  location.reload()
}

async function unPrivacySpace(idLink: string, titleAddPrivacySpace: string, linkAddPrivacySpace: string, describeAddPrivacySpace: string){
 
    await setDoc(doc(db, 'data', idLink.toString()), {
    title: titleAddPrivacySpace,
    describe: describeAddPrivacySpace,
    link: linkAddPrivacySpace,
    uid: uid, 
    date: date
  })
  deleteLink(idLink)
  console.log('done')
  }

</script>

<style>
#btn{
  margin-left: 50%;
}
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

#add-link-one-way-password-required{
  margin-left: -39%;
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
