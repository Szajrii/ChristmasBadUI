export interface RegistrationStepDefinition {
  /** Unikalny identyfikator kroku (np. 'step-01-credentials') */
  id: string
  /** Ścieżka w vue-router (np. '/', '/krok-1') */
  path: string
  /** Tytuł wyświetlany w nagłówku kontenera */
  title: string
  /** Krótki, kiczowaty podtytuł / instrukcja */
  subtitle: string
  /** Ikona emoji przypisana do kroku */
  icon: string
}

export interface ControlPanelSettings {
  snowEnabled: boolean
  lightsEnabled: boolean
  kitschBorderEnabled: boolean
}
