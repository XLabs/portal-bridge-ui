import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Container as MuiContainer, styled } from "@mui/material";

import arrow from "../../assets/imgs/arrow.svg";
import TableOfContent from "../atoms/TableOfContent";
import { FONT_SIZE, COLOR } from "../../theme/portal";

const TitleItem = styled("li")(() => ({
  paddingLeft: 25,
}));

const P = styled("p")(() => ({
  fontSize: FONT_SIZE.S,
  lineHeight: `${FONT_SIZE.XL}px`,
}));

const H1 = styled("h1")(() => ({
  fontSize: FONT_SIZE.XXL,
  lineHeight: `${FONT_SIZE.XXL}px`,
  fontWeight: 700,
  color: COLOR.white,
}));

const H2 = styled("h2")(() => ({
  fontSize: FONT_SIZE.XL,
  lineHeight: `${FONT_SIZE.XXL}px`,
  fontWeight: 700,
  color: COLOR.white,
}));

const H3 = styled("h3")(() => ({
  fontSize: FONT_SIZE.L,
  lineHeight: `${FONT_SIZE.XL}px`,
  fontWeight: 700,
}));

const ContactButton = styled(Button)(() => ({
  fontSize: FONT_SIZE.M,
  lineHeight: `${FONT_SIZE.XXL}px`,
  fontWeight: 400,
  textTransform: "lowercase",
  borderRadius: 8,
  padding: "8px 16px",
  backgroundColor: "#272745",
}));

const TitleContainer = styled("div")(() => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: 20,
}));

const GoBackButton = styled(Button)(() => ({
  minWidth: 24,
  height: 24,
}));

const ContentContainer = styled(MuiContainer)(() => ({
  color: COLOR.whiteWithTransparency,
  maxWidth: 1800,
}));

const Container = styled("div")(({ theme }) => ({
  display: "flex",
  gap: 80,
  justifyContent: "center",
  margin: "auto",
  padding: 40,
  [theme.breakpoints.down("md")]: {
    flexDirection: "column-reverse",
    width: "100%",
  },
}));

