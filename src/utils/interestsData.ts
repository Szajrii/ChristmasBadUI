export interface InterestOption {
  id: string
  label: string
  isResetTrap?: boolean
}

export const INTEREST_OPTIONS: InterestOption[] = [
  { id: 'int-01', label: 'Rozplątywanie lampek' },
  { id: 'int-02', label: 'Jedzenie karpia' },
  { id: 'int-03', label: 'Śpiewanie kolęd fałszem' },
  { id: 'int-04', label: 'Kolekcjonowanie skarpet' },
  { id: 'int-05', label: 'Lepienie bałwana w błocie' },
  { id: 'int-06', label: 'Picie barszczu z kubka' },
  { id: 'int-07', label: 'Oglądanie Kevina 15. raz' },
  { id: 'int-08', label: 'Kłótnie przy stole' },
  { id: 'int-09', label: 'Pakowanie prezentów w gazetę' },
  { id: 'int-10', label: 'Liczenie igieł z choinki' },
  { id: 'int-11', label: 'Szukanie ości w zupie' },
  { id: 'int-12', label: 'Walka o ostatniego pieroga' },
  { id: 'int-13', label: 'Noszenie swetra z dzwonkiem' },
  { id: 'int-14', label: 'Testowanie mrozu językiem' },
  { id: 'int-15', label: 'Zjadanie czekoladek z kalendarza' },
  { id: 'int-16', label: 'Słuchanie Last Christmas 24h' },
  { id: 'int-17', label: 'Polowanie na promocje majonezu' },
  { id: 'int-18', label: 'Dokarmianie karpia w wannie' },
  { id: 'int-19', label: 'Wyczyść wszystko', isResetTrap: true },
  { id: 'int-20', label: 'Czytanie etykiet na prezentach' },
  { id: 'int-21', label: 'Spanie po kolacji wigilijnej' },
]
