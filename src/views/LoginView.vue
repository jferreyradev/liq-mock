<script setup>  
    import { ref } from 'vue';
	import { useRouter } from 'vue-router'
	import { useUserStore } from '@/stores/user'

	// access the `store` variable anywhere in the component ✨
	const store = useUserStore()
	const router = useRouter()

    const showPassword = ref(false)
	const userInput = ref({
							username: '',
							password: '',
							})

	const submit = ()=>{
		console.log(userInput)
		localStorage.setItem('user', userInput.value)
		store.user.value = userInput.value
		//store.value = userInput.value
		router.push('/')
	}

</script>

<template>
	<v-card width="400" class="mx-auto mt-5">
		<v-card-title>
			<h2 class="display-1 ma-5">Acceso al sistema</h2>
		</v-card-title>
		<v-card-text class="ma-5">
			<v-form @submit.prevent="submit">
				<v-text-field label="Username" prepend-icon="mdi-account-circle" v-model="userInput.username" />
				<v-text-field
					:type="showPassword ? 'text' : 'password'"
					label="Password"
					prepend-icon="mdi-lock"
					:append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
					@click:append="showPassword = !showPassword"
					v-model="userInput.password"
				/>
			</v-form>
		</v-card-text>
		<v-divider></v-divider>
		<v-card-actions>
			<v-btn color="success">Registrar</v-btn>
			<v-spacer></v-spacer>
			<v-btn type="submit"  @click="submit" color="info">Ingresar</v-btn>
		</v-card-actions>
	</v-card>
</template>

<style></style>