const UL = styled("ul")(() => ({
  fontSize: FONT_SIZE.S,
  lineHeight: `${FONT_SIZE.XL}px`,
}));

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const from = state?.from || "/";

  return (
    <Container>
      <ContentContainer>
        <TitleContainer>
          <GoBackButton onClick={() => navigate(from)}>
            <img src={arrow} alt="arrow" />
          </GoBackButton>
          <H1>Privacy Policies</H1>
        </TitleContainer>
        {/* TODO: Update the date when we doo the release... Or the preview? */}
        <P>
          <i>Last Updated: May 17, 2024</i>
        </P>
        <P>
          xLabs (the “<b>Company</b>,” “<b>we</b>,” “<b>us</b>,” or “<b>our</b>
          ”) is committed to protecting your privacy. It is our policy to
          respect your privacy and comply with any applicable laws and
          regulations regarding any personal information we may collect about
          you, including across our website, portalbridge.com, and other sites
          we own and operate (collectively, the “<b>Platform</b>”). This Privacy
          Policy (the "<b>Policy</b>") outlines the data collection, processing,
          and management practices of the Company in relation to services
          provided on the Platform (the “<b>Services</b>”). By using our
          Platform, you agree to the collection, use, and disclosure of your
          personal information in accordance with this Policy.
        </P>
        <P>
          In the event our Platform contains links to third-party sites and
          services, please be aware that those sites and services have their own
          privacy policies. After following a link to any third-party content,
          you should read their posted privacy policy information about how they
          collect and use personal information. This Privacy Policy does not
          apply to any of your activities after you leave our Platform.
        </P>
        <ol type="I">
          <H2 id="section1">
            <TitleItem>INFORMATION WE COLLECT</TitleItem>
          </H2>
          <ol type="A">
            <H3>
              <TitleItem>
                Information About You That You Share With Us Directly
              </TitleItem>
            </H3>
            <div>
              <P>
                When you use Services on the Platform you may give us personal
                information directly (for example, details you connect your
                wallet to the Platform), and we will store that personal
                information on our systems and process it for the purposes
                described in this Privacy Policy.
              </P>
              <P>
                Depending on the Service, the personal information we collect
                will be relevant to providing that Service and include some or
                all of the following non-personally identifiable data:
              </P>
              <UL>
                <li>Your public blockchain wallet address;</li>
                <li>Amount of any asset involved in a transaction; and</li>
                <li>
                  Any additional information required for verification or
                  participation in the Service offered.
                </li>
              </UL>
              <P>
                We may also collect personal information from you when you
                communicate with us, such as your name, email address, and any
                other information you voluntarily provide.
              </P>
            </div>
            <H3>
              <TitleItem>Information You Generate Using Our Services</TitleItem>
            </H3>
            <div>
              <P>
                Information you generate while using our Services may be
                retained to protect the safety and well-being of our users; to
                protect our rights and property in connection with our Services;
                to conduct research; to operate, improve, personalize, and
                optimize our Services and our users’ experiences, including
                through the use of analytics; and to manage and deliver
                advertising. Where required by law, we will seek your consent
                for this.
              </P>
            </div>
            <H3>
              <TitleItem>
                Cookies and Other Automated Information Collection
              </TitleItem>
            </H3>
            <div>
              <P>
                We use cookies and other similar technologies (e.g., beacons,
                pixel tags, clear gifs, and device identifiers). We, our service
                providers, and our business partners use these cookies and other
                similar technologies to process information, which may include:
              </P>
              <UL>
                <li>IP address;</li>
                <li>the type of computer or mobile device you are using;</li>
                <li>platform type (like Apple iOS or Android);</li>
                <li>your operating system version;</li>
                <li>the screen resolution of your monitor(s);</li>
                <li>
                  your mobile device’s identifiers, like your MAC Address, Apple
                  Identifier For Advertising (IDFA), and/or Android Advertising
                  ID (AAID);
                </li>
                <li>application performance and de-bugging information;</li>
                <li>your browser type and language;</li>
                <li>referring and exit pages, and URLs;</li>
                <li>the number of clicks on an app feature or web page;</li>
                <li>the amount of time spent on an app feature or web page;</li>
                <li>domain names;</li>
                <li>landing pages;</li>
                <li>pages viewed and the order of those pages; and/or</li>
                <li>
                  what your current progress is in our Services and the date and
                  time of activity.
                </li>
              </UL>
            </div>
          </ol>

          <H2 id="section2">
            <TitleItem>
              PROCESSING AND USE OF YOUR PERSONAL INFORMATION
            </TitleItem>
          </H2>
          <div>
            <P>
              We only collect and use your personal information when we have a
              legitimate reason for doing so. Most commonly, we will use your
              personal data in the following circumstances:
            </P>
            <UL>
              <li>
                Provide our Services and create accounts in those Services
              </li>
              <li>
                Monitor and maintain the security and integrity of our Platform
              </li>
              <li>
                Improve, optimize and personalize our Services and our user’s
                experiences
              </li>
              <li>Communicate with you about the Services you are using</li>
              <li>
                Customer service and managing user communications, including
                technical support
              </li>
              <li>Protect the safety and well-being of our users and others</li>
              <li>
                Where you provide sensitive or special category personal
                information to us
              </li>
              <li>
                Maintain our business operations, including any business
                transition, like a merger, acquisition by another company, or
                sale of all or part of our assets
              </li>
              <li>
                For security purposes and to prevent fraud or potentially
                illegal activities, and to enforce the applicable Terms of
                Service
              </li>
              <li>
                Cooperate with public authorities and law enforcement where
                lawfully permitted or required
              </li>
              <li>
                Protect our rights, including compliance with applicable legal
                obligations, resolving any disputes we may have, and to
                administer our agreements with third parties
              </li>
            </UL>
          </div>

          <H2 id="section3">
            <TitleItem>
              DISCLOSURE OF PERSONAL INFORMATION TO THIRD PARTIES
            </TitleItem>
          </H2>
          <div>
            <P>
              We share your personal data with our third-party service
              providers, agents, subcontractors and other associated
              organizations, our group companies, and affiliates (as described
              below) in order to complete tasks and provide the Platform and
              Services to you on our behalf. When using third party service
              providers, they are required to respect the security of your
              personal data and to treat it in accordance with the law.
            </P>
            <P>We may disclose personal information to:</P>
            <UL>
              <li>a parent, subsidiary, or affiliate of the Company</li>
              <li>
                third-party service providers for the purpose of enabling them
                to provide their services, including (without limitation) IT
                service providers, data storage, hosting and server providers,
                analytics, error loggers, debt collectors, maintenance or
                problem-solving providers, professional advisors, and payment
                systems operators
              </li>
              <li>our employees, contractors, and/or related entities</li>
              <li>our existing or potential agents or business partners</li>
              <li>
                credit reporting agencies, courts, tribunals, and regulatory
                authorities, in the event you fail to pay for goods or services
                we have provided to you
              </li>
              <li>
                courts, tribunals, regulatory authorities, and law enforcement
                officers, as required by law, in connection with any actual or
                prospective legal proceedings, or in order to establish,
                exercise, or defend our legal rights
              </li>
              <li>
                third parties, including agents or sub-contractors, who assist
                us in providing information, products, or services
              </li>
              <li>third parties to collect and process data</li>
              <li>
                an entity that buys, or to which we transfer all or
                substantially all of our assets and business
              </li>
            </UL>
          </div>
          <H2 id="section4">
            <TitleItem>SECURITY OF YOUR PERSONAL INFORMATION</TitleItem>
          </H2>
          <div>
            <P>
              We implement reasonable and appropriate security measures to help
              protect the security of your information both online and offline
              and to ensure that your data is treated securely and in accordance
              with this Privacy Policy. These measures vary based upon the
              sensitivity of your information. It is important that you protect
              and maintain the security of your personal information, including
              the secure storage of any keys or other wallet data used to access
              your crypto assets.
            </P>
            <P>
              While we take precautions against possible security breaches of
              our Services and our customer databases and records, no website or
              Internet transmission is completely secure. We cannot guarantee
              that unauthorized access, hacking, data loss, or other breaches
              will never occur, and we cannot guarantee the security of your
              information while it is being transmitted to our Service. Any
              transmission is at your own risk.
            </P>
          </div>

          <H2 id="section5">
            <TitleItem>HOW LONG WE KEEP YOUR PERSONAL INFORMATION</TitleItem>
          </H2>
          <div>
            <P>
              How long we retain your personal information depends on why we
              collected it and how we use it, but we will not retain your
              personal information for longer than is necessary to provide you
              with the Services or for our legal requirements.
            </P>
            <P>
              We will retain personal information that is connected with your
              account and/or the Services you use from us for as long as you are
              actively using Services on the Platform. However, you acknowledge
              that we may retain some information after you have ceased to use
              the Platform’s Services where necessary to enable us to meet our
              legal obligations or to exercise, defend, or establish our rights.
            </P>
          </div>

          <H2 id="section6">
            <TitleItem>
              YOUR RIGHTS AND CONTROLLING YOUR PERSONAL INFORMATION
            </TitleItem>
          </H2>
          <div>
            <P>
              <b>Your choice:</b> By providing personal information to us, you
              understand we will collect, hold, use, and disclose your personal
              information in accordance with this Privacy Policy. You may choose
              to reject cookies and certain other tracking technologies by
              changing the setting of your browser. You do not have to provide
              personal information to us, however, if you do not, it may affect
              your use of our Platform or the products and/or services offered
              on or through it. You may also request details of the personal
              information that we hold about you.
            </P>
            <P>
              <b>Information from third parties:</b> If we receive personal
              information about you from a third party, we will protect it as
              set out in this Privacy Policy. If you are a third party providing
              personal information about somebody else, you represent and
              warrant that you have such person’s consent to provide the
              personal information to us.
            </P>
            <P>
              <b>Marketing permission and Unsubscribing:</b> If you have
              previously agreed to us using your personal information for direct
              marketing purposes, you may change your mind at any time by opting
              out of the promotional communications or contacting us using the
              details below. To unsubscribe from our email database or opt-out
              of communications (including marketing communications), please
              contact us using the details provided in this privacy policy or
              opt-out using the opt-out facilities provided in the
              communication. We may need to request specific information from
              you to help us confirm your identity.
            </P>
            <P>
              <b>Correction:</b> If you believe that any information we hold
              about you is inaccurate, out of date, incomplete, irrelevant, or
              misleading, please contact us using the details provided in this
              privacy policy. We will take reasonable steps to correct any
              information found to be inaccurate, incomplete, misleading, or out
              of date.
            </P>
            <P>
              <b>Non-discrimination:</b> We will not discriminate against you
              for exercising any of your rights over your personal information.
              Unless your personal information is required to provide you with a
              particular service or offer (for example providing user support),
              we will not deny you goods or services and/or charge you different
              prices or rates for goods or services, including through granting
              discounts or other benefits, or imposing penalties, or provide you
              with a different level or quality of goods or services.
            </P>
            <P>
              <b>Notification of data breaches:</b> We will comply with laws
              applicable to us in respect of any data breach.
            </P>
            <P>
              <b>Complaints:</b> If you believe that we have breached a relevant
              data protection law and wish to make a complaint, please contact
              us using the details below and provide us with full details of the
              alleged breach. We will promptly investigate your complaint and
              respond to you, in writing, setting out the outcome of our
              investigation and the steps we will take to deal with your
              complaint. You also have the right to contact a regulatory body or
              data protection authority in relation to your complaint.
            </P>
            <P>
              <b>No fee usually required:</b> You will not have to pay a fee to
              access your personal data (or to exercise any of the other
              rights). However, we may charge a reasonable fee if your request
              is manifestly unfounded or excessive. Alternatively, we could
              refuse to comply with your request in these circumstances. We may
              need to request specific information from you to help us confirm
              your identity and ensure your right to access your personal data
              (or to exercise any of your other rights). This is a security
              measure to ensure that personal data is not disclosed to any
              person who has no right to receive it. We may also contact you to
              ask you for further information in relation to your request to
              speed up our response.
            </P>
            <P>
              <b>Period for replying to a legitimate request:</b> We try to
              respond to all legitimate requests within one month. Occasionally
              it may take us longer than a month if your request is particularly
              complex or you have made a number of requests. In this case, we
              will notify you and keep you updated.
              <br />
              Notwithstanding the above, we cannot edit or delete any
              information that is stored on a blockchain as we do not have
              custody or control over any blockchains. The information stored on
              the blockchain may include purchases, sales, and transfers related
              to any blockchain address associated with you.
            </P>
          </div>

          <H2 id="section7">
            <TitleItem>CHILDREN’S PRIVACY</TitleItem>
          </H2>
          <div>
            <P>
              The Platform is not directed to children under 18 (or other age as
              required by local law), and we do not knowingly collect personal
              information from children. If you are a parent or guardian and
              believe your child has uploaded personal information to our
              Platform without your consent, you may contact us. If we become
              aware that a child has provided us with personal information in
              violation of applicable law, we will delete any personal
              information we have collected, unless we have a legal obligation
              to keep it, and terminate the child’s account if applicable.
            </P>
          </div>

          <H2 id="section8">
            <TitleItem>BUSINESS TRANSFERS</TitleItem>
          </H2>
          <div>
            <P>
              If we or our assets are acquired, or in the unlikely event that we
              go out of business or enter bankruptcy, we would include data,
              including your personal information, among the assets transferred
              to any parties who acquire us. You acknowledge that such transfers
              may occur, and that any parties who acquire us may, to the extent
              permitted by applicable law, continue to use your personal
              information according to this Privacy Policy, which they will be
              required to assume as it is the basis for any ownership or use
              rights we have over such information.
            </P>
          </div>

          <H2 id="section9">
            <TitleItem>INTERNATIONAL TRANSFERS</TitleItem>
          </H2>
          <div>
            <P>
              All information processed by us may be transferred, processed, and
              stored anywhere in the world, including, but not limited to, the
              United States, members of the European Union, or other countries,
              which may have data protection laws that are different from the
              laws where you live. We endeavor to safeguard your information
              consistent with the requirements of applicable laws.
            </P>
          </div>

          <H2 id="section10">
            <TitleItem>LIMITS OF OUR POLICY</TitleItem>
          </H2>
          <div>
            <P>
              Our Platform may link to external sites that are not operated by
              us. Please be aware that we have no control over the content and
              policies of those sites and cannot accept responsibility or
              liability for their respective privacy practices.
            </P>
          </div>

          <H2 id="section11">
            <TitleItem>CHANGES TO THIS POLICY</TitleItem>
          </H2>
          <div>
            <P>
              At our discretion, we may change this Privacy Policy to reflect
              updates to our business processes, current acceptable practices,
              or legislative or regulatory changes. If we decide to change this
              Policy, we will post the changes here at the same link by which
              you are accessing this Policy, and if the changes are significant,
              or if required by applicable law, we will contact you (based on
              your selected preferences for communications from us) with details
              of the changes.
            </P>
            <P>
              If required by law, we will get your permission or give you the
              opportunity to opt in to or opt out of, as applicable, any new
              uses of your personal information.
            </P>
          </div>

          <H2 id="section12">
            <TitleItem>SUPPLEMENTAL NOTICE FOR CALIFORNIA RESIDENTS</TitleItem>
          </H2>
          <div>
            <P>
              This Supplemental Notice for California Residents only applies to
              our processing of personal information that is subject to the
              California Consumer Privacy Act of 2018 (the “<b>CCPA</b>”). The
              CCPA provides California residents with the right to know what
              categories of personal information we have collected about them,
              and whether we disclosed that personal information for a business
              purpose (e.g., to a service provider) in the preceding 12 months.
              California residents can find this information by visiting:{" "}
              <Link to="https://www.oag.ca.gov/privacy/ccpa" target="_blank">
                https://www.oag.ca.gov/privacy/ccpa
              </Link>
              .
            </P>
          </div>

          <H2 id="section13">
            <TitleItem>SUPPLEMENTAL NOTICE FOR NEVADA RESIDENTS </TitleItem>
          </H2>
          <div>
            <P>
              If you are a resident of Nevada, you have the right to opt-out of
              the sale of certain personal information to third parties who
              intend to license or sell that personal information. You can
              exercise this right by contacting us with the subject line “Nevada
              Do Not Sell Request” and providing us with your name and the email
              address associated with your account.{" "}
            </P>
          </div>

          <H2 id="section14">
            <TitleItem>YOUR RIGHTS AS A DATA SUBJECT (GDPR)</TitleItem>
          </H2>
          <div>
            <P>
              You have certain rights under applicable legislation, and in
              particular under Regulation EU 2016/679 (General Data Protection
              Regulation or ‘GDPR’). You can find out more about the GDPR and
              your rights by accessing the European Commission’s website.
            </P>
          </div>
          <H2 id="section15">
            <TitleItem>
              CONTACT US FOR QUESTIONS AND REPORTING VIOLATIONS
            </TitleItem>
          </H2>
          <div>
            <P>
              If you have any questions, concerns, or complaints about our
              Privacy Policy or our data collection and processing practices, or
              if you want to report any security violations to us, or exercise
              any of your rights under this Privacy Policy, please contact us at
              the following address:
            </P>
            <br />
            <ContactButton href="mailto:legal@xlabs.xyz" variant="contained">
              legal@xlabs.xyz
            </ContactButton>
            <br />
            <br />
          </div>
        </ol>
      </ContentContainer>
      <TableOfContent />
    </Container>
  );
};

export default PrivacyPolicy;
