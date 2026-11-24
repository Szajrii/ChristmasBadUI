import type { Component } from 'vue'
import { createRouter, createWebHashHistory, type RouterHistory } from 'vue-router'
import { registrationSteps } from '../steps/stepRegistry'
import { useRegistrationStore } from '../stores/registrationStore'
import Step00Home from '../steps/Step00Home.vue'
import Step01Credentials from '../steps/Step01Credentials.vue'
import Step02Placeholder from '../steps/Step02Placeholder.vue'

const stepComponents: Record<string, Component> = {
  home: Step00Home,
  'step-01-credentials': Step01Credentials,
  'step-02-placeholder': Step02Placeholder,
}

export function createAppRouter(history?: RouterHistory) {
  const router = createRouter({
    history: history ?? createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
      ...registrationSteps.map((step, index) => ({
        path: step.path,
        name: step.id,
        component: stepComponents[step.id],
        meta: { stepIndex: index },
      })),
      {
        path: '/:pathMatch(.*)*',
        redirect: '/',
      },
    ],
  })

  router.beforeEach((to) => {
    const stepIndex = to.meta.stepIndex
    if (typeof stepIndex !== 'number') return true

    const store = useRegistrationStore()
    if (!store.isStepUnlocked(stepIndex)) {
      const fallbackStep = registrationSteps[store.currentStepIndex] ?? registrationSteps[0]
      return fallbackStep.path
    }

    store.currentStepIndex = stepIndex
    return true
  })

  return router
}

export const router = createAppRouter()
