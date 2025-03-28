import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Stepper } from './Stepper';
import { accountInfoSchema, AccountInfoStep } from './steps/AccountInfoStep';
import {
  enterpriseInfoSchema,
  EnterpriseInfoStep,
} from './steps/EnterpriseInfoStep';
import { personalInfoSchema, PersonalInfoStep } from './steps/PersonalInfoStep';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
const schema = z.object({
  personalInfo: personalInfoSchema,
  enterpriseInfo: enterpriseInfoSchema,
  accountInfo: accountInfoSchema,
});

export type SignUpFormData = z.infer<typeof schema>;
export function SignUpCard() {
  const navigate = useNavigate();
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      personalInfo: {
        name: '',
        CPF: '',
        birthdate: '',
      },
      enterpriseInfo: {
        CNPJ: '',
        enterpriseName: '',
        businessType: '',
      },
      accountInfo: {
        email: '',
        password: '',
        confirmPassword: '',
      },
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    console.log(data);
    navigate('/login');
    //TODO: API Call
  });

  return (
    <Card className="mx-26 lg:w-[50vh] lg:p-6">
      <CardHeader>
        <CardTitle className="text-center text-xl lg:text-3xl">
          Create your FeedAI account
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit}>
            <Stepper
              steps={[
                {
                  label: 'Personal Information',
                  content: <PersonalInfoStep />,
                },
                {
                  label: 'Enterprise Information',
                  content: <EnterpriseInfoStep />,
                },

                {
                  label: 'Account Information',
                  content: <AccountInfoStep />,
                },
              ]}
            />
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
