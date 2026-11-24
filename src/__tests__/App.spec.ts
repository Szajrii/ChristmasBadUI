import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import App from '../App.vue'

describe('App.vue', () => {
  it('renders control panel, square stage container, and home step with direct registration', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia()],
      },
    })

    expect(wrapper.find('[data-testid="control-panel"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="stage-container"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="home-step"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('ChristmasBadUI')

    // Volume control button starts at 100% and opens the bauble mini-game modal
    const volumeBtn = wrapper.find('[data-testid="volume-control-btn"]')
    expect(volumeBtn.text()).toContain('100%')
    expect(wrapper.find('[data-testid="volume-game-modal"]').exists()).toBe(false)
    await volumeBtn.trigger('click')
    expect(wrapper.find('[data-testid="volume-game-modal"]').exists()).toBe(true)

    // Toggle snow button in control panel
    const snowBtn = wrapper.find('[data-testid="toggle-snow-btn"]')
    expect(snowBtn.text()).toContain('ON')
    await snowBtn.trigger('click')
    expect(snowBtn.text()).toContain('OFF')

    // Click Register -> navigates to Step 1 placeholder
    await wrapper.find('[data-testid="home-register-btn"]').trigger('click')
    expect(wrapper.find('[data-testid="step-01-placeholder"]').exists()).toBe(true)
  })

  it('opens login modal telling nobody has an account and redirects to registration', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia()],
      },
    })

    expect(wrapper.find('[data-testid="login-modal"]').exists()).toBe(false)
    await wrapper.find('[data-testid="home-login-btn"]').trigger('click')

    const modal = wrapper.find('[data-testid="login-modal"]')
    expect(modal.exists()).toBe(true)
    expect(modal.text()).toContain('nikt jeszcze nie ma konta')

    await wrapper.find('[data-testid="login-modal-register-btn"]').trigger('click')
    expect(wrapper.find('[data-testid="login-modal"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="step-01-placeholder"]').exists()).toBe(true)
  })

  it('enables developer mode via combobox, mutes music, and allows jumping steps', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia()],
      },
    })

    const devSelect = wrapper.find('[data-testid="dev-mode-select"]')
    expect((devSelect.element as HTMLSelectElement).value).toBe('off')
    expect(wrapper.find('[data-testid="dev-nav-bar"]').exists()).toBe(false)

    await devSelect.setValue('on')

    expect(wrapper.find('[data-testid="dev-nav-bar"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="volume-control-btn"]').text()).toContain('0% (DEV)')

    // Jump directly to Step 1 without completing Step 0
    await wrapper.find('[data-testid="dev-next-btn"]').trigger('click')
    expect(wrapper.find('[data-testid="step-01-placeholder"]').exists()).toBe(true)
  })
})
