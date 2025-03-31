import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { accountInfoSchema, AccountInfoStep } from '../Steps/AccountInfoStep';
import {
  enterpriseInfoSchema,
  EnterpriseInfoStep,
} from '../Steps/EnterpriseInfoStep';
import {
  personalInfoSchema,
  PersonalInfoStep,
} from '../Steps/PersonalInfoStep';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import useAuthContext from '@/hooks/useAuth';
import { Stepper } from '@/context/StepperContext';
const schema = z.object({
  personalInfo: personalInfoSchema,
  enterpriseInfo: enterpriseInfoSchema,
  accountInfo: accountInfoSchema,
});

export type SignUpFormData = z.infer<typeof schema>;
export function SignUpCard() {
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

  const { register } = useAuthContext();

  const handleSubmit = form.handleSubmit(async (data) => {
    await register({
      cnpj: data.enterpriseInfo.CNPJ,
      company_name: data.enterpriseInfo.enterpriseName,
      company_type: data.enterpriseInfo.businessType,
      cpf: data.personalInfo.CPF,
      email: data.accountInfo.email,
      name: data.personalInfo.name,
      password: data.accountInfo.password,
      username: data.personalInfo.name,
    });
  });

  return (
    <Card className="mx-26 mb-10 lg:min-w-[50vh] lg:p-6">
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
