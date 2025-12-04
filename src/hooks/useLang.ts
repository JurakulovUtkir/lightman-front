import { ReactNode } from 'react'
import companyJson from '@/translations/company.json'
import contractJson from '@/translations/contract.json'
import expenceJson from '@/translations/expence.json'
import formJson from '@/translations/form.json'
import generalJson from '@/translations/general.json'
import networkJson from '@/translations/network.json'
import projectJson from '@/translations/project.json'
import { useUnit } from 'effector-react'
import { $lang } from '@/context/lang'

const interpolate = (text: string, values: Record<string, unknown>) => {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return values[key] !== undefined ? String(values[key]) : match
  })
}

const interpolateWithComponents = (
  text: string,
  components: Record<string, ReactNode>
): ReactNode[] => {
  const parts = text.split(/(\{\{\w+\}\})/g)

  return parts.map((part) => {
    const match = part.match(/\{\{(\w+)\}\}/)
    if (match && components[match[1]]) {
      return components[match[1]]
    }
    return part
  })
}

export const useLang = () => {
  const lang = useUnit($lang)
  const general = generalJson
  const tProject = projectJson
  const tForm = formJson
  const tNetwork = networkJson
  const tContract = contractJson
  const tCompany = companyJson
  const tExpence = expenceJson

  return {
    lang,
    interpolate,
    interpolateWithComponents,
    general,
    tProject,
    tForm,
    tNetwork,
    tCompany,
    tContract,
    tExpence,
  }
}
