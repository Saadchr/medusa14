import {
  Body,
  Container,
  Column,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

const baseUrl = "";

export const AppleReceiptEmail = ({ emailoptions }) => (
  <Html>
    <Head />
    <Preview>
      Sami Store - Votre Reçu de Commande N° {emailoptions.ordernumber}
    </Preview>

    <Body style={main}>
      <Container style={container}>
        <Section>
          <Row>
            <Column align="left" style={tableCell}>
              <Text style={heading}>Reçu </Text>
            </Column>
          </Row>
        </Section>
        <Section>
          <Text style={cupomText}>
            Créez un compte sur Sami Store pour bénéficier d'avantages clients
            (Remises, Black Friday, etc.)
            <Link href="https://www.samistore.ma/ma/account">
              Créez un compte ici
            </Link>
          </Text>
        </Section>
        <Section style={informationTable}>
          <Row style={informationTableRow}>
            <Column colSpan={2}>
              <Section>
                <Row>
                  <Column style={informationTableColumn}>
                    <Text style={informationTableLabel}>EMAIL</Text>
                    <Link
                      style={{
                        ...informationTableValue,
                        color: "#15c",
                        textDecoration: "underline",
                      }}
                    >
                      {emailoptions.email}
                    </Link>
                  </Column>
                </Row>

                <Row>
                  <Column style={informationTableColumn}>
                    <Text style={informationTableLabel}>DATE DE FACTURE</Text>
                    <Text style={informationTableValue}>
                      {emailoptions.created_at}
                    </Text>
                  </Column>
                </Row>

                <Row>
                  <Column style={informationTableColumn}>
                    <Text style={informationTableLabel}>COMMANDE N°</Text>
                    <Text style={informationTableValue}>
                      {emailoptions.ordernumber}{" "}
                    </Text>
                  </Column>
                  <Column style={informationTableColumn}>
                    <Text style={informationTableLabel}>DOCUMENT NO.</Text>
                    <Text style={informationTableValue}>
                      {emailoptions.ordernumber}
                    </Text>
                  </Column>
                </Row>
              </Section>
            </Column>
            <Column style={informationTableColumn} colSpan={2}>
              <Text style={informationTableLabel}>
                Informations de Livraison
              </Text>
              <Text style={informationTableValue}>{emailoptions.client}</Text>
              <Text style={informationTableValue}>
                {emailoptions.shipping_address}
              </Text>
              <Text style={informationTableValue}>{emailoptions.city}</Text>
              <Text style={informationTableValue}>{emailoptions.phone}</Text>
            </Column>
          </Row>
        </Section>
        <Section style={productTitleTable}>
          <Text style={productsTitle}>Sami Store</Text>
        </Section>
        <Section>
          {emailoptions.items.map((item) => {
            return (
              <Row style={{ marginTop: "22px" }} key={item.id}>
                <Column style={{ width: "64px" }}>
                  <Img
                    src={item.thumbnail}
                    width="64"
                    height="64"
                    alt="Produit"
                    style={productIcon}
                  />
                </Column>
                <Column style={{ paddingLeft: "22px" }}>
                  <Text style={productTitle}>{item.title}</Text>
                </Column>

                <Column style={productTitle}>
                  <Text>qté: {item.quantity}</Text>
                </Column>

                <Column style={productTitle} align="right">
                  <Text style={productPrice}>
                    {item.quantity} * {item.original_price / 100} MAD TTC
                  </Text>
                </Column>
              </Row>
            );
          })}
        </Section>
        <Hr style={productPriceLine} />
        <Section align="right">
          <Row>
            <Column style={tableCell} align="right">
              <Text style={productPriceTotal}>TOTAL H.T</Text>
            </Column>
            <Column style={productPriceVerticalLine}></Column>
            <Column align="right" style={productPriceLargeWrapper}>
              <Text style={productPriceLarge}>
                {emailoptions.subtotal / 100} MAD
              </Text>
            </Column>
          </Row>
          <Row>
            <Column style={tableCell} align="right">
              <Text style={productPriceTotal}>LIVRAISON TTC</Text>
            </Column>
            <Column style={productPriceVerticalLine}></Column>
            <Column align="right" style={productPriceLargeWrapper}>
              <Text style={productPriceLarge}>
                {Number(
                  ((emailoptions.shipping_total * 1.2) / 100).toLocaleString(
                    undefined,
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                  )
                )}{" "}
                MAD
              </Text>
            </Column>
          </Row>
          <Row>
            <Column style={tableCell} align="right">
              <Text style={productPriceTotal}>TVA</Text>
            </Column>
            <Column style={productPriceVerticalLine}></Column>
            <Column align="right" style={productPriceLargeWrapper}>
              <Text style={productPriceLarge}>
                {Number(emailoptions.tax_total / 100)} MAD
              </Text>
            </Column>
          </Row>
          <Row>
            <Column style={tableCell} align="right">
              <Text style={productPriceTotal}>TOTAL</Text>
            </Column>
            <Column style={productPriceVerticalLine}></Column>
            <Column align="right" style={productPriceLargeWrapper}>
              <Text style={productPriceLarge}>
                {emailoptions.total / 100} MAD
              </Text>
            </Column>
          </Row>
        </Section>
        <Hr style={productPriceLineBottom} />
        <Section>
          <Row>
            <Column align="center" style={block}></Column>
          </Row>
        </Section>
        <Section>
          <Row>
            <Column align="center" style={ctaTitle}>
              <Text style={ctaText}>
                Créez un compte sur Sami Store pour bénéficier des dernières
                réductions.
              </Text>
            </Column>
          </Row>
        </Section>
        <Section>
          <Row>
            <Column align="center" style={walletWrapper}>
              <Link
                href="https://wallet.apple.com/apple-card/setup/feature/ccs?referrer=cid%3Dapy-120-100003"
                style={walletLink}
              >
                <span style={walletLinkText}>Inscrivez-vous ici</span>
              </Link>
            </Column>
          </Row>
        </Section>
        <Hr style={walletBottomLine} />
        <Text style={footerCopyright}>
          Copyright © Sami Store 2024 <br />{" "}
          <Link href="https://samistore.ma">All rights reserved</Link>
        </Text>
      </Container>
    </Body>
  </Html>
);

export default AppleReceiptEmail;

const main = {
  fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
  backgroundColor: "#ffffff",
};

const resetText = {
  margin: "0",
  padding: "0",
  lineHeight: 1.4,
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "660px",
  maxWidth: "100%",
};

const tableCell = { display: "table-cell" };

const heading = {
  fontSize: "32px",
  fontWeight: "300",
  color: "#888888",
};

const cupomText = {
  textAlign: "center" as const,
  margin: "36px 0 40px 0",
  fontSize: "14px",
  fontWeight: "500",
  color: "#111111",
};

const supStyle = {
  fontWeight: "300",
};

const informationTable = {
  borderCollapse: "collapse" as const,
  borderSpacing: "0px",
  color: "rgb(51,51,51)",
  backgroundColor: "rgb(250,250,250)",
  borderRadius: "3px",
  fontSize: "12px",
};

const informationTableRow = {
  height: "46px",
};

const informationTableColumn = {
  paddingLeft: "20px",
  borderStyle: "solid",
  borderColor: "white",
  borderWidth: "0px 1px 1px 0px",
  height: "44px",
};

const informationTableLabel = {
  ...resetText,
  color: "rgb(102,102,102)",
  fontSize: "10px",
};

const informationTableValue = {
  fontSize: "12px",
  margin: "0",
  padding: "0",
  lineHeight: 1.4,
};

const productTitleTable = {
  ...informationTable,
  margin: "30px 0 15px 0",
  height: "24px",
};

const productsTitle = {
  background: "#fafafa",
  paddingLeft: "10px",
  fontSize: "14px",
  fontWeight: "500",
  margin: "0",
};

const productIcon = {
  margin: "0 0 0 20px",
  borderRadius: "14px",
  border: "1px solid rgba(128,128,128,0.2)",
};

const productTitle = {
  marginLeft: "22px",
  fontSize: "12px",
  fontWeight: "600",
  ...resetText,
};

const productDescription = {
  fontSize: "12px",
  color: "rgb(102,102,102)",
  ...resetText,
};

const productLink = {
  fontSize: "12px",
  color: "rgb(0,112,201)",
  textDecoration: "none",
};

const divisor = {
  marginLeft: "4px",
  marginRight: "4px",
  color: "rgb(51,51,51)",
  fontWeight: 200,
};

const productPriceTotal = {
  margin: "0",
  color: "rgb(102,102,102)",
  fontSize: "10px",
  fontWeight: "600",
  padding: "0px 30px 0px 0px",
  textAlign: "right" as const,
};

const productPrice = {
  fontSize: "12px",
  fontWeight: "600",
  margin: "0",
};

const productPriceLarge = {
  margin: "0px 20px 0px 0px",
  fontSize: "16px",
  fontWeight: "600",
  whiteSpace: "nowrap" as const,
  textAlign: "right" as const,
};

const productPriceWrapper = {
  display: "table-cell",
  padding: "0px 20px 0px 0px",
  width: "100px",
  verticalAlign: "top",
};

const productPriceLine = { margin: "30px 0 0 0" };

const productPriceVerticalLine = {
  height: "48px",
  borderLeft: "1px solid",
  borderColor: "rgb(238,238,238)",
};

const productPriceLargeWrapper = { display: "table-cell", width: "90px" };

const productPriceLineBottom = { margin: "0 0 75px 0" };

const block = { display: "block" };

const ctaTitle = {
  display: "block",
  margin: "15px 0 0 0",
};

const ctaText = { fontSize: "24px", fontWeight: "500" };

const walletWrapper = { display: "table-cell", margin: "10px 0 0 0" };

const walletLink = { color: "rgb(0,126,255)", textDecoration: "none" };

const walletImage = {
  display: "inherit",
  paddingRight: "8px",
  verticalAlign: "middle",
};

const walletBottomLine = { margin: "65px 0 20px 0" };

const footerText = {
  fontSize: "12px",
  color: "rgb(102,102,102)",
  margin: "0",
  lineHeight: "auto",
  marginBottom: "16px",
};

const footerTextCenter = {
  fontSize: "12px",
  color: "rgb(102,102,102)",
  margin: "20px 0",
  lineHeight: "auto",
  textAlign: "center" as const,
};

const footerLink = { color: "rgb(0,115,255)" };

const footerIcon = { display: "block", margin: "40px 0 0 0" };

const footerLinksWrapper = {
  margin: "8px 0 0 0",
  textAlign: "center" as const,
  fontSize: "12px",
  color: "rgb(102,102,102)",
};

const footerCopyright = {
  margin: "25px 0 0 0",
  textAlign: "center" as const,
  fontSize: "12px",
  color: "rgb(102,102,102)",
};

const walletLinkText = {
  fontSize: "14px",
  fontWeight: "400",
  textDecoration: "none",
};
