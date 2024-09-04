<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useFilterStore } from '@/stores/filterStore';

// access the `store` variable anywhere in the component ✨
const user = useUserStore()
const router = useRouter()

const filterStore = useFilterStore()

const showPassword = ref(false)
const userInput = ref({
  username: '',
  password: ''
})

const dialog = ref(false)
const text = ref('')

const overlay = ref(false)

const attempts = ref(0)

const login = async () => {
  overlay.value = true
  console.log(userInput.value.username , userInput.value.password )
  await user.loginUserName(userInput.value.username , userInput.value.password )
  overlay.value = false
  attempts.value++
  if (!user.auth) {
    text.value = 'El usuario o la contraseña ingresada es incorrecta.'
    dialog.value = true
  } else {
    overlay.value = true
    filterStore.setPer()
    overlay.value = false
    router.push('/')
  }


}

</script>

<template>
  <v-card width="400" class="mx-auto mt-5">
    <v-card-title>
      <h2 class="display-1 ma-5">Acceso al sistema</h2>
    </v-card-title>
    <v-card-text class="ma-5">
      <v-form @submit.prevent="login">
        <v-text-field label="Username" prepend-icon="mdi-account-circle" v-model="userInput.username" />
        <v-text-field :type="showPassword ? 'text' : 'password'" label="Password" prepend-icon="mdi-lock"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showPassword = !showPassword"
          v-model="userInput.password" />
        <div class="d-flex justify-end">
          <v-btn type="submit" class="mt-4 align-right" color="primary" value="log in">Ingresar</v-btn>
        </div>

      </v-form>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>

    </v-card-actions>
  </v-card>

  <v-dialog v-model="dialog" width="auto">
    <v-card max-width="400" prepend-icon="mdi-update" :text="text" title="Información">
      <template v-slot:actions>
        <v-btn class="ms-auto" text="Ok" @click="dialog = false"></v-btn>
      </template>
    </v-card>
  </v-dialog>

  <v-overlay :model-value="overlay" persistent class="align-center justify-center">
    <v-progress-circular color="primary" size="64" indeterminate :active="loading"></v-progress-circular>
  </v-overlay>
</template>

<style></style>
