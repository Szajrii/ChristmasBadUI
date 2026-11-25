import type { Component } from 'vue'
import { createRouter, createWebHashHistory, type RouterHistory } from 'vue-router'
import { registrationSteps } from '../steps/stepRegistry'
import { useRegistrationStore } from '../stores/registrationStore'
import Step00Home from '../steps/Step00Home.vue'
import Step01Credentials from '../steps/Step01Credentials.vue'
import Step02Email from '../steps/Step02Email.vue'
import Step03Interests from '../steps/Step03Interests.vue'
import Step04Memory from '../steps/Step04Memory.vue'
import Step05Birthdate from '../steps/Step05Birthdate.vue'
import Step06Phone from '../steps/Step06Phone.vue'
import Step07Country from '../steps/Step07Country.vue'
import Step08Captcha from '../steps/Step08Captcha.vue'
import Step09Terms from '../steps/Step09Terms.vue'
import Step10GrinchCheck from '../steps/Step10GrinchCheck.vue'
import Step11Certificate from '../steps/Step11Certificate.vue'

const stepComponents: Record<string, Component> = {
  home: Step00Home,
  'step-01-credentials': Step01Credentials,
  'step-02-email': Step02Email,
  'step-03-interests': Step03Interests,
  'step-04-memory': Step04Memory,
  'step-05-birthdate': Step05Birthdate,
  'step-06-phone': Step06Phone,
  'step-07-country': Step07Country,
  'step-08-captcha': Step08Captcha,
  'step-09-terms': Step09Terms,
  'step-10-grinch': Step10GrinchCheck,
  'step-11-certificate': Step11Certificate,
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
