import type { Component } from 'vue'

export interface RegistrationStepDefinition {
  /** Unikalny identyfikator kroku (np. 'step-01-username') */
  id: string
  /** Tytuł wyświetlany w nagłówku kontenera */
  title: string
  /** Krótki, kiczowaty podtytuł / instrukcja */
  subtitle: string
  /** Ikona emoji przypisana do kroku */
  icon: string
  /** Komponent Vue ładowany wewnątrz StageContainer */
  component: Component
}

export interface ControlPanelSettings {
  snowEnabled: boolean
  lightsEnabled: boolean
  kitschBorderEnabled: boolean
}
