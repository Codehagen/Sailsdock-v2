import EmailTemplate from "../src/components/email/email-template";

export default function Preview() {
  return (
    <EmailTemplate userName="Ola Nordmann" actionUrl="https://sailsdock.com/" />
  );
}
