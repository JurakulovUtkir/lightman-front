import { Link } from '@tanstack/react-router'
import { useLang } from '@/hooks/useLang'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { SignUpForm } from './components/sign-up-form'

export default function SignUp() {
  const { lang, general } = useLang()
  const t = general[lang]

  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>
            {t.auth.create_account}
          </CardTitle>
          <CardDescription>
            {t.auth.enter_sign_up_details} <br /> {t.auth.have_account}
            <Link
              to='/sign-in'
              className='hover:text-primary underline underline-offset-4'
            >
              {' '}
              {t.auth.sign_in}
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
        <CardFooter className='flex flex-col gap-4'>
          <p className='text-muted-foreground px-8 text-center text-sm'>
            {t.terms.agreement.split('{{terms}}')[0]}

            <a
              href='/terms'
              className='hover:text-primary underline underline-offset-4'
            >
              {t.terms.terms_of_service}
            </a>

            {t.terms.agreement.split('{{terms}}')[1].split('{{privacy}}')[0]}

            <a
              href='/privacy'
              className='hover:text-primary underline underline-offset-4'
            >
              {t.terms.privacy_policy}
            </a>

            {t.terms.agreement.split('{{privacy}}')[1]}
          </p>
          <p className='text-muted-foreground px-8 text-center text-sm'>
            © {new Date().getFullYear()} {t.auth.developed_by}
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
