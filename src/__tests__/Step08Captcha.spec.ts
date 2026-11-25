import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import Step08Captcha from '../steps/Step08Captcha.vue'
import { useRegistrationStore } from '../stores/registrationStore'
import {
  createCaptchaBoard,
  swapCaptchaTiles,
  verifyCaptchaSelection,
} from '../utils/captchaGame'

describe('captchaGame utils', () => {
  it('creates a 3x3 board with at least 2 boneless carps', () => {
    const board = createCaptchaBoard(3, () => 0.25)
    expect(board).toHaveLength(9)
    const bonelessCount = board.filter((t) => t.kind === 'boneless-carp').length
    expect(bonelessCount).toBeGreaterThanOrEqual(2)
  })

  it('swaps tiles while keeping at least one boneless carp on the board', () => {
    const board = createCaptchaBoard(3, () => 0.4)
    const { tiles, changedIds } = swapCaptchaTiles(board, 2, () => 0.7)
    expect(tiles).toHaveLength(9)
    expect(changedIds.length).toBeGreaterThan(0)
    expect(tiles.some((t) => t.kind === 'boneless-carp')).toBe(true)
  })

  it('verifies selection accurately', () => {
    const board = createCaptchaBoard(3, () => 0.3)
    expect(verifyCaptchaSelection(board)).toEqual({
      valid: false,
      reason: 'missing-boneless',
    })

    const onlyBoneless = board.map((t) => ({
      ...t,
      selected: t.kind === 'boneless-carp',
    }))
    expect(verifyCaptchaSelection(onlyBoneless)).toEqual({
      valid: true,
      reason: 'ok',
    })

    const withWrong = board.map((t) => ({
      ...t,
      selected: true,
    }))
    expect(verifyCaptchaSelection(withWrong)).toEqual({
      valid: false,
      reason: 'wrong-selection',
    })
  })
})

describe('Step08Captcha.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('rejects incomplete or wrong selection and unlocks on valid verification', async () => {
    const store = useRegistrationStore()
    const completeSpy = vi.spyOn(store, 'completeStep')
    const nextSpy = vi.spyOn(store, 'goToNextStep').mockReturnValue(true)

    const wrapper = mount(Step08Captcha, {
      props: { swapIntervalMs: 2500, randomFn: () => 0.42 },
    })

    const tiles = wrapper.findAll('[data-testid^="captcha-tile-"]')
    expect(tiles).toHaveLength(9)

    const submitBtn = wrapper.find('[data-testid="step-08-submit-btn"]')
    expect(submitBtn.attributes('disabled')).toBeDefined()

    // Próba 1: brak zaznaczeń
    await wrapper.find('[data-testid="captcha-verify-btn"]').trigger('click')
    expect(wrapper.find('[data-testid="captcha-status"]').text()).toContain('BŁĄD')
    expect(wrapper.find('[data-testid="captcha-attempts"]').text()).toContain('1')
    expect(submitBtn.attributes('disabled')).toBeDefined()

    // Próba 2: zaznaczamy tylko karpie bez ości
    const bonelessTiles = tiles.filter((t) => t.attributes('data-kind') === 'boneless-carp')
    expect(bonelessTiles.length).toBeGreaterThan(0)
    for (const tile of bonelessTiles) {
      await tile.trigger('click')
    }

    await wrapper.find('[data-testid="captcha-verify-btn"]').trigger('click')
    expect(wrapper.find('[data-testid="captcha-status"]').text()).toContain('Zweryfikowano')
    expect(wrapper.find('[data-testid="captcha-attempts"]').text()).toContain('2')
    expect(submitBtn.attributes('disabled')).toBeUndefined()

    await submitBtn.trigger('click')
    expect(completeSpy).toHaveBeenCalledWith('step-08-captcha', {
      captchaVerified: true,
      captchaAttempts: 2,
    })
    expect(nextSpy).toHaveBeenCalledTimes(1)
  })

  it('swaps tiles periodically every swapIntervalMs', async () => {
    const wrapper = mount(Step08Captcha, {
      props: { swapIntervalMs: 2500, randomFn: () => 0.35 },
    })

    const initialKinds = wrapper
      .findAll('[data-testid^="captcha-tile-"]')
      .map((t) => t.attributes('data-kind'))

    await vi.advanceTimersByTimeAsync(2500)

    const updatedKinds = wrapper
      .findAll('[data-testid^="captcha-tile-"]')
      .map((t) => t.attributes('data-kind'))

    expect(updatedKinds).not.toEqual(initialKinds)
  })

  it('keeps next button active in devMode', async () => {
    const store = useRegistrationStore()
    store.setDevMode(true)
    const completeSpy = vi.spyOn(store, 'completeStep')
    const nextSpy = vi.spyOn(store, 'goToNextStep').mockReturnValue(true)

    const wrapper = mount(Step08Captcha)
    const submitBtn = wrapper.find('[data-testid="step-08-submit-btn"]')
    expect(submitBtn.attributes('disabled')).toBeUndefined()

    await submitBtn.trigger('click')
    expect(completeSpy).toHaveBeenCalledWith('step-08-captcha', {
      captchaVerified: true,
      captchaAttempts: 0,
    })
    expect(nextSpy).toHaveBeenCalledTimes(1)
  })
})
