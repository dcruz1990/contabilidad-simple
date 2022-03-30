<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Nuevo comprobante</ion-title>
        <ion-buttons slot="end">
          <!-- <ion-button color="primary" small>Adicionar</ion-button> -->
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-label>Seleccione la cuenta</ion-label>
      <ion-select
        v-model="selectedAccount"
        ok-text="Aceptar"
        cancel-text="Cancelar"
        mode="md"
        name="selectedAccount"
      >
        <ion-select-option
          v-for="account in accounts"
          :value="account.id"
          :key="account"
          >{{ account.name }}</ion-select-option
        >
      </ion-select>

      <ion-text color="secondary" style="marginleft: 20px">
        <h1>Informacion de la cuenta:</h1>

        <p>Naturaleza:</p>
        {{
          currentAccount
            ? currentAccount.nature === "credit"
              ? "Cuenta de credito: Las cuentas de pasivos son de naturaleza acreedora, lo que significa que aumentan su saldo con crédito y disminuye cuando se les da un débito."
              : "Cuenta de debito: Las cuentas de activos son de naturaleza deudora. Esto quiere decir que aumentan su saldo cuando se les da un débito y por el contrario se reduce su saldo al acreditarse."
            : "No hay cuenta seleccionada"
        }}
      </ion-text>

      <ion-item>
        <ion-label>Debe</ion-label>
        <ion-input placeholder="Debe" v-model="debit"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label>Haber</ion-label>
        <ion-input placeholder="Haber" v-model="credit"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label>Nombre</ion-label>
        <ion-input placeholder="Nombre" v-model="name"></ion-input>
      </ion-item>

      <ion-item>
        <ion-textarea
          v-model="desc"
          placeholder="Escriba la descripcion de la operacion"
        ></ion-textarea>
      </ion-item>

      <div class="buttonContainer">
        <ion-button
          fill="solid"
          color="primary"
          @click="contabilize"
          :disabled="!selectedAccount"
        >
          <ion-spinner v-if="loading" name="crescent"></ion-spinner>
          Contabilizar</ion-button
        >
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { supabase } from "../supabase";
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  alertController,
  IonText,
} from "@ionic/vue";

type Account = {
  id: number;
  nature: string;
  balance: number;
  name: string;
  created_at: string;
};

type Operation = {
  id?: number;
  name: string;
  description: string;
  created_at?: string;
  account: number;
  debit: number;
  credit: number;
  initialAmmount?: number;
  finalAmmount?: number;
};

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
    IonInput,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonText,
  },

  setup: () => {
    const form = ref();
    const accounts = ref<any>();
    const selectedAccount = ref();
    const credit = ref<number>();
    const debit = ref<number>();
    const desc = ref("");
    const name = ref("");
    const loading = ref<boolean>(false);
    const currentAccount = ref<any>();

    const getAccounts = async () => {
      const { data, error } = await supabase.from<Account>("account").select();
      data ? (accounts.value = data) : null;
    };

    const getAccountInfo = async (accountId: number) => {
      const { data, error } = await supabase
        .from<Account>("account")
        .select()
        .eq("id", accountId);

      if (!data) return;

      currentAccount.value = data[0] || undefined;
    };

    // const itemColor = computed(() => {});

    const test = (value: any) => {
      console.log(value);
    };

    onMounted(() => {
      getAccounts();
    });

    const incrementOrDecrement = (nature: string) => {
      nature === "credit";
    };

    const contabilize = async () => {
      loading.value = true;
      console.log(credit.value);
      console.log(debit.value);
      console.log(selectedAccount.value);

      const account = await getAccountInfo(selectedAccount.value);

      const { data, error } = await supabase
        .from<Operation>("operation")
        .insert([
          {
            name: name.value,
            description: desc.value,
            account: selectedAccount.value,
            debit: debit.value,
            credit: credit.value,
            initialAmmount: currentAccount.value?.balance,
            finalAmmount:
              currentAccount.value?.nature === "debit"
                ? currentAccount.value?.balance + debit.value!
                : 0,
          },
        ]);

      if (currentAccount.value?.nature === "debit") {
        await updateAccountBalance(currentAccount.value.balance + credit.value);
      } else {
        await updateAccountBalance(currentAccount.value.balance - debit.value!);
      }

      // updateAccountBalance(
      //   currentAccount.value?.nature === "debit"
      //     ? currentAccount.value?.balance + debit.value!
      //     : currentAccount.value?.balance - credit.value!
      // );

      data ? ((loading.value = false), resetValues(), presentAlert()) : null;
    };

    const updateAccountBalance = async (balance: number) => {
      console.log(balance);
      console.log(currentAccount.value.id);
      const { data, error } = await supabase
        .from("account")
        .update({
          balance: balance,
        })
        .match({ id: currentAccount.value?.id });

      console.log(data);
    };

    const presentAlert = async () => {
      const alert = await alertController.create({
        cssClass: "my-custom-class",
        header: "Información",
        subHeader: "Creación de comprobante",
        message: "Su operación se ha contabilizado satisfactoriamente",
        buttons: ["OK"],
      });
      await alert.present();

      const { role } = await alert.onDidDismiss();
      console.log("onDidDismiss resolved with role", role);
    };

    const resetValues = () => {
      debit.value = 0;
      credit.value = 0;
      name.value = "";
      desc.value = "";
      selectedAccount.value = 0;
    };

    watch(selectedAccount, async () => {
      console.log(selectedAccount.value);
      await getAccountInfo(selectedAccount.value);
    });

    return {
      accounts,
      selectedAccount,
      form,
      contabilize,
      debit,
      credit,
      test,
      desc,
      name,
      loading,
      currentAccount,
    };
  },
});
</script>

<style scoped>
.buttonContainer {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}
</style>
