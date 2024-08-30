<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useFilterStore } from '@/stores/filterStore';

// access the `store` variable anywhere in the component ✨
const store = useUserStore()
const router = useRouter()

const filterStore = useFilterStore()

const showPassword = ref(false)
const userInput = ref({
  username: '',
  password: ''
})

const submit = () => {
  console.log(userInput.value)
  store.login(userInput.value.username, userInput.value.password)
  if (store.isAuth) {
    //console.log(userInput)
    //localStorage.setItem('user', userInput.value)
    //store.user.value = userInput.value
    //store.value = userInput.value    
    filterStore.setPer()
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
      <v-form @submit.prevent="submit">
        <v-text-field
          label="Username"
          prepend-icon="mdi-account-circle"
          v-model="userInput.username"
        />
        <v-text-field
          :type="showPassword ? 'text' : 'password'"
          label="Password"
          prepend-icon="mdi-lock"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword = !showPassword"
          v-model="userInput.password"
        />
        <div class="d-flex justify-end">
            <v-btn type="submit" class="mt-4 align-right" color="primary" value="log in">Ingresar</v-btn>
        </div>
        
      </v-form>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>

    </v-card-actions>
  </v-card>
</template>

<style></style>
