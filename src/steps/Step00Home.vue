<script setup lang="ts">
import { ref } from 'vue'
import { useRegistrationStore } from '../stores/registrationStore'
import KitschButton from '../components/ui/KitschButton.vue'
import KitschModal from '../components/ui/KitschModal.vue'

const store = useRegistrationStore()
const isLoginModalOpen = ref(false)

function startRegistration(viaLoginModal = false) {
  isLoginModalOpen.value = false
  store.completeStep('home', {
    entryChoice: viaLoginModal ? 'login-redirect' : 'register',
  })
  store.goToNextStep()
}
</script>

<template>
  <div data-testid="home-step" class="flex max-w-md flex-col items-center gap-5 text-center">
    <div class="text-5xl" aria-hidden="true">🎄🎅🎁</div>

    <h3 class="text-xl font-extrabold text-yellow-300 sm:text-2xl">
      HO! HO! HO! Witaj na Świątecznej Stronie Głównej!
    </h3>

    <p class="rounded-2xl border-2 border-red-400/70 bg-black/30 p-4 text-sm leading-relaxed text-amber-50 sm:text-base">
      Wybierz, czy chcesz się zalogować na swoje nieistniejące konto, czy od razu rzucić się
      w wir wieloetapowej, kiczowatej rejestracji! 🦌✨
    </p>

    <div class="flex flex-wrap items-center justify-center gap-4 pt-1">
      <KitschButton
        data-testid="home-login-btn"
        variant="santa"
        @click="isLoginModalOpen = true"
      >
        🔐 Logowanie
      </KitschButton>

      <KitschButton
        data-testid="home-register-btn"
        variant="gold"
        @click="startRegistration(false)"
      >
        📝 Rejestracja
      </KitschButton>
    </div>

    <!-- Okno dialogowe po kliknięciu Logowania -->
    <KitschModal
      v-if="isLoginModalOpen"
      data-testid="login-modal"
      title-id="login-modal-title"
    >
      <div class="flex flex-col items-center gap-4 p-6 text-center">
        <div class="text-4xl" aria-hidden="true">🎅❓🎄</div>

        <h4
          id="login-modal-title"
          class="kitsch-text-shadow text-xl font-extrabold text-yellow-300"
        >
          Chwileczkę, kolego!
        </h4>

        <p class="text-sm leading-relaxed text-amber-100 sm:text-base">
          Przecież tu <strong>nikt jeszcze nie ma konta</strong>! Mikołaj zgubił całą bazę danych
          w zaspie śnieżnej. Musisz najpierw przejść rejestrację! ❄️
        </p>

        <div class="flex flex-wrap items-center justify-center gap-3 pt-1">
          <KitschButton
            data-testid="login-modal-register-btn"
            variant="gold"
            @click="startRegistration(true)"
          >
            🎁 Przejdź do rejestracji
          </KitschButton>

          <KitschButton
            data-testid="login-modal-close-btn"
            variant="elf"
            @click="isLoginModalOpen = false"
          >
            🙈 Zamknij
          </KitschButton>
        </div>
      </div>
    </KitschModal>
  </div>
</template>
