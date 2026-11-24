import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import App from '../App.vue'

describe('App.vue', () => {
  it('renders control panel, square stage container, and placeholder step', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia()],
      },
    })

    expect(wrapper.find('[data-testid="control-panel"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="stage-container"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="placeholder-step"]').exists()).toBe(true)
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

    // Complete placeholder step
    await wrapper.find('[data-testid="placeholder-complete-btn"]').trigger('click')
    expect(wrapper.find('[data-testid="placeholder-completed-msg"]').exists()).toBe(true)
  })
})
