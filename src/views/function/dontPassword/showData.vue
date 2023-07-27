<template>
  <div class="column is-mobile">
    <div class="column is-11 is-offset-11" v-if="emailVerifiedUser == true">
      <button class="button">
        <Router-link :to="{ path: '/user/add/' + uid }"> Add new link </Router-link>
      </button>

      <!-- người dùng đã kích hoạt passcode -->
      <button id="privacy-space" class="button is-link" @click.prevent="onModalPassCode">
        Private space
      </button>
    </div>
    <div class="modal" :class="{ 'is-active': statusModal }" v-if="statusModal == true">
      <!-- đã kích hoạt passcode -->
      <div v-if="statusPassCode">
        <div class="modal-background"></div>
        <div class="modal-content">
          <div class="box">
            <div class="field">
              <label class="label">Enter PassCode:</label>
              <div class="control">
                <input class="input" type="password" placeholder="Nhập mật khẩu" v-model="pC" />
              </div>
            </div>
            <div class="field is-grouped">
              <div class="control">
                <button class="button is-primary" @click.prevent="accessPrivacySpace">
                  Confirm
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
                >You are turning off PASSCODE please press settings to enter SETTING to turn the
                feature back on</label
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
                        add in: {{ show.hour }}h{{ show.minute }}' {{ show.day }}/{{
                          show.month
                        }}/{{ show.year }}
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
                <Router-link :to="{ path: '/user/update/' + uid + '/' + show.id }">
                  edit
                </Router-link>
              </button>

              <button
                class="button is-primary"
                style="margin-left: 3%"
                @click.prevent="addPrivacySpace(show.id, show.title, show.link, show.describe)"
              >
                add privacy
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
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  serverTimestamp,
  setDoc
} from '@firebase/firestore'
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
const statusModalDeleteLink = ref(false)
const pC = ref('')
const ThisUserPassCodeID = ref('')
const passCodeOnFireBase = ref('')
const statusPassCode = ref(false)
const date = serverTimestamp()
const saveIdDeleteLink = ref('')

onMounted(async () => {
  let arrData: ShowData[] = []

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
            day: doc.data().date.toDate().getDate(),
            month: doc.data().date.toDate().getMonth() + 1,
            year: doc.data().date.toDate().getFullYear()
          }

          arrData.push(Data)
        })
        // Sử dụng phương thức sort và hàm so sánh tùy chỉnh phức tạp để xếp theo thứ tự yêu cầu
        arrData.sort((a, b) => {
          // Kiểm tra các thông tin ngày, tháng, năm, giờ và phút trước khi sử dụng
          const yearA = a.year !== undefined ? a.year : 0
          const monthA = a.month !== undefined ? a.month - 1 : 0
          const dayA = a.day !== undefined ? a.day : 1
          const hourA = a.hour !== undefined ? a.hour : 0
          const minuteA = a.minute !== undefined ? a.minute : 0

          const yearB = b.year !== undefined ? b.year : 0
          const monthB = b.month !== undefined ? b.month - 1 : 0
          const dayB = b.day !== undefined ? b.day : 1
          const hourB = b.hour !== undefined ? b.hour : 0
          const minuteB = b.minute !== undefined ? b.minute : 0
          // Chuyển các thông tin ngày, tháng, năm, giờ và phút sang dạng timestamp để so sánh
          const timestampA = new Date(yearA, monthA, dayA, hourA, minuteA).getTime()
          const timestampB = new Date(yearB, monthB, dayB, hourB, minuteB).getTime()

          // Nếu có cùng ngày, tháng, năm
          if (timestampA === timestampB) {
            // Tiếp tục so sánh theo phút
            const minuteA = a.minute !== undefined ? a.minute : 0
            const minuteB = b.minute !== undefined ? b.minute : 0
            if (minuteA !== minuteB) {
              // Sắp xếp theo phút tăng dần (nhỏ nhất trước)
              return minuteA - minuteB
            }

            // Tiếp tục so sánh theo giờ
            const hourA = a.hour !== undefined ? a.hour : 0
            const hourB = b.hour !== undefined ? b.hour : 0
            return hourA - hourB
          }

          // Nếu khác ngày, tháng, năm, sắp xếp theo ngày, tháng, năm giảm dần
          return timestampB - timestampA
        })
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

async function run(id: string) {
  onModelDeleteLink();
  saveIdDeleteLink.value = id
}
async function deleteLink(id: string) {
    await deleteDoc(doc(db, 'data', id))
    location.reload()
}


//{ modal
const onModalPassCode = () => {
  statusModal.value = true // Khi người dùng click vào nút "privacy space", mở modal
}

const offModalPassCode = () => {
  statusModal.value = false // Hàm để đóng modal khi cần thiết
}

const onModelDeleteLink =  ()  => {
  statusModalDeleteLink.value = true
}

const offModelDeleteLink = () => {
  statusModalDeleteLink.value = false
}
const alertnotification1 = () => {
  return routerVue.push('/user/userInfo/' + uid)
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
  }
})

async function accessPrivacySpace() {
  if ((pC.value = passCodeOnFireBase.value)) {
    return routerVue.push('/user/showData/needPass/' + uid)
  } else {
    alert('Vui lòng nhập lại PassCode')
  }
}

async function addPrivacySpace(
  idLink: string,
  titleAddPrivacySpace: string,
  linkAddPrivacySpace: string,
  describeAddPrivacySpace: string
) {
  if (statusPassCode.value == true) {
    await setDoc(doc(db, 'dataNeedPassCode', idLink.toString()), {
      title: titleAddPrivacySpace,
      describe: describeAddPrivacySpace,
      link: linkAddPrivacySpace,
      uid: uid,
      date: date
    })
    deleteLink(idLink)
    console.log('done')
  } else {
    onModalPassCode()
    // alertnotification()
  }
}
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

#privacy-space {
  margin-left: -22%;
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
