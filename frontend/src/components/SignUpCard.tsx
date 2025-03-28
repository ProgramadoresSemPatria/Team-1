import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Stepper } from './Stepper';
import { AccountInfoStep } from './steps/AccountInfoStep';
import { EnterpriseInfoStep } from './steps/EnterpriseInfoStep';
import { PersonalInfoStep } from './steps/PersonalInfoStep';

export function SignUpCard() {
  return (
    <div className="flex flex-col items-center justify-center md:px-10">
      <Card className="md:w-[80vh]">
        <CardHeader>
          <CardTitle className="text-center">
            Create your FeedAI account
          </CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}
