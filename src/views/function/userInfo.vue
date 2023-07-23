<template>
  <div class="box has-background-light columns">
    <div class="column is-3">
      <figure>
        <img :src="imageUrl" class="image" />
      </figure>
      <div class="file">
        <label class="file-label">
          <input class="file-input" type="file" name="resume" @change="updateImg" />
          <span class="file-cta">
            <span class="file-icon">
              <i class="fas fa-upload"></i>
            </span>
            <span id="label-update-picture" class="file-label">Update Picture</span>
          </span>
        </label>
      </div>
    </div>
    <div class="column is-4">
      <span class="tag is-primary is-light">Email</span>
      <div class="box">
        <span v-if="!editingEmail">{{ email }}</span>
        <input v-else class="input" type="email" v-model="email" />
        <button id="btn-update-email" class="button is-primary" @click="toggleEditEmail">
          {{ editingEmail ? 'Save Email' : 'Update Email' }}
        </button>
      </div>

      <span class="tag is-primary is-light">Password</span>
      <div class="box">
        <div>
          <button id="btn-change-passCode" class="button is-primary" @click="changePassword">
            Change Password
          </button>
        </div>
      </div>

      <span class="tag is-primary is-light">Email Verified</span>
      <div class="box">
        <span id="btn-login-don't-passCode" class="button is-primary is-light">
          Email Verified: {{ showStatusEmailVerified ? 'DONE' : 'SLACKING' }}
        </span>
      </div>
    </div>
    <div class="column is-4">
      <span class="tag is-primary is-light">Full Name</span>
      <div class="box">
        <span v-if="!editingFullName">{{ fullName }}</span>
        <input v-else class="input" type="email" v-model="fullName" />
        <button id="btn-update-name" class="button is-primary" @click="toggleEditFullName">
          {{ editingFullName ? 'Save Name' : 'Update Name' }}
        </button>
      </div>

      <span class="tag is-primary is-light">Function</span>
      <div class="box">
        <button
          id="btn-login-don't-passCode"
          class="button is-primary is-light"
          @click="modelPassCode"
        >
          PASSCODE: {{ statusPassCode ? 'ON' : 'OFF' }}
        </button>
        <div>
          <span v-if="!statusPassCode" class="alert">{{
            statusPassCode
              ? 'Bạn đã bật PASSCODE tính năng lưu cần mật khẩu đã bật'
              : 'Bạn chưa bật PASSCODE tính năng lưu cần mật khẩu bị tắt'
          }}</span>
        </div>

        <!-- //model thiết lập pass code lần đầu -->
        <div
          class="modal"
          :class="{ 'is-active': showModal }"
          v-if="!statusPassCode && firstOnPassCode == 0"
        >
          <div class="modal-background"></div>
          <div class="modal-content">
            <div class="box">
              <div class="field">
                <label class="label">Thiết lập Passcode:</label>
                <div class="control">
                  <input
                    class="input"
                    type="password"
                    placeholder="Nhập mật khẩu"
                    v-model="passCode"
                  />
                </div>
              </div>
              <div class="field is-grouped">
                <div class="control">
                  <button class="button is-primary" @click="onPassCode">Xác nhận</button>
                </div>
                <div class="control">
                  <button class="button" @click="closepassCodeModal">Hủy</button>
                </div>
              </div>
            </div>
          </div>
          <button
            class="modal-close is-large"
            aria-label="close"
            @click="closepassCodeModal"
          ></button>
        </div>

        <!-- bật lại passCode -->
        <!-- //model thiết lập pass code lần đầu -->
        <div
          class="modal"
          :class="{ 'is-active': showModal }"
          v-if="!statusPassCode && firstOnPassCode == 1"
        >
          <div class="modal-background"></div>
          <div class="modal-content">
            <div class="box">
              <div class="field">
                <label class="label">Bật lại Passcode:</label>
                <div class="control">
                  <input
                    class="input"
                    type="password"
                    placeholder="Nhập mật khẩu"
                    v-model="passCode"
                  />
                </div>
              </div>
              <div class="field is-grouped">
                <div class="control">
                  <button class="button is-primary" @click="onAgainPassCode">Xác nhận</button>
                </div>
                <div class="control">
                  <button class="button" @click="closepassCodeModal">Hủy</button>
                </div>
              </div>
            </div>
          </div>
          <button
            class="modal-close is-large"
            aria-label="close"
            @click="closepassCodeModal"
          ></button>
        </div>

        <!-- model xác nhận tắt passcode -->
        <div class="modal" :class="{ 'is-active': showModal }" v-if="statusPassCode">
          <div class="modal-background"></div>
          <div class="modal-content">
            <div class="box">
              <div class="field">
                <label class="label">Nhập Passcode để tắt tính năng:</label>
                <div class="control">
                  <input
                    class="input"
                    type="password"
                    placeholder="Nhập mật khẩu"
                    v-model="passCode"
                  />
                </div>
              </div>
              <div class="field is-grouped">
                <div class="control">
                  <button class="button is-primary" @click="offPassCode">Xác nhận</button>
                </div>
                <div class="control">
                  <button class="button" @click="closepassCodeModal">Hủy</button>
                </div>
              </div>
            </div>
          </div>
          <button
            class="modal-close is-large"
            aria-label="close"
            @click="closepassCodeModal"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { db, Auth1, storage } from '../../configs/firebase'
