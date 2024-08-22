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
        <n-button @click="handleValidateClick" type="primary" class="w-full">Войти</n-button>
      </n-form-item>
    </n-card>
  </section>
</template>
<script lang="ts" setup>
import { authUser } from '@/domain/stores';
import { NCard,NForm,NFormItem, NInput, NButton, type FormInst, useMessage } from 'naive-ui';
import {ref} from 'vue';
import { useRouter } from 'vue-router';

const message = useMessage();
const router = useRouter();

const formRef = ref<FormInst | null>(null);
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
    e.preventDefault()
    formRef.value?.validate((errors) => {
      if (!errors) {
        authUser(formValue.value).then(res=>{
          localStorage.setItem("token", res.data.token);
          router.push({
            name: 'editor-info-create-welcome'
          });
        }).catch(e=>{
          message.error('Пароль или логин не верный! '+e.toString())
        })
      }
      else {
        console.log(errors)
        message.error('Введите все поля')
      }
    })
}

</script>