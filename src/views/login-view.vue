<template>
  <section class="bg-gray-50 dark:bg-gray-900 px-4 min-h-screen flex place-items-center">
    <n-card round>
      <h2 class="text-2xl">Авторизация</h2>
      <n-form ref="formRef"
      :model="formValue"
      :rules="rules"
      class="mt-4">
        <n-form-item label="Логин" path="username">
          <n-input v-model:value="formValue.username" placeholder="admin"></n-input>
        </n-form-item>
        <n-form-item label="Пароль" path="password">
          <n-input v-model:value="formValue.password" type="password" placeholder="*******"></n-input>
        </n-form-item>
      </n-form>
      <n-form-item>
        <n-button :loading="isLoading" @click="handleValidateClick" type="primary" class="w-full">Войти</n-button>
      </n-form-item>
    </n-card>
  </section>
</template>
<script lang="ts" setup>
import {authUser, updateAuthenticationStatus} from '@/domain/stores';
import { NCard,NForm,NFormItem, NInput, NButton, type FormInst, useMessage } from 'naive-ui';
import {ref} from 'vue';
import { useRouter } from 'vue-router';

const message = useMessage();
const router = useRouter();

const formRef = ref<FormInst | null>(null);
const isLoading = ref<boolean>(false);
const formValue = ref({
  username: null,
  password: null
});

const rules = {
  username: {
    required: true,
    message: 'Введите логин',
    trigger: ['input']
  },
  password: {
    required: true,
    message: 'Введите пароль',
    trigger: ['input']
  }
}

async function handleValidateClick(e: MouseEvent) {
    e.preventDefault();
    isLoading.value = true;
    console.log("Handle click")
    formRef.value?.validate((errors) => {
      if (!errors) {
        authUser(formValue.value).then(res=>{
          updateAuthenticationStatus(res.data.token)
          router.push({
            name: 'editor-info-create-welcome'
          });
          message.success('Успешный вход!')
        }).catch(e=>{
          message.error('Пароль или логин не верный! '+e.toString())
        }).finally(()=>{
          isLoading.value = false;
        })
      }
      else {
        console.log(errors)
        message.error('Введите все поля')
      }
    })
}

</script>