<script setup>  
    import { ref } from 'vue';

    const showPassword = ref(false)
</script>

<template>
	<v-card width="400" class="mx-auto mt-5">
		<v-card-title>
			<h2 class="display-1 ma-5">Acceso al sistema</h2>
		</v-card-title>
		<v-card-text class="ma-5">
			<v-form>
				<v-text-field label="Username" prepend-icon="mdi-account-circle" />
				<v-text-field
					:type="showPassword ? 'text' : 'password'"
					label="Password"
					prepend-icon="mdi-lock"
					:append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
					@click:append="showPassword = !showPassword"
				/>
			</v-form>
		</v-card-text>
		<v-divider></v-divider>
		<v-card-actions>
			<v-btn color="success">Registrar</v-btn>
			<v-spacer></v-spacer>
			<v-btn color="info">Ingresar</v-btn>
		</v-card-actions>
	</v-card>
</template>

<style></style>