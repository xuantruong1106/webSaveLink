<template>
  <div class="column is-mobile">
    <div class="column is-11 is-offset-11" v-if="emailVerifiedUser == true">
      <button class="button">
        <Router-link :to="{ path: '/user/add/' + uid }"> Add new link </Router-link>
      </button>

      <!-- người dùng đã kích hoạt passcode -->
      <button
        id="add-link-one-way-pC-required"
        class="button is-link"
        @click.prevent="onModalPassCode"
      >
        Add new link one way pC required
      </button>
    </div>
    <div class="modal" :class="{ 'is-active': statusModal }" v-if="statusModal == true">
      <!-- đã kích hoạt passcode -->
      <div v-if="statusPassCode">
        <div class="modal-background"></div>
        <div class="modal-content">
          <div class="box">
            <div class="field">
              <label class="label">Mật khẩu:</label>
              <div class="control">
                <input class="input" type="pC" placeholder="Nhập mật khẩu" v-model="pC" />
              </div>
            </div>
            <div class="field is-grouped">
              <div class="control">
                <button class="button is-primary" @click.prevent="accessSpaceNeedPassCode">
                  Xác nhận
                </button>
              </div>
              <div class="control">
                <button class="button" @click.prevent="offModalPassCode">CLOSE</button>
              </div>
            </div>
          </div>
        </div>
        <button
          class="modal-close is-large"
          aria-label="close"
          @click.prevent="offModalPassCode"
        ></button>
      </div>
      <!-- đã tắt kích hoạt pascode -->
      <div v-else>
        <div class="modal-background"></div>
        <div class="modal-content">
          <div class="box">
            <div class="field">
              <label class="label"
                >Bạn đang tắt PASSCODE vui lòng nhấn cài đặt để vào SETTING để bật lại tính
                năng</label
              >
            </div>
            <div class="field is-grouped">
              <div class="control">
                <button class="button is-primary" @click.prevent="alertnotification1">
                  SETTING
                </button>
              </div>
              <div class="control">
                <button class="button" @click.prevent="offModalPassCode">CLOSE</button>
              </div>
            </div>
          </div>
        </div>
        <button
          class="modal-close is-large"
          aria-label="close"
          @click.prevent="offModalPassCode"
        ></button>
      </div>
    </div>

    <div
      id="notification-email-verified"
      class="column is-11 is-offset-11"
      v-if="emailVerifiedUser == false"
    >
      <p>Vui lòng xác nhận email để dùng được các tính năng của trang web</p>
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
              <button class="button is-danger" @click="deleteLink(show.id)">delete</button>
              <button class="button is-link is-light" style="margin-left: 3%">
                <Router-link :to="{ path: '/user/update/' + uid + '/' + show.id }">
                  edit
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
import { db, Auth1 } from '../../../configs/firebase'
import { collection, query, where, getDocs, doc, deleteDoc } from '@firebase/firestore'
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

let showDataDetail = ref<ShowData[]>([])
const routeVue = useRoute()
const uid = routeVue.params.uid
const routerVue = useRouter()
const emailVerifiedUser = ref(false)
const statusModal = ref(false)
const pC = ref('')

const ThisUserPassCodeID = ref('')
const passCodeOnFireBase = ref('')
const statusPassCode = ref('')
const statusModalPassCode = ref('')
onMounted(async () => {
  let arrData: ShowData[] = []
  let dataEnd: ShowData = {
    id: '',
    title: '',
    link: '',
    describe: '',
    minute: 0,
    hour: 0,
    day: 0
  }

  const q = query(collection(db, 'data'), where('uid', '==', uid))
  const querySnap = await getDocs(q)

  onAuthStateChanged(Auth1, (user) => {
    if (user) {
      emailVerifiedUser.value = user.emailVerified
      // console.log(emailVerifiedUser.value)
      if (user.uid == uid) {
        // Người dùng đã đăng nhập
        querySnap.forEach((doc) => {
          const Data: ShowData = {
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

          if (dayNow !== Data.day) {
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
            if (Data.hour !== undefined) {
              const hours = Math.abs(hourNow - Data.hour)
              dataEnd = {
                id: doc.id,
                title: doc.data().title,
                link: doc.data().link,
                describe: doc.data().describe,
                day: Data.day,
                month: Data.month,
                year: Data.year,
                hour: hours
              }
            } else if (Data.minute !== undefined) {
              const minutes = Math.abs(minuteNow - Data.minute)
              dataEnd = {
                id: doc.id,
                title: doc.data().title,
                link: doc.data().link,
                describe: doc.data().describe,
                day: Data.day,
                month: Data.month,
                year: Data.year,
                minute: minutes
              }
            }
          }
          arrData.push(dataEnd)
        })
        arrData.sort((a, b) => {
          const timeA = a.hour !== undefined ? a.hour : 0
          const timeB = b.hour !== undefined ? b.hour : 0

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
        path: '/'
      })
    }
  })
})

const deleteLink = async (id: string) => {
  await deleteDoc(doc(db, 'data', id))
  location.reload()
}

//{ modal
const onModalPassCode = () => {
  statusModal.value = true // Khi người dùng click vào nút "need pass", mở modal
}

const offModalPassCode = () => {
  statusModal.value = false // Hàm để đóng modal khi cần thiết
}

const alertnotification1 = () => {
  return routerVue.push('/user/userInfo/' + uid)
}

const alertnotification = () => {
  const statusAlert = confirm(
    'Bạn chưa kích hoạt PassCode vui lòng nhấn ok để vào phần cài đặt để bật PassCode'
  )

  if (statusAlert == true) {
    return routerVue.push('/user/userInfo/' + uid)
  } else {
    offModalPassCode()
  }
}
//truy vấn trạng thái Pass code bật hay tắt trên firebase từ collection passCode
onAuthStateChanged(Auth1, async (user) => {
  const q = query(collection(db, 'passCode'), where('uid', '==', user?.uid))

  const querySnapshot = await getDocs(q)
  if (!querySnapshot.empty) {
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      statusPassCode.value = doc.data().status
      passCodeOnFireBase.value = doc.data().pC
      ThisUserPassCodeID.value = doc.id
    })
  } else {
    alertnotification()
  }
})

async function accessSpaceNeedPassCode() {
  if ((pC.value = passCodeOnFireBase.value)) {
    return routerVue.push('/user/showData/needPass/' + uid)
  } else {
    alert('Vui lòng nhập lại PassCode')
  }
}
//}
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

#add-link-one-way-pC-required {
  margin-left: -35%;
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

  .button {
    width: 100%;
    margin-bottom: 10px;
  }

  .level {
    flex-wrap: wrap;
  }

  .is-mobile {
    display: block;
  }
}

#notification-email-verified {
  margin-left: 30%;
}
</style>
