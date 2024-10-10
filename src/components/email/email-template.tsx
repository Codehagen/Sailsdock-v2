import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Link,
} from "@react-email/components";

interface EmailTemplateProps {
  userName: string;
  actionUrl: string;
}

const EmailTemplate: React.FC<EmailTemplateProps> = ({
  userName,
  actionUrl,
}) => {
  return (
    <Html lang="no">
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Text style={logoText}>Sailsdock</Text>
          </Section>
          <Section style={content}>
            <Text style={paragraph}>Hei {userName},</Text>
            <Text style={paragraph}>
              Velkommen til Sailsdock! Vi er glade for å ha deg om bord.
            </Text>
            <Text style={paragraph}>
              Her er noen ting du kan gjøre for å komme i gang:
            </Text>
            <ul style={list}>
              <li>
                <Link href={actionUrl} style={link}>
                  Fullfør din profil
                </Link>
              </li>
              <li>
                <Link href="https://sailsdock.com/features" style={link}>
                  Utforsk våre funksjoner
                </Link>
              </li>
              <li>
                <Link href="https://sailsdock.com/support" style={link}>
                  Les vår brukerveiledning
                </Link>
              </li>
            </ul>
            <Button style={button} href={actionUrl}>
              Kom i gang nå
            </Button>
          </Section>
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              © 2023 Sailsdock. Alle rettigheter reservert.
            </Text>
            <Text style={footerText}>
              Hvis du har spørsmål, vennligst kontakt vår{" "}
              <Link href="https://sailsdock.com/support" style={link}>
                kundestøtte
              </Link>
              .
            </Text>
            <Text style={footerText}>
              <Link href="https://sailsdock.com/privacy" style={link}>
                Personvernerklæring
              </Link>{" "}
              |{" "}
              <Link href="https://sailsdock.com/terms" style={link}>
                Vilkår for bruk
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: "hsl(210, 40%, 96.1%)",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "hsl(0, 0%, 100%)",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "600px",
};

const logoSection = {
  textAlign: "center" as const,
  marginBottom: "24px",
};

const logoText = {
  fontSize: "32px",
  fontWeight: "bold",
  color: "hsl(187, 80.8%, 34.7%)",
  margin: "0",
};

const content = {
  padding: "0 20px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "hsl(222.2, 84%, 4.9%)",
};

const list = {
  ...paragraph,
  paddingLeft: "20px",
};

const button = {
  backgroundColor: "hsl(187, 80.8%, 34.7%)",
  borderRadius: "0.5rem",
  color: "hsl(210, 40%, 98%)",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "12px 20px",
};

const link = {
  color: "hsl(187, 80.8%, 34.7%)",
  textDecoration: "underline",
};

const hr = {
  borderColor: "hsl(214.3, 31.8%, 91.4%)",
  margin: "20px 0",
};

const footer = {
  textAlign: "center" as const,
};

const footerText = {
  color: "hsl(215.4, 16.3%, 46.9%)",
  fontSize: "12px",
  lineHeight: "16px",
  margin: "8px 0",
};

export default EmailTemplate;
