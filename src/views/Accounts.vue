<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Cuentas</ion-title>
        <ion-buttons slot="end">
          <!-- <ion-button color="primary" small>Adicionar</ion-button> -->
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list>
        <ion-item
          v-for="account in accounts"
          :key="account"
          :color="account.nature === 'debit' ? 'danger' : 'primary'"
        >
          <ion-label slot="start">
            {{ account.nature === "debit" ? "Deudora" : "Acreedora" }}
          </ion-label>
          <ion-label>
            {{ account.name }}
          </ion-label>
          <ion-label slot="end">
            {{ account.balance }}
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { supabase } from "../supabase";
import { computed, defineComponent, onMounted, ref } from "vue";
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
} from "@ionic/vue";

export default defineComponent({
  name: "AccountComponent",
  components: {
    IonButtons,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar,
  },
  setup: () => {
    const accounts = ref();
    const getAccounts = async () => {
      const { data, error } = await supabase.from("account").select();
      data ? (accounts.value = data) : null;
    };

    // const itemColor = computed(() => {});

    onMounted(() => {
      getAccounts();
    });

    console.log(accounts);

    return { accounts };
  },
});
</script>

<style scoped>
</style>
