import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import VolumeBaubleGameModal from '../components/ui/VolumeBaubleGameModal.vue'

describe('VolumeBaubleGameModal.vue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders 20 baubles with values 1-5 and completes with summed reduction after 10s', async () => {
    // randomFn = 0.5 -> Math.floor(0.5 * 5) + 1 = 3 for every bauble
    const wrapper = mount(VolumeBaubleGameModal, {
      props: {
        baubleCount: 20,
        durationSeconds: 10,
        randomFn: () => 0.5,
      },
    })

    expect(wrapper.find('[data-testid="baubles-remaining"]').text()).toBe('20')

    // Click 3 baubles (3 * 3% = 9%)
    await wrapper.find('[data-testid="bauble-1"]').trigger('click')
    await wrapper.find('[data-testid="bauble-2"]').trigger('click')
    await wrapper.find('[data-testid="bauble-3"]').trigger('click')

    expect(wrapper.find('[data-testid="baubles-remaining"]').text()).toBe('17')
    expect(wrapper.find('[data-testid="volume-game-reduction"]').text()).toContain('-9%')

    // Advance 10 seconds
    vi.advanceTimersByTime(10000)

    const emitted = wrapper.emitted('complete')
    expect(emitted).toBeTruthy()
    expect(emitted?.[0]?.[0]).toEqual({
      reductionPercent: 9,
      allClicked: false,
    })
  })

  it('emits allClicked: true immediately when all 20 baubles are clicked', async () => {
    const wrapper = mount(VolumeBaubleGameModal, {
      props: {
        baubleCount: 20,
        durationSeconds: 10,
        randomFn: () => 0, // value = 1 each (sum = 20%)
      },
    })

    for (let i = 1; i <= 20; i++) {
      await wrapper.find(`[data-testid="bauble-${i}"]`).trigger('click')
    }

    const emitted = wrapper.emitted('complete')
    expect(emitted).toBeTruthy()
    expect(emitted?.[0]?.[0]).toEqual({
      reductionPercent: 20,
      allClicked: true,
    })
  })
})
