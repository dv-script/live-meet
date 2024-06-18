import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface VerifyEmailProps {
  name: string;
  token: string;
}

export function VerificationEmail({ name, token }: VerifyEmailProps) {
  const domain =
    process.env.NODE_ENV === "production"
      ? "https://live-meet.vercel.app"
      : "http://localhost:3000";

  const confirmationLink = `${domain}/auth/verify-email?token=${token}`;

  return (
    <Html>
      <Head />
      <Preview>
        É necessário confirmar o e-mail para terminar o seu registro no Live
        Meet
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://utfs.io/f/333f0442-b7a2-4cef-9157-e0ffdb6cac4a-hru0oc.png"
            width="64"
            height="64"
            alt="Livemode logo"
          />

          <Text style={title}>
            <strong>{name}</strong>, a sua conta está quase pronta!
          </Text>

          <Section style={section}>
            <Text style={text}>
              Olá, <strong>{name}</strong>!
            </Text>
            <Text style={text}>
              Para terminar o seu registro no Live Meet, é necessário confirmar
              o seu e-mail.
            </Text>

            <Link href={confirmationLink} target="blank" style={button}>
              Confirmar e-mail
            </Link>
          </Section>
          <Text style={links}>
            <Link href="mailto:dhasson@livemode.com" style={link}>
              Precisa de suporte?
            </Link>
          </Text>

          <Text style={footer}>
            Livemode ・ 443 Rua Assunção ・ Botafogo ・ Rio de Janeiro, RJ,
            Brasil
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#ffffff",
  color: "#24292e",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
};

const container = {
  maxWidth: "480px",
  margin: "0 auto",
  padding: "20px 0 48px",
};

const title = {
  fontSize: "24px",
  lineHeight: 1.25,
};

const section = {
  padding: "24px",
  border: "solid 1px #dedede",
  borderRadius: "5px",
  textAlign: "center" as const,
};

const text = {
  margin: "0 0 10px 0",
  textAlign: "left" as const,
};

const button = {
  fontSize: "14px",
  backgroundColor: "#28a745",
  textDecoration: "none",
  color: "#fff",
  lineHeight: 1.5,
  borderRadius: "0.5em",
  padding: "12px 24px",
};

const links = {
  textAlign: "center" as const,
};

const link = {
  color: "#0366d6",
  fontSize: "12px",
};

const footer = {
  color: "#6a737d",
  fontSize: "12px",
  textAlign: "center" as const,
  marginTop: "60px",
};
