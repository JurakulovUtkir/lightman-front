import ContentSection from '../components/content-section'
import LanguageSelector from './lang-selector'

export default function Localization() {
  //   const { lang, general } = useLang()

  return (
    <ContentSection
      title='Localization'
      //   title={general[lang].create}
      desc='Update your language settings. Set your preferred language.'
    >
      <LanguageSelector />
    </ContentSection>
  )
}
