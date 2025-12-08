import { useLang } from '@/hooks/useLang'
import ContentSection from '../components/content-section'
import LanguageSelector from './lang-selector'

export default function Localization() {
  const { lang, general } = useLang()
  const t = general[lang].layout
  return (
    <ContentSection title={t.localization} desc={t.update_lang}>
      <LanguageSelector />
    </ContentSection>
  )
}