import { useRoute, useRouter } from 'vue-router'
import {
  onAuthStateChanged,
  updateProfile,
  updateEmail,
  sendEmailVerification,
  sendPasswordResetEmail,
  isSignInWithEmailLink
} from 'firebase/auth'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import {
  collection,
  where,
  doc,
  getDocs,
  query,
  addDoc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore'

const routerVue = useRouter()

const email = ref('')
const editingEmail = ref(false)

const fullName = ref()
const editingFullName = ref(false)

const imageUrl = ref('')

const user = Auth1.currentUser

const usesrStatus = ref(false)

const showStatusEmailVerified = ref(false)

const showModal = ref(false)

const passCode = ref('')

const statusPassCode = ref('')

const statusOnpassCodeOnFireBase = ref(true)

const statusOffpassCodeOnFireBase = ref(false)

const ThisUserPassCodeID = ref('')

const passCodeOnFireBase = ref('')

const firstOnPassCode = ref()

// kiểm tra trạng thái đăng nhập
onAuthStateChanged(Auth1, (user) => {
  if (!user) {
    return routerVue.push({
      path: '/'
    })
  } else {
    //hiển thị thông tin của user
    showStatusEmailVerified.value = Auth1.currentUser?.emailVerified || false
    usesrStatus.value = true
    fullName.value = user.displayName ?? ''
    email.value = user.email ?? ''
    imageUrl.value = user.photoURL ?? ''
  }
})

// chuyển đổi giá trị edittingEmail để hiển thị hay ẩn thẻ input email
function toggleEditEmail() {
  editingEmail.value = !editingEmail.value
  onAuthStateChanged(Auth1, (user) => {
    try {
      if (!editingEmail.value) {
        if (user) {
          updateEmail(user, email.value)
            .then(() => {
              // Email updated!
              sendEmailVerification(user).then(() => {
                // Email verification sent!
                alert('kiểm tra email để hoàn thành việc cập nhật')
              })
            })
            .catch((error) => {
              // An error occurred
              // ...
            })
          console.log('Email updated successfully')
        } else {
          console.log('Error updating email: User is not authenticated')
        }
      } else {
        console.log('Error updating email: Editing email is still in progress' + editingEmail.value)
      }
    } catch (error) {
      console.log('try Error updating email', error)
    }
  })
}

// // sau khi nhập email cần đổi nhấn enter để thực hiện lưu mà không cần nhấn nút save email
// function saveEmail(): void {
//   toggleEditEmail()
// }

// chuyển đổi giá trị edittingEmail để hiển thị hay ẩn thẻ input full name
async function toggleEditFullName() {
  editingFullName.value = !editingFullName.value
  onAuthStateChanged(Auth1, (user) => {
    try {
      if (!editingFullName.value) {
        if (usesrStatus.value == true && user) {
          updateProfile(user, {
            displayName: fullName.value
          })
          console.log('Profile updated successfully')
          fullName.value = user.displayName // Update the value of fullName variable
          location.reload()
        } else {
          console.log('Error updating full name: User is not authenticated')
        }
      } else {
        console.log(
          'Error updating full name: Editing full name is still in progress' + editingFullName.value
        )
      }
    } catch (error) {
      console.log('try Error updating full name', error)
    }
  })
}

//update image
const updateImg = async (event: Event) => {
  // lưu đường dẫn file vào biến file
  const file = (event.target as HTMLInputElement).files?.[0]
  //nếu có tồn tại file
  if (file) {
    // khai báo lưu file vào thư mục proifile trong storage firebase
    const storageReference = storageRef(storage, `profile/${file.name}`)
    const uploadTask = uploadBytes(storageReference, file)

    uploadTask
      .then(
        (snapshot) => {
          console.log('uploading')
        },
        (error) => {
          console.error('Upload error:', error)
        }
      )
      .then(async () => {
        // tạo biến để lưu ảnh được tải từ đường dẫn trực tuyến sau khi đưa ảnh lên storage
        const downloadURL = await getDownloadURL(storageReference)

        const user = Auth1.currentUser
        if (user) {
          await updateProfile(user, {
            photoURL: downloadURL
          })
          console.log('Profile picture updated successfully')
          imageUrl.value = downloadURL // Update the displayed image URL
        }
      })
  }
}

//thay đổi password account
const changePassword = async () => {
  sendPasswordResetEmail(Auth1, email.value)
    .then(() => {
      // passCode reset email sent!
      //
      alert('Link đặt lại mật khẩu đã được gửi tới email của bạn, vui lòng kiểm tra')

      // Kiểm tra xem người dùng đã kích hoạt link reset mật khẩu hay chưa
      if (isSignInWithEmailLink(Auth1, window.location.href)) {
        // Người dùng đã kích hoạt link reset mật khẩu
        // Thực hiện các thao tác xử lý tương ứng ở đây
        // Ví dụ: cho phép người dùng đặt lại mật khẩu
        // Sử dụng thông tin người dùng và liên kết hiện tại để hoàn thành quá trình đặt lại mật khẩu
        return routerVue.push({
          path: '/'
        })
      } else {
        // Người dùng chưa kích hoạt link reset mật khẩu
        // Hiển thị form đăng nhập hoặc thông báo tương ứng
        alert('Vui lòng kích hoạt để tiếp hành đặt lại mật khẩu')
      }
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      // ..
    })
}

//reload lại trang
function reloadWebsite() {
  location.reload()
}
//{

//mở model passcode
const openpassCodeModal = () => {
  showModal.value = true // Hàm để đóng modal khi cần thiết
}

//đóng model passcode
const closepassCodeModal = () => {
  showModal.value = false // Hàm để đóng modal khi cần thiết
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
    firstOnPassCode.value = 1
    // console.log(statusPassCode, passCodeOnFireBase)
  } else {
    console.log('người dùng chưa bật passCode')
    statusPassCode.value = false.toString();
  }
})

