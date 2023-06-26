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
        <input v-else class="input" type="email" v-model="email" @keyup.enter="saveEmail" />
        <button id="btn-update-email" class="button is-primary" @click="toggleEditEmail">
          {{ editingEmail ? 'Save Email' : 'Update Email' }}
        </button>
      </div>
      <span class="tag is-primary is-light">Password</span>
      <div class="box">
        <span class="is-1">{{ showPassword ? password : '****' }}</span>
        <div>
          <button id="btn-change-password" class="button is-primary">Change Password</button>
          <button id="btn-show-password" class="button is-primary" @click="toggleShowPassword">
            {{ showPassword ? 'Hide' : 'Show' }}
          </button>
        </div>
      </div>
    </div>
    <div class="column is-4">
      <span class="tag is-primary is-light">Full Name</span>
      <div class="box">
        <span v-if="!editingFullName">{{ fullName }}</span>
        <input v-else class="input" type="email" v-model="fullName" @keyup.enter="saveFullName" />
        <button id="btn-update-name" class="button is-primary" @click="toggleEditFullName">
          {{ editingFullName ? 'Save Name' : 'Update Name' }}
        </button>
      </div>

      <span class="tag is-primary is-light">Function</span>
      <div class="box">
        <button
          id="btn-login-don't-password"
          class="button is-primary is-light"
          @click="toggleLoginDontPassword"
        >
          Login don't need password: {{ showStatus ? 'ON' : 'OFF' }}
        </button>
        <div>
          <span v-if="showStatusAlert" class="alert">{{
            showStatus
              ? 'Tính năng đăng nhập không cần mật khẩu đã được kích hoạt'
              : 'Tính năng đăng nhập không cần mật khẩu đã được tắt'
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { db, Auth1, storage } from '../../configs/firebase'
import { collection, query, where, getDocs, doc, deleteDoc } from '@firebase/firestore'
import { useRoute, useRouter } from 'vue-router'
import { onAuthStateChanged, updateProfile} from 'firebase/auth'
import { getStorage,  ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage"
const routerVue = useRouter()

const email = ref('')
const editingEmail = ref(false)

const fullName = ref('')
const editingFullName = ref(false)

const password = ref('13245asasdasdadss6')
const showPassword = ref(false)

const showStatus = ref(false)
const showStatusAlert = ref(false)

const imageUrl = ref('');


onAuthStateChanged(Auth1, (user) => {
  if (!user) {
    return routerVue.push({
      path: '/logIn'
    })
  }
})

function toggleEditEmail(): void {
  editingEmail.value = !editingEmail.value
}

function saveEmail(): void {
  toggleEditEmail()
}

function toggleEditFullName(): void {
  editingFullName.value = !editingFullName.value
}

function saveFullName(): void {
  toggleEditFullName()
}

function toggleShowPassword(): void {
  showPassword.value = !showPassword.value
}

function toggleLoginDontPassword(): void {
  if (showStatusAlert.value) {
    const status = confirm('Bạn muốn tắt tính năng đăng nhập không cần mật khẩu')
    if (status) {
      showStatus.value = !showStatus.value
      showStatusAlert.value = false
    }
  } else {
    const status = confirm('Bạn muốn kích hoạt tính năng đăng nhập không cần mật khẩu')
    if (status) {
      showStatus.value = !showStatus.value
      showStatusAlert.value = true
    }
  }
}

const updateImg = async () => {
  const file = event.target.files[0];

  if (file) {
    const storageReference = storageRef(storage, `profile/${file.name}`);
    const uploadTask = uploadBytes(storageReference, file);

    uploadTask.then(
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload progress: ${progress}%`);
      },
      (error) => {
        console.error('Upload error:', error);
      }
    ).then(async () => {
      const downloadURL = await getDownloadURL(storageReference);
      console.log('Download URL:', downloadURL);

      const user = Auth1.currentUser;
      if (user) {
        await updateProfile(user, {
          photoURL: downloadURL,
        });
        console.log('Profile picture updated successfully');
        imageUrl.value = downloadURL; // Update the displayed image URL
      }
    });
  }
};
</script>

<style scoped>
#btn-update-email {
  margin-left: 70%;
  margin-top: 1%;
}

#btn-change-password {
  margin-left: 40%;
  margin-top: 4%;
}

#btn-show-password {
  margin-left: 84%;
  margin-top: -10.5%;
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
