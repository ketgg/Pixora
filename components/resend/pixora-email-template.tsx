import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components"
import * as React from "react"

import { SITE_URL } from "@/constants/site"

export type statusType = "PROCESSING" | "SUCCEEDED" | "FAILED" | "CANCELED"

interface PixoraModelTrainingResultEmailProps {
  userFullName?: string
  genImgLink?: string
  status: statusType
}

const statusMsg: Record<statusType, string> = {
  PROCESSING:
    "Your model training has officially begun! Sit back and relax while we work on training your model. We’ll notify you as soon as it’s ready for use.",
  SUCCEEDED:
    "Great news! Your model has been successfully trained and is ready to use. You can now start creating your images using this model. Dive in and bring your ideas to life!",
  FAILED:
    "We regret to inform you that your model training failed. This could be due to insufficient data, an issue with the dataset, or a technical error. Please check your dataset and try again. If the issue persists, feel free to reach out to @ketto.gg on Discord.",
  CANCELED: "Your model training has been canceled as per your request.",
}

const baseUrl = SITE_URL

// PixoraModelTrainingResultEmail.PreviewProps = {
//   userFullName: "Alan",
//   genImgLink: "/generate",
//   message:
//     "Great news! Your model has been successfully trained and is ready to use. You can now start creating your images using this model. Dive in and bring your ideas to life!",
// } as PixoraModelTrainingResultEmailProps

export const PixoraModelTrainingResultEmail = ({
  userFullName,
  genImgLink,
  status,
}: PixoraModelTrainingResultEmailProps) => {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Preview>Pixora Model Training Alert</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${baseUrl}/static/pixora-logo.png`}
            width="40"
            height="40"
            alt="Pixora"
          />
          <Section>
            <Text style={text}>Hi {userFullName},</Text>
            <Text style={text}>{statusMsg[status]}</Text>
            {status === "SUCCEEDED" && (
              <Button style={button} href={`${baseUrl}${genImgLink}`}>
                Begin Creating
              </Button>
            )}

            <Text style={footer}>
              Thanks for trying out Pixora!
              <br />
              Cheers,
              <br />
              Ketto
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default PixoraModelTrainingResultEmail

const main = {
  backgroundColor: "#f6f6f6",
  padding: "10px 0",
}

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e5e5",
  padding: "48px",
}

const text = {
  fontSize: "16px",
  fontFamily:
    "'Inter','Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: "300",
  color: "#000000",
  lineHeight: "24px",
}

const footer = {
  fontSize: "16px",
  fontFamily:
    "'Inter', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: "300",
  color: "#000000",
  lineHeight: "24px",
  marginBottom: "0px",
}

const button = {
  backgroundColor: "#000000",
  borderRadius: "0px",
  color: "#fff",
  fontFamily: "'Inter','Open Sans', 'Helvetica Neue', Arial",
  fontSize: "15px",
  fontWeight: "300",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "200px",
  padding: "12px 4px",
  margin: "16px 0px",
}