//Bật PassCode lần đầu lên firebase
async function onPassCode() {
  const docRef = await addDoc(collection(db, 'passCode'), {
    pass: passCode.value,
    status: statusOnpassCodeOnFireBase.value,
    uid: user?.uid || ''
  })
  ThisUserPassCodeID.value = docRef.id
  console.log('on passcode on firebase successful')
  closepassCodeModal()
  reloadWebsite()
}

//tắt PassCode lên firebase
async function offPassCode() {
  if (passCode.value == passCodeOnFireBase.value) {
    const docRef = doc(db, 'passCode', ThisUserPassCodeID.value)

    await updateDoc(docRef, { status: statusOffpassCodeOnFireBase.value })

    console.log('off passcode on firebase successful')
    closepassCodeModal()
    reloadWebsite()
  }
}

//bật lại passCode
async function onAgainPassCode() {
  if (passCode.value == passCodeOnFireBase.value) {
    console.log(ThisUserPassCodeID.value)
    const docRef = doc(db, 'passCode', ThisUserPassCodeID.value.toString()) // Adjust the document reference based on your Firestore structure

    await updateDoc(docRef, {
      status: statusOnpassCodeOnFireBase.value
    })

    console.log('on again passcode on firebase successful')
    closepassCodeModal()
    reloadWebsite()
  }
}

//gọi modal
function modelPassCode() {
  openpassCodeModal()
  if (!statusPassCode) {
    onPassCode()
  } else {
    offPassCode()
  }
}
//}
</script>

<style scoped>
#btn-update-email {
  margin-left: 70%;
  margin-top: 1%;
}

#btn-update-name {
  margin-left: 65%;
  margin-top: 1%;
}

#label-update-picture {
  padding: 0% 60% 0% 0%;
}

.alert {
  margin-top: 1rem;
  color: red;
}

.image {
  height: 350px;
  width: auto;
  border-radius: 30%;
  overflow: hidden;
}

.file {
  margin-top: 3%;
  margin-left: 5%;
}
</style>
