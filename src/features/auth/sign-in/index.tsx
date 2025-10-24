import { Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'

export default function SignIn() {
  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>Sign in </CardTitle>
          <CardDescription>
            Enter your phone number and password below to <br />
            sign into your account
            <br />
            Don&apos;t have an account?{' '}
            <Link
              to='/sign-up'
              className='hover:text-primary underline underline-offset-4'
            >
              Sign up
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserAuthForm />
        </CardContent>
        <CardFooter className='flex flex-col gap-4'>
          <div>
            <p className='text-muted-foreground px-8 text-center text-sm'>
              By clicking login, you agree to our{' '}
              <a
                href='/terms'
                className='hover:text-primary underline underline-offset-4'
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href='/privacy'
                className='hover:text-primary underline underline-offset-4'
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
          <p className='text-muted-foreground px-8 text-center text-sm'>
            © {new Date().getFullYear()} Developed by Lightman Group.
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
