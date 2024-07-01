import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";
import { MyAccountForm } from "./my-account-form";
import { Prisma } from "@prisma/client";
import { ChangePasswordForm } from "./change-password-form";

export function SettingsContainer({
  user,
}: {
  user: Prisma.UserGetPayload<{ select: { name: true; department: true } }>;
}) {
  return (
    <Tabs defaultValue="account" className="w-full max-w-[600px] mx-auto">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Minha conta</TabsTrigger>
        <TabsTrigger value="password">Alterar senha</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Minha conta</CardTitle>
            <CardDescription>
              Faça alterações de perfil e gerencie suas configurações de conta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MyAccountForm user={user} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Alterar senha</CardTitle>
            <CardDescription>
              Altere sua senha para manter sua conta segura.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
